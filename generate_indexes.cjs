const fs = require('fs');
const path = require('path');

function generateIndex(dir) {
    const items = fs.readdirSync(dir);
    const filtered = items.filter(item => item !== 'index.list');
    const content = filtered.join('\n') + '\n';
    fs.writeFileSync(path.join(dir, 'index.list'), content);
    console.log(`Generated index.list for ${dir}`);

    for (const item of filtered) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            generateIndex(fullPath);
        }
    }
}

generateIndex('static');
