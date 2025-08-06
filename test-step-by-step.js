const binding = require('bindings')('node-libxml-xsd');
const libxmljs = require('libxmljs2');
const fs = require('fs');

console.log('1. Modules loaded');

try {
    // Step 1: Read schema file
    const schemaSource = fs.readFileSync('./test/resources/chapter04ord1.xsd', 'utf8');
    console.log('2. Schema file read, length:', schemaSource.length);
    
    // Step 2: Parse as XML document
    console.log('3. About to parse XML...');
    const schemaDoc = libxmljs.parseXml(schemaSource);
    console.log('4. XML parsed successfully');
    console.log('   - Document type:', typeof schemaDoc);
    console.log('   - Document constructor:', schemaDoc.constructor.name);
    console.log('   - Has xml_obj:', schemaDoc.xml_obj ? 'yes' : 'no');
    
    // Step 3: Call native schemaSync
    console.log('5. About to call schemaSync...');
    console.log('   - binding.schemaSync type:', typeof binding.schemaSync);
    console.log('   - Passing document:', schemaDoc);
    
    const schema = binding.schemaSync(schemaDoc);
    console.log('6. schemaSync returned:', schema);
    
} catch(e) {
    console.error('ERROR at step:', e.message);
    console.error('Stack:', e.stack);
    
    // Try to get more info
    if (e.code) console.error('Error code:', e.code);
    if (e.errno) console.error('Error errno:', e.errno);
    if (e.syscall) console.error('Error syscall:', e.syscall);
}