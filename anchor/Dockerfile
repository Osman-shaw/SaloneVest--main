# Build Anchor smart contracts in isolated Docker environment
FROM rust:1.75-bookworm

# Install required dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    pkg-config \
    libssl-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI
RUN curl -sSfL https://release.solana.com/v1.18.0/install | sh
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Rust WASM target
RUN rustup target add wasm32-unknown-unknown

# Install Anchor via cargo
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked && \
    avm install 0.30.0 && \
    avm use 0.30.0

# Install Node.js for testing
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn

# Verify installations
RUN anchor --version && \
    solana --version && \
    rustc --version && \
    cargo --version && \
    node --version

# Set working directory
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]
