var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET users listing. */
router.post('/', function(req, res, next) {

  console.log(req.body);

  var module = req.body.module;
  var page = req.body.page;


  var bxj_url = "https://m.hupu.com/"+module+"/34-"+page;

  superagent.get(bxj_url)
  .end(function(err, sres){
  	if(err) return next(err);

  	var $ = cheerio.load(sres.text);

  	var arr =[];

  	$('.news-list ul li').each(function(i, elem){
  		
  		var title = $(elem).find('div.news-txt>h3').text();
  		var title_link = $(elem).find('a').attr('href');
  		var author = $(elem).find('div.news-source').text();
  		var create_time = $(elem).find('div.news-time').text();
  		
  		var bright_count = $(elem).find('span.bright-no').text();

  		var reply_counts = bright_count== '' ? $(elem).find('div.news-view > span:nth-child(2)').text():$(elem).find('div.news-view > span:nth-child(4)').text();

  		
  		arr.push({
  			title:title.replace(/\n/g,''),
  			title_link:'https:'+title_link,
  			author:author.replace(/\n/g,''),
  			create_time:create_time.replace(/\n/g,''),
  			reply_counts:reply_counts,
            bright_count:bright_count == '' ? 0:bright_count
  		})

  	})

    var pages = $('span.page_num').text().replace(/\n/g,'').split('/');

  	res.send({code:200,bxj:arr,currPage:pages[0],totalPage:pages[1]});
  })
});

module.exports = router;
