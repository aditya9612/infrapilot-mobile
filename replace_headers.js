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

            // Different headers used in different files
            const headerVariants = [
                '{/* Top Blue Header */}',
                '{/* Header */}',
                '{/* Header Toolbar',
            ];

            let targetIdx = -1;
            for (const variant of headerVariants) {
                targetIdx = content.indexOf(variant);
                if (targetIdx !== -1) break;
            }

            if (targetIdx !== -1) {
                // Find title and subtitle
                const titleMatch = content.match(/<Text className="text-xl font-bold text-[^"]+">([^<]+)<\/Text>/) || content.match(/<Text className="text-xl font-bold text-[^"]+">([^<]+)<\/Text>/);
                const subtitleMatch = content.match(/<Text className="text-[^"]+ text-[^"]+">([^<]+)<\/Text>/g);
                
                let title = titleMatch ? titleMatch[1] : 'Dashboard';
                let subtitle = 'Overview';
                
                if (subtitleMatch && subtitleMatch.length > 0) {
                     // Try to find the one right after title
                     const subRegex = /<Text className="text-(?:xs|\[10px\]) text-[^"]+">([^<]+)<\/Text>/;
                     const match = content.match(subRegex);
                     if (match) subtitle = match[1];
                }

                let endIdx = content.indexOf('<ScrollView', targetIdx);
                if (endIdx === -1) endIdx = content.indexOf('{/* Header & Main Actions */}', targetIdx);
                if (endIdx === -1) endIdx = content.indexOf('{/* Secondary Header */}', targetIdx);
                if (endIdx === -1) endIdx = content.indexOf('{/* Project Header */}', targetIdx);
                if (endIdx === -1) endIdx = content.indexOf('{/* Critical Alerts Banner */}', targetIdx);
                if (endIdx === -1) endIdx = content.indexOf('<View className="px-4', targetIdx + 20);
                if (endIdx === -1) endIdx = content.indexOf('<View className="flex-1', targetIdx + 20);
                
                if (endIdx !== -1) {
                    const lastViewEnd = content.lastIndexOf('</View>', endIdx);
                    if (lastViewEnd !== -1 && lastViewEnd > targetIdx) {
                        const replacement = `\n            <TopHeader title="${title}" subtitle="${subtitle}" />\n`;
                        
                        content = content.substring(0, targetIdx) + replacement + content.substring(lastViewEnd + 7);
                        
                        const relativeDepth = fullPath.substring(appDir.length).split(path.sep).length - 1;
                        // appDir is src/app. If in src/app/admin/foo.tsx, depth is 2 (admin, foo.tsx) -> relative depth from appDir is 2.
                        // We want path to src/components.
                        let prefix = '';
                        for (let i = 0; i < relativeDepth; i++) {
                            prefix += '../';
                        }
                        prefix += 'components/';
                        
                        if (!content.includes('TopHeader')) {
                            content = `import TopHeader from '${prefix}TopHeader';\n` + content;
                        }
                        
                        fs.writeFileSync(fullPath, content);
                        console.log('Updated ' + fullPath);
                    }
                }
            }
        }
    }
}

for (const role of roles) {
    processDir(path.join(appDir, role));
}
