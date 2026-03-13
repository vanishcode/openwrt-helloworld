# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an OpenWrt LuCI application that combines a C++ backend with a React frontend. The application provides a simple interface to save text content to a file on the OpenWrt system via ubus RPC calls.

## Architecture

The application follows a three-tier architecture:

1. **Frontend (React/TypeScript)**: Located in `app/` directory, built with Vite
2. **Backend (C++)**: Located in `src/` directory, compiled to binary
3. **Integration Layer**: Shell script RPC interface in `root/usr/libexec/rpcd/helloworld`
4. **LuCI Interface**: Menu configuration and JavaScript view files in `root/`

## Key Components

- **C++ Backend** (`src/helloworld.cpp`): Accepts text input and writes to `/tmp/test.txt`
- **RPC Bridge** (`root/usr/libexec/rpcd/helloworld`): Shell script that exposes C++ functionality via ubus
- **React Frontend** (`app/src/App.tsx`): Provides UI for text input and communicates with ubus
- **LuCI Integration** (`root/usr/share/luci/menu.d/luci-app-helloworld.json`): Menu registration
- **OpenWrt Package** (`Makefile`): Build and deployment configuration

## Development Commands

### Frontend Development
```bash
cd app
pnpm install    # Install dependencies
pnpm dev        # Start development server
pnpm build      # Build for production (copies to root/www/helloworld)
pnpm lint      # Run ESLint
```

### Backend Development
```bash
g++ -o helloworld src/helloworld.cpp  # Compile C++ backend
./helloworld "test message"           # Test binary directly
```

### OpenWrt Package Building
```bash
# Using Docker (recommended)
docker pull openwrt/sdk:rockchip-armv8-25.12.0
docker run --rm -it --platform linux/amd64 -v $(pwd):/builder/package/helloworld openwrt/sdk:rockchip-armv8-25.12.0 /bin/bash

# Inside container
make menuconfig
make package/helloworld/compile V=s
```

### ubus Testing
```bash
# Test RPC interface directly
ubus call helloworld set_text '{"text":"Hello World"}'
```

## File Structure

- `src/`: C++ source code and Makefile
- `app/`: React frontend (TypeScript, Vite)
- `root/`: OpenWrt system files (rpcd scripts, LuCI configs, web assets)
- `Makefile`: OpenWrt package build configuration
- `README.md`: Docker-based build instructions

## Build Process

1. Frontend builds with Vite and outputs to `app/dist/`
2. `pnpm build` copies frontend assets to `root/www/helloworld/`
3. C++ backend compiles to binary in `src/`
4. OpenWrt Makefile packages everything into APK

## Communication Flow

1. React frontend makes HTTP POST to `/ubus`
2. LuCI/uhttpd routes to ubus daemon
3. ubus calls `helloworld` service via shell script
4. Shell script executes C++ binary with text parameter
5. C++ binary writes to `/tmp/test.txt`
6. Response flows back through the chain

## Dependencies

- OpenWrt: `libstdcpp`, `rpcd`, `rpcd-mod-file`, `uhttpd`
- Frontend: React 19, TypeScript, Vite
- Build: Docker with OpenWrt SDK

## Testing Strategy

- Test C++ binary directly with command line arguments
- Test ubus interface with `ubus call` commands
- Frontend can be tested in development mode with `pnpm dev`
- Integration testing requires OpenWrt environment

## Deployment

Built APK is copied to `dist/` directory and can be installed on OpenWrt with:
```bash
opkg install helloworld-1.0.0-r1.apk
```