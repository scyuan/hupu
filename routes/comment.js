var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');


// 深度优先搜索算法遍历DOM
function DFS(text){
	var $ = cheerio.load(text);

	var a = [];

	// var log = [];

	function traverse(element){
		for(let i = 0; i < $(element).children().length; i++){
			var childNode = $(element).children().eq(i);
			// log.push('第'+(i+1)+'子节点');
			if($(childNode).children().length !==0){
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
	traverse($('blockquote').get(0));
	
	return a;

}
router.get('/',function(req, res, next){
	
	//var url = "https://bbs.hupu.com/21682420.html";
	var url = "https://bbs.hupu.com/21715225.html";

	// 评论分为两部分  一部分是热评，一部分是按时间顺序的所有评论

	// 评论分为两种 一种是评论他人  一种是直接评论

	superagent.get(url)
	.end(function(err, sres){
		if(err) return next(err);
		var $ = cheerio.load(sres.text);

		//高亮评论
		var hot_comments = [];

		$("div#readfloor>div.floor").each(function(i, elem){
			var id = parseInt($(elem).attr('id'));

			//评论者
			var name = $(elem).find('div.user>div').attr('uname');
			var name_id = parseInt($(elem).find('div.user>div').attr('uid'));
			// 评论者头像
			var avator_url = $(elem).find('div.user>div>a>img').attr('src');
			
			//评论时间
			var time = $(elem).find('div.floor_box>div.author>div.left>span.stime').text();
			//是否是楼主
			var isOwner = false;
			if($(elem).find('div.floor_box>div.author div.left span.post-owner').text()){
				isOwner = true;
			}
			// 评论内容
			var comment_content = [];

			var a = $(elem).find('div.floor_box>table.case td').text().replace($(elem).find('div.floor_box>table.case td>blockquote').text(),'');

			var splits = a.split('\n');
			//console.log(splits);

			for(let i=0;i<splits.length;i++){
				if(splits[i]!==''&&splits[i]!=='发自虎扑iPhone客户端'&&splits[i]!=='发自虎扑Android客户端'&&splits[i]!=='发自手机虎扑 m.hupu.com')
					comment_content.push(splits[i]);
			}

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

				$(elem).find('div.floor_box>table.case td').each(function(i, element){

					//console.log($(element).html()+'\n\n\n');

					var reply_content_1 = DFS($(element).html()).slice(1);

					var reply_content_2 = [];

					var all = $(element).find('blockquote>p:first-child').text();

					var b = $(element).find('blockquote>p:first-child').find('b').text();
					var c = all.replace(b,'').replace(':','').split('\n');

				 	if(c.length !== 0 )
				 		for(let i=0;i<c.length;i++){
				 			if(c[i]!=='')
				 				reply_content_2.push(c[i]);
				 	}
				 	reply_content = reply_content_2.concat(reply_content_1);

					// 第一个p标签是标题 格式类似 引用X楼@XXX发表的：
					// if(i==0){
					// 	var all = $(element).text();
					// 	var b = $(element).find('b').text();
					// 	var c = all.replace(b,'').replace(':','').split('\n');
					// 	if(c.length !== 0 )
					// 		for(let i=0;i<c.length;i++){
					// 			reply_content.push(c[i]);
					// 		}
					// }else{
					// 	/*
					// 		第一个肯定是p标签，后面就不一定了，有可能是div、有可能是p，div或者p标签里面可能有图片

					// 		现在大概有几种情况

					// 		1.div标签里面只有img、p标签里面有图片

					// 		2.div标签里面只有文字、p标签里面有文字

					// 		3.div标签里面有文字有img

					// 	*/


						

					// }

				})

				reply = {
					user_id:user_id,
					user_name:user_name,
					reply_content:reply_content
				}
			}

			hot_comments.push({
				comment_id:id,
				avator_url:avator_url,
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