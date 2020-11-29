const { wifi_data, pos_name, lat, lon } = {
  wifi_data: [
      {bssid: '12:34', rssi: 80, timestamp: '2020-11-26 21:30:22.159452', position: '롯데백화점', rp: '2층 입구'},
      {bssid: '56:78', rssi: 56, timestamp: '2020-11-26 21:30:22.159452', position: '롯데백화점', rp: '2층 입구'},
      {bssid: '54:53', rssi: 57, timestamp: '2020-11-26 21:30:22.159452', position: '롯데백화점', rp: '2층 입구'},
      {bssid: '54:a2', rssi: 54, timestamp: '2020-11-26 22:33:22.159452', position: '롯데백화점', rp: 'ZARA'},
      {bssid: '54:dc', rssi: 43, timestamp: '2020-11-26 22:33:22.159452', position: '롯데백화점', rp: 'ZARA'},
      {bssid: '54:ad', rssi: 97, timestamp: '2020-11-26 22:33:22.159452', position: '롯데백화점', rp: 'ZARA'},
  ],
  pos_name: 'test_pos',
  lat: '37.296429',
  lon: '126.971933'
};

var path = require('path');

const {spawn} = require('child_process');
const py_path = path.join(__dirname, '../ml/preprocess.py');
const py = spawn('python', [py_path, pos_name, lat, lon]);

py.stdout.setEncoding('utf-8');
py.stdout.on('data', data=>console.log(data));
py.stderr.on('data', data=>console.log(data));
py.stdin.setDefaultEncoding('utf-8');
py.stdin.write(JSON.stringify(wifi_data));
py.stdin.end();

py.on('end', (code) => {
  const py2_path = path.join(__dirname, '../ml/preprocess.py');
  const py2 = spawn('python', [py2_path, pos_name, lat, lon]);

  py2.on('end', (code) => {
    //res.send({ result: true });
    console.log('SUCCESS');
  })
});