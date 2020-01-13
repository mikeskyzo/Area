var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sex/:taille', function(req, res, next) {
  res.json({ taille: req.params.taille });
});

module.exports = router;
