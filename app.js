var request = require('request');
var Client = require('ssh2').Client;

const connection_options = require('./config.json');

const url = connection_options.webhook;
const hosts = connection_options.hosts;
const port = connection_options.port;
const username = connection_options.username;
const password = connection_options.password;
const command = connection_options.commands;


// FOR EACH HOST
hosts.forEach(hostname => {
    // SEND EACH COMMAND IN MQ_CALL
    command.forEach(cmd => {
        MQ_CALL(hostname,cmd)
    
    });
});


function MQ_CALL(hostname,cmd){

    var result = '';

    var conn = new Client();
    conn.on('ready', function() {
    // console.log('Client :: ready');
    conn.exec(cmd, function(err, stream) {
        if (err) throw err;
        stream.on('close', function(code, signal) {

        conn.end();

        // SHOW THE MQ STATUS IN CONSOLE    
        console.log(result);
        // SEND STATUS TO SLACK
        SLACK_CALL(result)

        }).on('data', function(data) {

        result += data;

        }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
        });
    });
    }).connect(
        {
            host: hostname,
            port: port,
            username: username,
            password: password

        }
    );
}



function SLACK_CALL(result){

    var payload = {"text":result}
    // CONVERT THE JS OBJECT PAYLOAD TO STRING
    payload = JSON.stringify(payload);

    var headers = {"Content-type": "application/json"}

    //REMEMBER TO USE BODY:PAYLOAD ...header is redundant
    // https://stackoverflow.com/questions/6432693/post-data-with-request-module-on-node-js
    request.post({url: url, headers: headers, body: payload},function(err,data){

        console.log(data.body);
    })
}