const { wifi_data, pos_name, lat, lon } = {};
if(!wifi_data || !pos_name || !lat || !lon) {
    //res.send({ result : false });
}

const {spawn} = require('child_process');
const py = spawn('python', ['../../../ml/preprocess.py', pos_name, lat, lon]);

py.on('close', (code) => {
  const py2 = spawn('python', ['../../../ml/train.py', pos_name, lat, lon]);

  py2.on('close', (code) => {
    //res.send({ result: true });
    console.log("SUCCESS");
  })
});
py.stdin.write(JSON.stringify(wifi_data));
py.stdin.end();