const fs = require('fs');
const content = fs.readFileSync('build-output.log', 'utf16le');
fs.writeFileSync('build-output-utf8.log', content, 'utf8');
