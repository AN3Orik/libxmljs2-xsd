# Using libxmljs2-xsd in Your Project

This guide explains different ways to use libxmljs2-xsd in your Node.js projects.

## Method 1: Install from npm (Recommended)

If the package is published to npm:

```bash
npm install libxmljs2-xsd
```

Then use it in your code:

```javascript
const xsd = require('libxmljs2-xsd');
```

## Method 2: Install from Local Path

If you have built libxmljs2-xsd locally:

```bash
# From your project directory
npm install /path/to/libxmljs2-xsd

# Or using relative path
npm install ../libxmljs2-xsd
```

## Method 3: Using the .node File Directly

If you only want to use the compiled `.node` file without the full package:

### Step 1: Copy Required Files

Copy these files to your project:

```
your-project/
├── lib/
│   ├── node-libxml-xsd.node  (from build/Release/)
│   └── libxmljs2-xsd.js      (create this wrapper)
├── package.json
└── your-app.js
```

### Step 2: Create a Wrapper

Create `lib/libxmljs2-xsd.js`:

```javascript
const path = require('path');
const binding = require('./node-libxml-xsd.node');
const libxmljs = require('libxmljs2');

// Schema class wrapper
class Schema {
    constructor(schemaDoc, schemaObj) {
        this.schemaDoc = schemaDoc;
        this.schemaObj = schemaObj;
    }

    validate(source) {
        const doc = typeof source === 'string' || Buffer.isBuffer(source) 
            ? libxmljs.parseXml(source) 
            : source;

        const validationErrors = binding.validateSync(this.schemaObj, doc);
        
        if (validationErrors.length === 0) {
            return null;
        }
        
        return validationErrors;
    }

    validateFile(filename) {
        const fs = require('fs');
        const content = fs.readFileSync(filename, 'utf8');
        return this.validate(content);
    }
}

// Main module exports
module.exports = {
    parse: function(source) {
        const schemaDoc = typeof source === 'string' || Buffer.isBuffer(source)
            ? libxmljs.parseXml(source)
            : source;

        const schemaObj = binding.schemaSync(schemaDoc);
        return new Schema(schemaDoc, schemaObj);
    },

    parseFile: function(filename) {
        const fs = require('fs');
        const content = fs.readFileSync(filename, 'utf8');
        return this.parse(content);
    }
};
```

### Step 3: Install libxmljs2 Dependency

Your project needs libxmljs2:

```bash
npm install libxmljs2
```

### Step 4: Use in Your Project

```javascript
const xsd = require('./lib/libxmljs2-xsd');

// Your XSD schema
const schemaText = `<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="name" type="xs:string"/>
        <xs:element name="age" type="xs:integer"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;

// Parse schema
const schema = xsd.parse(schemaText);

// Validate XML
const xmlText = `<?xml version="1.0"?>
<root>
  <name>John Doe</name>
  <age>30</age>
</root>`;

const errors = schema.validate(xmlText);
if (errors === null) {
    console.log('Document is valid!');
} else {
    console.log('Validation errors:', errors);
}
```

## Method 4: Link During Development

For development, you can use npm link:

```bash
# In libxmljs2-xsd directory
npm link

# In your project directory
npm link libxmljs2-xsd
```

## Platform Considerations

### Windows
- The `.node` file is platform-specific
- A `.node` file built on Windows x64 won't work on Linux or macOS
- Ensure Visual C++ Redistributables are installed on target machines

### Cross-Platform Distribution
If distributing to multiple platforms, you need to:

1. Build on each target platform
2. Include platform-specific `.node` files:
   ```
   lib/
   ├── win32-x64/
   │   └── node-libxml-xsd.node
   ├── darwin-x64/
   │   └── node-libxml-xsd.node
   └── linux-x64/
       └── node-libxml-xsd.node
   ```

3. Load the correct one based on platform:
   ```javascript
   const os = require('os');
   const path = require('path');
   
   const platform = os.platform();
   const arch = os.arch();
   const bindingPath = path.join(__dirname, `${platform}-${arch}`, 'node-libxml-xsd.node');
   const binding = require(bindingPath);
   ```

## API Reference

### `xsd.parse(schemaSource)`
- **schemaSource**: String, Buffer, or libxmljs Document containing the XSD schema
- **Returns**: Schema object

### `xsd.parseFile(filename)`
- **filename**: Path to XSD schema file
- **Returns**: Schema object

### `schema.validate(xmlSource)`
- **xmlSource**: String, Buffer, or libxmljs Document to validate
- **Returns**: `null` if valid, array of error objects if invalid

### `schema.validateFile(filename)`
- **filename**: Path to XML file to validate
- **Returns**: `null` if valid, array of error objects if invalid

## Error Object Structure

When validation fails, each error object contains:

```javascript
{
  message: "Element 'age': 'thirty' is not a valid value of the atomic type 'xs:integer'.",
  domain: 17,
  code: 1824,
  level: 2,
  line: 4,
  column: 0
}
```

## Example: Express.js Validation Middleware

```javascript
const xsd = require('libxmljs2-xsd');
const fs = require('fs');

// Load schema once at startup
const schemaText = fs.readFileSync('./schemas/order.xsd', 'utf8');
const orderSchema = xsd.parse(schemaText);

// Validation middleware
function validateXML(req, res, next) {
    const errors = orderSchema.validate(req.body);
    
    if (errors === null) {
        next();
    } else {
        res.status(400).json({
            error: 'XML validation failed',
            details: errors.map(err => ({
                message: err.message,
                line: err.line,
                column: err.column
            }))
        });
    }
}

// Use in route
app.post('/api/orders', validateXML, (req, res) => {
    // Process valid XML
    res.json({ status: 'Order received' });
});
```

## Troubleshooting

### "Cannot find module" Error
- Ensure the `.node` file path is correct
- Check that the file has the correct permissions
- Verify the architecture matches (x64 vs x86)

### "Invalid ELF header" (Linux/macOS)
- You're trying to use a Windows-built `.node` file
- Build the module on the target platform

### "The specified module could not be found" (Windows)
- Install Visual C++ Redistributables
- Ensure all dependencies are available

### Performance Tips
- Parse schemas once and reuse them
- For high-volume validation, consider caching parsed documents
- Use Buffer instead of string when possible for large documents