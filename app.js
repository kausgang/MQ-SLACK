var request = require('request');
var Client = require('ssh2').Client;

var url = "https://hooks.slack.com/services/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";



//READ THIS FROM CONFIGURATION FILE
var connection_options = {
    host:'9.51.171.61',
    port: 22,
    username: 'kaustav',
    password: 'Kolkata@1'
};




//    COMMAND TO CHECK QM STATUS ....ADD NEW COMMAND TO GET DIFFERENT RESULT
var cmd = '. /home/kaustav/.profile;dspmq'


var result = '';

var conn = new Client();
conn.on('ready', function() {
// console.log('Client :: ready');
conn.exec(cmd, function(err, stream) {
    if (err) throw err;
    stream.on('close', function(code, signal) {
    // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
    conn.end();




    console.log(result);

    SLACK_CALL(result)



    }).on('data', function(data) {
    // console.log('STDOUT: ' + data);

    result += data;

    }).stderr.on('data', function(data) {
    console.log('STDERR: ' + data);
    });
});
}).connect(connection_options);








function SLACK_CALL(result){

    var payload = {"text":result}

    payload = JSON.stringify(payload);

    var headers = {"Content-type": "application/json"}


    //REMEMBER TO USE BODY:PAYLOAD ...header is redundant
    // https://stackoverflow.com/questions/6432693/post-data-with-request-module-on-node-js
    request.post({url: url, headers: headers, body: payload},function(err,data){

        console.log(data.body);
    })
}