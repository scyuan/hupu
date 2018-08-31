const Sequelize = require('sequelize');
const sequelize = require('./index.js');

var movieplaying = sequelize.define('movieplaying',{
    id:{
        type: Sequelize.STRING,
        primaryKey:true
    },
    name:{
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
    }
}, {
    timestamps: false
})
movieplaying.sync();
module.exports = movieplaying;