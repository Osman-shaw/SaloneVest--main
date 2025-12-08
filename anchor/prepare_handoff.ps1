# prepare_handoff.ps1
# Creates a zip containing the Anchor templates and INSTALLATION_GUIDE.md
param(
    [string]$Destination = "salonevest-anchor-handoff.zip"
)

$root = (Get-Location).Path
$templatesPath = Join-Path $root "anchor\templates\*"
$guidePath = Join-Path $root "anchor\INSTALLATION_GUIDE.md"

Write-Host "Creating handoff zip: $Destination"
if (Test-Path $Destination) { Remove-Item $Destination -Force }

Compress-Archive -Path $templatesPath, $guidePath -DestinationPath (Join-Path $root "anchor\$Destination") -Force

Write-Host "Created: anchor\$Destination"
Write-Host "Contents:" 
Expand-Archive -Path (Join-Path $root "anchor\$Destination") -DestinationPath (Join-Path $root "anchor\temp_unpack") -Force
Get-ChildItem -Path (Join-Path $root "anchor\temp_unpack") -Recurse | Select-Object -First 50 | ForEach-Object { Write-Host $_.FullName }
Remove-Item -Path (Join-Path $root "anchor\temp_unpack") -Recurse -Force
