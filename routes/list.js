var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET users listing. */
router.get('/', function(req, res, next) {

  var bxj_url = "https://bbs.hupu.com/bxj"

  superagent.get(bxj_url)
  .end(function(err, sres){
  	if(err) return next(err);

  	var $ = cheerio.load(sres.text);

  	var arr =[];

  	$('.for-list li').each(function(i, elem){
  		
  		var title = $(elem).find('div.titlelink>a').text();
  		var title_link = bxj_url.replace('/bxj',$(elem).find('div.titlelink>a').attr('href'));
  		var id = parseInt($(elem).find('div.titlelink>a').attr('href').replace('/','').replace('.html',''));
  		var author = $(elem).find('div.author>a.aulink').text();
  		var create_time = $(elem).find('div.author a:last-child').text();
  		
  		var counts = $(elem).find('span.ansour').text().split('/');
  		var reply_counts = counts[0];
  		var read_counts =counts[1];
  		
  		arr.push({
  			title:title,
  			id:id,
  			title_link:title_link,
  			author:author,
  			create_time:create_time,
  			reply_counts:reply_counts.replace(/(^\s*)|(\s*$)/g,''),
  			read_counts:read_counts.replace(/(^\s*)|(\s*$)/g,'')
  		})

  	})
  	res.send({code:200,bxj:arr});
  })
});

module.exports = router;
