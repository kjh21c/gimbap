
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , perf = require('./routes/perf')
  , airport_info = require('./routes/airport_info')
  , perf_s39 = require('./routes/perf_s39')
  , http = require('http')
  , path = require('path');


var app = express();

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile); // added

app.use(express.compress()); //gzip 사용
app.use(express.favicon());

//default, short ,tiny, and dev
//app.use(express.logger('default'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/metar/KHIO', routes.index);
app.get('/metar/KHIO_2', perf.index);
app.get('/metar/metar_data', perf.metar_data);
app.get('/metar/weather_data', perf.weather_data);
app.get('/metar/weather_etc_data', perf.weather_etc_data);
app.get('/metar/distance_152', perf.distance_152);
app.get('/metar/distance_172', perf.distance_172);
app.get('/metar/Landing_Airports', airport_info.index);
app.get('/metar/S39', perf_s39.index);
app.get('/info', routes.info);
app.get('/sitemap', routes.sitemap);
app.get('/BLOG', routes.blog);


/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/
app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});



