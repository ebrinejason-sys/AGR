const FtpDeploy = require('ftp');

const config = {
    host: 's12079.fra1.stableserver.net',
    user: 'africang',
    password: '3brine@BBQs@uce',
    port: 21,
};

const client = new FtpDeploy();

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
client.connect(config);
