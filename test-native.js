const binding = require('bindings')('node-libxml-xsd');

console.log('Native binding loaded');
console.log('Binding exports:', Object.keys(binding));

// Try to check if the functions exist
console.log('schemaSync exists:', typeof binding.schemaSync);
console.log('validateSync exists:', typeof binding.validateSync);

// Check if Schema constructor exists
if (binding.Schema) {
    console.log('Schema constructor exists');
}