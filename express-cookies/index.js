var express = require('express')

var cookiesParser = require('cookie-parser')

var session = require('express-session')

var redisStore = require('connect-redis')(session)

var app = express()
app.listen(9000, function(err) {
	if (err) {
		console.log(err)
	}
	
	console.log('listen at 9000')
})

// app.use(cookiesParser())

app.use(session({
	secret: 'recommand 128 bytes random string',
	store: new redisStore(),
	cookie: {maxAge: 60 * 1000}
}))

app.get('/', function(req, res) {
	
	/* if (req.cookies.isVisit) {
		console.log(req.cookies)
		res.send('欢迎再次访问')
	} else {
		res.cookie('isVisit', 1, {maxAge: 60 * 1000})
		res.send('欢迎访问')
	} */
	
	if (req.session.isVisit) {
		req.session.isVisit++
		res.send('<p>第 ' + req.session.isVisit + '次来此页面</p>')
	} else {
		req.session.isVisit = 1
		res.send("欢迎第一次来这里")
		console.log(req.session)
	}
})