const libxmljs = require('libxmljs2');
const binding = require('./build/Release/node-libxml-xsd');

console.log('Testing document wrapper...');

const xsdContent = `<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root" type="xs:string"/>
</xs:schema>`;

console.log('Parsing XSD...');
const doc = libxmljs.parseXml(xsdContent);

console.log('Document type:', typeof doc);
console.log('Document constructor name:', doc.constructor.name);
console.log('Document is instance of libxmljs.Document:', doc instanceof libxmljs.Document);

// Check if Document constructor is available
console.log('libxmljs.Document exists:', typeof libxmljs.Document);

// Let's see what's in the binding
console.log('\nBinding exports:', Object.keys(binding));

// Try to check if the document has internal properties
console.log('\nDocument internal properties:');
const props = Object.getOwnPropertyNames(doc);
console.log('Own properties:', props);

// Check prototype chain
let proto = Object.getPrototypeOf(doc);
let level = 1;
while (proto && level < 5) {
    console.log(`Prototype level ${level}:`, proto.constructor.name);
    level++;
    proto = Object.getPrototypeOf(proto);
}

// Try to see if we can access any native handle
console.log('\nChecking for native handle...');
console.log('doc._handle:', doc._handle);
console.log('doc.handle:', doc.handle);

// Let's try a different approach - create a minimal native function to test unwrapping
console.log('\nAttempting to call schemaSync...');
try {
    const result = binding.schemaSync(doc);
    console.log('Success! Result:', result);
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}