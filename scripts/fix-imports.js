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

const files = walk('src/pages');
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    content = content.replace(/@\/app\/stories\/page\.module\.css/g, './StoriesPage.module.css');
    content = content.replace(/@\/app\/pay\/page\.module\.css/g, './PayPage.module.css');
    content = content.replace(/@\/app\/our-story\/page\.module\.css/g, './OurStoryPage.module.css');
    content = content.replace(/@\/app\/legal-advocacy\/page\.module\.css/g, './LegalAdvocacyPage.module.css');
    content = content.replace(/@\/app\/legal\/legal\.module\.css/g, './legal.module.css');
    content = content.replace(/@\/app\/events\/page\.module\.css/g, './EventsPage.module.css');
    content = content.replace(/@\/app\/donate\/page\.module\.css/g, './DonatePage.module.css');
    content = content.replace(/@\/app\/contact\/partner\/page\.module\.css/g, './ContactPartnerPage.module.css');
    content = content.replace(/@\/app\/contact\/page\.module\.css/g, './ContactPage.module.css');
    content = content.replace(/@\/app\/admin\/subscriptions\/subscriptions\.module\.css/g, './SubscriptionsPage.module.css');
    content = content.replace(/@\/app\/admin\/stories\/stories\.module\.css/g, './StoriesPage.module.css');
    content = content.replace(/@\/app\/admin\/projects\/page\.module\.css/g, './ProjectsPage.module.css');
    content = content.replace(/@\/app\/admin\/media\/media\.module\.css/g, './MediaPage.module.css');
    content = content.replace(/@\/app\/admin\/login\/login\.module\.css/g, './LoginPage.module.css');
    content = content.replace(/@\/app\/admin\/events\/events\.module\.css/g, './EventsPage.module.css');
    content = content.replace(/@\/app\/admin\/page\.module\.css/g, './DashboardPage.module.css');
    content = content.replace(/@\/app\/admin\/contacts\/contacts\.module\.css/g, './ContactsPage.module.css');

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        modifiedCount++;
    }
});

console.log(`Modified ${modifiedCount} files in src/pages`);
