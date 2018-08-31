
const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://root:@localhost:3306/spider');

sequelize.authenticate()
.then(()=>{
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
})

module.exports = sequelize;
