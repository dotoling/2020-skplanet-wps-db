module.exports = (sequelize, DataTypes) => {
  const db_strength = sequelize.define(
    'db_strength',
    {
    //   id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     unique: true,
    //   },
      b_ssid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      strength: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
  );

  return db_strength;
}