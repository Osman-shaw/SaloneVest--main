#!/bin/bash

# SaloneVest Investment Escrow - Deployment Script
# This script builds and deploys the Anchor program to Solana

set -e  # Exit on error

echo "🚀 SaloneVest Investment Escrow Deployment"
echo "=========================================="
echo ""

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Error: Anchor is not installed"
    echo "Please install Anchor first: https://www.anchor-lang.com/docs/installation"
    exit 1
fi

# Check if Solana is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Error: Solana CLI is not installed"
    echo "Please install Solana CLI first"
    exit 1
fi

# Get current cluster
CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $3}')
echo "📡 Current cluster: $CLUSTER"
echo ""

# Confirm deployment
read -p "Deploy to this cluster? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Build the program
echo "🔨 Building program..."
anchor build

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/investment_escrow-keypair.json)
echo "📝 Program ID: $PROGRAM_ID"

# Update Anchor.toml with program ID
echo "📝 Updating Anchor.toml..."
sed -i "s/investment_escrow = \".*\"/investment_escrow = \"$PROGRAM_ID\"/" Anchor.toml

# Update lib.rs with program ID
echo "📝 Updating lib.rs..."
sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" programs/investment-escrow/src/lib.rs

# Rebuild with correct program ID
echo "🔨 Rebuilding with correct program ID..."
anchor build

# Deploy
echo "🚀 Deploying program..."
anchor deploy

# Copy IDL to frontend
echo "📋 Copying IDL to frontend..."
mkdir -p ../../frontend/lib/idl
cp target/idl/investment_escrow.json ../../frontend/lib/idl/
cp target/types/investment_escrow.ts ../../frontend/lib/types/

# Update environment variables
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update frontend/.env.local:"
echo "   NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID"
echo ""
echo "2. Update backend/.env:"
echo "   PROGRAM_ID=$PROGRAM_ID"
echo ""
echo "3. Run tests:"
echo "   anchor test"
echo ""
echo "4. Verify deployment:"
echo "   solana program show $PROGRAM_ID"
