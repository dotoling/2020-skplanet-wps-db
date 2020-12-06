const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const path = require('path');
const fs = require('fs');

const curPos = async (req, res) => {
    const [wifi_data, lat, lon] = req.body;
    
    // const curPosName =  "롯데백화점";
    // res.send({
    //     curPos : curPosName,
    //     result : true,
    // });

    // add check-in data in db_checkIn table
    models.db_checkIn.create({
        checkInPos : curPosName,
    })
    if(!wifi_data || !lat || !lon)
        res.send({ result : false });

    const {spawn} = require('child_process');
    const py_path = path.join(__dirname, '../../../ml/detect.py');
    const py = spawn('python', [py_path, "롯데백화점"]);
    
    py.stdin.setDefaultEncoding('utf-8');
    py.stdout.setEncoding('utf-8');
    py.stderr.setEncoding('utf-8');
    py.stdout.on('data', (data) => {
        res.send({
            // "롯데백화점 ZARA" 형식으로 출력됨
            curRp : data.toString(),
            result : true,
    });
    py.stdin.write(JSON.stringify(wifi_data));
    py.stdin.end();

	models.db_checkIn.create({
       		checkInPos : data.toString(),
    	});
    });
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
