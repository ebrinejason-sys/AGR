const { Client } = require('ssh2');

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
    host: 's12079.fra1.stableserver.net',
    port: 2121,
    username: 'africang',
    password: '3brine@BBQs@uce',
    readyTimeout: 30000
});
