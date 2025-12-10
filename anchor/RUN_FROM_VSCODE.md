# Run Anchor Build from VS Code

## Option 1: Use VS Code Terminal (Easiest)

### Step 1: Open Integrated Terminal
- Press `Ctrl + `` (backtick) to open VS Code terminal
- Or go to **View → Terminal**

### Step 2: Navigate to Anchor Folder
```powershell
cd anchor
```

### Step 3: Run Build Commands

**Check Docker:**
```powershell
docker --version
```

**Build Docker Image:**
```powershell
pwsh build-anchor.ps1 build
```

**Compile Smart Contract:**
```powershell
pwsh build-anchor.ps1 compile
```

**Run Tests:**
```powershell
pwsh build-anchor.ps1 test
```

**Deploy to Devnet:**
```powershell
pwsh build-anchor.ps1 deploy
```

---

## Option 2: Create VS Code Task (Run with Ctrl+Shift+B)

### Step 1: Create .vscode/tasks.json

If you don't have `.vscode/tasks.json`, create it:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Docker Build Image",
      "type": "shell",
      "command": "pwsh",
      "args": [
        "build-anchor.ps1",
        "build"
      ],
      "options": {
        "cwd": "${workspaceFolder}/anchor"
      },
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Compile Smart Contract",
      "type": "shell",
      "command": "pwsh",
      "args": [
        "build-anchor.ps1",
        "compile"
      ],
      "options": {
        "cwd": "${workspaceFolder}/anchor"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "pwsh",
      "args": [
        "build-anchor.ps1",
        "test"
      ],
      "options": {
        "cwd": "${workspaceFolder}/anchor"
      },
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Deploy to Devnet",
      "type": "shell",
      "command": "pwsh",
      "args": [
        "build-anchor.ps1",
        "deploy"
      ],
      "options": {
        "cwd": "${workspaceFolder}/anchor"
      },
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared"
      },
      "problemMatcher": []
    }
  ]
}
```

### Step 2: Run Tasks from VS Code

**Run Build Command:**
- Press `Ctrl + Shift + B` (runs default build task)
- Or press `Ctrl + Shift + P`, type "Tasks: Run Task", select task

**See All Tasks:**
- `Ctrl + Shift + P` → "Tasks: Run Task" → Choose from list

---

## Option 3: Create Run Button (Explorer Context Menu)

Create a simple wrapper script to run from explorer:

**File: `anchor/run-build.cmd`**
```batch
@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "build-anchor.ps1" %1
pause
```

Then right-click file in Explorer → Open with → Command Prompt

---

## Option 4: VS Code Extension (Optional)

Install **Command Runner** extension:
1. Open Extensions (`Ctrl + Shift + X`)
2. Search "Command Runner"
3. Install by emeraldwalk
4. Create `.vscode/command-runner.json`:

```json
{
  "commands": {
    "Docker Build": "cd anchor && pwsh build-anchor.ps1 build",
    "Compile Contract": "cd anchor && pwsh build-anchor.ps1 compile",
    "Run Tests": "cd anchor && pwsh build-anchor.ps1 test"
  }
}
```

Then use `Ctrl + Shift + P` → "Command Runner" to access commands

---

## Quick Reference

| Task | Command |
|------|---------|
| Build Docker Image | `cd anchor && pwsh build-anchor.ps1 build` |
| Compile Contract | `cd anchor && pwsh build-anchor.ps1 compile` |
| Run Tests | `cd anchor && pwsh build-anchor.ps1 test` |
| Deploy | `cd anchor && pwsh build-anchor.ps1 deploy` |
| Check Status | `cd anchor && pwsh build-anchor.ps1 status` |
| Interactive Shell | `cd anchor && pwsh build-anchor.ps1 shell` |

---

## Troubleshooting

**Issue: "powershell command not found"**
- Open PowerShell path: `C:\Windows\System32\WindowsPowerShell\v1.5\powershell.exe`
- Use full path in command: `C:\Windows\System32\WindowsPowerShell\v1.5\powershell.exe build-anchor.ps1 build`

**Issue: "ExecutionPolicy" error**
- Run VS Code as Administrator
- Or use: `pwsh -ExecutionPolicy Bypass -File build-anchor.ps1 build`

**Issue: "docker not found"**
- Install Docker Desktop from https://docker.com/products/docker-desktop
- Restart VS Code after installation
- Verify: `docker --version` in terminal

**Issue: "Permission denied"**
- Right-click VS Code → Run as Administrator
- Or change file permissions: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
