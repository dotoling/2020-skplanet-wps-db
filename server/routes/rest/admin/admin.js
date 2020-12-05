const { send } = require('process');
const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const path = require('path');
const fs = require('fs');

const addPos = async (req, res) => {
  res.send({result: "success"});

  const { wifi_data, lat, lon } = {
    wifi_data: JSON.parse(req.body.wifi_data),
    lat: '37.296429',
    lon: '126.971933'
  };
  const pos_name = wifi_data[0]['position'];

  const {spawn} = require('child_process');
  const py_path = path.join(__dirname, '../../../ml/preprocess.py');
  const py = spawn('python', [py_path, pos_name, lat, lon]);

  py.stdin.setDefaultEncoding('utf-8');
  py.stdout.setEncoding('utf-8');
  py.stderr.setEncoding('utf-8');
  py.stdout.on('data', data=>console.log(data));
  py.stderr.on('data', data=>console.log(data));
  py.stdin.write(JSON.stringify(wifi_data));
  py.stdin.end();

  py.on('exit', (code) => {
    const py2_path = path.join(__dirname, '../../../ml/train.py');
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