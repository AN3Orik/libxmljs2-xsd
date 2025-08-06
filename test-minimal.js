const binding = require('bindings')('node-libxml-xsd');
const libxmljs = require('libxmljs2');

console.log('Testing minimal schema creation...');

try {
    // Create a minimal XSD schema
    const minimalXsd = `<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root" type="xs:string"/>
</xs:schema>`;

    console.log('Parsing minimal XSD...');
    const doc = libxmljs.parseXml(minimalXsd);
    console.log('Document parsed, type:', typeof doc);
    console.log('Document constructor:', doc.constructor.name);
    
    // Try to access internal structure
    console.log('\nChecking document structure:');
    console.log('doc properties:', Object.getOwnPropertyNames(doc));
    console.log('doc.__proto__ properties:', Object.getOwnPropertyNames(doc.__proto__));
    
    // Check if we can get the native handle
    const nativeHandle = doc.constructor;
    console.log('\nNative handle:', nativeHandle);
    
    console.log('\nAttempting to call schemaSync...');
    const schema = binding.schemaSync(doc);
    console.log('Success! Schema created:', schema);
    
} catch (e) {
    console.error('\nError occurred:');
    console.error('Message:', e.message);
    console.error('Stack:', e.stack);
}