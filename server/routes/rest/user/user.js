const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const curPos = async (req, res) => {
    const [wifi_data, lat, lon] = req.body;

    const {spawn} = require('child_process');
    const python = spawn('python', ['../ml/detect.py', wifi_data]);
    
    python.stdout.on('data', (data) => {
        res.send({
            // 롯데백화점 ZARA 형식으로 출력됨
            curRp : data.toString(),
            result : true,
        });
    });
    python.on('close', (code) => {});
}

module.exports= {
    curPos
}