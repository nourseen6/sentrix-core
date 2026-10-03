# Lists likely credentials in source-like files.
# Prints the file path and the pattern name only. Never prints the matched value.
# Usage (from the workspace root):
#   powershell -NoProfile -File security/tools/scan-secrets.ps1

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")

$allowed = @(
    ".dart", ".kt", ".java", ".swift", ".js", ".jsx", ".ts", ".tsx",
    ".py", ".json", ".yml", ".yaml", ".xml", ".gradle", ".plist",
    ".c", ".h", ".cpp", ".hpp", ".rs", ".env", ".properties", ".toml"
)

$patterns = @(
    @{ Name = "private-key-header"; Regex = "-----BEGIN [A-Z ]*PRIVATE KEY-----" },
    @{ Name = "aws-access-key-id"; Regex = "\bAKIA[0-9A-Z]{16}\b" },
    @{ Name = "google-api-key"; Regex = "\bAIza[0-9A-Za-z\-_]{35}\b" },
    @{ Name = "slack-token"; Regex = "\bxox[baprs]-[0-9A-Za-z-]{10,}\b" },
    @{ Name = "stripe-live-key"; Regex = "\bsk_live_[0-9A-Za-z]{10,}\b" },
    @{ Name = "assigned-password"; Regex = "(?i)\b(password|passwd|pwd)\b\s*[:=]\s*['""][^'""]{4,}['""]" },
    @{ Name = "assigned-api-key"; Regex = "(?i)\b(api[_-]?key|secret|access[_-]?token)\b\s*[:=]\s*['""][^'""]{6,}['""]" }
)

$files = Get-ChildItem -Path $root -Recurse -File -Force -ErrorAction SilentlyContinue |
    Where-Object {
        $allowed -contains $_.Extension.ToLower() -or $_.Name -like ".env*"
    }

$findings = @()
foreach ($file in $files) {
    $text = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $text) { continue }
    foreach ($pattern in $patterns) {
        if ($text -match $pattern.Regex) {
            $relative = $file.FullName.Substring($root.Path.Length).TrimStart("\", "/")
            $findings += [PSCustomObject]@{
                File = $relative
                Pattern = $pattern.Name
            }
        }
    }
}

Write-Output ("source_files_scanned=" + @($files).Count)
Write-Output ("findings=" + @($findings).Count)
foreach ($hit in $findings) {
    Write-Output ("finding`t" + $hit.Pattern + "`t" + $hit.File)
}

if (@($findings).Count -gt 0) { exit 1 }
exit 0
