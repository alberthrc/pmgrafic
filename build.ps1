# Une src/ en index.html. Uso: powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$enc = New-Object System.Text.UTF8Encoding $false
$head = [IO.File]::ReadAllText("src\01-head.html", $enc)
$body = [IO.File]::ReadAllText("src\02-body.html", $enc)
$js = ("03-data.js","04-app.js","05-three.js" | ForEach-Object { [IO.File]::ReadAllText("src\$_", $enc) }) -join ""
$libs = @"
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
"@
$out = @"
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Imprenta digital, offset y gran formato en Caracas. Arma tu pedido en línea y recibe tu cotización por WhatsApp y correo.">
<meta name="theme-color" content="#0d0e11">
$head
</head>
<body>
$body
$libs
<script>
$js
</script>
</body>
</html>
"@
[IO.File]::WriteAllText("index.html", $out, $enc)
Write-Host "index.html actualizado"
