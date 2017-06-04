/*
 * Perf Cal page.
 */
//timer
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.second = [ 0, 10, 20, 30, 40, 50, 5, 15, 25, 35, 45, 55 ];
; // 매 시간 30분 마다 수행


//http
var request = require('request');
// xml
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var metar_data, metar_temp, metar_alti, metar_wind, metar_windVel, pa, da, crossWind1, crossWind2, Perf152_data_TO_Gnd_Roll, Perf152_data_TO_50_Clr, Perf152_data_Land_Gnd_Roll, Perf152_data_Rate_Of_Climb, Perf172_data_TO_Gnd_Roll, Perf172_data_TO_50_Clr, Perf172_data_Land_Gnd_Roll, Perf172_data_Rate_Of_Climb;

// 페이지 콜 부분
exports.index = function(req, res) {
	readData(function() {
		res.render('wx_perf', {
			title : 'KHIO METAR & 152 Perf. Infomation',
			pa : pa,
			da : da,
			metar : metar_data,
			surfaceWind : metar_windVel,
			crossWind1 : crossWind1,
			crossWind2 : crossWind2,
			Perf152_data_TO_Gnd_Roll : Perf152_data_TO_Gnd_Roll,
			Perf152_data_TO_50_Clr : Perf152_data_TO_50_Clr,
			Perf152_data_Land_Gnd_Roll : Perf152_data_Land_Gnd_Roll,
			Perf152_data_Rate_Of_Climb : Perf152_data_Rate_Of_Climb,
			Perf172_data_TO_Gnd_Roll : Perf172_data_TO_Gnd_Roll,
			Perf172_data_TO_50_Clr : Perf172_data_TO_50_Clr,
			Perf172_data_Land_Gnd_Roll : Perf172_data_Land_Gnd_Roll,
			Perf172_data_Rate_Of_Climb : Perf172_data_Rate_Of_Climb

		});
	});

};


var j = schedule.scheduleJob(rule, function() {
	//console.log('...');
	// METAR
	var url = {
		url : "http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KHIO&hoursBeforeNow=2",
		json : false
	};

	request(
			url,
			function(err, res, html) {
				parser
						.parseString(
								html,
								function(err, result) {

									var alti = Number(result.response.data[0].METAR[0].altim_in_hg);
									var temper = Number(result.response.data[0].METAR[0].temp_c);
									var metar_raw_text = result.response.data[0].METAR[0].raw_text[0];
									var wind = Number(result.response.data[0].METAR[0].wind_dir_degrees); // exception
									// 처리
									var windVel = Number(result.response.data[0].METAR[0].wind_speed_kt);

									metar_data = metar_raw_text;
									metar_temp = temper;
									metar_alti = alti;
									metar_wind = wind;
									metar_windVel = windVel;
								})
			})

});
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
			.toFixed(1);
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
