const { Sequelize, DataTypes } = require('sequelize');

//TODO: please update this to access the credential form the .env file
const sequelize = new Sequelize('likarchitects', 'postgres', 'yes123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Set to true for debugging
});

const bcryptjs = require('bcryptjs');
const User = require('../models/userModel')(sequelize, DataTypes);
const Project = require('../models/project')(sequelize, DataTypes);



const data = [];

(async () => {
  try {
    // await sequelize.sync({ force: true }); // This will drop and recreate all tables on this db
    await User.sync({ force: true });
    
    const generateHashedPassword = async () => {
      return await bcryptjs.hash('Admin123.', 10);
    };

    const password = await generateHashedPassword();
    const seedData = [
      {
        fullName: 'Admin Admin',
        email: 'admin@gmail.com',
        password: password,
        phone: '+251919765445',
        role: 'admin'
      }
    ];

    await User.bulkCreate(seedData);
    await Project.sync({force: true});
    await Project.bulkCreate({data});

    console.log('Seed data added successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
})();
