var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');

// 判断子节点是否全是span
function isAllSpan(text, node){
	var $ = cheerio.load(text);

	console.log($(node).children().html());
	var isAll = false;

	if($(node).children().length === 0){
		return isAll;
	}else{
		for(let i = 0; i< $(node).children().length; i++){
			//console.log($(node).children().eq(i).tagName);
			if($(node).children().eq(i).get(0).tagName === 'span'){
				return true;
			}
		}
	}	
	return isAll;
}

function DFS(text){
	var $ = cheerio.load(text);

	console.log(text);
	var a = [];

	// var log = [];

	function traverse(element){
		for(let i = 0; i < $(element).children().length; i++){
			var childNode = $(element).children().eq(i);
			// log.push('第'+(i+1)+'子节点');
			if($(childNode).children().length !== 0 && !isAllSpan(text, childNode)){
				traverse(childNode);
			}else{
				//console.log($(childNode).get(0).tagName);
				if($(childNode).get(0).tagName == 'img'){
					a.push($(childNode).attr('src'));
				}else if($(childNode).text().replace(/(^\s*)|(\s*$)/g,'')!==''){
					a.push($(childNode).text().replace(/(^\s*)|(\s*$)/g,''));
				}
			}
		}
	}
	
	traverse($('div.quote-content').get(0));
	
	return a;

}

router.get('/', function(req, res, next){
	var url = "https://bbs.hupu.com/21715225.html";
	superagent.get(url)
	.end(function(err, sres){
		if(err) return next(err);
		var $ = cheerio.load(sres.text);

		var post_id = $('form[name="delatc"]').find('input[name="tid"]').attr('value');

		var author_name = $('div.author a.u').eq(0).text();

		var author_id = parseInt(($('div.author a.u').attr('href').split('com/'))[1]);

		var avator_url = $('div#tpc').find('a.headpic>img').attr('src');

		var create_time = $('div.author div.left span.stime').eq(0).text();

		var title = $('table.case div.subhead>span').text();

		// 开始爬取帖子正文

		var content_list = [];

		content_list = DFS($('div#tpc table.case td').html());


		res.send({
			id:post_id,
			author:{
				id:author_id,
				name:author_name,
				url:avator_url
			},
			create_time:create_time,
			title:title,
			content:content_list,
		});
	})
})

module.exports = router