const xsd = require('./index.js');
const fs = require('fs');
const libxmljs = xsd.libxmljs;

console.log('Module loaded');
console.log('libxmljs version:', libxmljs.version);

try {
    const schemaSource = fs.readFileSync('./test/resources/chapter04ord1.xsd', 'utf8');
    console.log('Schema file read, length:', schemaSource.length);
    console.log('First 100 chars:', schemaSource.substring(0, 100));
    
    // First try to parse as XML with libxmljs
    console.log('Parsing schema as XML document...');
    const schemaDoc = libxmljs.parseXml(schemaSource);
    console.log('XML document parsed successfully');
    console.log('Root element:', schemaDoc.root().name());
    
    // Now try to create XSD schema
    console.log('Creating XSD schema from document...');
    const schema = xsd.parse(schemaDoc);
    console.log('Schema parsed successfully');
    console.log('Schema object:', schema);
    
} catch(e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
    console.error('Full error:', e);
}