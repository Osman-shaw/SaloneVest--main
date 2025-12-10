# SaloneVest Monolithic Deployment Script
# One-command deployment of all services

param(
    [string]$Action = "up",
    [switch]$Build,
    [switch]$Logs,
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommandPath

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "SaloneVest Monolithic Deployment" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    $DockerVersion = docker --version
    Write-Host "✓ Docker: $DockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Docker not found. Install from: https://docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}

# Check Docker Compose
try {
    $ComposeVersion = docker-compose --version
    Write-Host "✓ Docker Compose: $ComposeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Docker Compose not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check for .env file
if (-not (Test-Path "$ProjectRoot\.env")) {
    Write-Host "Creating .env from template..." -ForegroundColor Yellow
    Copy-Item "$ProjectRoot\.env.example" "$ProjectRoot\.env"
    Write-Host "✓ .env created. Edit with your configuration:" -ForegroundColor Green
    Write-Host "  notepad $ProjectRoot\.env" -ForegroundColor Gray
}

Write-Host ""

# Functions
function Build-Services {
    Write-Host "Building services..." -ForegroundColor Yellow
    docker-compose -f "$ProjectRoot\docker-compose.yml" build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build completed" -ForegroundColor Green
    } else {
        Write-Host "✗ Build failed" -ForegroundColor Red
        exit 1
    }
}

function Start-Services {
    Write-Host "Starting services..." -ForegroundColor Yellow
    docker-compose -f "$ProjectRoot\docker-compose.yml" up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Services started" -ForegroundColor Green
        Write-Host ""
        Show-Status
    } else {
        Write-Host "✗ Failed to start services" -ForegroundColor Red
        exit 1
    }
}

function Stop-Services {
    Write-Host "Stopping services..." -ForegroundColor Yellow
    docker-compose -f "$ProjectRoot\docker-compose.yml" down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Services stopped" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to stop services" -ForegroundColor Red
        exit 1
    }
}

function Show-Status {
    Write-Host "Service Status:" -ForegroundColor Cyan
    Write-Host ""
    docker-compose -f "$ProjectRoot\docker-compose.yml" ps
    Write-Host ""
    Write-Host "Access Points:" -ForegroundColor Yellow
    Write-Host "  Frontend:  https://localhost:3000" -ForegroundColor Gray
    Write-Host "  Backend:   https://localhost:5000" -ForegroundColor Gray
    Write-Host "  API Docs:  https://localhost:5000/api/docs" -ForegroundColor Gray
    Write-Host "  MongoDB:   localhost:27017" -ForegroundColor Gray
    Write-Host ""
}

function Show-Logs {
    Write-Host "Showing logs (Ctrl+C to stop)..." -ForegroundColor Yellow
    Write-Host ""
    docker-compose -f "$ProjectRoot\docker-compose.yml" logs -f --tail=100
}

function Clean-Services {
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    Write-Host "This will remove all containers and volumes" -ForegroundColor Yellow
    $Confirm = Read-Host "Continue? (yes/no)"
    
    if ($Confirm -eq "yes") {
        docker-compose -f "$ProjectRoot\docker-compose.yml" down -v
        Write-Host "✓ Cleanup completed" -ForegroundColor Green
    } else {
        Write-Host "Cleanup cancelled" -ForegroundColor Yellow
    }
}

# Execute action
switch ($Action.ToLower()) {
    "up" {
        if ($Build) {
            Build-Services
        }
        Start-Services
    }
    "down" {
        Stop-Services
    }
    "restart" {
        Stop-Services
        Start-Services
    }
    "build" {
        Build-Services
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "clean" {
        Clean-Services
    }
    default {
        Write-Host "Usage: .\deploy.ps1 [action] [options]" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Actions:" -ForegroundColor Cyan
        Write-Host "  up          Start all services (default)" -ForegroundColor Gray
        Write-Host "  down        Stop all services" -ForegroundColor Gray
        Write-Host "  restart     Restart all services" -ForegroundColor Gray
        Write-Host "  build       Build all images" -ForegroundColor Gray
        Write-Host "  status      Show service status" -ForegroundColor Gray
        Write-Host "  logs        Show service logs" -ForegroundColor Gray
        Write-Host "  clean       Remove all containers and volumes" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Options:" -ForegroundColor Cyan
        Write-Host "  -Build      Build before starting" -ForegroundColor Gray
        Write-Host "  -Logs       Show logs after starting" -ForegroundColor Gray
        Write-Host "  -Clean      Clean up (with confirmation)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Cyan
        Write-Host "  .\deploy.ps1                    # Start services" -ForegroundColor Gray
        Write-Host "  .\deploy.ps1 up -Build          # Build and start" -ForegroundColor Gray
        Write-Host "  .\deploy.ps1 logs               # Show logs" -ForegroundColor Gray
        Write-Host "  .\deploy.ps1 clean              # Clean up" -ForegroundColor Gray
        Write-Host ""
    }
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Done" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Cyan
