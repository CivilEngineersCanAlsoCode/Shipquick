
mkdir -p content/_tools/beads/bin/dist

# Reuse existing arm64 binary
if [ -f content/_tools/beads/bin/bd ]; then
  mv content/_tools/beads/bin/bd content/_tools/beads/bin/dist/bd-darwin-arm64
fi

# Function to download and extract
download_bd() {
  PLATFORM=$1 # darwin_amd64, linux_amd64
  URL="https://github.com/steveyegge/beads/releases/download/v0.50.3/beads_0.50.3_${PLATFORM}.tar.gz"
  echo "Downloading $PLATFORM..."
  curl -L -o "bd_${PLATFORM}.tar.gz" "$URL"
  if [ -f "bd_${PLATFORM}.tar.gz" ]; then
    tar -xzf "bd_${PLATFORM}.tar.gz"
    if [ -f "bd" ]; then
      mv bd "content/_tools/beads/bin/dist/bd-${PLATFORM//_/-}"
    else
      echo "Error: bd binary not found in tarball for $PLATFORM"
    fi
    rm "bd_${PLATFORM}.tar.gz"
  else
    echo "Failed to download $PLATFORM"
  fi
}

# Download others
download_bd "darwin_amd64"
download_bd "linux_amd64"

# Windows (Zip)
URL="https://github.com/steveyegge/beads/releases/download/v0.50.3/beads_0.50.3_windows_amd64.zip"
echo "Downloading windows_amd64..."
curl -L -o "bd_win.zip" "$URL"
if [ -f "bd_win.zip" ]; then
  # unzip using python
  python3 -c "import zipfile; zipfile.ZipFile('bd_win.zip').extractall('.')"
  if [ -f "bd.exe" ]; then
    mv bd.exe "content/_tools/beads/bin/dist/bd-windows-amd64.exe"
  else
     echo "Error: bd.exe not found in zip"
  fi
  rm "bd_win.zip"
fi

ls -F content/_tools/beads/bin/dist/
