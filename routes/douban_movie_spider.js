var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');


router.get('/playing_movie_list',function (req, res, next) {
    var base_url = 'https://movie.douban.com/cinema/nowplaying/beijing/';

    var arr = [];
    superagent.get(base_url).end(function (err, sres) {
        if(err) return next(err);


        var $ = cheerio.load(sres.text);

        $('div#nowplaying>div.mod-bd:nth-child(2)>ul.lists>li').each(function (i, element) {

            console.log(i);

            var id = $(element).attr('id');
            var name = $(element).attr('data-title');
            var score = $(element).attr('data-score');
            var release = $(element).attr('data-release');
            var duration = $(element).attr('data-duration');
            var region = $(element).attr('data-region');
            var directors = $(element).attr('data-director').split(' ');
            var actors = $(element).attr('data-actors').split(' / ');
            var vote_count = $(element).attr('data-votecount');

            var cover = $(element).find('ul>.poster>a>img').attr('src');
            // var img_url = $(element).find('div.wp>img').attr('href');
            //
            // var name = $(element).find('div.info>h3').text().replace(/\n/g,'');
            //
            // var score = "";
            //
            // if($(element).find('div.info p.rank span').text().indexOf('暂无评分') < 0){
            //      score = $(element).find('div.info p.rank span:nth-child(2)').text().replace(/\n/g,'');
            // }
            //
            // arr.push({
            //     name:name,
            //     cover:img_url,
            //     score:score
            // })
            arr.push({
                id:id,name:name,cover:cover,score:score,release:release,duration:duration,region:region,directors:directors,actors:actors,vote_count:vote_count
            })
        })

        res.send(arr);
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