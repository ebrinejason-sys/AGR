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
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src/pages/admin');
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Simple string replacements
    content = content.replace(/'\/api\/admin\/contacts'/g, "'/api/admin?action=contacts'");
    content = content.replace(/'\/api\/admin\/stats'/g, "'/api/admin?action=stats'");
    content = content.replace(/'\/api\/admin\/events'/g, "'/api/admin?action=events'");
    content = content.replace(/'\/api\/admin\/projects'/g, "'/api/admin?action=projects'");
    content = content.replace(/'\/api\/admin\/stories'/g, "'/api/admin?action=stories'");
    content = content.replace(/'\/api\/admin\/subscriptions'/g, "'/api/admin?action=subscriptions'");
    content = content.replace(/'\/api\/admin\/email'/g, "'/api/admin?action=email'");
    content = content.replace(/'\/api\/admin\/email\/broadcast'/g, "'/api/admin?action=email_broadcast'");

    // Template literal replacement for /api/admin/projects/${id}
    // Match `/api/admin/projects/${someId}` and replace with `/api/admin?action=projects&id=${someId}`
    content = content.replace(/`\/api\/admin\/projects\/\${([^}]+)}`/g, '`/api/admin?action=projects&id=${$1}`');

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        modifiedCount++;
    }
});

console.log(`Modified ${modifiedCount} files in src/pages/admin`);
