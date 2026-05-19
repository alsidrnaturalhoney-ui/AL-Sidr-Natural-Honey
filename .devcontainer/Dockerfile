FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install extra OS packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      git curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*
