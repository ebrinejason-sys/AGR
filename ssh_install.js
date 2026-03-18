const { Client } = require('ssh2');

const host = process.env.CPANEL_SSH_HOST;
const username = process.env.CPANEL_SSH_USER;
const password = process.env.CPANEL_SSH_PASSWORD;
const port = process.env.CPANEL_SSH_PORT ? Number(process.env.CPANEL_SSH_PORT) : 2121;

if (!host || !username || !password) {
    console.error('Missing SSH env vars. Set CPANEL_SSH_HOST, CPANEL_SSH_USER, CPANEL_SSH_PASSWORD (and optionally CPANEL_SSH_PORT).');
    process.exit(1);
}

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('source /home/africang/nodevenv/african-girl-rise-app/10/bin/activate && cd /home/africang/african-girl-rise-app && npm install', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error("SSH Connection Error: ", err.message);
}).connect({
    host,
    port,
    username,
    password,
    readyTimeout: 30000
});
