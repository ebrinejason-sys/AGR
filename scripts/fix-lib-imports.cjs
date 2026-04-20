const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/lib');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    // Replace '@/lib/' with './'
    content = content.replace(/from '@\/lib\//g, "from './");
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Fixed ${path.basename(file)}`);
    }
});
