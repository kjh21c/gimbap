
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.redirect('/METAR/KHIO');
  //res.render('index', { title: 'Express' });
};

exports.info = function(req, res){
	res.render('info', { title: 'Express' });
};