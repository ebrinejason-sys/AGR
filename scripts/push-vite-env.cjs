const fs = require('fs');
const { execSync } = require('child_process');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const lines = envLocal.split('\n');

lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_')) {
        const [key, ...rest] = line.split('=');
        let val = rest.join('=').trim();
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        }
        
        const newKey = key.replace('NEXT_PUBLIC_', 'VITE_');
        console.log(`Adding ${newKey}...`);
        
        const envs = ['production', 'preview', 'development'];
        
        for (const env of envs) {
            try {
                execSync(`npx vercel env add ${newKey} ${env}`, {
                    input: val,
                    stdio: ['pipe', 'inherit', 'inherit']
                });
            } catch (e) {
                console.error(`Failed to add ${newKey} to ${env}:`, e.message);
            }
        }
    }
});
console.log('Done!');
