module.exports = (sequelize, DataTypes) => {
  const db_rp = sequelize.define(
    'db_rp',
    {
    //   id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     unique: true,
    //   },
    },
    {
      timestamps: true,
      //paranoid: true,
    },
  );

  db_rp.associate = (models) => {
    db_rp.hasMany(models.db_strength);
  };

  return db_rp;
}