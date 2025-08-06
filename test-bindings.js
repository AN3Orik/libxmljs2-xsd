const libxmljs = require('libxmljs2');
const libxmljsBindings = require('libxmljs2/lib/bindings');
const fs = require('fs');

console.log('libxmljs exports:', Object.keys(libxmljs));
console.log('libxmljs bindings exports:', Object.keys(libxmljsBindings));

// Test parsing with different methods
const schemaSource = fs.readFileSync('./test/resources/chapter04ord1.xsd', 'utf8');

// Method 1: Using libxmljs.parseXml (wrapper)
const doc1 = libxmljs.parseXml(schemaSource);
console.log('\nMethod 1 - libxmljs.parseXml:');
console.log('Type:', typeof doc1);
console.log('Constructor:', doc1.constructor.name);
console.log('Is Document?', doc1 instanceof libxmljs.Document);

// Method 2: Using bindings directly
const doc2 = libxmljsBindings.fromXml(schemaSource);
console.log('\nMethod 2 - bindings.fromXml:');
console.log('Type:', typeof doc2);
console.log('Constructor:', doc2.constructor.name);
console.log('Is Document?', doc2 instanceof libxmljsBindings.Document);

// Check if they're the same
console.log('\nAre they the same type?', doc1.constructor === doc2.constructor);

// Try to access native document
console.log('\nChecking for native access:');
console.log('doc1 properties:', Object.getOwnPropertyNames(doc1));
console.log('doc2 properties:', Object.getOwnPropertyNames(doc2));