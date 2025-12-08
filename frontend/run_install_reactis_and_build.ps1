Set-Location -Path 'D:\SaloneVest--main\frontend'

Write-Output "== npm install react-is =="
npm install react-is
if ($LASTEXITCODE -ne 0) { Write-Output "INSTALL_REACTIS_FAILED:$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Output "== npm run build =="
npm run build
if ($LASTEXITCODE -ne 0) { Write-Output "BUILD_FAILED_AFTER_FIX:$LASTEXITCODE"; exit $LASTEXITCODE }

Write-Output "BUILD_SUCCESS_AFTER_FIX"
