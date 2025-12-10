# SaloneVest Anchor Build Script
# This script builds a Docker container with Anchor and compiles your smart contract

param(
    [string]$Command = "build",
    [string]$ImageName = "salonevest-anchor",
    [string]$TagName = "latest"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "SaloneVest Anchor Smart Contract Builder" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $DockerVersion = docker --version
    Write-Host "✓ Docker found: $DockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Docker not found. Please install Docker Desktop from:" -ForegroundColor Red
    Write-Host "  https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

switch ($Command) {
    "build" {
        Write-Host "Building Docker image: $ImageName`:$TagName" -ForegroundColor Yellow
        Write-Host "This will take 5-10 minutes on first run..." -ForegroundColor Cyan
        Write-Host ""
        
        $BuildTime = Measure-Command {
            docker build -t "$ImageName`:$TagName" -f "$ScriptDir\Dockerfile" $ScriptDir
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Docker image built successfully!" -ForegroundColor Green
            Write-Host "  Build time: $($BuildTime.TotalSeconds) seconds" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next step: Run 'pwsh build-anchor.ps1 compile'" -ForegroundColor Cyan
        }
        else {
            Write-Host "✗ Docker build failed" -ForegroundColor Red
            exit 1
        }
    }
    
    "compile" {
        Write-Host "Compiling Anchor smart contract..." -ForegroundColor Yellow
        Write-Host ""
        
        docker run --rm `
            -v "$ScriptDir`:/workspace" `
            "$ImageName`:$TagName" `
            anchor build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Smart contract compiled successfully!" -ForegroundColor Green
            Write-Host "  Output: $ScriptDir\target\deploy\" -ForegroundColor Green
        }
        else {
            Write-Host "✗ Compilation failed" -ForegroundColor Red
            exit 1
        }
    }
    
    "test" {
        Write-Host "Running tests..." -ForegroundColor Yellow
        Write-Host ""
        
        docker run --rm `
            -v "$ScriptDir`:/workspace" `
            "$ImageName`:$TagName" `
            anchor test
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ All tests passed!" -ForegroundColor Green
        }
        else {
            Write-Host "✗ Tests failed" -ForegroundColor Red
            exit 1
        }
    }
    
    "clean" {
        Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
        
        docker run --rm `
            -v "$ScriptDir`:/workspace" `
            "$ImageName`:$TagName" `
            anchor clean
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Cleaned successfully!" -ForegroundColor Green
        }
    }
    
    "shell" {
        Write-Host "Opening shell in Docker container..." -ForegroundColor Yellow
        Write-Host "Commands available: anchor, solana, rustc, cargo, node, npm" -ForegroundColor Cyan
        Write-Host "Type 'exit' to close the shell" -ForegroundColor Cyan
        Write-Host ""
        
        docker run --rm -it `
            -v "$ScriptDir`:/workspace" `
            "$ImageName`:$TagName"
    }
    
    "status" {
        Write-Host "Checking environment status..." -ForegroundColor Yellow
        Write-Host ""
        
        docker run --rm `
            -v "$ScriptDir`:/workspace" `
            "$ImageName`:$TagName" `
            bash -c "echo '=== Versions ===' && anchor --version && echo '' && solana --version && echo '' && rustc --version && echo '' && cargo --version && echo '' && node --version && echo '' && echo '=== Anchor Setup ===' && avm list"
    }
    
    "deploy" {
        Write-Host "Deploying to Devnet..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Note: Configure your wallet in Solana CLI first:" -ForegroundColor Cyan
        Write-Host "  solana config set --url devnet" -ForegroundColor Gray
        Write-Host "  solana-keygen new --outfile ~/.config/solana/id.json" -ForegroundColor Gray
        Write-Host "  solana airdrop 2" -ForegroundColor Gray
        Write-Host ""
        
        docker run --rm `
            -v "$ScriptDir`:/workspace" `
            -v "$env:USERPROFILE\.config\solana`:/.solana" `
            -e ANCHOR_WALLET="/.solana/id.json" `
            "$ImageName`:$TagName" `
            anchor deploy --provider.cluster devnet
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Deployment successful!" -ForegroundColor Green
        }
        else {
            Write-Host "✗ Deployment failed" -ForegroundColor Red
            exit 1
        }
    }
    
    default {
        Write-Host "Usage: pwsh build-anchor.ps1 [command]" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor Cyan
        Write-Host "  build     - Build Docker image (run first)" -ForegroundColor Green
        Write-Host "  compile   - Compile smart contract" -ForegroundColor Green
        Write-Host "  test      - Run test suite" -ForegroundColor Green
        Write-Host "  clean     - Clean build artifacts" -ForegroundColor Green
        Write-Host "  shell     - Open interactive shell" -ForegroundColor Green
        Write-Host "  status    - Check environment versions" -ForegroundColor Green
        Write-Host "  deploy    - Deploy to Solana Devnet" -ForegroundColor Green
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Cyan
        Write-Host "  pwsh build-anchor.ps1 build      # First time setup" -ForegroundColor Gray
        Write-Host "  pwsh build-anchor.ps1 compile    # Compile contract" -ForegroundColor Gray
        Write-Host "  pwsh build-anchor.ps1 test       # Run tests" -ForegroundColor Gray
        Write-Host "  pwsh build-anchor.ps1 shell      # Open shell" -ForegroundColor Gray
    }
}

Write-Host ""
