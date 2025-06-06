module.exports = {
  "run": [
    // Step 1: Clone the AutoGif repository
    {
      "method": "shell.run",
      "params": {
        "message": "git clone https://github.com/shitcoinsherpa/AutoGif.git app"
      }
    },
    // Step 2: Install platform-specific PyTorch using torch.js
    {
      "method": "script.start",
      "params": {
        "uri": "torch.js",
        "params": {
          "venv": "env",                // Edit this to customize the venv folder path
          "path": "app",                // Edit this to customize the path to start the shell from
          // xformers: true   // uncomment this line if your project requires xformers
          // triton: true   // uncomment this line if your project requires triton
          // sageattention: true   // uncomment this line if your project requires sageattention
        }
      }
    },
    // Step 3: Upgrade pip
    {
      "method": "shell.run",
      "params": {
        "venv": "env",
        "path": "app",
        "message": "python -m pip install --upgrade pip"
      }
    },
    // Step 4: Install requirements
    {
      "method": "shell.run",
      "params": {
        "venv": "env",
        "path": "app",
        "message": [
          "pip install gradio devicetorch",
          "pip install -r requirements.txt"
        ]
      }
    },
    // Step 5: Install additional packages
    {
      "method": "shell.run",
      "params": {
        "venv": "env",
        "path": "app",
        "message": [
          "pip install yt-dlp",
          "pip install pyinstaller"
        ]
      }
    },
    // Step 6: Set up platform-specific binaries
    {
      "when": "{{platform === 'darwin'}}",
      "method": "shell.run",
      "params": {
        "path": "app",
        "message": [
          "mkdir -p resources",
          "curl -L -o resources/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos || echo 'Failed to download yt-dlp'",
          "chmod +x resources/yt-dlp",
          "command -v brew && brew install ffmpeg || echo 'Homebrew not found. Please install ffmpeg manually: brew install ffmpeg or download from https://evermeet.cx/ffmpeg/'"
        ]
      }
    },
    {
      "when": "{{platform === 'linux'}}",
      "method": "shell.run",
      "params": {
        "path": "app",
        "message": [
          "mkdir -p resources",
          "curl -L -o resources/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp || echo 'Failed to download yt-dlp'",
          "chmod +x resources/yt-dlp",
          "sudo apt-get update && sudo apt-get install -y ffmpeg || echo 'FFmpeg installation failed, trying static build'",
          "[[ $(uname -m) == 'x86_64' ]] && curl -L -o /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz || echo 'Skipping FFmpeg static build'",
          "[[ $(uname -m) == 'aarch64' ]] && curl -L -o /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz || echo 'Skipping FFmpeg static build'",
          "[ -f /tmp/ffmpeg.tar.xz ] && tar -xf /tmp/ffmpeg.tar.xz -C /tmp/ && mv /tmp/ffmpeg-*-static/ffmpeg resources/ && mv /tmp/ffmpeg-*-static/ffprobe resources/ && chmod +x resources/ffmpeg resources/ffprobe && rm -rf /tmp/ffmpeg* || echo 'FFmpeg static build setup skipped or failed'"
        ]
      }
    },
    {
      "when": "{{platform === 'win32'}}",
      "method": "shell.run",
      "params": {
        "path": "app",
        "message": [
          "if not exist resources mkdir resources",
          "curl -L -o resources/yt-dlp.exe https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe || echo 'Failed to download yt-dlp.exe'",
          "curl -L -o resources/ffmpeg.zip https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n6.1-latest-win64-gpl-6.1.zip || echo 'Failed to download ffmpeg'",
          "powershell -command \"Expand-Archive -Path resources/ffmpeg.zip -DestinationPath resources/ffmpeg_temp -Force\" || echo 'Failed to extract ffmpeg'",
          "copy /Y resources\\ffmpeg_temp\\ffmpeg-n6.1-latest-win64-gpl-6.1\\bin\\ffmpeg.exe resources\\ffmpeg.exe || echo 'Failed to copy ffmpeg.exe'",
          "copy /Y resources\\ffmpeg_temp\\ffmpeg-n6.1-latest-win64-gpl-6.1\\bin\\ffprobe.exe resources\\ffprobe.exe || echo 'Failed to copy ffprobe.exe'",
          "rd /s /q resources\\ffmpeg_temp || echo 'Failed to remove temp directory'",
          "del resources\\ffmpeg.zip || echo 'Failed to delete ffmpeg.zip'"
        ]
      }
    },
    // Step 7: Build PyInstaller executable (simplified)
    {
      "method": "shell.run",
      "params": {
        "venv": "env",
        "path": "app",
        "message": "python -m pyinstaller --onefile --name autogif-main autogif/main.py || echo 'PyInstaller build failed, but installation can continue'"
      }
    },
    // Step 8: Notify completion
    {
      "method": "notify",
      "params": {
        "html": "Installation complete! Click the 'Start' tab to launch AutoGif!"
      }
    }
  ]
}
