
module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Projects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    file: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: 'Loading'
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
    },

    });

    return Project
}
