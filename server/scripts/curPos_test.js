const [wifi_data, lat, lon] = {};
if(!wifi_data || !lat || !lon) {
    //res.send({ result : false });
}

const {spawn} = require('child_process');
const python = spawn('python', ['../ml/detect.py', wifi_data]);

python.stdout.on('data', (data) => {
    /*
    res.send({
        // "롯데백화점 ZARA" 형식으로 출력됨
        curRp : data.toString(),
        result : true,
    });
    */
   console.log(data.toString());
});
python.on('close', (code) => {});