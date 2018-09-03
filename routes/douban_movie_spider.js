var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');
var db = require('../models/movieplaying')

router.get('/playing_movie_list',function (req, res, next) {
    var base_url = 'https://movie.douban.com/cinema/nowplaying/beijing/';

    var arr = [];
    superagent.get(base_url).end(function (err, sres) {
        if(err) return next(err);


        var $ = cheerio.load(sres.text);

        $('div#nowplaying>div.mod-bd:nth-child(2)>ul.lists>li').each(function (i, element) {

            var id = $(element).attr('id');
            var name = $(element).attr('data-title');
            var score = $(element).attr('data-score');
            var release = $(element).attr('data-release');
            var duration = $(element).attr('data-duration');
            var region = $(element).attr('data-region');
            var director = JSON.stringify($(element).attr('data-director').split(' '));
            var actors = JSON.stringify($(element).attr('data-actors').split(' / '));
            var vote_count = $(element).attr('data-votecount');
            var cover = $(element).find('ul>.poster>a>img').attr('src');

            arr.push({
                id:id,name:name,cover:cover,score:score,release:release,duration:duration,region:region,director:director,actors:actors,vote_count:vote_count,cover:cover,createdAt:new Date()
            })
        })
        for(let i = 0;i<arr.length;i++){

            db.create(arr[i]).then(function () {
                console.log('success')
            }).catch(function (err) {
                console.log('ERROR',err);
            })
        }

        res.send('ok');
    })
})

router.get('/coming_movie_list',function (req, res, next) {
    var base_url ='https://movie.douban.com/cinema/later/beijing/';

    superagent.get(base_url).end(function (err,sres) {
        if(err) return next(err);

        var $ = cheerio.load(sres.text);
        var arr = []

        $('#showing-soon>.item').each(function (i, element) {

        })
    })
})
module.exports = router