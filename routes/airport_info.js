//http
var request = require('request');
//xml
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
//scheduling
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.miniute = 5;
// 5분시행

exports.index = function(req, res){
	res.render('lnd_airports', { title: 'Hillsboro Weather Information' ,
		hio_elev : '208',
		eug_elev : metarContaioner.KEUG.elevation_ft,
		s39_elev : metarContaioner.KS39.elevation_ft,
		dls_elev : metarContaioner.KDLS.elevation_ft,
		cvo_elev : metarContaioner.KCVO.elevation_ft,
		
		hio_dens_alt  : Number(metarContaioner.KHIO.da).toFixed(1),
		eug_dens_alt  : Number(metarContaioner.KEUG.da).toFixed(1),
		s39_dens_alt  : Number(metarContaioner.KS39.da).toFixed(1),
		dls_dens_alt  : Number(metarContaioner.KDLS.da).toFixed(1),
		cvo_dens_alt  : Number(metarContaioner.KCVO.da).toFixed(1),
		
		hio_rwy_info : metarContaioner.KHIO.rwy_info,
		eug_rwy_info : metarContaioner.KEUG.rwy_info,
		s39_rwy_info : metarContaioner.KS39.rwy_info,
		dls_rwy_info : metarContaioner.KDLS.rwy_info,
		cvo_rwy_info : metarContaioner.KCVO.rwy_info,
		
		hio_pa_text : metarContaioner.KHIO.pa_text,
		eug_pa_text : metarContaioner.KEUG.pa_text,
		s39_pa_text : metarContaioner.KS39.pa_text,
		dls_pa_text : metarContaioner.KDLS.pa_text,
		cvo_pa_text : metarContaioner.KCVO.pa_text,
		
		hio_da_text : metarContaioner.KHIO.da_text,
		eug_da_text : metarContaioner.KEUG.da_text,
		s39_da_text : metarContaioner.KS39.da_text,
		dls_da_text : metarContaioner.KDLS.da_text,
		cvo_da_text : metarContaioner.KCVO.da_text,
		
		
	
	});
};


var rwyInfo = {
		'KS39':'5751/4504',
		'KHIO':'6600/3821/3600',
		'KDLS':'5097/4697',
		'KEUG':'8009/6000',
		'KOLM':'5500/4197',
		'KCVO':'5900/3545'
};

var stationName = ['KHIO', 'KEUG', 'KOLM'//,'KCVO'
                   ,'KDLS','KS39'];
var metarContaioner = []; 

//initiate for cvo only
metarContaioner["KCVO"] = {'elevation_ft':''
							,'da':''
							,'rwy_info':''
							,'da_text':''
							,'pa_text':''
							
}; 



//scheduling 시작
var j = schedule.scheduleJob(
		rule, 
		function() {

stationName.forEach(function(elt, i) {
	var urlText = "http://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=" +
			elt +
			"&hoursBeforeNow=4";
	var url = { url : urlText };
	
	request(url,function(err, res, xml){
		parser.parseString(xml, function(err, result) {
			//metarInfo["error"] = true;
			if(!err){
				//if(result.response.data.legth>=0) 
				{
					var std_id = result.response.data[0].METAR[0].station_id;
					var metarInfo = {'pa':Number, 'da': Number};
					metarInfo["station_id"] =   		result.response.data[0].METAR[0].station_id;
					metarInfo["error"] = false;
					metarInfo["raw_text"]  =   			result.response.data[0].METAR[0].raw_text;
					metarInfo["station_id"]  =   		result.response.data[0].METAR[0].station_id;
					metarInfo["observation_time"]  =  	result.response.data[0].METAR[0].observation_time;
					metarInfo["latitude"]  =  			 result.response.data[0].METAR[0].latitude;
					metarInfo["longitude"]  =  			 result.response.data[0].METAR[0].longitude;
					metarInfo["temp_c"]  = 				 result.response.data[0].METAR[0].temp_c		;	
					metarInfo["dewpoint_c"]  = 			 result.response.data[0].METAR[0].dewpoint_c;
					metarInfo["wind_dir_degrees"]  =  	 result.response.data[0].METAR[0].wind_dir_degrees;
					metarInfo["wind_speed_kt"]  =  	 	result.response.data[0].METAR[0].wind_speed_kt;
					metarInfo["wind_gust_kt"]  =  		 result.response.data[0].METAR[0].wind_gust_kt;
					metarInfo["visibility_statute_mi"]  = result.response.data[0].METAR[0].visibility_statute_mi  ;
					metarInfo["altim_in_hg"] =  		 Number(result.response.data[0].METAR[0].altim_in_hg).toFixed(2);
					metarInfo["sea_level_pressure_mb"]  =   result.response.data[0].METAR[0].sea_level_pressure_mb;
					metarInfo["quality_control_flags"]  =   result.response.data[0].METAR[0].quality_control_flags;	
					metarInfo["sky_cover"]  			=   result.response.data[0].METAR[0].sky_cover;  // array	
					metarInfo["flight_category"]  		=   result.response.data[0].METAR[0].flight_category;	
					metarInfo["metar_type"] 			 =   result.response.data[0].METAR[0].metar_type;	
					metarInfo["elevation_m"] 			 =   result.response.data[0].METAR[0].elevation_m;	
					
					metarInfo["elevation_ft"] 			 =   Number((metarInfo.elevation_m)* 3.28).toFixed(0) ;	
					metarInfo["pa"] 					= Number(((29.92 - metarInfo.altim_in_hg) * 1000 + metarInfo.elevation_m*3.28)).toFixed(1);
					metarInfo["da"] 					= Number(metarInfo.pa) + 120 * (metarInfo.temp_c - 15);
					
					metarInfo["pa_text"] 					= "((29.92 - " + metarInfo.altim_in_hg+ " ) * 1000 + "+ Number(metarInfo.elevation_m*3.28).toFixed(0) + ")";
					metarInfo["da_text"] 					= metarInfo.pa + " + 120 * ("+ metarInfo.temp_c + "- 15)";
					metarInfo["rwy_info"]				= 	rwyInfo[std_id];			
					metarContaioner[std_id] = metarInfo;
				}
				
				//console.log(metarContaioner.KHIO);
			} 
		});
	} );
	
});



			
			
		});
		
		
		
		





