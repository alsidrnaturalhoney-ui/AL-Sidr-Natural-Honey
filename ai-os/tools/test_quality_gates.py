"""Safe, zero-network deterministic AL SIDR AI OS gate tests."""
import unittest
from datetime import date
from quality_gates import assess_delivery, check_release, resolve_fact


class TestDelivery(unittest.TestCase):
    def test_blocks_high_bounce_with_sufficient_observations(self):
        result = assess_delivery(recipients=27, delivered=0, bounced=27)
        self.assertEqual(result['priority'], 'P0')
        self.assertEqual(result['decision'], 'INVESTIGATE_NO_SEND')
        self.assertEqual(result['bounce_pct'], 100.0)

    def test_does_not_overdiagnose_small_sample(self):
        result = assess_delivery(recipients=2, delivered=0, bounced=1)
        self.assertEqual(result['priority'], 'REVIEW')
        self.assertEqual(result['decision'], 'INVESTIGATE_NO_SEND')

    def test_invalid_counts_rejected(self):
        with self.assertRaises(ValueError):
            assess_delivery(recipients=10, delivered=10, bounced=2)

    def test_zero_recipients_is_indeterminate(self):
        self.assertEqual(assess_delivery(0, 0, 0)['priority'], 'INSUFFICIENT_DATA')


class TestRelease(unittest.TestCase):
    def test_blocked_when_missing_approval(self):
        checks = {key: True for key in ('backup_verified','en_visual_qa','ar_visual_qa','checkout_threshold_qa','notifications_tested')}
        result = check_release(checks)
        self.assertEqual(result['decision'], 'NOT_READY')
        self.assertIn('owner_approval', result['missing_or_failed'])

    def test_release_never_publishes(self):
        checks = {key: True for key in ('backup_verified','en_visual_qa','ar_visual_qa','checkout_threshold_qa','notifications_tested','owner_approval')}
        result = check_release(checks)
        self.assertEqual(result['decision'], 'READY_FOR_MANUAL_RELEASE')
        self.assertFalse(result['publishes'])

    def test_unknown_check_is_not_pass(self):
        checks = {'backup_verified': 'unknown'}
        self.assertEqual(check_release(checks)['decision'], 'NOT_READY')


class TestKnowledge(unittest.TestCase):
    def test_live_source_outranks_historical(self):
        evidence = [
            {'value': 200, 'source_class': 'historical_draft', 'observed_on': '2026-10-01', 'verified': True},
            {'value': 250, 'source_class': 'live_commerce', 'observed_on': '2026-10-24', 'verified': True},
        ]
        result = resolve_fact(evidence, as_of=date(2026,10,24))
        self.assertEqual(result['status'], 'VERIFIED_CURRENT')
        self.assertEqual(result['value'], 250)

    def test_same_rank_conflict(self):
        evidence = [
            {'value': 'A', 'source_class':'approved_knowledge','observed_on':'2026-10-24','verified':True},
            {'value': 'B', 'source_class':'approved_knowledge','observed_on':'2026-10-24','verified':True},
        ]
        self.assertEqual(resolve_fact(evidence, as_of=date(2026,10,24))['status'],'CONFLICTED')

    def test_stale_live_data(self):
        evidence = [{'value':7,'source_class':'live_commerce','observed_on':'2026-10-20','verified':True}]
        self.assertEqual(resolve_fact(evidence, as_of=date(2026,10,24))['status'],'STALE')

    def test_no_evidence(self):
        self.assertEqual(resolve_fact([], as_of=date(2026,10,24))['status'],'UNVERIFIED')


if __name__ == '__main__': unittest.main()
