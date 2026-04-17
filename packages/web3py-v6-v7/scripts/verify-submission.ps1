# Local checks before hackathon submit (run from repo root or package dir).
# Usage: pwsh ./scripts/verify-submission.ps1

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $PSScriptRoot
Set-Location $here

Write-Host "== npm test ==" -ForegroundColor Cyan
npm test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n== workflow validate ==" -ForegroundColor Cyan
npx codemod workflow validate -w workflow.yaml
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "OK - see docs/HACKATHON_RUBRIC_CHECKLIST.md for rubric mapping." -ForegroundColor Green
