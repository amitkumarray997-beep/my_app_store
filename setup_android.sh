#!/bin/bash
set -e

echo "🚀 Starting Android SDK Setup for WSL..."

# 1. System Updates & Java 17
echo "📦 Installing Java 17 and Dependencies..."
sudo apt update && sudo apt install -y openjdk-17-jdk unzip curl wget

# 2. Setup Android SDK Directory
echo "📂 Creating Android SDK Directory..."
mkdir -p "$HOME/Android/Sdk/cmdline-tools"
cd "$HOME/Android/Sdk/cmdline-tools"

# 3. Download Command Line Tools
if [ ! -d "latest" ]; then
    echo "📡 Downloading Command Line Tools..."
    wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O tools.zip
    unzip tools.zip
    mv cmdline-tools latest
    rm tools.zip
fi

# 4. Set Environment Variables
echo "🔧 Configuring Environment Variables..."
grep -q "export ANDROID_HOME" ~/.bashrc || echo "export ANDROID_HOME=\$HOME/Android/Sdk" >> ~/.bashrc
grep -q "platform-tools" ~/.bashrc || echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin:\$ANDROID_HOME/platform-tools" >> ~/.bashrc

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# 5. Accept Licenses
echo "📝 Accepting Android Licenses..."
yes | sdkmanager --licenses

# 6. Install Build Tools
echo "🛠️ Installing Build & Platform Tools (API 34)..."
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo "✅ Setup Complete! Please run 'source ~/.bashrc' before building."
