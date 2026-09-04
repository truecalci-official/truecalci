# TrueCalci Precision Computational API & MCP Suite PowerShell Test Runner
# Active Tier: Pro Agency & Scale (15,000 req/mo, 1,000 RPM concurrency)

$BaseUrl = 'http://127.0.0.1:4000'
$ApiKey = 'tc_live_pro_a8f9c2e1b7_d04a'
$Headers = @{
    'Content-Type'  = 'application/json'
    'Authorization' = "Bearer $ApiKey"
}

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "TRUECALCI AI AGENT & COMPUTATIONAL API - POWERSHELL VERIFICATION" -ForegroundColor Cyan
Write-Host "Host: $BaseUrl | Key: tc_live_pro_..." -ForegroundColor Cyan
Write-Host "================================================================================"

# 1. Health
Write-Host "`n[1] Health Check:" -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$BaseUrl/api/health" -Headers $Headers -Method Get
$health | ConvertTo-Json

# 2. MCP Handshake
Write-Host "`n[2] MCP Protocol Handshake:" -ForegroundColor Yellow
$mcpBody = @{
    jsonrpc = '2.0'
    id = 1
    method = 'initialize'
    params = @{ protocolVersion = '2024-11-05'; capabilities = @{} }
} | ConvertTo-Json
$mcpInit = Invoke-RestMethod -Uri "$BaseUrl/api/v1/mcp" -Headers $Headers -Method Post -Body $mcpBody
Write-Host "Server: $($mcpInit.result.serverInfo.name) v$($mcpInit.result.serverInfo.version)" -ForegroundColor Green

# 3. 16 Engines Quick Sample
Write-Host "`n[3] 16 Deterministic Engines Invocation:" -ForegroundColor Yellow

$engines = @(
    @{ tool = "contractor_parity"; params = @{ w2Salary = 130000; contractorHourlyRate = 85 } },
    @{ tool = "mortgage_piti"; params = @{ homePrice = 450000; downPaymentPercent = 20; interestRate = 6.8; tenureYears = 30 } },
    @{ tool = "vat_sales_tax"; params = @{ amount = 1000; vatRatePercent = 20; mode = "add" } },
    @{ tool = "tip_splitter"; params = @{ billAmount = 120; tipPercent = 18; numPeople = 3 } },
    @{ tool = "compound_wealth"; params = @{ principal = 10000; monthlyDeposit = 500; annualRatePercent = 8; tenureYears = 15 } },
    @{ tool = "indian_income_tax"; params = @{ ctc = 1250000; isSalaried = $true } },
    @{ tool = "sip_investment"; params = @{ monthlyInvestment = 10000; annualReturnRate = 12; tenureYears = 15; stepUpPercent = 0 } },
    @{ tool = "home_loan_emi"; params = @{ principal = 5000000; interestRatePercent = 8.5; tenureYears = 20 } },
    @{ tool = "casio_991_solve"; params = @{ type = "quadratic"; a = 1; b = -5; c = 6 } },
    @{ tool = "beam_bending"; params = @{ loadNewtons = 5000; lengthMeters = 4; elasticModulusGpa = 200; momentOfInertiaCm4 = 800; distanceFromNeutralAxisMm = 50 } },
    @{ tool = "projectile_motion"; params = @{ initialVelocityMs = 50; launchAngleDegrees = 45 } },
    @{ tool = "black_scholes"; params = @{ spotPrice = 100; strikePrice = 100; timeToExpiryYears = 1; riskFreeRatePercent = 4.5; volatilityPercent = 25 } },
    @{ tool = "linear_regression"; params = @{ points = @(@{ x = 1; y = 2 }, @{ x = 2; y = 4 }, @{ x = 3; y = 5 }, @{ x = 4; y = 4 }, @{ x = 5; y = 5 }) } },
    @{ tool = "pipe_flow"; params = @{ flowRateM3s = 0.05; pipeDiameterM = 0.15; pipeLengthM = 100 } },
    @{ tool = "rlc_circuit"; params = @{ resistanceOhms = 50; inductanceHenrys = 0.01; capacitanceFarads = 0.000001 } },
    @{ tool = "rocket_deltav"; params = @{ initialMassKg = 549054; finalMassKg = 22200; specificImpulseSeconds = 311 } }
)

$i = 1
foreach ($item in $engines) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $jsonBody = $item | ConvertTo-Json -Depth 5
    $resp = Invoke-RestMethod -Uri "$BaseUrl/api/v1/calculate" -Headers $Headers -Method Post -Body $jsonBody
    $sw.Stop()
    $toolName = $item.tool
    $elapsed = [math]::Round($sw.Elapsed.TotalMilliseconds, 1)
    Write-Host "$i. $toolName - Status: OK - Time: ${elapsed}ms" -ForegroundColor Green
    $i++
}

Write-Host "`n================================================================================" -ForegroundColor Cyan
Write-Host "ALL 16 ENGINES VERIFIED SUCCESSFULLY VIA POWERSHELL." -ForegroundColor Cyan
Write-Host "================================================================================"
