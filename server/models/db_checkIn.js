module.exports = (sequelize, DataTypes) => {
    const db_checkIn = sequelize.define(
      'db_checkIn',
      {
        checkInPos: {
          type: DataTypes.STRING,
          allowNull: false,
          comment : "checkin name",
        },
      },
      {
        timestamps: true,
      },
    );
  
    db_checkIn.associate = (models) => {
    };
  
    return db_checkIn;
  }
  
  // in deatil, we must use user information but we have little time so we skip this.
  
