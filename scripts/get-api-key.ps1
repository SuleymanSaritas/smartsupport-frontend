# Helper script to get API key from backend .env file
# This script reads the API_KEY from the backend .env and suggests adding it to frontend .env.local

$backendEnvPath = "C:\Users\Suleyman\Documents\repo\smartsupport-backend\.env"

if (Test-Path $backendEnvPath) {
    $backendEnv = Get-Content $backendEnvPath
    $apiKeyLine = $backendEnv | Select-String "^API_KEY="
    
    if ($apiKeyLine) {
        $apiKey = ($apiKeyLine -split "=")[1].Trim()
        Write-Host ""
        Write-Host "Found API Key in backend .env file:" -ForegroundColor Green
        Write-Host "   $apiKey" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To fix the issue, add this line to your .env.local file:" -ForegroundColor Cyan
        Write-Host "   NEXT_PUBLIC_API_KEY=$apiKey" -ForegroundColor White
        Write-Host ""
        Write-Host "Or run this command:" -ForegroundColor Cyan
        Write-Host "   Add-Content .env.local `"NEXT_PUBLIC_API_KEY=$apiKey`"" -ForegroundColor White
    } else {
        Write-Host "API_KEY not found in backend .env file" -ForegroundColor Red
    }
} else {
    Write-Host "Backend .env file not found at: $backendEnvPath" -ForegroundColor Red
    Write-Host "Please check the path and ensure the backend repository is accessible." -ForegroundColor Yellow
}

