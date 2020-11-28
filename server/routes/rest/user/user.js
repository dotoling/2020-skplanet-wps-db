const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const curPos = async (req, res) => {
    res.send({
        curPos : "롯데백화점",
        result : true,
    })
};

const curRp = async (req, res) => {
    const wifi_data = [];
    const {spawn} = require('child_process');
    const python = spawn('python', ['../ml/detect.py', wifi_data]);

    /* argv로 wifi_data가 커서 안넘어가면 이걸로 대체
    const wifi_data = JSON.stringify([1,2,3,4,5]);
    python.stdin.write(data);
    python.stdin.end();
    */

    python.stdout.on('data', (data) => {
        res.send({
            curRp : data.toString(),
            result : true,
        }
    );
    python.on('close', (code) => {});
};

module.exports= {
    curPos, curRp
};