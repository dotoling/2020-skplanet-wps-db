// csv 파일 테스트용 함수
function csvJSON(csv){
  let lines=csv.split("\n");
  let result = [];

  for(let i=1;i<lines.length;i++){
      let obj = {};
      let currentline=lines[i].split("\r")[0].split(",");

      obj['bssid'] = currentline[0];
      obj['rssi'] = parseInt(currentline[1]);
      obj['timestamp'] = currentline[2];
      obj['position'] = currentline[3];
      obj['rp'] = currentline[4];

      result.push(obj);
  }
  
  return result;
}

const path = require('path');
const fs = require('fs');

fs.readFile('./server/ml/data/signal_data.csv', 'utf8', function (err, data) {
  if (err)
    return console.log(err);

  const { wifi_data, lat, lon } = {
    wifi_data: csvJSON(data),
    // wifi_data: [
    //     {bssid: '12:34', rssi: 80, timestamp: '2020-11-26 21:30:22.159452', position: '롯데백화점', rp: '2층 입구'},
    //     {bssid: '56:78', rssi: 56, timestamp: '2020-11-26 21:30:22.159452', position: '롯데백화점', rp: '2층 입구'},
    //     {bssid: '54:53', rssi: 57, timestamp: '2020-11-26 21:30:22.159452', position: '롯데백화점', rp: '2층 입구'},
    //     {bssid: '54:a2', rssi: 54, timestamp: '2020-11-26 22:33:22.159452', position: '롯데백화점', rp: 'ZARA'},
    //     {bssid: '54:dc', rssi: 43, timestamp: '2020-11-26 22:33:22.159452', position: '롯데백화점', rp: 'ZARA'},
    //     {bssid: '54:ad', rssi: 97, timestamp: '2020-11-26 22:33:22.159452', position: '롯데백화점', rp: 'ZARA'},
    // ],
    lat: '37.296429',
    lon: '126.971933'
  };
  const pos_name = wifi_data[0]['position'];

  const {spawn} = require('child_process');
  const py_path = path.join(__dirname, '../ml/preprocess.py');
  const py = spawn('python', [py_path, pos_name, lat, lon]);

  py.stdin.setDefaultEncoding('utf-8');
  py.stdout.setEncoding('utf-8');
  py.stderr.setEncoding('utf-8');
  py.stdout.on('data', data=>console.log(data));
  py.stderr.on('data', data=>console.log(data));
  py.stdin.write(JSON.stringify(wifi_data));
  py.stdin.end();

  py.on('exit', (code) => {
    const py2_path = path.join(__dirname, '../ml/train.py');
    const py2 = spawn('python', [py2_path, pos_name]);

    py2.stdout.setEncoding('utf-8');
    py2.stderr.setEncoding('utf-8');
    py2.stdout.on('data', data=>console.log(data));
    py2.stderr.on('data', data=>console.log(data));
    py2.on('exit', (code) => {
      //res.send({ result: true });
      console.log('SUCCESS');
    })
  });
});