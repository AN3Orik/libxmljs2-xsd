const xsd = require('./index.js');
const fs = require('fs');

console.log('Module loaded');

try {
    const schemaSource = fs.readFileSync('./test/resources/chapter04ord1.xsd', 'utf8');
    console.log('Schema file read, length:', schemaSource.length);
    
    const schema = xsd.parse(schemaSource);
    console.log('Schema parsed successfully');
    console.log('Schema object:', schema);
    
    const docSource = fs.readFileSync('./test/resources/chapter04.xml', 'utf8');
    console.log('Document file read, length:', docSource.length);
    
    const validationErrors = schema.validate(docSource);
    console.log('Validation result:', validationErrors);
    
} catch(e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
}