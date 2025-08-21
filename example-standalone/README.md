# Using node-libxml-xsd.node Directly

This example demonstrates how to use the compiled `node-libxml-xsd.node` file directly in your project without installing the full libxmljs2-xsd package.

## Setup

1. **Copy the .node file** from the parent project:
   ```bash
   # From this example directory
   cp ../build/Release/node-libxml-xsd.node ./
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the example**:
   ```bash
   node index.js
   ```

## Project Structure

For your own project, you'll need:

```
your-project/
├── node_modules/
│   └── libxmljs2/          # Required dependency
├── node-libxml-xsd.node    # The compiled native module
├── package.json
└── your-app.js
```

## Minimal Code Example

```javascript
const binding = require('./node-libxml-xsd.node');
const libxmljs = require('libxmljs2');

// Parse XSD schema
const xsdDoc = libxmljs.parseXml(xsdString);
const schemaObj = binding.schemaSync(xsdDoc);

// Validate XML
const xmlDoc = libxmljs.parseXml(xmlString);
const errors = binding.validateSync(schemaObj, xmlDoc);

if (errors.length === 0) {
    console.log('Valid!');
} else {
    console.log('Validation errors:', errors);
}
```

## Important Notes

1. **Platform-specific**: The `.node` file is compiled for your specific platform (Windows/Linux/macOS) and architecture (x64/x86). You cannot use a Windows-compiled `.node` file on Linux.

2. **Dependencies**: You must have `libxmljs2` installed as it provides the XML document objects that the native module works with.

3. **Distribution**: If distributing your application, you'll need to either:
   - Include platform-specific `.node` files for each target platform
   - Build the module on the target platform
   - Use a CI/CD system to build for multiple platforms

## API Reference

The native module exports two functions:

### `binding.schemaSync(xsdDocument)`
- **xsdDocument**: A libxmljs2 Document object containing the XSD schema
- **Returns**: A schema object (opaque handle to the native schema)

### `binding.validateSync(schemaObj, xmlDocument)`
- **schemaObj**: The schema object returned by `schemaSync`
- **xmlDocument**: A libxmljs2 Document object to validate
- **Returns**: Array of error objects (empty if valid)

## Error Object Format

```javascript
{
  message: "Element 'age': '200' is not a valid value...",
  domain: 17,
  code: 1824,
  level: 2,
  line: 4,
  column: 0
}