
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.redirect('http://www.actualimc.com');
  //res.render('index', { title: 'Express' });
};

exports.info = function(req, res){
	res.render('info', { title: 'Hillsboro Weather Information' 
			
	});
};

exports.sitemap = function(req, res){
	res.render('sitemap', { title: 'Hillsboro Weather Information sitemap' });
};

exports.blog = function(req, res){
	res.render('doc_container', { title: 'Aviation Blog' });
};

