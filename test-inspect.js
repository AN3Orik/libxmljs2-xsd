const libxmljs = require('libxmljs2');
const fs = require('fs');

// Read and parse a simple XML
const schemaSource = fs.readFileSync('./test/resources/chapter04ord1.xsd', 'utf8');
const doc = libxmljs.parseXml(schemaSource);

console.log('Document object properties:');
console.log(Object.getOwnPropertyNames(doc));
console.log('\nDocument prototype properties:');
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(doc)));

// Check if we can access internal properties
console.log('\nTrying to access internals:');
console.log('doc._xmlDoc:', doc._xmlDoc);
console.log('doc.doc:', doc.doc);

// Try to get more info about the document
console.log('\nDocument info:');
console.log('toString:', doc.toString().substring(0, 100) + '...');
console.log('root:', doc.root());
console.log('encoding:', doc.encoding());
console.log('version:', doc.version());