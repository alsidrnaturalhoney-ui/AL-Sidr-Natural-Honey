"""AL SIDR AI OS — local, deterministic, read-only review gates.

All inputs must be supplied by a separate authorized source. This module does
not connect to a live service, send email, modify records, or publish releases.
"""
from __future__ import annotations

from datetime import date
from typing import Any, Mapping, Sequence

REQUIRED_RELEASE_CHECKS = (
    'backup_verified', 'en_visual_qa', 'ar_visual_qa',
    'checkout_threshold_qa', 'notifications_tested', 'owner_approval',
)
SOURCE_RANK = {
    'primary_evidence': 1,
    'live_commerce': 2,
    'approved_knowledge': 3,
    'official_external': 4,
    'historical_draft': 5,
}
MAX_AGE_DAYS = {
    'primary_evidence': 365,      # expiry-specific checks must be done upstream
    'live_commerce': 1,
    'approved_knowledge': 90,
    'official_external': 30,
    'historical_draft': 0,
}


def assess_delivery(recipients: int, delivered: int, bounced: int) -> dict[str, Any]:
    """Classify aggregate delivery without inferring a root cause or sending mail."""
    counts = (recipients, delivered, bounced)
    if any(type(x) is not int or x < 0 for x in counts):
        raise ValueError('Counts must be nonnegative integers (not booleans).')
    if delivered + bounced > recipients:
        raise ValueError('Delivered plus bounced cannot exceed recipients.')
    if recipients == 0:
        return {'priority': 'INSUFFICIENT_DATA', 'decision': 'INVESTIGATE_NO_SEND',
                'bounce_pct': None, 'delivered_pct': None, 'remaining_unknown': 0}
    rate = bounced / recipients
    priority = ('P0' if recipients >= 10 and rate >= 0.10
                else 'P1' if recipients >= 10 and rate >= 0.02
                else 'REVIEW')
    return {
        'priority': priority,
        'decision': 'INVESTIGATE_NO_SEND',
        'bounce_pct': round(100 * rate, 2),
        'delivered_pct': round(100 * delivered / recipients, 2),
        'remaining_unknown': recipients - delivered - bounced,
        'warning': 'Aggregate delivery results do not prove root cause or native platform notification failure.',
    }


def check_release(checks: Mapping[str, Any]) -> dict[str, Any]:
    """Review release evidence only; a pass is not a deployment instruction."""
    if not isinstance(checks, Mapping):
        raise TypeError('checks must be a mapping')
    missing = [key for key in REQUIRED_RELEASE_CHECKS if checks.get(key) is not True]
    return {
        'decision': 'NOT_READY' if missing else 'READY_FOR_MANUAL_RELEASE',
        'missing_or_failed': missing,
        'publishes': False,
        'next_action': 'Obtain or verify missing evidence.' if missing else 'Use separate authorized release process; verify post-deploy.',
    }


def resolve_fact(candidates: Sequence[Mapping[str, Any]], as_of: date) -> dict[str, Any]:
    """Choose authoritative *current* evidence or preserve a conflict.

    Never selects stale data as live truth. Dates are YYYY-MM-DD. This is a
    review aid; source ownership, licences, expiry, scope and permissions are
    checked separately in the canonical ingestion process.
    """
    if not isinstance(as_of, date):
        raise TypeError('as_of must be a date')
    verified = []
    for item in candidates:
        if item.get('verified') is not True:
            continue
        source_class = item.get('source_class')
        if source_class not in SOURCE_RANK:
            continue
        try:
            observed = date.fromisoformat(item['observed_on'])
            age = (as_of - observed).days
            if age < 0:
                continue
        except (KeyError, TypeError, ValueError):
            continue
        verified.append((SOURCE_RANK[source_class], age, item))
    if not verified:
        return {'status': 'UNVERIFIED', 'value': None, 'source': None}
    verified.sort(key=lambda row: (row[0], row[1]))
    best_rank = verified[0][0]
    current = [(age, item) for rank, age, item in verified
               if rank == best_rank and age <= MAX_AGE_DAYS[item['source_class']]]
    if not current:
        return {'status': 'STALE', 'value': None, 'source': None}
    freshest_age = min(age for age, _ in current)
    tied = [item for age, item in current if age == freshest_age]
    if any(item['value'] != tied[0]['value'] for item in tied[1:]):
        return {'status': 'CONFLICTED', 'value': None,
                'source': None, 'candidates': len(tied)}
    chosen = tied[0]
    return {'status': 'VERIFIED_CURRENT', 'value': chosen['value'],
            'source': chosen['source_class'], 'observed_on': chosen['observed_on']}
