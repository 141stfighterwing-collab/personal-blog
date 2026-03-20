<#
.SYNOPSIS
    Personal Blog Auto-Configuration Script
.DESCRIPTION
    Automates the complete setup of the Personal Blog application including:
    - Default credentials creation
    - Database installation and configuration
    - Application configuration
    - Functionality testing
    - Progress tracking and logging
.NOTES
    Version: 1.3.0
    Author: Shootre21
    Requires: PowerShell 5.1+ or PowerShell 7+
#>

# ============================================================================
# CONFIGURATION & CONSTANTS
# ============================================================================

$ErrorActionPreference = "Continue"
$ProgressPreference = "Continue"

# Script version
$SCRIPT_VERSION = "1.3.0"

# Paths
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $SCRIPT_DIR) { $SCRIPT_DIR = $PWD.Path }
$LOG_DIR = Join-Path $SCRIPT_DIR "logs"
$LOG_FILE = Join-Path $LOG_DIR "setup_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$BACKUP_DIR = Join-Path $SCRIPT_DIR "backups"

# Default credentials
$DEFAULT_CREDENTIALS = @{
    Admin = @{ Username = "admin"; Password = "admin123"; Role = "Admin" }
    Reviewer = @{ Username = "reviewer"; Password = "review123"; Role = "Reviewer" }
    User = @{ Username = "user"; Password = "user123"; Role = "User" }
}

# Database defaults
$DB_DEFAULTS = @{
    Host = "localhost"
    Port = 5432
    Name = "personal_blog"
    User = "blog_user"
    Password = "blog_password_2024"
}

# Colors for console output
$COLORS = @{
    Header = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "White"
    Progress = "Magenta"
    Step = "Blue"
}

# ============================================================================
# LOGGING SYSTEM
# ============================================================================

function Initialize-Logging {
    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
    }
    if (-not (Test-Path $BACKUP_DIR)) {
        New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
    }
}

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet("INFO", "SUCCESS", "WARNING", "ERROR", "DEBUG")]
        [string]$Level = "INFO",
        [switch]$NoConsole
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # Write to file
    Add-Content -Path $LOG_FILE -Value $logEntry
    
    # Write to console with color
    if (-not $NoConsole) {
        $color = switch ($Level) {
            "SUCCESS" { $COLORS.Success }
            "WARNING" { $COLORS.Warning }
            "ERROR" { $COLORS.Error }
            "DEBUG" { "Gray" }
            default { $COLORS.Info }
        }
        Write-Host $logEntry -ForegroundColor $color
    }
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n  == $Message ==" -ForegroundColor $COLORS.Step
    Write-Log -Message $Message -Level "INFO"
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor $COLORS.Success
    Write-Log -Message $Message -Level "SUCCESS"
}

function Write-Warning {
    param([string]$Message)
    Write-Host "  [!] $Message" -ForegroundColor $COLORS.Warning
    Write-Log -Message $Message -Level "WARNING"
}

function Write-Error {
    param([string]$Message)
    Write-Host "  [X] $Message" -ForegroundColor $COLORS.Error
    Write-Log -Message $Message -Level "ERROR"
}

# ============================================================================
# PROGRESS BAR SYSTEM
# ============================================================================

$script:PROGRESS_TOTAL = 0
$script:PROGRESS_CURRENT = 0
$script:PROGRESS_STEPS = @()

function Initialize-Progress {
    param([string[]]$Steps)
    $script:PROGRESS_STEPS = $Steps
    $script:PROGRESS_TOTAL = $Steps.Count
    $script:PROGRESS_CURRENT = 0
}

function Update-Progress {
    param(
        [string]$CurrentStep,
        [string]$Status = ""
    )
    
    $script:PROGRESS_CURRENT++
    $percent = [math]::Round(($script:PROGRESS_CURRENT / $script:PROGRESS_TOTAL) * 100)
    
    # Draw progress bar
    $barWidth = 40
    $filled = [math]::Round(($percent / 100) * $barWidth)
    $empty = $barWidth - $filled
    $bar = "█" * $filled + "░" * $empty
    
    # Clear previous line and write new progress
    Write-Host "`r  Progress: [$bar] $percent% - $CurrentStep" -NoNewline -ForegroundColor $COLORS.Progress
    if ($Status) {
        Write-Host " - $Status" -ForegroundColor $COLORS.Info
    } else {
        Write-Host ""
    }
    
    Write-Log -Message "Progress: $percent% - $CurrentStep $Status" -Level "DEBUG" -NoConsole
}

function Complete-Progress {
    Write-Host "`n  Progress: [$('█' * 40)] 100% - Complete!" -ForegroundColor $COLORS.Success
}

# ============================================================================
# SYSTEM CHECKS
# ============================================================================

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

function Test-Port {
    param(
        [string]$Host = "localhost",
        [int]$Port
    )
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connect = $tcpClient.BeginConnect($Host, $Port, $null, $null)
        $wait = $connect.AsyncWaitHandle.WaitOne(3000, $false)
        if ($wait) {
            try {
                $tcpClient.EndConnect($connect)
                $tcpClient.Close()
                return $true
            } catch {
                return $false
            }
        }
        $tcpClient.Close()
        return $false
    } catch {
        return $false
    }
}

function Get-InstalledSoftware {
    param([string]$Name)
    $uninstallPaths = @(
        "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
    )
    
    $software = Get-ItemProperty $uninstallPaths -ErrorAction SilentlyContinue | 
                Where-Object { $_.DisplayName -like "*$Name*" }
    
    return $software
}

# ============================================================================
# DATABASE FUNCTIONS
# ============================================================================

function Install-PostgreSQL {
    param(
        [string]$Version = "16",
        [string]$DataDir = "",
        [string]$Password = $DB_DEFAULTS.Password
    )
    
    Write-Step "Installing PostgreSQL $Version"
    
    # Check if already installed
    $pgInstalled = Get-InstalledSoftware -Name "PostgreSQL"
    if ($pgInstalled) {
        Write-Success "PostgreSQL already installed: $($pgInstalled.DisplayName)"
        return $true
    }
    
    # Check for chocolatey
    if (-not (Test-Command "choco")) {
        Write-Log "Installing Chocolatey package manager..."
        try {
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            Write-Success "Chocolatey installed successfully"
        } catch {
            Write-Error "Failed to install Chocolatey: $_"
            return $false
        }
    }
    
    # Install PostgreSQL via Chocolatey
    Write-Log "Installing PostgreSQL via Chocolatey..."
    try {
        $installArgs = @(
            "install",
            "postgresql$Version",
            "-y",
            "--params '/Password:$Password'"
        )
        
        if ($DataDir) {
            $installArgs += "--params '/DataDir:$DataDir'"
        }
        
        $process = Start-Process -FilePath "choco" -ArgumentList $installArgs -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -eq 0) {
            Write-Success "PostgreSQL $Version installed successfully"
            
            # Add to PATH
            $pgPath = "C:\Program Files\PostgreSQL\$Version\bin"
            if (Test-Path $pgPath) {
                $env:Path += ";$pgPath"
                [Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)
                Write-Success "Added PostgreSQL to system PATH"
            }
            
            return $true
        } else {
            Write-Error "PostgreSQL installation failed with exit code: $($process.ExitCode)"
            return $false
        }
    } catch {
        Write-Error "Failed to install PostgreSQL: $_"
        return $false
    }
}

function Install-Docker {
    Write-Step "Installing Docker Desktop"
    
    # Check if already installed
    $dockerInstalled = Get-InstalledSoftware -Name "Docker Desktop"
    if ($dockerInstalled) {
        Write-Success "Docker Desktop already installed"
        return $true
    }
    
    # Check for chocolatey
    if (-not (Test-Command "choco")) {
        Write-Log "Installing Chocolatey package manager..."
        try {
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            Write-Success "Chocolatey installed successfully"
        } catch {
            Write-Error "Failed to install Chocolatey: $_"
            return $false
        }
    }
    
    try {
        $process = Start-Process -FilePath "choco" -ArgumentList @("install", "docker-desktop", "-y") -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -eq 0) {
            Write-Success "Docker Desktop installed successfully"
            Write-Warning "Please restart your computer to complete Docker installation"
            return $true
        } else {
            Write-Error "Docker Desktop installation failed"
            return $false
        }
    } catch {
        Write-Error "Failed to install Docker Desktop: $_"
        return $false
    }
}

function Start-DockerDatabase {
    param(
        [string]$DbName = $DB_DEFAULTS.Name,
        [string]$DbUser = $DB_DEFAULTS.User,
        [string]$DbPassword = $DB_DEFAULTS.Password,
        [int]$Port = $DB_DEFAULTS.Port
    )
    
    Write-Step "Starting PostgreSQL with Docker"
    
    # Check if Docker is running
    try {
        docker info | Out-Null
        if (-not $?) {
            Write-Error "Docker is not running. Please start Docker Desktop."
            return $false
        }
    } catch {
        Write-Error "Docker command not found. Please install Docker Desktop."
        return $false
    }
    
    # Stop existing container if any
    Write-Log "Stopping existing containers..."
    docker stop personal-blog-db 2>$null
    docker rm personal-blog-db 2>$null
    
    # Start new container
    Write-Log "Creating new PostgreSQL container..."
    $dockerArgs = @(
        "run", "-d",
        "--name", "personal-blog-db",
        "-e", "POSTGRES_USER=$DbUser",
        "-e", "POSTGRES_PASSWORD=$DbPassword",
        "-e", "POSTGRES_DB=$DbName",
        "-p", "${Port}:5432",
        "-v", "personal_blog_data:/var/lib/postgresql/data",
        "postgres:16-alpine"
    )
    
    $output = docker @dockerArgs 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "PostgreSQL container started successfully"
        Write-Log "Container ID: $output"
        
        # Wait for database to be ready
        Write-Log "Waiting for database to be ready..."
        Start-Sleep -Seconds 5
        
        # Test connection
        $maxAttempts = 10
        for ($i = 1; $i -le $maxAttempts; $i++) {
            if (Test-Port -Host "localhost" -Port $Port) {
                Write-Success "Database is ready and accepting connections"
                return $true
            }
            Write-Log "Waiting for database... (attempt $i/$maxAttempts)"
            Start-Sleep -Seconds 2
        }
        
        Write-Error "Database failed to start within timeout"
        return $false
    } else {
        Write-Error "Failed to start PostgreSQL container: $output"
        return $false
    }
}

function New-Database {
    param(
        [string]$Host = $DB_DEFAULTS.Host,
        [int]$Port = $DB_DEFAULTS.Port,
        [string]$Name = $DB_DEFAULTS.Name,
        [string]$User = $DB_DEFAULTS.User,
        [string]$Password = $DB_DEFAULTS.Password
    )
    
    Write-Step "Creating database and user"
    
    $env:PGPASSWORD = "postgres"
    
    # Check if psql is available
    if (-not (Test-Command "psql")) {
        Write-Warning "psql not found, skipping direct database creation"
        return $true
    }
    
    try {
        # Create user
        $createUserSql = "CREATE USER `"$User`" WITH PASSWORD '$Password';"
        psql -h $Host -p $Port -U postgres -c $createUserSql 2>&1 | Out-Null
        
        # Create database
        $createDbSql = "CREATE DATABASE `"$Name`" OWNER `"$User`";"
        psql -h $Host -p $Port -U postgres -c $createDbSql 2>&1 | Out-Null
        
        # Grant privileges
        $grantSql = "GRANT ALL PRIVILEGES ON DATABASE `"$Name`" TO `"$User`";"
        psql -h $Host -p $Port -U postgres -c $grantSql 2>&1 | Out-Null
        
        Write-Success "Database '$Name' created successfully"
        return $true
    } catch {
        Write-Warning "Database creation skipped (may already exist): $_"
        return $true
    } finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

# ============================================================================
# ENVIRONMENT CONFIGURATION
# ============================================================================

function New-EnvironmentFile {
    param(
        [string]$DbHost = $DB_DEFAULTS.Host,
        [int]$DbPort = $DB_DEFAULTS.Port,
        [string]$DbName = $DB_DEFAULTS.Name,
        [string]$DbUser = $DB_DEFAULTS.User,
        [string]$DbPassword = $DB_DEFAULTS.Password,
        [string]$AuthSecret = "",
        [int]$Port = 3000
    )
    
    Write-Step "Creating environment configuration"
    
    $envPath = Join-Path $SCRIPT_DIR ".env"
    $envExamplePath = Join-Path $SCRIPT_DIR ".env.example"
    
    # Generate auth secret if not provided
    if (-not $AuthSecret) {
        $AuthSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
    }
    
    $envContent = @"
# Personal Blog Environment Configuration
# Generated by setup script on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Database Configuration
DATABASE_URL="postgresql://$DbUser:$DbPassword@$($DbHost):$DbPort/$DbName?schema=public"
DIRECT_DATABASE_URL="postgresql://$DbUser:$DbPassword@$($DbHost):$DbPort/$DbName?schema=public"

# Application Configuration
NEXTAUTH_URL="http://localhost:$Port"
NEXTAUTH_SECRET="$AuthSecret"

# Node Environment
NODE_ENV="development"

# Admin Credentials (for initial setup)
# These are demo credentials - change in production!
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
"@
    
    # Backup existing .env if present
    if (Test-Path $envPath) {
        $backupPath = Join-Path $BACKUP_DIR ".env_$(Get-Date -Format 'yyyyMMdd_HHmmss').bak"
        Copy-Item $envPath $backupPath -Force
        Write-Log "Backed up existing .env to $backupPath"
    }
    
    # Write new .env
    $envContent | Out-File -FilePath $envPath -Encoding UTF8 -Force
    Write-Success "Created .env file with database configuration"
    
    return $true
}

function Initialize-Database {
    Write-Step "Initializing database schema"
    
    Push-Location $SCRIPT_DIR
    try {
        # Check if bun or npm is available
        $packageManager = ""
        if (Test-Command "bun") {
            $packageManager = "bun"
        } elseif (Test-Command "npm") {
            $packageManager = "npm"
        } else {
            Write-Error "Neither bun nor npm found. Please install Node.js or Bun."
            return $false
        }
        
        Write-Log "Using package manager: $packageManager"
        
        # Install dependencies if needed
        if (-not (Test-Path "node_modules")) {
            Write-Log "Installing dependencies..."
            if ($packageManager -eq "bun") {
                bun install
            } else {
                npm install
            }
        }
        
        # Generate Prisma client
        Write-Log "Generating Prisma client..."
        if ($packageManager -eq "bun") {
            bunx prisma generate
        } else {
            npx prisma generate
        }
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to generate Prisma client"
            return $false
        }
        Write-Success "Prisma client generated"
        
        # Push database schema
        Write-Log "Pushing database schema..."
        if ($packageManager -eq "bun") {
            bunx prisma db push --skip-generate
        } else {
            npx prisma db push --skip-generate
        }
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to push database schema"
            return $false
        }
        Write-Success "Database schema initialized"
        
        return $true
    } catch {
        Write-Error "Database initialization failed: $_"
        return $false
    } finally {
        Pop-Location
    }
}

function Start-SeedData {
    Write-Step "Seeding initial data"
    
    Push-Location $SCRIPT_DIR
    try {
        # Check if server needs to start briefly for seeding
        Write-Log "Starting development server for seeding..."
        
        $packageManager = if (Test-Command "bun") { "bun" } else { "npm" }
        
        # Start server in background
        $serverJob = Start-Job -ScriptBlock {
            param($path, $pm)
            Set-Location $path
            if ($pm -eq "bun") {
                bun run dev
            } else {
                npm run dev
            }
        } -ArgumentList $SCRIPT_DIR, $packageManager
        
        # Wait for server to start
        Write-Log "Waiting for server to start..."
        $maxWait = 30
        for ($i = 1; $i -le $maxWait; $i++) {
            Start-Sleep -Seconds 1
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3000/api/seed" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    Write-Success "Seed data created"
                    break
                }
            } catch {
                # Continue waiting
            }
            if ($i -eq $maxWait) {
                Write-Warning "Server startup timeout, skipping seed"
            }
        }
        
        # Stop server
        Stop-Job $serverJob -ErrorAction SilentlyContinue
        Remove-Job $serverJob -ErrorAction SilentlyContinue
        
        return $true
    } catch {
        Write-Warning "Seeding skipped: $_"
        return $true
    } finally {
        Pop-Location
    }
}

# ============================================================================
# TESTING FUNCTIONS
# ============================================================================

function Test-DatabaseConnection {
    param(
        [string]$Host = $DB_DEFAULTS.Host,
        [int]$Port = $DB_DEFAULTS.Port
    )
    
    Write-Step "Testing database connection"
    
    if (Test-Port -Host $Host -Port $Port) {
        Write-Success "Database port $Port is accessible"
        return $true
    } else {
        Write-Error "Cannot connect to database on $Host`:$Port"
        return $false
    }
}

function Test-Application {
    param([int]$Port = 3000)
    
    Write-Step "Testing application"
    
    $tests = @(
        @{ Name = "Application Port"; Test = { Test-Port -Host "localhost" -Port $Port } }
        @{ Name = "Home Page"; Test = { 
            try {
                $r = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 10
                $r.StatusCode -eq 200
            } catch { $false }
        }}
        @{ Name = "API Endpoint"; Test = { 
            try {
                $r = Invoke-WebRequest -Uri "http://localhost:$Port/api/posts" -TimeoutSec 10
                $r.StatusCode -eq 200
            } catch { $false }
        }}
        @{ Name = "RSS Feed"; Test = { 
            try {
                $r = Invoke-WebRequest -Uri "http://localhost:$Port/api/rss" -TimeoutSec 30
                $r.StatusCode -eq 200
            } catch { $false }
        }}
    )
    
    $passed = 0
    $failed = 0
    
    foreach ($test in $tests) {
        $result = & $test.Test
        if ($result) {
            Write-Success "$($test.Name) - PASSED"
            $passed++
        } else {
            Write-Error "$($test.Name) - FAILED"
            $failed++
        }
    }
    
    Write-Host "`n  Test Results: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) { $COLORS.Success } else { $COLORS.Warning })
    
    return $failed -eq 0
}

function Start-Application {
    param([int]$Port = 3000)
    
    Write-Step "Starting application"
    
    Push-Location $SCRIPT_DIR
    try {
        $packageManager = if (Test-Command "bun") { "bun" } else { "npm" }
        
        Write-Log "Starting development server on port $Port..."
        
        if ($packageManager -eq "bun") {
            Start-Process -FilePath "bun" -ArgumentList "run", "dev" -NoNewWindow
        } else {
            Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        }
        
        # Wait for server
        Write-Log "Waiting for server to start..."
        $maxWait = 30
        for ($i = 1; $i -le $maxWait; $i++) {
            Start-Sleep -Seconds 1
            if (Test-Port -Host "localhost" -Port $Port) {
                Write-Success "Application started on http://localhost:$Port"
                Start-Sleep -Seconds 2
                return $true
            }
        }
        
        Write-Error "Application failed to start within $maxWait seconds"
        return $false
    } catch {
        Write-Error "Failed to start application: $_"
        return $false
    } finally {
        Pop-Location
    }
}

# ============================================================================
# CREDENTIAL MANAGEMENT
# ============================================================================

function Show-Credentials {
    Write-Step "Default Credentials"
    
    Write-Host @"

  ┌─────────────────────────────────────────────────────────────────┐
  │                    DEFAULT USER CREDENTIALS                      │
  ├─────────────┬─────────────┬─────────────┬───────────────────────┤
  │ Role        │ Username    │ Password    │ Access Level          │
  ├─────────────┼─────────────┼─────────────┼───────────────────────┤
  │ Admin       │ admin       │ admin123    │ Full Access           │
  │ Reviewer    │ reviewer    │ review123   │ Create/Edit           │
  │ User        │ user        │ user123     │ Read-Only             │
  └─────────────┴─────────────┴─────────────┴───────────────────────┘

"@

    Write-Log "Displayed default credentials"
    Write-Warning "Please change these credentials in production!"
}

function Export-CredentialsFile {
    $credPath = Join-Path $SCRIPT_DIR "credentials.txt"
    
    $content = @"
Personal Blog - Default Credentials
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
================================================

ADMIN ACCOUNT
Username: admin
Password: admin123
Access: Full access to all features

REVIEWER ACCOUNT  
Username: reviewer
Password: review123
Access: Create and edit content

USER ACCOUNT
Username: user
Password: user123
Access: Read-only access

================================================
WARNING: Change these credentials in production!
================================================
"@
    
    $content | Out-File -FilePath $credPath -Encoding UTF8 -Force
    Write-Success "Credentials saved to $credPath"
}

# ============================================================================
# SETUP MODES
# ============================================================================

function Start-QuickSetup {
    Write-Host @"

  ╔═════════════════════════════════════════════════════════════════╗
  ║                    QUICK SETUP MODE                              ║
  ║                    All defaults, automated                       ║
  ╚═════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor $COLORS.Header
    
    $steps = @(
        "Check prerequisites",
        "Install Docker (if needed)",
        "Start PostgreSQL container",
        "Create environment file",
        "Install dependencies",
        "Initialize database schema",
        "Seed initial data",
        "Start application",
        "Run tests"
    )
    
    Initialize-Progress -Steps $steps
    
    # Step 1: Prerequisites
    Update-Progress -CurrentStep "Checking prerequisites"
    if (-not (Test-Administrator)) {
        Write-Warning "Not running as Administrator. Some features may not work."
    }
    
    # Step 2: Docker
    Update-Progress -CurrentStep "Checking Docker"
    $dockerInstalled = Test-Command "docker"
    if (-not $dockerInstalled) {
        Write-Warning "Docker not found. Installing..."
        if (-not (Install-Docker)) {
            Write-Error "Docker installation failed. Please install manually."
            Write-Log "Falling back to direct PostgreSQL installation..."
            if (-not (Install-PostgreSQL)) {
                return $false
            }
        }
    }
    
    # Step 3: Start database
    Update-Progress -CurrentStep "Starting database"
    if ($dockerInstalled -or (Test-Command "docker")) {
        if (-not (Start-DockerDatabase)) {
            Write-Error "Failed to start database"
            return $false
        }
    }
    
    # Step 4: Environment
    Update-Progress -CurrentStep "Creating environment"
    if (-not (New-EnvironmentFile)) {
        Write-Error "Failed to create environment file"
        return $false
    }
    
    # Step 5: Dependencies
    Update-Progress -CurrentStep "Installing dependencies"
    Push-Location $SCRIPT_DIR
    try {
        if (Test-Command "bun") {
            bun install 2>&1 | Out-Null
        } elseif (Test-Command "npm") {
            npm install 2>&1 | Out-Null
        }
        Write-Success "Dependencies installed"
    } catch {
        Write-Warning "Dependency installation warning: $_"
    }
    Pop-Location
    
    # Step 6: Database schema
    Update-Progress -CurrentStep "Initializing schema"
    if (-not (Initialize-Database)) {
        Write-Error "Failed to initialize database"
        return $false
    }
    
    # Step 7: Seed data
    Update-Progress -CurrentStep "Seeding data"
    Start-SeedData | Out-Null
    
    # Step 8: Start application
    Update-Progress -CurrentStep "Starting application"
    if (-not (Start-Application)) {
        Write-Warning "Application startup had issues"
    }
    
    # Step 9: Tests
    Update-Progress -CurrentStep "Running tests"
    Start-Sleep -Seconds 3
    Test-Application | Out-Null
    
    Complete-Progress
    
    return $true
}

function Start-ManualSetup {
    Write-Host @"

  ╔═════════════════════════════════════════════════════════════════╗
  ║                    MANUAL SETUP MODE                             ║
  ║                    Guided configuration                          ║
  ╚═════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor $COLORS.Header
    
    # Database options
    Write-Host "`n  [1] Database Configuration" -ForegroundColor $COLORS.Step
    
    $dbOption = Read-Host "  Choose database setup method:
    [1] Docker (Recommended - isolated container)
    [2] Local PostgreSQL (Requires existing installation)
    [3] Cloud Database (Enter connection string manually)
  
  Selection [1-3]"
    
    switch ($dbOption) {
        "1" {
            # Docker setup
            if (-not (Test-Command "docker")) {
                Write-Host "`n  Docker is not installed. Install now?" -ForegroundColor $COLORS.Warning
                $installDocker = Read-Host "  [Y/n]"
                if ($installDocker -ne "n") {
                    Install-Docker
                    Write-Warning "Please restart your computer after Docker installation and run setup again."
                    return $false
                }
            }
            
            $dbHost = Read-Host "  Database host [localhost]"
            if (-not $dbHost) { $dbHost = "localhost" }
            
            $dbPort = Read-Host "  Database port [5432]"
            if (-not $dbPort) { $dbPort = 5432 }
            
            $dbName = Read-Host "  Database name [personal_blog]"
            if (-not $dbName) { $dbName = "personal_blog" }
            
            $dbUser = Read-Host "  Database user [blog_user]"
            if (-not $dbUser) { $dbUser = "blog_user" }
            
            $dbPassword = Read-Host "  Database password [blog_password_2024]"
            if (-not $dbPassword) { $dbPassword = "blog_password_2024" }
            
            Write-Step "Starting Docker database"
            Start-DockerDatabase -DbName $dbName -DbUser $dbUser -DbPassword $dbPassword -Port $dbPort
        }
        "2" {
            # Local PostgreSQL
            $dbHost = Read-Host "  Database host [localhost]"
            if (-not $dbHost) { $dbHost = "localhost" }
            
            $dbPort = Read-Host "  Database port [5432]"
            if (-not $dbPort) { $dbPort = 5432 }
            
            $dbName = Read-Host "  Database name [personal_blog]"
            if (-not $dbName) { $dbName = "personal_blog" }
            
            $dbUser = Read-Host "  Database user [blog_user]"
            if (-not $dbUser) { $dbUser = "blog_user" }
            
            $dbPassword = Read-Host "  Database password"
            while (-not $dbPassword) {
                Write-Warning "Password is required"
                $dbPassword = Read-Host "  Database password"
            }
            
            New-Database -Host $dbHost -Port $dbPort -Name $dbName -User $dbUser -Password $dbPassword
        }
        "3" {
            # Cloud database
            Write-Host "`n  Enter your cloud database connection string." -ForegroundColor $COLORS.Info
            Write-Host "  Example: postgresql://user:password@host:5432/database" -ForegroundColor $COLORS.Info
            
            $connectionString = Read-Host "  Connection string"
            while (-not $connectionString) {
                Write-Warning "Connection string is required"
                $connectionString = Read-Host "  Connection string"
            }
            
            # Parse connection string
            if ($connectionString -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)") {
                $dbUser = $matches[1]
                $dbPassword = $matches[2]
                $dbHost = $matches[3]
                $dbPort = [int]$matches[4]
                $dbName = $matches[5]
            } else {
                Write-Error "Invalid connection string format"
                return $false
            }
        }
        default {
            Write-Error "Invalid selection"
            return $false
        }
    }
    
    # Application port
    Write-Host "`n  [2] Application Configuration" -ForegroundColor $COLORS.Step
    $appPort = Read-Host "  Application port [3000]"
    if (-not $appPort) { $appPort = 3000 }
    
    # Create environment
    Write-Step "Creating configuration files"
    New-EnvironmentFile -DbHost $dbHost -DbPort $dbPort -DbName $dbName -DbUser $dbUser -DbPassword $dbPassword -Port $appPort
    
    # Install dependencies
    Write-Host "`n  [3] Dependencies" -ForegroundColor $COLORS.Step
    $installDeps = Read-Host "  Install dependencies now? [Y/n]"
    if ($installDeps -ne "n") {
        Push-Location $SCRIPT_DIR
        if (Test-Command "bun") {
            Write-Log "Installing with bun..."
            bun install
        } elseif (Test-Command "npm") {
            Write-Log "Installing with npm..."
            npm install
        }
        Pop-Location
    }
    
    # Initialize database
    Write-Host "`n  [4] Database Initialization" -ForegroundColor $COLORS.Step
    $initDb = Read-Host "  Initialize database schema? [Y/n]"
    if ($initDb -ne "n") {
        Initialize-Database
    }
    
    # Start application
    Write-Host "`n  [5] Start Application" -ForegroundColor $COLORS.Step
    $startApp = Read-Host "  Start the application? [Y/n]"
    if ($startApp -ne "n") {
        Start-Application -Port $appPort
    }
    
    return $true
}

function Start-DockerManagement {
    Write-Host @"

  ╔═════════════════════════════════════════════════════════════════╗
  ║                    DOCKER MANAGEMENT                             ║
  ╚═════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor $COLORS.Header
    
    $action = Read-Host "  Choose action:
    [1] View container status
    [2] Stop database container
    [3] Start database container
    [4] Restart database container
    [5] View container logs
    [6] Remove container (keeps data)
    [7] Remove container and data
    [B] Back to main menu
  
  Selection"
    
    switch ($action) {
        "1" {
            Write-Step "Container Status"
            docker ps -a --filter "name=personal-blog"
        }
        "2" {
            Write-Step "Stopping container"
            docker stop personal-blog-db
            Write-Success "Container stopped"
        }
        "3" {
            Write-Step "Starting container"
            docker start personal-blog-db
            Write-Success "Container started"
        }
        "4" {
            Write-Step "Restarting container"
            docker restart personal-blog-db
            Write-Success "Container restarted"
        }
        "5" {
            Write-Step "Container logs (press Ctrl+C to exit)"
            docker logs -f personal-blog-db
        }
        "6" {
            $confirm = Read-Host "  Confirm remove container? [y/N]"
            if ($confirm -eq "y") {
                docker stop personal-blog-db
                docker rm personal-blog-db
                Write-Success "Container removed"
            }
        }
        "7" {
            $confirm = Read-Host "  Confirm remove container AND data? [y/N]"
            if ($confirm -eq "y") {
                docker stop personal-blog-db
                docker rm personal-blog-db
                docker volume rm personal_blog_data
                Write-Success "Container and data removed"
            }
        }
        "B" { return }
        default { Write-Warning "Invalid selection" }
    }
    
    Read-Host "`n  Press Enter to continue"
}

function Show-SystemStatus {
    Write-Host @"

  ╔═════════════════════════════════════════════════════════════════╗
  ║                    SYSTEM STATUS                                 ║
  ╚═════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor $COLORS.Header

    # Check Node.js/Bun
    Write-Host "  Package Managers:" -ForegroundColor $COLORS.Step
    if (Test-Command "bun") {
        $bunVersion = bun --version
        Write-Success "Bun: $bunVersion"
    } else {
        Write-Warning "Bun: Not installed"
    }
    if (Test-Command "node") {
        $nodeVersion = node --version
        Write-Success "Node.js: $nodeVersion"
    } else {
        Write-Warning "Node.js: Not installed"
    }
    
    # Check Docker
    Write-Host "`n  Docker:" -ForegroundColor $COLORS.Step
    if (Test-Command "docker") {
        $dockerVersion = docker --version
        Write-Success "Docker: $dockerVersion"
        
        $containers = docker ps -a --filter "name=personal-blog" --format "{{.Names}}: {{.Status}}"
        if ($containers) {
            Write-Host "  Container: $containers"
        } else {
            Write-Warning "No personal-blog containers found"
        }
    } else {
        Write-Warning "Docker: Not installed"
    }
    
    # Check PostgreSQL
    Write-Host "`n  Database:" -ForegroundColor $COLORS.Step
    if (Test-Port -Host "localhost" -Port 5432) {
        Write-Success "PostgreSQL: Running on port 5432"
    } else {
        Write-Warning "PostgreSQL: Not running on port 5432"
    }
    
    # Check Application
    Write-Host "`n  Application:" -ForegroundColor $COLORS.Step
    if (Test-Port -Host "localhost" -Port 3000) {
        Write-Success "App: Running on http://localhost:3000"
    } else {
        Write-Warning "App: Not running on port 3000"
    }
    
    # Environment file
    Write-Host "`n  Configuration:" -ForegroundColor $COLORS.Step
    $envPath = Join-Path $SCRIPT_DIR ".env"
    if (Test-Path $envPath) {
        Write-Success ".env file exists"
    } else {
        Write-Warning ".env file missing"
    }
    
    # Node modules
    $nodeModules = Join-Path $SCRIPT_DIR "node_modules"
    if (Test-Path $nodeModules) {
        Write-Success "Dependencies installed"
    } else {
        Write-Warning "Dependencies not installed"
    }
    
    Read-Host "`n  Press Enter to continue"
}

# ============================================================================
# MAIN MENU
# ============================================================================

function Show-MainMenu {
    while ($true) {
        Clear-Host
        Write-Host @"

  ╔═══════════════════════════════════════════════════════════════════════╗
  ║                                                                       ║
  ║              PERSONAL BLOG - AUTO CONFIGURATION SCRIPT                ║
  ║                          Version $SCRIPT_VERSION                              ║
  ║                                                                       ║
  ╚═══════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor $COLORS.Header

        Write-Host "  Setup Options:" -ForegroundColor $COLORS.Info
        Write-Host "    [1] Quick Setup      - Automated setup with defaults"
        Write-Host "    [2] Manual Setup     - Guided configuration"
        Write-Host ""
        Write-Host "  Management:" -ForegroundColor $COLORS.Info
        Write-Host "    [3] Docker Manager   - Manage database container"
        Write-Host "    [4] System Status    - View current setup status"
        Write-Host "    [5] Show Credentials - Display default login info"
        Write-Host "    [6] Export Credentials - Save credentials to file"
        Write-Host ""
        Write-Host "  Tools:" -ForegroundColor $COLORS.Info
        Write-Host "    [7] Test Application - Run functionality tests"
        Write-Host "    [8] View Logs        - Open setup log file"
        Write-Host ""
        Write-Host "    [Q] Quit" -ForegroundColor $COLORS.Warning
        Write-Host ""
        
        $selection = Read-Host "  Selection"
        
        switch ($selection.ToUpper()) {
            "1" {
                $result = Start-QuickSetup
                if ($result) {
                    Show-Credentials
                    Write-Host "`n  Setup complete! Access your blog at: http://localhost:3000" -ForegroundColor $COLORS.Success
                } else {
                    Write-Error "Setup encountered errors. Check logs for details."
                }
                Read-Host "`n  Press Enter to continue"
            }
            "2" {
                $result = Start-ManualSetup
                if ($result) {
                    Show-Credentials
                }
                Read-Host "`n  Press Enter to continue"
            }
            "3" {
                Start-DockerManagement
            }
            "4" {
                Show-SystemStatus
            }
            "5" {
                Show-Credentials
                Read-Host "`n  Press Enter to continue"
            }
            "6" {
                Export-CredentialsFile
                Read-Host "`n  Press Enter to continue"
            }
            "7" {
                Test-Application
                Read-Host "`n  Press Enter to continue"
            }
            "8" {
                if (Test-Path $LOG_FILE) {
                    Get-Content $LOG_FILE | Out-Host
                } else {
                    Write-Warning "No log file found"
                }
                Read-Host "`n  Press Enter to continue"
            }
            "Q" {
                Write-Host "`n  Thank you for using Personal Blog Setup!`n" -ForegroundColor $COLORS.Success
                return
            }
            default {
                Write-Warning "Invalid selection"
                Start-Sleep -Seconds 1
            }
        }
    }
}

# ============================================================================
# ENTRY POINT
# ============================================================================

function Main {
    # Initialize logging
    Initialize-Logging
    
    Write-Log "=== Personal Blog Setup Script Started ===" -Level "INFO"
    Write-Log "Script Version: $SCRIPT_VERSION"
    Write-Log "Script Directory: $SCRIPT_DIR"
    Write-Log "PowerShell Version: $($PSVersionTable.PSVersion)"
    Write-Log "OS: $($PSVersionTable.OS)"
    
    # Show menu
    Show-MainMenu
    
    Write-Log "=== Personal Blog Setup Script Ended ===" -Level "INFO"
}

# Run main function
Main
