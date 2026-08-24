const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');
const roles = ['engineer', 'admin', 'accountant', 'client', 'manager', 'labour'];

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx') && !file.startsWith('_')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            if (content.includes('<TopHeader') && !content.includes('import TopHeader')) {
                const relativeDepth = fullPath.substring(appDir.length).split(path.sep).length - 1;
                let prefix = '';
                for (let i = 0; i < relativeDepth; i++) {
                    prefix += '../';
                }
                prefix += 'components/';
                
                content = `import TopHeader from '${prefix}TopHeader';\n` + content;
                fs.writeFileSync(fullPath, content);
                console.log('Added import to ' + fullPath);
            }
        }
    }
}

for (const role of roles) {
    processDir(path.join(appDir, role));
}
