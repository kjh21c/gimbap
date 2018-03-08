/*
 * Perf Cal page.
 */
//timer
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.second = [ 20, 40, 58];
 // 매 시간 15초 마다 수행

var schedule2 = require('node-schedule');
var rule2 = new schedule2.RecurrenceRule();
rule2.miniute = 1.5;

//http
var request = require('request');
// xml
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
//http crowing
var cheerio = require('cheerio');
//phantom
var metar_data, metar_temp, metar_alti, 
	metar_wind, metar_windVel, pa, da, metar_dewp , metar_visi , 
	obsrv_time , obsrv_time_diff, 
	crossWind1, crossWind2,	Perf152_data_TO_Gnd_Roll, Perf152_data_TO_50_Clr, Perf152_data_Land_Gnd_Roll, Perf152_data_Rate_Of_Climb, Perf172_data_TO_Gnd_Roll, Perf172_data_TO_50_Clr, Perf172_data_Land_Gnd_Roll, Perf172_data_Rate_Of_Climb;
var temperature, pressure, elevation;
var taf_data,metar_flight_category;
var area_forecast = '',
	wind_aloft = '',
	notam_url = 'https://pilotweb.nas.faa.gov/PilotWeb/notamRetrievalByICAOAction.do?method=displayByICAOs&reportType=RAW&formatType=DOMESTIC&retrieveLocId=HIO&actionType=notamRetrievalByICAOs';
// new ver val
var sunsettime , sunrisetime , sunsettwilight, sunrisetwilight;
var metar_wx_string;
var $aopa_weather,
	$aopa_weather_taf;
//cheerio object
var $data_first_metar_obj;
var $data_first_taf_obj ;
var forecast_string ;


//페이지 콜 부분
exports.index = function(req, res) {
	readData(function() {
		res.render('wx_perf', {
			title : 'KHIO METAR & 152 Perf. Infomation',
			pa : pa,
			da : da,
			loc_id : 'hio',
			temperature : temperature,
			pressure : pressure,
			elevation : elevation , 
			metar : metar_data,
			taf : taf_data,
			surfaceWind : metar_wind,
			surfaceWindVel : metar_windVel,
			crossWind1 : crossWind1,
			crossWind2 : crossWind2,
			metar_alti : metar_alti , 
			metar_dewp : metar_dewp,
			metar_visi : metar_visi,
			metar_flight_category: metar_flight_category,
			obsrv_time: obsrv_time, 
			obsrv_time_diff : obsrv_time_diff, 
			//cheerio obj
			$data_first_metar_obj : $data_first_metar_obj,
			$data_first_taf_obj : $data_first_taf_obj,
			//sun set time
			sunsettime  : sunsettime ,
			sunrisetime : sunrisetime ,
			sunsettwilight: sunsettwilight,
			sunrisetwilight: sunrisetwilight,
			metar_wx_string:metar_wx_string,
			forecast_string:forecast_string,
			
			//airp perf data
			Perf152_data_TO_Gnd_Roll : Perf152_data_TO_Gnd_Roll,
			Perf152_data_TO_50_Clr : Perf152_data_TO_50_Clr,
			Perf152_data_Land_Gnd_Roll : Perf152_data_Land_Gnd_Roll,
			Perf152_data_Rate_Of_Climb : Perf152_data_Rate_Of_Climb,
			Perf172_data_TO_Gnd_Roll : Perf172_data_TO_Gnd_Roll,
			Perf172_data_TO_50_Clr : Perf172_data_TO_50_Clr,
			Perf172_data_Land_Gnd_Roll : Perf172_data_Land_Gnd_Roll,
			Perf172_data_Rate_Of_Climb : Perf172_data_Rate_Of_Climb,
			bloco_title_10 : 'Area Forecast',
			bloco_title_11 : 'Wind_Aloft',
			bloco_title_12 : 'NOTAM',
			bloco_title_13 : 'Convective SIGMETs, SIGMETs',
			bloco_title_14 : 'Surface Analysis',
			bloco_title_15 : 'Weather Dipiction',
			bloco_title_16 : 'RADAR Summary',
			
			bloco_contents_10 : area_forecast,
			bloco_contents_11 : wind_aloft,
			bloco_contents_12 : notam_url,
			bloco_contents_13 : 'bloco_contents_13',
			bloco_contents_14 : 'bloco_contents_14',
			bloco_contents_15 : 'bloco_contents_15',
			bloco_contents_16 : 'bloco_contents_16',
			bloco_contents_metar : $aopa_weather,
			bloco_contents_taf : $aopa_weather_taf
	});
	});
	var time = new Date(); 
	console.log("!!!Page Accessed "+ time.getDay() + "th," +  time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()); 

};
//페이지 콜 부분
exports.weather_etc_data = function(req, res) {
	readData(function() {
		res.render('weather_etc_data', {
			title : 'KHIO METAR & 152 Perf. Infomation',
			pa : pa,
			da : da,
			loc_id : 'hio',
			temperature : temperature,
			pressure : pressure,
			elevation : elevation , 
			metar : metar_data,
			taf : taf_data,
			surfaceWind : metar_wind,
			surfaceWindVel : metar_windVel,
			crossWind1 : crossWind1,
			crossWind2 : crossWind2,
			metar_alti : metar_alti , 
			metar_dewp : metar_dewp,
			metar_visi : metar_visi,
			metar_flight_category: metar_flight_category,
			obsrv_time: obsrv_time, 
			obsrv_time_diff : obsrv_time_diff, 
			//cheerio obj
			$data_first_metar_obj : $data_first_metar_obj,
			$data_first_taf_obj : $data_first_taf_obj,
			//sun set time
			sunsettime  : sunsettime ,
			sunrisetime : sunrisetime ,
			sunsettwilight: sunsettwilight,
			sunrisetwilight: sunrisetwilight,
			metar_wx_string:metar_wx_string,
			forecast_string:forecast_string,
			
			//airp perf data
			Perf152_data_TO_Gnd_Roll : Perf152_data_TO_Gnd_Roll,
			Perf152_data_TO_50_Clr : Perf152_data_TO_50_Clr,
			Perf152_data_Land_Gnd_Roll : Perf152_data_Land_Gnd_Roll,
			Perf152_data_Rate_Of_Climb : Perf152_data_Rate_Of_Climb,
			Perf172_data_TO_Gnd_Roll : Perf172_data_TO_Gnd_Roll,
			Perf172_data_TO_50_Clr : Perf172_data_TO_50_Clr,
			Perf172_data_Land_Gnd_Roll : Perf172_data_Land_Gnd_Roll,
			Perf172_data_Rate_Of_Climb : Perf172_data_Rate_Of_Climb,
			bloco_title_10 : 'Area Forecast',
			bloco_title_11 : 'Wind_Aloft',
			bloco_title_12 : 'NOTAM',
			bloco_title_13 : 'Convective SIGMETs, SIGMETs',
			bloco_title_14 : 'Surface Analysis',
			bloco_title_15 : 'Weather Dipiction',
			bloco_title_16 : 'RADAR Summary',
			
			bloco_contents_10 : area_forecast,
			bloco_contents_11 : wind_aloft,
			bloco_contents_12 : notam_url,
			bloco_contents_13 : 'bloco_contents_13',
			bloco_contents_14 : 'bloco_contents_14',
			bloco_contents_15 : 'bloco_contents_15',
			bloco_contents_16 : 'bloco_contents_16',
			bloco_contents_metar : $aopa_weather,
			bloco_contents_taf : $aopa_weather_taf
	});
	});
	var time = new Date(); 
	console.log("!!!Page Accessed "+ time.getDay() + "th," +  time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()); 

};

//페이지 콜 부분
exports.distance_172 = function(req, res) {
	readData(function() {
		res.render('distance_172', {
			title : 'KHIO METAR & 172 Perf. Infomation',
			pa : pa,
			da : da,
			loc_id : 'hio',
			temperature : temperature,
			pressure : pressure,
			elevation : elevation , 
			metar : metar_data,
			taf : taf_data,
			surfaceWind : metar_wind,
			surfaceWindVel : metar_windVel,
			crossWind1 : crossWind1,
			crossWind2 : crossWind2,
			metar_alti : metar_alti , 
			metar_dewp : metar_dewp,
			metar_visi : metar_visi,
			metar_flight_category: metar_flight_category,
			obsrv_time: obsrv_time, 
			obsrv_time_diff : obsrv_time_diff, 
			//cheerio obj
			$data_first_metar_obj : $data_first_metar_obj,
			$data_first_taf_obj : $data_first_taf_obj,
			//sun set time
			sunsettime  : sunsettime ,
			sunrisetime : sunrisetime ,
			sunsettwilight: sunsettwilight,
			sunrisetwilight: sunrisetwilight,
			metar_wx_string:metar_wx_string,
			forecast_string:forecast_string,
			
			//airp perf data
			Perf152_data_TO_Gnd_Roll : Perf152_data_TO_Gnd_Roll,
			Perf152_data_TO_50_Clr : Perf152_data_TO_50_Clr,
			Perf152_data_Land_Gnd_Roll : Perf152_data_Land_Gnd_Roll,
			Perf152_data_Rate_Of_Climb : Perf152_data_Rate_Of_Climb,
			Perf172_data_TO_Gnd_Roll : Perf172_data_TO_Gnd_Roll,
			Perf172_data_TO_50_Clr : Perf172_data_TO_50_Clr,
			Perf172_data_Land_Gnd_Roll : Perf172_data_Land_Gnd_Roll,
			Perf172_data_Rate_Of_Climb : Perf172_data_Rate_Of_Climb,
			bloco_title_10 : 'Area Forecast',
			bloco_title_11 : 'Wind_Aloft',
			bloco_title_12 : 'NOTAM',
			bloco_title_13 : 'Convective SIGMETs, SIGMETs',
			bloco_title_14 : 'Surface Analysis',
			bloco_title_15 : 'Weather Dipiction',
			bloco_title_16 : 'RADAR Summary',
			
			bloco_contents_10 : area_forecast,
			bloco_contents_11 : wind_aloft,
			bloco_contents_12 : notam_url,
			bloco_contents_13 : 'bloco_contents_13',
			bloco_contents_14 : 'bloco_contents_14',
			bloco_contents_15 : 'bloco_contents_15',
			bloco_contents_16 : 'bloco_contents_16',
			bloco_contents_metar : $aopa_weather,
			bloco_contents_taf : $aopa_weather_taf
	});
	});
	var time = new Date(); 
	console.log("!!!Page Accessed "+ time.getDay() + "th," +  time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()); 

};

//페이지 콜 부분
exports.distance_152 = function(req, res) {
	readData(function() {
		res.render('distance_152', {
			title : 'KHIO METAR & 152 Perf. Infomation',
			pa : pa,
			da : da,
			loc_id : 'hio',
			temperature : temperature,
			pressure : pressure,
			elevation : elevation , 
			metar : metar_data,
			taf : taf_data,
			surfaceWind : metar_wind,
			surfaceWindVel : metar_windVel,
			crossWind1 : crossWind1,
			crossWind2 : crossWind2,
			metar_alti : metar_alti , 
			metar_dewp : metar_dewp,
			metar_visi : metar_visi,
			metar_flight_category: metar_flight_category,
			obsrv_time: obsrv_time, 
			obsrv_time_diff : obsrv_time_diff, 
			//cheerio obj
			$data_first_metar_obj : $data_first_metar_obj,
			$data_first_taf_obj : $data_first_taf_obj,
			//sun set time
			sunsettime  : sunsettime ,
			sunrisetime : sunrisetime ,
			sunsettwilight: sunsettwilight,
			sunrisetwilight: sunrisetwilight,
			metar_wx_string:metar_wx_string,
			forecast_string:forecast_string,
			
			//airp perf data
			Perf152_data_TO_Gnd_Roll : Perf152_data_TO_Gnd_Roll,
			Perf152_data_TO_50_Clr : Perf152_data_TO_50_Clr,
			Perf152_data_Land_Gnd_Roll : Perf152_data_Land_Gnd_Roll,
			Perf152_data_Rate_Of_Climb : Perf152_data_Rate_Of_Climb,
			Perf172_data_TO_Gnd_Roll : Perf172_data_TO_Gnd_Roll,
			Perf172_data_TO_50_Clr : Perf172_data_TO_50_Clr,
			Perf172_data_Land_Gnd_Roll : Perf172_data_Land_Gnd_Roll,
			Perf172_data_Rate_Of_Climb : Perf172_data_Rate_Of_Climb,
			bloco_title_10 : 'Area Forecast',
			bloco_title_11 : 'Wind_Aloft',
			bloco_title_12 : 'NOTAM',
			bloco_title_13 : 'Convective SIGMETs, SIGMETs',
			bloco_title_14 : 'Surface Analysis',
			bloco_title_15 : 'Weather Dipiction',
			bloco_title_16 : 'RADAR Summary',
			
			bloco_contents_10 : area_forecast,
			bloco_contents_11 : wind_aloft,
			bloco_contents_12 : notam_url,
			bloco_contents_13 : 'bloco_contents_13',
			bloco_contents_14 : 'bloco_contents_14',
			bloco_contents_15 : 'bloco_contents_15',
			bloco_contents_16 : 'bloco_contents_16',
			bloco_contents_metar : $aopa_weather,
			bloco_contents_taf : $aopa_weather_taf
	});
	});
};
//페이지 콜 부분
exports.weather_data = function(req, res) {
	readData(function() {
		res.render('weather_data', {
			title : 'KHIO METAR & 152 Perf. Infomation',
			pa : pa,
			da : da,
			loc_id : 'hio',
			temperature : temperature,
			pressure : pressure,
			elevation : elevation , 
			metar : metar_data,
			taf : taf_data,
			surfaceWind : metar_wind,
			surfaceWindVel : metar_windVel,
			crossWind1 : crossWind1,
			crossWind2 : crossWind2,
			metar_alti : metar_alti , 
			metar_dewp : metar_dewp,
			metar_visi : metar_visi,
			metar_flight_category: metar_flight_category,
			obsrv_time: obsrv_time, 
			obsrv_time_diff : obsrv_time_diff, 
			//cheerio obj
			$data_first_metar_obj : $data_first_metar_obj,
			$data_first_taf_obj : $data_first_taf_obj,
			//sun set time
			sunsettime  : sunsettime ,
			sunrisetime : sunrisetime ,
			sunsettwilight: sunsettwilight,
			sunrisetwilight: sunrisetwilight,
			metar_wx_string:metar_wx_string,
			forecast_string:forecast_string,
			
			//airp perf data
			Perf152_data_TO_Gnd_Roll : Perf152_data_TO_Gnd_Roll,
			Perf152_data_TO_50_Clr : Perf152_data_TO_50_Clr,
			Perf152_data_Land_Gnd_Roll : Perf152_data_Land_Gnd_Roll,
			Perf152_data_Rate_Of_Climb : Perf152_data_Rate_Of_Climb,
			Perf172_data_TO_Gnd_Roll : Perf172_data_TO_Gnd_Roll,
			Perf172_data_TO_50_Clr : Perf172_data_TO_50_Clr,
			Perf172_data_Land_Gnd_Roll : Perf172_data_Land_Gnd_Roll,
			Perf172_data_Rate_Of_Climb : Perf172_data_Rate_Of_Climb,
			bloco_title_10 : 'Area Forecast',
			bloco_title_11 : 'Wind_Aloft',
			bloco_title_12 : 'NOTAM',
			bloco_title_13 : 'Convective SIGMETs, SIGMETs',
			bloco_title_14 : 'Surface Analysis',
			bloco_title_15 : 'Weather Dipiction',
			bloco_title_16 : 'RADAR Summary',
			
			bloco_contents_10 : area_forecast,
			bloco_contents_11 : wind_aloft,
			bloco_contents_12 : notam_url,
			bloco_contents_13 : 'bloco_contents_13',
			bloco_contents_14 : 'bloco_contents_14',
			bloco_contents_15 : 'bloco_contents_15',
			bloco_contents_16 : 'bloco_contents_16',
			bloco_contents_metar : $aopa_weather,
			bloco_contents_taf : $aopa_weather_taf
	});
	});
	var time = new Date(); 
	console.log("!!!Page Accessed "+ time.getDay() + "th," +  time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()); 

};

//페이지 콜 부분
exports.metar_data = function(req, res) {
	readData(function() {
		res.render('metar_data', {
			title : 'KHIO METAR & 152 Perf. Infomation',
			pa : pa,
			da : da,
			loc_id : 'hio',
			temperature : temperature,
			pressure : pressure,
			elevation : elevation , 
			metar : metar_data,
			taf : taf_data,
			surfaceWind : metar_wind,
			surfaceWindVel : metar_windVel,
			crossWind1 : crossWind1,
			crossWind2 : crossWind2,
			metar_alti : metar_alti , 
			metar_dewp : metar_dewp,
			metar_visi : metar_visi,
			metar_flight_category: metar_flight_category,
			obsrv_time: obsrv_time, 
			obsrv_time_diff : obsrv_time_diff, 
			//cheerio obj
			$data_first_metar_obj : $data_first_metar_obj,
			$data_first_taf_obj : $data_first_taf_obj,
			//sun set time
			sunsettime  : sunsettime ,
			sunrisetime : sunrisetime ,
			sunsettwilight: sunsettwilight,
			sunrisetwilight: sunrisetwilight,
			metar_wx_string:metar_wx_string,
			forecast_string:forecast_string,
			
			bloco_contents_metar : $aopa_weather,
			bloco_contents_taf : $aopa_weather_taf
	});
	});

};




var j = schedule
		.scheduleJob(
				rule,
				function() {
				
					// METAR
					var url = {
						url : "http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KHIO&hoursBeforeNow=24",
						json : false
					};

					request(url,function(err, res, html) {
						if(err)
							return 0 ; 
						//cheerio 이용 개선
						$ = cheerio.load(html,{  xmlMode: true	});
						if ($('data').attr('num_results') != 0  && $('data').attr('num_results') )
						{
							console.log('$(data).attr(num_results)' + $('data').attr('num_results') );
							var $data_first_metar = cheerio.load($('data').children().first().html(),{xmlMode:true});
							$data_first_metar_obj = $data_first_metar;
							metar_wx_string = $data_first_metar('wx_string').html();
						
						//이전 버젼 방식
								if(!err){
								parser.parseString(html,
													function(err, result) {
														if(!err){
															var alti = Number(result.response.data[0].METAR[0].altim_in_hg);
															var temper = Number(result.response.data[0].METAR[0].temp_c);
															var metar_raw_text = result.response.data[0].METAR[0].raw_text[0];
															var wind = Number(result.response.data[0].METAR[0].wind_dir_degrees); // exception
															var windVel = Number(result.response.data[0].METAR[0].wind_speed_kt);
															var flight_category = result.response.data[0].METAR[0].flight_category;
															var dewp = Number(result.response.data[0].METAR[0].dewpoint_c); // 
															var visi = Number(result.response.data[0].METAR[0].visibility_statute_mi); // 
															var obsrv_time_metar = result.response.data[0].METAR[0].observation_time; // 
															
															metar_data = metar_raw_text;
															metar_temp = temper;
															metar_alti = alti;
															metar_wind = wind;
															metar_windVel = windVel;
															metar_flight_category = flight_category;
															metar_dewp = dewp; 
															metar_visi = visi; 
															
															temperature = temper;
															pressure = alti;
															elevation = 0;
														
															obsrv_time = new Date(obsrv_time_metar);
															obsrv_time_diff = new Date().getTime() - obsrv_time.getTime() ;
															obsrv_time_diff = new Date(obsrv_time_diff );
															obsrv_time_diff = obsrv_time_diff.getUTCHours() + ":" + obsrv_time_diff.getUTCMinutes() ;
															obsrv_time = obsrv_time.getHours() + ":" + obsrv_time.getMinutes();
														}
												});
								}
						}
					});

					// TAF
					var url = {
						url : "http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=tafs&requestType=retrieve&format=xml&stationString=KHIO&hoursBeforeNow=24",
						json : false
					};

					request(
							url,
							function(err, res, html) {
								if (err)
									return 0 ;
								//insert for cheerio new way handling
								$ = cheerio.load(html,{  xmlMode: true	});
								if ($('data').attr('num_results') != 0 && $('data').attr('num_results'))
								{ 
									var $data_first_taf = cheerio.load($('data').children().first().html(),{xmlMode:true});
									$data_first_taf_obj = $data_first_taf;								
								
									parser.parseString(
													html,
													function(err, result) {
														var taf_raw_text = result.response.data[0].TAF[0].raw_text[0];
														taf_data = taf_raw_text;
													});
								}
							});
							
					// af get
					var url_af = "http://aviationweather.gov/areafcst/data?region=sfo";
					request(url_af, function (err, res, html) {
					    if (!err) {
					        var $ = cheerio.load(html);

					        //데이터 처리
					        area_forecast = $("pre").html();
					     
					    }
					});
					
					
					
					// windaloft get
					var url_loft = "http://aviationweather.gov/windtemp/data?region=sfo";
					request(url_loft, function (err, res, html) {
					    if (!err) {
					        var $ = cheerio.load(html);
					        //데이터 처리
					        wind_aloft = $("pre").html();
					    }
					});
					
					
					//sunset rise times
					var url_forecast = 'https://sunrise-sunset.org/us/portland-or';
					request(url_forecast, function (err, res, html) {
					    if (!err) {
					        var $ = cheerio.load(html);
					        //데이터 처리
					        sunrisetime  = $('#today .sunrise .time').text();
					        sunrisetwilight = $('#today .sunrise .twilight').text();
					        sunsettime= $('#today .sunset .time').text();
					        sunsettwilight= $('#today .sunset .twilight').text();
						        
					        
					    }
					});
					
					// weather forecast
					var options = {
							  url: 'https://api.weather.gov/gridpoints/PQR/103,105/forecast',
							  headers: {
							    'Accept': 'application/vnd.noaa.dwml+xml.',
							    'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0'
							  }
							};
					request(options, function (err, res, html) {
					    if (!err) {
					        var data_JSON = JSON.parse(html);
					        var forecast_date = data_JSON.properties.periods[1].name;
					        var forecast_context = data_JSON.properties.periods[1].shortForecast;
					        forecast_string = forecast_date + ' is ' +forecast_context ;
					        
					        //데이터 처리
					        
					     
					    }
					});	
					
					
					
					
				});

/*
 // 두번째 스케줄
var j2 = schedule2.scheduleJob(rule2, function() {
	// aopa page crowingstart
	var phantom = require("phantom");
	var _ph, _page, _outObj;
	phantom.create().then(function(ph) {
		_ph = ph;
		return _ph.createPage();
	}).then(
			function(page) {
				_page = page;
				return _page.open('https://www.aopa.org/airports/khio',
						function(status) {
							if (status !== 'success') {
								console.log('Unable to load the address!');
								phantom.exit();
							} else {
								window.setTimeout(function() {
									page.render(output);
									phantom.exit();
								}, 1000); // Change timeout as required to
								// allow sufficient time
							}
						});
			}).then(function(status) {
		console.log('status:' + status);
		return _page.property('content')
	}).then(function(content) {
		// console.log(content);
		var $ = cheerio.load(content);
		$('.header').remove();
		$aopa_weather = $('.metars-here');
		$aopa_weather_taf = $('.taf-here');
		//
		//console.log('html_metar-' + $aopa_weather.html());
		//console.log('html-' + $.html());
		var post = [];
		_page.close();
		_ph.exit();
	});

	// aopa crwoing end

});

*/


// 콜백 해결 구분

var readData = function(callback) {
	
	//
	// 삽입
	//

	// Calculation
	pa = ((29.92 - metar_alti) * 1000 + 208);
	da = pa + 120 * (metar_temp - 15);
	pa = pa.toFixed(1);
	da = da.toFixed(1);

	// this is for corss wind
	// var wind= wind;
	// var windValocity= 10;

	var rwyUse1 = 310; // or 13
	var rwyUse2 = 200;// or 2
	var rwyDiff1 = rwyUse1 - metar_wind;
	var rwyDiff2 = rwyUse2 - metar_wind;

	crossWind1 = Number(
			Math.abs(Math.sin(Math.PI / 180 * rwyDiff1) * metar_windVel))
			.toFixed(1);
	crossWind2 = Number(
			Math.abs(Math.sin(Math.PI / 180 * rwyDiff2) * metar_windVel))
			.toFixed(1);

	// console.log('crossWind1:'+crossWind1);
	// console.log('crossWind2:'+crossWind2);

	//
	//
	// Load the data
	// forcast function
	function CurTOGndRoll(cur_temp, cur_pressure, data) {
	}
	function CurTO50Clr(cur_temp, cur_pressure, data) {
	}
	function CurLandRoll(cur_temp, cur_pressure, data) {
	}
	function CurRateOfClimb(cur_temp, cur_pressure, data) {
	}

	// data 152
	var takeoffGndRoll_152 = [ [ 640, 695, 755, 810 ] // p. alti 0
	// temp 0~30
	, [ 705, 765, 825, 890 ] // p.
	// alti
	// 1000
	// temp
	// 0~30
	, [ 775, 840, 910, 980 ] ]; // p.
	// alti
	// 2000
	// temp
	// 0~30

	var takeoff50ft_152 = [ [ 1190, 1290, 1390, 1495 ] // p.
	// alti
	// 0
	// temp
	// 0~30
	, [ 1310, 1420, 1530, 1645 ] // p.
	// alti
	// 1000
	// temp
	// 0~30
	, [ 1445, 1565, 1690, 1820 ] ];// p.
	// alti
	// 2000
	// temp
	// 0~30

	var rateOfClimb_152 = [ [ 835, 765, 700, 630 ] // p.alti 0
	// temp -20
	// to +40
	, [ 735, 670, 600, 535 ] // p.alti
	// 2000
	// temp
	// -20
	// to
	// +40
	];

	var landGndRoll_152 = [ [ 450, 465, 485, 500 ], [ 465, 485, 500, 520 ],
			[ 485, 500, 520, 535 ] ];

	// data 172
	var takeoffGndRoll_172 = [ [ 795, 860, 925, 995 ],
			[ 875, 940, 1015, 1090 ], [ 960, 1035, 1115, 1200 ] ]; // p.
	// alti
	// 2000
	// temp
	// 0~30

	var takeoff50ft_172 = [ [ 1446, 1570, 1685, 1810 ],
			[ 1605, 1725, 1860, 2000 ], [ 1770, 1910, 2060, 2220 ] ];// p.
	// alti
	// 2000
	// temp
	// 0~30

	var rateOfClimb_172 = [ [ 805, 745, 685, 625 ], [ 695, 640, 580, 525 ] ];

	var landGndRoll_172 = [ [ 510, 530, 550, 570 ], [ 530, 550, 570, 590 ],
			[ 550, 570, 590, 610 ]

	];

	// for cal unit 게산용 unit
	var tempDegreeby10 = [ 0, 10, 20, 30 ];
	var tempDegreeby20 = [ -20, 0, 20, 40 ];
	var pressureDegree = [ 0, 1000, 2000 ];
	var pressureDegreeBy2000 = [ 0, 2000 ];

	//
	// 데이터 저장 152
	Perf152_data_TO_Gnd_Roll = CurTOGndRoll(metar_temp, pa, takeoffGndRoll_152)
			.toFixed(1);
	Perf152_data_TO_50_Clr = CurTO50Clr(metar_temp, pa, takeoff50ft_152)
			.toFixed(1);
	Perf152_data_Land_Gnd_Roll = CurLandRoll(metar_temp, pa, landGndRoll_152)
			.toFixed(1)*1.5;
	Perf152_data_Rate_Of_Climb = CurRateOfClimb(metar_temp, pa, rateOfClimb_152)
			.toFixed(1);

	// 데이터 저장 172
	Perf172_data_TO_Gnd_Roll = CurTOGndRoll(metar_temp, pa, takeoffGndRoll_172)
			.toFixed(1);
	Perf172_data_TO_50_Clr = CurTO50Clr(metar_temp, pa, takeoff50ft_172)
			.toFixed(1);
	Perf172_data_Land_Gnd_Roll = CurLandRoll(metar_temp, pa, landGndRoll_172)
			.toFixed(1);
	Perf172_data_Rate_Of_Climb = CurRateOfClimb(metar_temp, pa, rateOfClimb_172)
			.toFixed(1);

	// callback();

	// Time Series Cal
	function Forecast(x, kx, ky) {
		var i = 0, nr = 0, dr = 0, ax = 0, ay = 0, a = 0, b = 0;
		function average(ar) {
			var r = 0;
			for (i = 0; i < ar.length; i++) {
				r = r + ar[i];
			}
			return r / ar.length;
		}
		ax = average(kx);
		ay = average(ky);
		for (i = 0; i < kx.length; i++) {
			nr = nr + ((kx[i] - ax) * (ky[i] - ay));
			dr = dr + ((kx[i] - ax) * (kx[i] - ax))
		}
		b = nr / dr;
		a = ay - b * ax;
		return (a + b * x);
	}

	// 가로축 세로축 모두 계산을 해야 하기떄문에 이렇게 함. 현재 온도를 넣고
	// , 프레셔 0,1000,2000,3000단위로 모두 구함
	function CurTOGndRoll(cur_temp, cur_pressure, takeoffGndRoll) // temp
	// ,
	// pre
	// ,
	// 데이터
	{
		// T.O Gnd Roll
		var ToGndRollForecast = new Array;
		for (i = 0; i < takeoffGndRoll.length; i++) {
			ToGndRollForecast[i] = Forecast(cur_temp, tempDegreeby10,
					takeoffGndRoll[i]); // 0
			// alt.
			// pressure
			// 0
			// ,1000,2000일때
		}
		var curToGndRoll = Forecast(cur_pressure, pressureDegree,
				ToGndRollForecast);
		return curToGndRoll;
	}

	function CurTO50Clr(cur_temp, cur_pressure, takeoff50ft) {
		// T.O 50ft
		var To50ftForecast = new Array;
		for (i = 0; i < takeoff50ft.length; i++) {
			To50ftForecast[i] = Forecast(cur_temp, tempDegreeby10,
					takeoff50ft[i]);
		}
		var curTo50ft = Forecast(cur_pressure, pressureDegree, To50ftForecast);
		return curTo50ft;
	}
	//Land Roll
	function CurLandRoll(cur_temp, cur_pressure, landGndRoll) {
		//Land Roll
		var LandGndRollForecast = new Array;
		for (i = 0; i < landGndRoll.length; i++) {
			LandGndRollForecast[i] = Forecast(cur_temp, tempDegreeby10,
					landGndRoll[i]);
		}
		var curLandGndRoll = Forecast(cur_pressure, pressureDegree,
				LandGndRollForecast);
		return curLandGndRoll;
	}

	//Climb Perf
	function CurRateOfClimb(cur_temp, cur_pressure, rateOfClimb) {
		//Climb Perf
		var rateOfClimbForecast = new Array;
		for (i = 0; i < rateOfClimb.length; i++) {
			rateOfClimbForecast[i] = Forecast(cur_temp, tempDegreeby20,
					rateOfClimb[i])
		}
		var curRateOfClimb = Forecast(cur_pressure, pressureDegreeBy2000,
				rateOfClimbForecast);
		return curRateOfClimb;

	}
	
	callback();

}
