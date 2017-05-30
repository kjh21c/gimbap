
/*
 * Perf Cal page.
 */
//http
var request = require('request');
//xml
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var metar_data 
	,metar_temp
	,metar_alti
	,metar_wind
	,metar_windVel
	, pa, da
	,crossWind1
	,crossWind2
	,Perf152_data_TO_Gnd_Roll
	,Perf152_data_TO_50_Clr
	,Perf152_data_Land_Gnd_Roll
	,Perf152_data_Rate_Of_Climb;

exports.index = function(req, res){
	readData(function(){
	  res.render('wx_perf', { title: 'KHIO METAR & 152 Perf. Infomation'
		  					, pa : pa
		  					, da : da
		  					, metar : metar_data
		  					, surfaceWind : metar_windVel 
		  					, crossWind1 : crossWind1
		  					, crossWind2 : crossWind2
		  					,Perf152_data_TO_Gnd_Roll : Perf152_data_TO_Gnd_Roll  
		  					,Perf152_data_TO_50_Clr : Perf152_data_TO_50_Clr
		  					,Perf152_data_Land_Gnd_Roll :Perf152_data_Land_Gnd_Roll
		  					,Perf152_data_Rate_Of_Climb :Perf152_data_Rate_Of_Climb
		  					
		  						}  );
	});

};

var readData = function(callback) {
	//METAR 
	var url = { 
			url : 
				"http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KHIO&hoursBeforeNow=1"
			,json: false
		};
	
		request(url, function (err, res, html) {
			parser.parseString(html, function(err, result) {
				
				var alti = Number(result.response.data[0].METAR[0].altim_in_hg);
				var temper = Number(result.response.data[0].METAR[0].temp_c);
				var metar_raw_text = result.response.data[0].METAR[0].raw_text[0];		
				var wind = Number(result.response.data[0].METAR[0].wind_dir_degrees); // exception 처리
				var windVel = Number(result.response.data[0].METAR[0].wind_speed_kt);
							
				metar_data = metar_raw_text ;
				metar_temp = temper;
				metar_alti = alti ;
				metar_wind = wind;
				metar_windVel = windVel;
				
				//
				//삽입
				//
			
				// Calculation
				pa = ((29.92-metar_alti) * 1000 + 208); 
				da = pa+120*(metar_temp - 15);
				pa = pa.toFixed(1);
				da = da.toFixed(1);
			
				// this is for corss wind 
			//	var wind=  wind;
			//	var windValocity=  10;
				
				var rwyUse1 = 310; // or 13
				var rwyUse2 = 200 ;// or 2
				var rwyDiff1 = rwyUse1 - metar_wind ; 
				var rwyDiff2 = rwyUse2 - metar_wind ; 
			  	
				crossWind1 = Number(Math.abs(Math.sin(Math.PI/180*rwyDiff1)*metar_windVel)).toFixed(1);
				crossWind2 = Number(Math.abs(Math.sin(Math.PI/180*rwyDiff2)*metar_windVel)).toFixed(1);
					
			//		console.log('crossWind1:'+crossWind1);
			//		console.log('crossWind2:'+crossWind2);
				
				
				//
				//
				// Load the data
				// forcast function
				function Cur152TOGndRoll(cur_temp,cur_pressure){}
				function Cur152TO50Clr(cur_temp,cur_pressure){}
				function Cur152LandRoll(cur_temp,cur_pressure){}
				function Cur152RateOfClimb(cur_temp,cur_pressure){}
				
				
				//data		
				var takeoffGndRoll = [[640,695,755,810] // p. alti 0 temp 0~30
						,[705,765,825,890]				// p. alti 1000 temp 0~30
						,[775,840,910,980] ];			// p. alti 2000 temp 0~30
			
				var takeoff50ft = [
					[1190,	1290,	1390,	1495	]  // p. alti 0 temp 0~30
					,[1310,	1420,	1530,	1645]  // p. alti 1000 temp 0~30
					,[1445,	1565,	1690,	1820]];// p. alti 2000 temp 0~30
			
				var rateOfClimb = [
					 [835,	765	,700,	630] // p.alti 0 temp -20 to +40
					 ,[735,	670,600,	535] // p.alti 2000 temp -20 to +40
					 ];
			
				var landGndRoll = [
					[	450	,	465	,	485	,	500]
					,[	465	,	485	,	500	,	520]
					,[	485	,	500	,	520	,	535]
				       ];
			
				// for cal unit 게산용 unit
				var tempDegreeby10 = [0,10,20,30];
				var tempDegreeby20 = [-20,0,20,40];
				var pressureDegree = [0,1000,2000];
				var pressureDegreeBy2000 = [0,2000];
				
				//
				// 데이터 저장
				Perf152_data_TO_Gnd_Roll = Cur152TOGndRoll(metar_temp,pa).toFixed(1);
				Perf152_data_TO_50_Clr = Cur152TO50Clr(metar_temp,pa).toFixed(1);
				Perf152_data_Land_Gnd_Roll = Cur152LandRoll(metar_temp,pa).toFixed(1);
				Perf152_data_Rate_Of_Climb = Cur152RateOfClimb(metar_temp,pa).toFixed(1);
				
				//callback();
			
				//Time Series Cal	
				function Forecast(x, kx, ky){
				   var i=0, nr=0, dr=0,ax=0,ay=0,a=0,b=0;
				   function average(ar) {
				          var r=0;
				      for (i=0;i<ar.length;i++){
				         r = r+ar[i];
				      }
				      return r/ar.length;
				   }
				   ax=average(kx);
				   ay=average(ky);
				   for (i=0;i<kx.length;i++){
				      nr = nr + ((kx[i]-ax) * (ky[i]-ay));
				      dr = dr + ((kx[i]-ax)*(kx[i]-ax))
				   }
				  b=nr/dr;
				  a=ay-b*ax;
				  return (a+b*x);
				}
			
			
				// 가로축 세로축 모두 계산을 해야 하기떄문에 이렇게 함. 현재 온도를 넣고 , 프레셔 0,1000,2000,3000단위로 모두 구함 
			
				function Cur152TOGndRoll(cur_temp,cur_pressure){
					//T.O Gnd Roll
					var ToGndRollForecast = 
							[
						     Forecast(cur_temp, tempDegreeby10 ,takeoffGndRoll[0]) // 0 alt. pressure 0 일때
						     , Forecast(cur_temp, tempDegreeby10 ,takeoffGndRoll[1]) // 0 alt. pressure 1000 일때
						     , Forecast(cur_temp, tempDegreeby10 ,takeoffGndRoll[2]) // 0 alt. pressure 2000 일때
						     ];
			
					var curToGndRoll =
							Forecast(cur_pressure, pressureDegree, ToGndRollForecast  );
			
					return curToGndRoll ;
				}
			
				function Cur152TO50Clr(cur_temp,cur_pressure){ 
					//T.O 50ft 
					var To50ftForecast =
							[  Forecast(cur_temp, tempDegreeby10 ,takeoff50ft[0]) // 0 alt. pressure 0 일때
						    , Forecast(cur_temp, tempDegreeby10 ,takeoff50ft[1]) // 0 alt. pressure 1000 일때
						    , Forecast(cur_temp, tempDegreeby10 ,takeoff50ft[2]) // 0 alt. pressure 2000 일때
						    ];
			
					var curTo50ft =
							Forecast(cur_pressure, pressureDegree, To50ftForecast  );
			
					return curTo50ft ;
				}
			
				//Land Roll
				function Cur152LandRoll(cur_temp,cur_pressure){ 
					//Land Roll
					var LandGndRollForecast =
							[  Forecast(cur_temp, tempDegreeby10 ,landGndRoll[0]) // 0 alt. pressure 0 일때
					         , Forecast(cur_temp, tempDegreeby10 ,landGndRoll[1]) // 0 alt. pressure 1000 일때
					         , Forecast(cur_temp, tempDegreeby10 ,landGndRoll[2]) // 0 alt. pressure 2000 일때
					     	];
			
					var curLandGndRoll =
							Forecast(cur_pressure, pressureDegree, LandGndRollForecast  );
					return curLandGndRoll;
					
				}
			
				//Climb Perf
				function Cur152RateOfClimb(cur_temp,cur_pressure){ 
					//Climb Perf
					var rateOfClimbForecast =
							[  Forecast(cur_temp, tempDegreeby20 ,rateOfClimb[0]) // 0 alt. pressure 0 일때
					         , Forecast(cur_temp, tempDegreeby20 ,rateOfClimb[1]) // 0 alt. pressure 2000 일때
					     	];
			
					var curRateOfClimb =
							Forecast(cur_pressure, pressureDegreeBy2000, rateOfClimbForecast  );
					
					return curRateOfClimb;
					
				}
				
				
				
				
				
				
				
				
				
				
				
				//
				//
				//종료
				
				callback();
			});
			
		});
		

}
		


