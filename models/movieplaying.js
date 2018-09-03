const Sequelize = require('sequelize');
const sequelize = require('./index.js');

var movieplaying = sequelize.define('movieplaying',{
    index:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id:{
        type: Sequelize.STRING,
    },
    name:{
        type: Sequelize.STRING
    },
    cover:{
        type: Sequelize.STRING
    },
    score:{
        type: Sequelize.STRING
    },
    release:{
        type: Sequelize.STRING
    },
    duration:{
        type: Sequelize.STRING
    },
    region:{
        type: Sequelize.STRING
    },
    director:{
        type: Sequelize.STRING
    },
    actors:{
        type: Sequelize.STRING
    },
    vote_count:{
        type: Sequelize.STRING
    },
    createdAt:{
        type:Sequelize.DATE
    }
}, {
    engine              : 'InnoDB',
    charset             : 'utf8',
    timestamps: false
})
movieplaying.sync({ force:false});
module.exports = movieplaying;