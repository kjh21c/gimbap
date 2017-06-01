
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.redirect('/METAR/KHIO');
  //res.render('index', { title: 'Express' });
};