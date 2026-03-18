const Client = require('ftp');
const path = require('path');

const host = process.env.CPANEL_FTP_HOST;
const user = process.env.CPANEL_FTP_USER;
const password = process.env.CPANEL_FTP_PASSWORD;
const port = process.env.CPANEL_FTP_PORT ? Number(process.env.CPANEL_FTP_PORT) : 21;

if (!host || !user || !password) {
    console.error('Missing FTP env vars. Set CPANEL_FTP_HOST, CPANEL_FTP_USER, CPANEL_FTP_PASSWORD (and optionally CPANEL_FTP_PORT).');
    process.exit(1);
}

const client = new Client();

client.on('ready', () => {
    console.log('FTP connection established. Creating deployment directory...');

    client.mkdir('/home/africang/african-girl-rise-app', true, (err) => {
        if (err) {
            console.log('Directory might already exist or error creating it:', err.message);
        }

        console.log('Starting upload of app-deploy.zip...');
        const localPath = path.join(__dirname, 'app-deploy.zip');
        const remotePath = '/home/africang/african-girl-rise-app/app-deploy.zip';

        client.put(localPath, remotePath, (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                client.end();
                return;
            }
            console.log('Upload successful!');
            client.end();
        });
    });
});

client.on('error', (err) => {
    console.error('FTP Error:', err);
});

console.log('Connecting to FTP server...');
client.connect({ host, user, password, port });
