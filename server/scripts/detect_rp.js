const {spawn} = require('child_process');

wifi_data = {"asdf": "asdf", "zxcv": "zxcv"}

const python = spawn('python', ['./server/python/detect.py', wifi_data]);

let result
python.stdout.on('data', function (data) {
    console.log(data);
    //console.log('Pipe data from python script ...');
    result = data.toString();
});

// in close event we are sure that stream from child process is closed
python.on('close', (code) => {
    // console.log(`child process close all stdio with code ${code}`);
    console.log(result);
});  