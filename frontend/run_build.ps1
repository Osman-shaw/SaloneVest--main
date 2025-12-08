Set-Location -Path 'D:\SaloneVest--main\frontend'

Write-Output "== npm install --legacy-peer-deps =="
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { Write-Output "INSTALL_FAILED:$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Output "== npm run build =="
npm run build
if ($LASTEXITCODE -ne 0) { Write-Output "BUILD_FAILED:$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Output "BUILD_SUCCESS"
