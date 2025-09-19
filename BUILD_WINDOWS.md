# Building libxmljs2-xsd on Windows

This guide explains how to build the libxmljs2-xsd native module on Windows.

## Prerequisites

1. **Node.js** (tested with v24.2.0)
   - Download from: https://nodejs.org/

2. **Python** (required by node-gyp)
   - Python 3.x (tested with 3.13.4)
   - Download from: https://www.python.org/downloads/

3. **Visual Studio 2022** with C++ development tools
   - Download Community edition from: https://visualstudio.microsoft.com/
   - During installation, select "Desktop development with C++"
   - Make sure to include:
     - MSVC v143 - VS 2022 C++ x64/x86 build tools
     - Windows SDK

4. **node-gyp** (Node.js native addon build tool)
   ```bash
   npm install -g node-gyp
   ```

## Build Steps

### 1. Clone or download the repository

```bash
git clone <repository-url>
cd libxmljs2-xsd
```

### 2. Install dependencies

```bash
npm install
```

This will install libxmljs2 and other required dependencies.

### 3. Build the native module

```bash
node-gyp rebuild
```

Or if you prefer using npm:

```bash
npm run install
```

The build process will:
- Compile the C++ source files from `src/`
- Compile required libxml2 source files from `node_modules/libxmljs2/vendor/libxml/`
- Link everything into `build/Release/node-libxml-xsd.node`

### 4. Verify the build

Run the tests to ensure everything is working:

```bash
npm test
```

## Build Configuration

The build is configured through `binding.gyp` which:

1. **Includes libxmljs2 headers**:
   - Points to `node_modules/libxmljs2/src` and `node_modules/libxmljs2/vendor/libxml/include`

2. **Compiles libxml2 sources directly** (Windows-specific):
   - Includes necessary libxml2 source files for XSD validation
   - This avoids linking issues since libxmljs2 doesn't produce a .lib file

3. **Sets Windows-specific defines**:
   - `LIBXML_STATIC` - Use static linking
   - `HAVE_WIN32_THREADS` - Enable Windows threading
   - `WITHOUT_ICONV` - Disable iconv support (not needed)

## Troubleshooting

### Error: Cannot find module 'node-gyp'
Install node-gyp globally:
```bash
npm install -g node-gyp
```

### Error: MSBuild or Visual Studio not found
- Make sure Visual Studio 2022 is installed with C++ tools
- Run the build from a Visual Studio Developer Command Prompt
- Or set the Visual Studio version explicitly:
  ```bash
  npm config set msvs_version 2022
  ```

### Error: Python not found
- Install Python 3.x
- Make sure Python is in your PATH
- Or set the Python path explicitly:
  ```bash
  npm config set python "C:\Python313\python.exe"
  ```

### Linker errors (LNK2001, LNK1181)
The current build configuration already handles this by compiling libxml2 sources directly. If you still encounter linker errors, ensure:
- You're using the latest version of this repository with the Windows fixes
- Run `node-gyp clean` before rebuilding

### Runtime crashes
The module has been updated to handle the libxmljs2 document objects correctly. If you experience crashes:
- Ensure you've rebuilt the module after pulling the latest changes
- Check that you're using a compatible version of libxmljs2 (tested with v0.37.0)

## Using the Module

After successful build:

```javascript
const xsd = require('libxmljs2-xsd');

// Parse a schema
const schema = xsd.parse(schemaString);

// Validate a document
const validationErrors = schema.validate(xmlString);
if (validationErrors === null) {
    console.log('Document is valid');
} else {
    console.log('Validation errors:', validationErrors);
}
```

## Development

If you're modifying the C++ source:

1. Make changes to files in `src/`
2. Rebuild: `node-gyp rebuild`
3. Test: `npm test`

For verbose build output:
```bash
node-gyp rebuild --verbose
```

To clean build artifacts:
```bash
node-gyp clean