module.exports = (sequelize, DataTypes) => {
  const db_pos = sequelize.define(
    'db_pos',
    {
    //   id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     unique: true,
    //     comment : "position ID",
    //   },
      pos_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment : "position name",
      },
      pos_rp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment : "count of RP",
      },
    },
    {
      timestamps: true,
      //paranoid: true,
    },
  );

  db_pos.associate = (models) => {
    db_pos.hasMany(models.db_rp);
  };

  return db_pos;
}


