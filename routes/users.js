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

router.get('/bxj/list/posts/comment',function(req, res, next){
	
	var url = "https://bbs.hupu.com/21682420.html";

	superagent.get(url)
	.end(function(err, sres){
		if(err) return next(err);
		var $ = cheerio.load(sres.text);
		//高亮评论
		var hot_comments = [];

		$("div#readfloor>div.floor").each(function(i, elem){
			var id = $(elem).attr('id');

			//评论者
			var name = $(elem).find('div.user>div').attr('uname');
			var name_id = $(elem).find('div.user>div').attr('uid');

			//评论时间
			var time = $(elem).find('div.floor_box>div.author>div.left>span.stime').text();
			//是否是楼主
			var isOwner = false;
			if($(elem).find('div.floor_box>div.author div.left span.post-owner').text()){
				isOwner = true;
			}
			var comment_content = [];

			$(elem).find('div.floor_box>table.case td>p').each(function(i, e){
				comment_content.push($(e).text());
			})
			//亮了数
			var light = 0;
			light = parseInt($(elem).find('div.floor_box>div.author>div.left>span.f444 span.stime').text());

			//判断是否是回复他人的
			var reply = {};
			
			if($(elem).find('div.floor_box>table.case td>blockquote').html()){
				//是
				var user_name = $(elem).find('div.floor_box>table.case td>blockquote b>a.u').text();
				var user_id = parseInt($(elem).find('div.floor_box>table.case td>blockquote b>a.u').attr('href').split('com/')[1]);

				var reply_content = [];
				$(elem).find('div.floor_box>table.case td>blockquote>p').each(function(i, p){
					if($(p).text()!==''){
						if(i===0){
							var temp = $(p).text().split(':');
							if(temp.length>1&&temp[1]!==''){
								reply_content.push(temp[1]);
							}
						}else{
							reply_content.push($(p).text());
						}
						
					}
				})

				reply = {
					user_id:user_id,
					user_name:user_name,
					reply_content:reply_content
				}
			}

			hot_comments.push({
				comment_id:id,
				light:light,
				name:name,
				name_id:name_id,
				time:time,
				isOwner:isOwner,
				comment_content:comment_content,
				reply:reply
			})
		})

		var comments = [];

		//普通评论
		$('#t_main>form>div.floor').each(function(i, floor){
			if($(floor).attr('id')!=='tpc'){
				var user_id = $(floor).find('div.user>div').attr('uid');
				var user_name = $(floor).find('div.user>div').attr('uname');
				var time = $(floor).find('div.author>div.left>span.stime').text();
				var avator_url = $(floor).find('div.user>div img').attr('src');
				var comment_content = [];
				var aa = $(floor).find('div.floor_box>table.case td').text().split('\n');
				for(let a of aa){
					if(a!==''&&a!=='发自虎扑iPhone客户端'&&a!=='发自虎扑Android客户端'&&a!=='发自手机虎扑 m.hupu.com')
						comment_content.push(a);
				}
				//comment_content.push($(floor).find('div.floor_box>table.case td').text());

				comments.push({
					user_id:user_id,
					user_name:user_name,
					time:time,
					avator_url:avator_url,
					comment_content:comment_content
				})
			}
		})

		res.send({
			hot_comments:hot_comments,
			comments:comments
		})

	})

})





module.exports = router;
