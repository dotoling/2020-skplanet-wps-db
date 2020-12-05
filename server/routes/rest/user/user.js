const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const curPos = async (req, res) => {
    const [wifi_data, lat, lon] = req.body;
    if(!wifi_data || !lat || !lon)
        res.send({ result : false });

    const {spawn} = require('child_process');
    const python = spawn('python', ['../ml/detect.py', wifi_data]);
    
    python.stdout.on('data', (data) => {
        res.send({
            // "롯데백화점 ZARA" 형식으로 출력됨
            curRp : data.toString(),
            result : true,
        });
    });
    python.on('close', (code) => {});
};

const checkInHistory = async ( req, res ) => {
    try {
        const history = await models.db_checkIn.findAll ({
            attributes : ['id','checkInPos'],
        })
    
        res.send({
            history,
            result : true,
        })
    } catch(error) {
	console.log(error);
        res.send({
            result : false,
        })
    }

};

module.exports= {
    curPos, checkInHistory
}
