# Dominic M. Blancaflor Portfolio - Universal Web Server
param([int]$Port = 3000)

$ErrorActionPreference = "Continue"

$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = Get-Location }

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".jsx"   = "text/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".webp"  = "image/webp"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".woff2" = "font/woff2"
    ".woff"  = "font/woff"
    ".ttf"   = "font/ttf"
    ".pdf"   = "application/pdf"
}

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
$listener.Start()

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Dominic M. Blancaflor - Universal Dev Server" -ForegroundColor Green
Write-Host "  Port: $Port (Accepts ALL host domains, tunnels & IP access)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $client.ReceiveTimeout = 4000
            $client.SendTimeout = 4000
            $stream = $client.GetStream()
            
            # Read first chunk containing the HTTP request header
            $buffer = New-Object byte[] 4096
            $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
            if ($bytesRead -gt 0) {
                $reqText = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
                $firstLine = $reqText.Split("`n")[0].Trim()
                $parts = $firstLine.Split(' ')
                $method = $parts[0]
                $url = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
                
                $path = $url.Split('?')[0].TrimStart('/')
                if ([string]::IsNullOrWhiteSpace($path)) {
                    $path = "index.html"
                }
                $path = [System.Uri]::UnescapeDataString($path).Replace('/', '\')
                $fullPath = Join-Path $baseDir $path

                if (Test-Path $fullPath -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                    $mime = $mimeTypes[$ext]
                    if (-not $mime) { $mime = "application/octet-stream" }
                    
                    $fileBytes = [System.IO.File]::ReadAllBytes($fullPath)
                    $headerStr = "HTTP/1.1 200 OK`r`n" +
                                 "Content-Type: $mime`r`n" +
                                 "Content-Length: $($fileBytes.Length)`r`n" +
                                 "Access-Control-Allow-Origin: *`r`n" +
                                 "Connection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerStr)
                    
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    if ($method -ne "HEAD") {
                        $stream.Write($fileBytes, 0, $fileBytes.Length)
                    }
                } else {
                    $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $headerStr = "HTTP/1.1 404 Not Found`r`n" +
                                 "Content-Type: text/plain`r`n" +
                                 "Content-Length: $($notFound.Length)`r`n" +
                                 "Connection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerStr)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    if ($method -ne "HEAD") {
                        $stream.Write($notFound, 0, $notFound.Length)
                    }
                }
                $stream.Flush()
            }
        } catch {
            # Catch transient network/socket exceptions
        } finally {
            try { $client.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
}
