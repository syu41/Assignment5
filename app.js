// The morse code interpreter app
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// pass the client html file
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
    console.log("Connected");
})
server.listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});

// the morse code table we use to decode
var morseTable = [{
    code   : 'SL', 
    letter : 'A'
}, {
    code   : 'LSSS', 
    letter : 'B'
}, {
    code   : 'LSLS',
    letter : 'C'
}, {
    code   : 'LSS',
    letter : 'D'
}, {
    code   : 'S',
    letter : 'E'
}, {
    code   : 'SSLS',
    letter : 'F'
}, {   
    code   : 'LLS',
    letter : 'G'
}, {
    code   : 'SSSS',
    letter : 'H'
}, {
    code   : 'SS',
    letter : 'I'
}, {
    code   : 'SLLL',
    letter : 'J'
}, {
    code   : 'LSL',
    letter : 'K'
}, {
    code   : 'SLSS',
    letter : 'L'
}, {
    code   : 'LL',
    letter : 'M'
}, {
    code   : 'LS',
    letter : 'N'
}, {
    code   : 'LLL',
    letter : 'O'
}, {
    code   : 'SLLS',
    letter : 'P'
}, {
    code   : 'LLSL',
    letter : 'Q'
}, {
    code   : 'SLS',
    letter : 'R'
}, {
    code   : 'SSS',
    letter : 'S'
}, {
    code   : 'L',
    letter : 'T'
}, {
    code   : 'SSL',
    letter : 'U'
}, {    
    code   : 'SSSL',
    letter : 'V'
}, {
    code   : 'SLL',
    letter : 'W'
}, {
    code   : 'LSSL',
    letter : 'X'
}, {
    code   : 'LSLL',
    letter : 'Y'
}, {
    code   : 'LLSS',
    letter : 'Z'
}];

// create a new board 
var five = require("johnny-five");
five.Board().on("ready", function() {
    // create a new 'LED' instance
    var led = new five.Led(13);
    // create a new `motion` hardware instance
    var motion = new five.Motion(6);

    // create socket
    var socket = require('socket.io').listen(server);
    socket.on('connection', function(socket) {
        // create a string to store the motion sequence
        var morseCode = '';

        // create variable to store potential letter
        var output,
        // create variables to determine motion duration
        stime = 0,
        etime = 0,
        duration,
        length,
        // create variables to determine gap duration
        gap,
        // create flags to control last motion checking
        flag1,
        flag2

        // "calibrated" occurs once, at the beginning of a session
        motion.on("calibrated", function() {
            console.log("calibrated");
        });
            
        // triggers when motion detected
        motion.on('motionstart', function() {
            // record time of motion detected
            console.log('motion detected')
            led.on();
            stime = Date.now();
            gap = stime - etime;
        });

        // triggers when a detected motion ends
        motion.on('motionend', function() {
            // calculate motion duration
            console.log('motion ended')
            led.off();
            etime = Date.now();
            length = checkMotion(stime, etime);
            if (length == "L") {
                morseCode += 'L';
            } else {
                morseCode += 'S';
            }
            flag1 = true;
            flag2 = true;
        });

        // always checking if there are more incoming motions
        motion.on('data', function(data) {
            if (data.detectedMotion) {
                //console.log('more motions!');
            } else {
                gap = Date.now()-etime
                // check for character gap
                if (morseCode != "" && gap >= 3000 && flag1 == true) {
                    output = decode(morseCode, morseTable);
                    if (output != null) {
                        socket.emit("output", {'output':output});
                        console.log('a new character is starting');
                        morseCode = "";
                        flag1 = false;
                    };
                };
                // check for work gap
                if (gap >= 9000 && flag2 == true) {
                    socket.emit("space");
                    console.log('a new word is starting');
                    flag2 = false;
                };
            };
        });
    });
});

// a function that calculates if a motion detected long/short
// takes in strat time and end time, returns L for long motion and S for short motion
function checkMotion(start, end) {
    var duration = end - start;
    // send message to client based on duration of motion detected
    if (duration >= 6500) {
        console.log('long motion detected');
        return 'L';
    } else {
        console.log('short motion detected');
        return 'S';
    };
};

// a function that checks if a input matches a element in the morse code table
// takes in a L/S string and a morse code table, returns letter if match or null if no matching
function decode(input, table) {
    for (l = 0; l < 26; l++) {
        if (input == table[l].code) {
            return table[l].letter;
        };
    };
    return null;
};

// export functions and table for unit tests
module.exports.checkMotion = checkMotion;
module.exports.decode = decode;
module.exports.morseTable = morseTable;
