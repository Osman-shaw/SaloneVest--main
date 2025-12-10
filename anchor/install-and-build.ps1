# Install Docker Desktop on Windows and build Anchor
# This script automates the entire setup process

Write-Host "Install Docker and Build Anchor Smart Contract" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
$DockerCheck = & docker --version 2>&1

if ($null -eq $DockerCheck -or $LASTEXITCODE -ne 0) {
    Write-Host "Docker not found." -ForegroundColor Red
    Write-Host "Install Docker Desktop: https://docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host "Docker found: $DockerCheck" -ForegroundColor Green
Write-Host ""

# Navigate to anchor directory
$AnchorPath = "D:\SaloneVest--main\anchor"
Set-Location $AnchorPath
Write-Host "Working in: $AnchorPath" -ForegroundColor Green
Write-Host ""

# Step 1: Build Docker image
Write-Host "Step 1: Building Docker image (5-10 minutes)..." -ForegroundColor Yellow
& powershell.exe -File "$AnchorPath\build-anchor.ps1" build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Step 1 Complete: Docker image built" -ForegroundColor Green
Write-Host ""

# Step 2: Compile smart contract
Write-Host "Step 2: Compiling smart contract (1-2 minutes)..." -ForegroundColor Yellow
& powershell.exe -File "$AnchorPath\build-anchor.ps1" compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Compilation failed" -ForegroundColor Red
    exit 1
}
Write-Host "Step 2 Complete: Smart contract compiled" -ForegroundColor Green
Write-Host ""

# Step 3: Run tests
Write-Host "Step 3: Running tests..." -ForegroundColor Yellow
& powershell.exe -File "$AnchorPath\build-anchor.ps1" test
$TestResult = $LASTEXITCODE
Write-Host "Step 3 Complete: Tests run (result: $TestResult)" -ForegroundColor Green
Write-Host ""

# Step 4: Verify output
Write-Host "Step 4: Verifying output files..." -ForegroundColor Yellow
$DeployPath = "$AnchorPath\target\deploy"
$SOFile = "$DeployPath\investment_escrow.so"
$IDLFile = "$DeployPath\idl\investment_escrow.json"

if (Test-Path $SOFile) {
    Write-Host "Smart contract binary found: $SOFile" -ForegroundColor Green
}
else {
    Write-Host "Smart contract binary NOT found" -ForegroundColor Red
}

if (Test-Path $IDLFile) {
    Write-Host "IDL file found: $IDLFile" -ForegroundColor Green
}
else {
    Write-Host "IDL file NOT found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "Next: Copy IDL to frontend and deploy to Devnet" -ForegroundColor Cyan
