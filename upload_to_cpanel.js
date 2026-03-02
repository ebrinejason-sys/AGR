const FtpDeploy = require('ftp');
const fs = require('fs');
const path = require('path');

const config = {
    host: 's12079.fra1.stableserver.net',
    user: 'africang',
    password: '3brine@BBQs@uce',
    port: 21,
};

const client = new FtpDeploy();

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
client.connect(config);
