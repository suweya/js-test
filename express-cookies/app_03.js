var superagent = require('superagent')

var eventproxy = require('eventproxy')

var URL = require('url')

var express = require('express')

var cheerio = require('cheerio')

var Async = require('async')

var app = express()

const CNODE_URL = 'https://cnodejs.org/'

app.listen(9000, function(err) {
	
	if (err) {
		console.error(err)
	}
	
	console.log('app listen at 9000')
})

app.get('/async', function(req, res, next) {
	superagent.get(CNODE_URL)
		.end(function(err, sres) {
			if (err) {
				return next(err)
			}
			
			var $ = cheerio.load(sres.text)
			var items = []
			$('#topic_list .topic_title').each(function(idx, element) {
				var $element = $(element)
				items.push({
					title: $element.attr('title'),
					href: URL.resolve(CNODE_URL, $element.attr('href'))
				})
			})
			
			// res.send(items)
			Async.mapLimit(items, 5, async function(item) {
				const response = await superagent.get(item.href)
				let $ = (response && response.status === 200) ? cheerio.load(response.text) : null
				return {
					title: item.title,
					href: item.href,
					comment: $ !== null ? $('.reply_content').eq(0).text().trim() : 'Error'
				}
			}, function(err, result) {
				if (err) {
					return next(err)
				}
				
				res.send(result)
			})
		})
})

app.get('/', function(req, res, next) {
	
	superagent.get(CNODE_URL)
		.end(function(err, sres) {
			if (err) {
				return next(err)
			}
			
			var $ = cheerio.load(sres.text)
			var items = []
			$('#topic_list .topic_title').each(function(idx, element) {
				var $element = $(element)
				items.push({
					title: $element.attr('title'),
					href: URL.resolve(CNODE_URL, $element.attr('href'))
				})
			})
			
			// res.send(items)
			var ep = new eventproxy()
			ep.after('TOPIC_HTML', items.length, function(topics) {
				topics = topics.map(function(data) {
					var $ = cheerio.load(data.text)
					return {
						title: data.title,
						href: data.href,
						comment: $('.reply_content').eq(0).text().trim()
					}
				})
				
				res.send(topics)
			})
			
			items.forEach(function(item) {
				superagent.get(item.href)
					.end(function(err, sres) {
						console.log('Fetch ' + item.href + ' successful')
						ep.emit('TOPIC_HTML', {
							href: item.href,
							title: item.title,
							text: sres.text
						})
					})
			})
		})
})