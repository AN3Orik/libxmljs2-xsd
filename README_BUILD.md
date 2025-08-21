# Building libxmljs2-xsd

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python (for node-gyp)
- C++ compiler:
  - **Windows**: Visual Studio 2022 with C++ tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: GCC or Clang

### Install and Build

```bash
# Install dependencies
npm install

# The module will be built automatically during npm install
# Or manually rebuild:
node-gyp rebuild
```

### Verify Installation

```bash
# Run tests
npm test
```

## Platform-Specific Instructions

### Windows
See [BUILD_WINDOWS.md](BUILD_WINDOWS.md) for detailed Windows build instructions.

Key points for Windows:
- Requires Visual Studio 2022 with C++ development tools
- Python 3.x must be installed
- The module compiles libxml2 sources directly to avoid linking issues

### macOS
```bash
# Install Xcode Command Line Tools if not already installed
xcode-select --install

# Build
npm install
```

### Linux
```bash
# Install build essentials (Ubuntu/Debian)
sudo apt-get install build-essential python3

# Build
npm install
```

## Troubleshooting

### Common Issues

1. **node-gyp not found**
   ```bash
   npm install -g node-gyp
   ```

2. **Python not found**
   - Install Python 3.x and ensure it's in PATH
   - Or configure: `npm config set python /path/to/python`

3. **Compiler not found**
   - Windows: Install Visual Studio 2022 with C++ tools
   - macOS: Install Xcode Command Line Tools
   - Linux: Install build-essential package

4. **Build fails after Node.js upgrade**
   ```bash
   npm rebuild
   ```

### Clean Build

If you encounter issues, try a clean build:

```bash
node-gyp clean
node-gyp configure
node-gyp build
```

## Development

When modifying C++ source files:

1. Edit files in `src/`
2. Rebuild: `node-gyp rebuild`
3. Test: `npm test`

For verbose output during build:
```bash
node-gyp rebuild --verbose
```

## Build Output

The compiled module will be at:
- `build/Release/node-libxml-xsd.node`

This file is loaded automatically by `index.js` when you `require('libxmljs2-xsd')`.