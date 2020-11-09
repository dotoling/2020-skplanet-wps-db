const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];


const addPos = async (req, res) => {
    console.log(req.body);
    const { pos_name, pos_rp } = req.body;
    const rp_data = [ 
        [
            {b_ssid : "BSSID_1", strength : 100,},
            {b_ssid : "BSSID_2", strength : 200,},
        ],
        [
            {b_ssid : "BSSID_1", strength : 500,},
            {b_ssid : "BSSID_2", strength : 4000,},
        ]
    ];
    try {
      const result = await models.db_pos.create({
        pos_name,
        pos_rp, // in test , fix it two
      });
      if (result) {
        var rp_make_range = Array.from({length: pos_rp}, (v,i) => i);
        console.log(rp_make_range);
        await rp_make_range.map(async (rp_index) => {
            const result2 = await models.db_rp.create({
                dbPoId : result.id,
            });
            var stren_make_range = Array.from({length : rp_data[rp_index].length}, (v,i) => i);
            await stren_make_range.map(async (stren_index) => {
                const result3 = await models.db_strength.create({
                    b_ssid : rp_data[rp_index][stren_index].b_ssid,
                    strength : rp_data[rp_index][stren_index].strength,
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
  };
  
  module.exports= {
      addPos,
  }