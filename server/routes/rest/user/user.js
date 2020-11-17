const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const curPos = async (req, res) => {
    console.log(req.body)
    console.log("========================");
    res.send({
        result : true,
    })
};
  
  module.exports= {
      curPos,
  }