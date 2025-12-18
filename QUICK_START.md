# Quick Start: Using node-libxml-xsd.node in Your Project

## Step 1: Build libxmljs2-xsd

```bash
# Clone and build libxmljs2-xsd
git clone <repository-url> libxmljs2-xsd
cd libxmljs2-xsd
npm install
node-gyp rebuild
```

## Step 2: Copy the .node file to your project

```bash
# From your project directory
mkdir lib
cp path/to/libxmljs2-xsd/build/Release/node-libxml-xsd.node ./lib/
```

## Step 3: Install libxmljs2 dependency

```bash
npm install libxmljs2
```

## Step 4: Create a wrapper (optional but recommended)

Create `lib/xsd-validator.js`:

```javascript
const binding = require('./node-libxml-xsd.node');
const libxmljs = require('libxmljs2');

module.exports = {
    parseSchema(xsdString) {
        const xsdDoc = libxmljs.parseXml(xsdString);
        const schemaObj = binding.schemaSync(xsdDoc);
        
        return {
            validate(xmlString) {
                const xmlDoc = libxmljs.parseXml(xmlString);
                const errors = binding.validateSync(schemaObj, xmlDoc);
                return errors.length === 0 ? null : errors;
            }
        };
    }
};
```

## Step 5: Use in your application

```javascript
const xsdValidator = require('./lib/xsd-validator');

// Your XSD schema
const schema = xsdValidator.parseSchema(`
    <?xml version="1.0"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:element name="user">
            <xs:complexType>
                <xs:sequence>
                    <xs:element name="name" type="xs:string"/>
                    <xs:element name="email" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>
        </xs:element>
    </xs:schema>
`);

// Validate XML
const errors = schema.validate(`
    <?xml version="1.0"?>
    <user>
        <name>John Doe</name>
        <email>john@example.com</email>
    </user>
`);

if (errors === null) {
    console.log('✅ XML is valid!');
} else {
    console.log('❌ Validation errors:', errors);
}
```

## Direct Usage (without wrapper)

If you prefer to use the native binding directly:

```javascript
const binding = require('./lib/node-libxml-xsd.node');
const libxmljs = require('libxmljs2');

// Parse schema
const xsdDoc = libxmljs.parseXml(xsdString);
const schemaObj = binding.schemaSync(xsdDoc);

// Validate
const xmlDoc = libxmljs.parseXml(xmlString);
const errors = binding.validateSync(schemaObj, xmlDoc);
```

## Important Notes

1. **Platform-specific**: The `.node` file only works on the platform it was built on
2. **Node.js version**: Should match the Node.js version used to build the module
3. **Architecture**: Must match (x64 vs x86/ia32)

## Troubleshooting

### Error: "Cannot find module"
- Check the path to the `.node` file
- Ensure file permissions are correct

### Error: "Module version mismatch"
- Rebuild with your current Node.js version
- Check NODE_MODULE_VERSION compatibility

### Error: "Invalid ELF header" or "not a valid Win32 application"
- Wrong platform - rebuild on target platform
- Architecture mismatch (32-bit vs 64-bit)

## Distribution Tips

For npm packages that use the `.node` file:

1. Use `.npmignore` to exclude unnecessary files
2. Consider using `node-pre-gyp` for prebuilt binaries
3. Document platform requirements clearly
4. Provide build instructions for each platform

## Example package.json

```json
{
  "name": "my-xml-validator",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "libxmljs2": "^0.37.0"
  },
  "files": [
    "lib/",
    "index.js"
  ],
  "engines": {
    "node": ">=14.0.0"
  },
  "os": ["win32"],
  "cpu": ["x64"]
}