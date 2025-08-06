const xsd = require('./index');
const fs = require('fs');

console.log('Testing XSD validation with various scenarios...\n');

// Test 1: Valid document
console.log('Test 1: Valid document');
const schemaContent = fs.readFileSync('./test/resources/chapter04ord1.xsd', 'utf8');
const validDoc = fs.readFileSync('./test/resources/chapter04.xml', 'utf8');

const schema = xsd.parse(schemaContent);
const validationResult = schema.validate(validDoc);
console.log('Valid document result:', validationResult);
console.log('Expected: null (no errors)\n');

// Test 2: Invalid document - missing required element
console.log('Test 2: Invalid document - missing required element');
const invalidDoc1 = `<?xml version="1.0" encoding="UTF-8"?>
<order xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="chapter04ord.xsd">
  <!-- Missing number element -->
  <items>
    <shirt>
      <quantity>5</quantity>
      <color value="blue"/>
    </shirt>
  </items>
</order>`;

const result1 = schema.validate(invalidDoc1);
console.log('Invalid document result:', result1);
console.log('Expected: Array with validation errors\n');

// Test 3: Invalid document - wrong data type
console.log('Test 3: Invalid document - wrong data type');
const invalidDoc2 = `<?xml version="1.0" encoding="UTF-8"?>
<order xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="chapter04ord.xsd">
  <number>12345</number>
  <items>
    <shirt>
      <quantity>not-a-number</quantity>
      <color value="blue"/>
    </shirt>
  </items>
</order>`;

const result2 = schema.validate(invalidDoc2);
console.log('Invalid document result:', result2);
console.log('Expected: Array with validation errors\n');

// Test 4: Simple schema validation
console.log('Test 4: Simple schema validation');
const simpleSchema = xsd.parse(`<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="name" type="xs:string"/>
        <xs:element name="age" type="xs:integer"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`);

const validSimple = `<?xml version="1.0"?>
<root>
  <name>John Doe</name>
  <age>30</age>
</root>`;

const invalidSimple = `<?xml version="1.0"?>
<root>
  <name>John Doe</name>
  <age>thirty</age>
</root>`;

console.log('Valid simple document:', simpleSchema.validate(validSimple));
console.log('Invalid simple document:', simpleSchema.validate(invalidSimple));

console.log('\nAll tests completed!');