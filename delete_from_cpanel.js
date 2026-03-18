const Client = require('ftp');

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
    console.log('FTP connection established. Preparing to delete uploaded files...');

    // The previous script uploaded to /home/africang/african-girl-rise-app/app-deploy.zip
    const remoteFilePath = '/home/africang/african-girl-rise-app/app-deploy.zip';

    client.delete(remoteFilePath, (err) => {
        if (err) {
            console.error('Error deleting file (It may not exist):', err.message);
        } else {
            console.log(`Successfully deleted ${remoteFilePath}`);
        }

        // Optionally try to remove the directory if it's empty now
        const remoteDirPath = '/home/africang/african-girl-rise-app';
        client.rmdir(remoteDirPath, (err) => {
            if (err) {
                console.log('Could not remove directory (It may contain other files or not exist):', err.message);
            } else {
                console.log(`Successfully removed directory ${remoteDirPath}`);
            }
            client.end();
        });
    });
});

client.on('error', (err) => {
    console.error('FTP Error:', err);
});

console.log('Connecting to FTP server to delete deployment...');
client.connect({ host, user, password, port });
