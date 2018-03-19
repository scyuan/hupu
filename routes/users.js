var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET users listing. */
router.get('/bxj/list', function(req, res, next) {

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

router.get('/bxj/list/posts', function(req, res, next){
	var url = "https://bbs.hupu.com/21682420.html";
	superagent.get(url)
	.end(function(err, sres){
		if(err) return next(err);
		var $ = cheerio.load(sres.text);

		var post_id = $('form[name="delatc"]').find('input[name="tid"]').attr('value');

		var author_name = $('div.author a.u').eq(0).text();

		var author_id = parseInt(($('div.author a.u').attr('href').split('com/'))[1]);

		var create_time = $('div.author div.left span.stime').eq(0).text();

		var title = $('table.case div.subhead>span').text();

		var content_list = [];

		$('table.case div.quote-content>p').each(function(i, elem){
			var conntent = $(elem).text();
			if(conntent!==''){
				content_list.push(conntent);
			}
		})

		var img_list = []

		//是否有gif
		$('table.case div.quote-content img').each(function(i, elem){
			img_list.push($(elem).attr('src'));
		})

		res.send({
			id:post_id,
			author:{
				id:author_id,
				name:author_name
			},
			create_time:create_time,
			title:title,
			content:content_list,
			imgs:img_list
		});
	})
})







module.exports = router;
