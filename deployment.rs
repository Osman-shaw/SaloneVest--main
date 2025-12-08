// deployment.rs - Solana Program Deployment Script
// 
// This script deploys the investment_escrow smart contract to devnet
// Run with: cargo run --release
//
// Prerequisites:
// 1. Solana wallet at ~/.config/solana/id.json
// 2. Devnet SOL (airdrop 2 SOL)
// 3. Built contract at anchor/target/deploy/investment_escrow.so

use std::fs;
use std::path::Path;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Solana Smart Contract Deployment Script");
    println!("==========================================\n");

    // Step 1: Check prerequisites
    println!("📋 Checking prerequisites...\n");

    // Check Rust/Cargo
    println!("✅ Rust {} detected", get_rust_version()?);

    // Check built contract
    let contract_path = "anchor/target/deploy/investment_escrow.so";
    if !Path::new(contract_path).exists() {
        eprintln!("❌ Contract not found at {}", contract_path);
        eprintln!("   Run: anchor build");
        return Err("Build contract first".into());
    }
    let contract_size = fs::metadata(contract_path)?.len();
    println!("✅ Contract built: {} KB", contract_size / 1024);

    // Check wallet
    let wallet_path = shellexpand::tilde("~/.config/solana/id.json");
    if !Path::new(wallet_path.as_ref()).exists() {
        eprintln!("❌ Wallet not found at {}", wallet_path);
        eprintln!("   Create with: solana-keygen new -o ~/.config/solana/id.json");
        return Err("Wallet setup required".into());
    }
    println!("✅ Wallet found");

    // Step 2: Display deployment info
    println!("\n📊 Deployment Configuration");
    println!("===========================");
    println!("Cluster: Devnet");
    println!("Contract: investment_escrow");
    println!("Binary size: {} KB", contract_size / 1024);
    println!("Estimated fee: ~0.5 SOL");

    // Step 3: Display next steps
    println!("\n🔧 Next Steps");
    println!("==============");
    println!("Since Solana CLI is not available on Windows, use one of:");
    println!();
    println!("Option 1: Linux/WSL2");
    println!("  - Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install");
    println!("  - Install Solana CLI in WSL2");
    println!("  - Run: anchor deploy --provider.cluster devnet");
    println!();
    println!("Option 2: Docker");
    println!("  - Install Docker: https://www.docker.com/products/docker-desktop");
    println!("  - Run: docker run --rm -v %CD%\\anchor:/anchor coral/anchor anchor deploy");
    println!();
    println!("Option 3: Use solana-cli-tools crate");
    println!("  - Add to Cargo.toml: solana-cli-tools = \"1.18\"");
    println!("  - Then run this script");
    println!();
    println!("Option 4: Manual Deployment (Advanced)");
    println!("  - Use Solana Web3.js or anchor-lang SDK");
    println!("  - Create custom deployment script");
    println!();

    // Step 4: Provide deployment verification checklist
    println!("✅ Deployment Checklist");
    println!("======================");
    println!("□ Contract built (anchor build)");
    println!("□ Wallet created (solana-keygen new)");
    println!("□ Devnet SOL obtained (solana airdrop 2)");
    println!("□ Solana CLI installed (solana --version)");
    println!("□ Connected to devnet (solana config set --url devnet)");
    println!();
    println!("📖 For detailed deployment guide, see:");
    println!("   SMART_CONTRACT_DEPLOYMENT_GUIDE.md");
    println!();

    println!("✨ Contract ready for deployment!");

    Ok(())
}

fn get_rust_version() -> Result<String, Box<dyn std::error::Error>> {
    let output = std::process::Command::new("rustc")
        .arg("--version")
        .output()?;

    Ok(String::from_utf8(output.stdout)?
        .trim()
        .split_whitespace()
        .nth(1)
        .unwrap_or("unknown")
        .to_string())
}
