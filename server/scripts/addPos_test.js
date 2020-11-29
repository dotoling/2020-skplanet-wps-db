const { wifi_data, pos_name, lat, lon } = {
  wifi_data: [
      {bssid: "12:34", rssi: 80},
      {bssid: "56:78", rssi: 56},
      {bssid: "54:53", rssi: 56}
  ],
  pos_name: "test_pos",
  lat: "37.296429",
  lon: "126.971933"
};

var path = require('path');

const {spawn} = require('child_process');
const py_path = path.join(__dirname, '../ml/preprocess.py');
const py = spawn('python', [py_path, pos_name, lat, lon]);

py.stdout.on('data', (data) => {
    console.log(String.fromCharCode.apply(null, data));
});
py.stderr.on('data', (data) => {
    console.log(String.fromCharCode.apply(null, data));
});

py.on('close', (code) => {
  const py2_path = path.join(__dirname, '../ml/preprocess.py');
  const py2 = spawn('python', [py2_path, pos_name, lat, lon]);

  py2.on('close', (code) => {
    //res.send({ result: true });
    console.log("SUCCESS");
  })
});
py.stdin.write(JSON.stringify(wifi_data));
py.stdin.end();