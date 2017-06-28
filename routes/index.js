
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.redirect('/METAR/KHIO');
  //res.render('index', { title: 'Express' });
};

exports.info = function(req, res){
	res.render('info', { title: 'Hillsboro Weather Information' 
			
	});
};

exports.sitemap = function(req, res){
	res.render('sitemap', { title: 'Hillsboro Weather Information sitemap' });
};