const { send } = require('process');
const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const addPos = async (req, res) => {
    console.log(req.body);
    const [ wifi_data, pos_name, lat, lon ] = req.body;
    if(!wifi_data || !pos_name || !lat || !lon)
        res.send({ result : false });
    
    const {spawn} = require('child_process');
    const py = spawn('python', ['../../../ml/preprocess.py', pos_name, lat, lon]);

    py.on('close', (code) => {
      const py2 = spawn('python', ['../../../ml/train.py', pos_name, lat, lon]);

      py2.on('close', (code) => {
        res.send({ result: true });
      })
    });
    py.stdin.write(JSON.stringify(wifi_data));
    py.stdin.end();
    /*
    try {
      const result = await models.db_pos.create({
        pos_name,
        pos_rp, // in test , fix it two
      });
      if (result) {
        var rp_arr = Array.from({length: pos_rp}, (v,i) => i);
        await rp_arr.map(async (rp_index) => {
            const result2 = await models.db_rp.create({
                dbPoId : result.id,
            });
            var rssi_arr = Array.from({length : rp_data[rp_index].length}, (v,i) => i);
            await rssi_arr.map(async (stren_index) => {
                const result3 = await models.db_strength.create({
                    bssid : rp_data[rp_index][stren_index].bssid,
                    rssi : rp_data[rp_index][stren_index].rssi,
                    dbRpId : result2.id,
                });
            });
        });
        res.send({
          result: true,
        });
      } else {
        console.log('DB insert error');
        res.status(500);
        res.send({
          result: false,
          error: 'DB not insert',
        });
      }
    } catch (e) {
      console.error(e);
      console.log('DB error');
      res.status(500);
      res.send({
        result: false,
        error: 'DB error',
      });
    }
    */
  };
  
  module.exports= {
      addPos
  }