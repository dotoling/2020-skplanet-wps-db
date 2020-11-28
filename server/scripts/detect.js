const {spawn} = require('child_process');

const wifi_data = {"asdf": "asdf", "zxcv": "zxcv"}
const python = spawn('python', ['./server/python/detect.py', wifi_data]);

/* argv로 wifi_data가 커서 안넘어가면 이걸로 대체
const wifi_data = JSON.stringify([1,2,3,4,5]);
python.stdin.write(data);
python.stdin.end();
*/

let result;
python.stdout.on('data', function (data) {
    console.log(data);
    result = data.toString();
});

python.on('close', (code) => {
    console.log(result);
});  