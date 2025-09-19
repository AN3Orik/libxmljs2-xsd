// Example of using the compiled node-libxml-xsd.node file directly

const path = require('path');
const libxmljs = require('libxmljs2');

// Load the native binding
// In a real project, copy the .node file from build/Release/ to your project
const binding = require('../build/Release/node-libxml-xsd.node');

// Simple wrapper around the native binding
class Schema {
    constructor(schemaObj) {
        this.schemaObj = schemaObj;
    }

    validate(xmlSource) {
        // Parse XML if it's a string
        const doc = typeof xmlSource === 'string' 
            ? libxmljs.parseXml(xmlSource) 
            : xmlSource;

        // Call native validation
        const errors = binding.validateSync(this.schemaObj, doc);
        
        // Return null for valid documents, errors array for invalid
        return errors.length === 0 ? null : errors;
    }
}

// Function to parse XSD schema
function parseSchema(xsdSource) {
    // Parse XSD if it's a string
    const doc = typeof xsdSource === 'string' 
        ? libxmljs.parseXml(xsdSource) 
        : xsdSource;

    // Create schema using native binding
    const schemaObj = binding.schemaSync(doc);
    
    return new Schema(schemaObj);
}

// Example usage
console.log('Example: Using node-libxml-xsd.node directly\n');

// Define a simple XSD schema
const xsdSchema = `<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="person">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="name" type="xs:string"/>
        <xs:element name="age">
          <xs:simpleType>
            <xs:restriction base="xs:integer">
              <xs:minInclusive value="0"/>
              <xs:maxInclusive value="150"/>
            </xs:restriction>
          </xs:simpleType>
        </xs:element>
        <xs:element name="email" type="xs:string" minOccurs="0"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;

// Parse the schema
console.log('1. Parsing XSD schema...');
const schema = parseSchema(xsdSchema);
console.log('   Schema parsed successfully!\n');

// Test with valid XML
console.log('2. Validating valid XML...');
const validXml = `<?xml version="1.0"?>
<person>
  <name>John Doe</name>
  <age>30</age>
  <email>john@example.com</email>
</person>`;

const validResult = schema.validate(validXml);
console.log('   Result:', validResult === null ? 'VALID' : 'INVALID');
console.log('   Errors:', validResult || 'None\n');

// Test with invalid XML (age out of range)
console.log('3. Validating invalid XML (age > 150)...');
const invalidXml1 = `<?xml version="1.0"?>
<person>
  <name>Jane Doe</name>
  <age>200</age>
</person>`;

const invalidResult1 = schema.validate(invalidXml1);
console.log('   Result:', invalidResult1 === null ? 'VALID' : 'INVALID');
if (invalidResult1) {
    console.log('   Errors:');
    invalidResult1.forEach(err => {
        console.log(`     - Line ${err.line}: ${err.message}`);
    });
}

// Test with invalid XML (wrong type)
console.log('\n4. Validating invalid XML (age not a number)...');
const invalidXml2 = `<?xml version="1.0"?>
<person>
  <name>Bob Smith</name>
  <age>thirty</age>
</person>`;

const invalidResult2 = schema.validate(invalidXml2);
console.log('   Result:', invalidResult2 === null ? 'VALID' : 'INVALID');
if (invalidResult2) {
    console.log('   Errors:');
    invalidResult2.forEach(err => {
        console.log(`     - Line ${err.line}: ${err.message}`);
    });
}

// Test with invalid XML (missing required element)
console.log('\n5. Validating invalid XML (missing name)...');
const invalidXml3 = `<?xml version="1.0"?>
<person>
  <age>25</age>
</person>`;

const invalidResult3 = schema.validate(invalidXml3);
console.log('   Result:', invalidResult3 === null ? 'VALID' : 'INVALID');
if (invalidResult3) {
    console.log('   Errors:');
    invalidResult3.forEach(err => {
        console.log(`     - Line ${err.line}: ${err.message}`);
    });
}

console.log('\n✅ Example completed!');
console.log('\nTo use this in your own project:');
console.log('1. Copy build/Release/node-libxml-xsd.node to your project');
console.log('2. Install libxmljs2: npm install libxmljs2');
console.log('3. Use the code pattern shown above');