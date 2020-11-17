const { Op } = require('sequelize');
const models = require('../../../models');
const config = require('../../../config/config.json')[process.env.NODE_ENV || 'development'];

const curPos = async (req, res) => {
    const outputCurPos = "result Position";
    console.log(req.body)
    console.log("========================");
    res.send({
        curPosition : outputCurPos,
        result : true,
    })
};
  
  module.exports= {
      curPos,
  }