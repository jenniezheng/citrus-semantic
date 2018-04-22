var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('analogy', { result: "nothing yet"});
});

module.exports = router;
