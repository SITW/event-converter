var fs = require('fs');

var pyear = process.argv[2];
var process_count = 0;
var m = [];
for (var i = 12; i >= 1; i--) {
	m[i] = [];
}


var readYearData = fs.readFile('./data/' + pyear + '/' + pyear + '.json', function(err, data) {
	if (err) {
		console.log(err);
	}else {
		var data_json = JSON.parse(data);
		var data_length = data_json.length;

		for(var j = data_length - 1; j >=0; j--) {
			_loopAct(data_json[j])
		}
		

		for (var i = 12; i >= 1; i--) {
			_insert_arr(m[i], pyear, i)
		}
		
		function _loopAct (data) {
			var club_act = data["活動時間"];
			var act_month = club_act.substr(4, 2);
			var convert_data = _convert_data(data)
			if(convert_data) {
				m[parseInt(act_month, 10)].push(convert_data);
			}
			process_count++;
		}

		function _convert_data (data) {
			var new_data = {};
			var start_date = data["活動時間"].substr(0, 14);
			var end_date = data["活動時間"].substr(-18, 14);

			var start_year = start_date.substr(0, 4);
			var start_month = start_date.substr(4, 2);
			var start_day = start_date.substr(6, 2);
			var start_hour = start_date.substr(9, 2);
			var start_min = start_date.substr(12, 2);

			var end_year = end_date.substr(0, 4);
			var end_month = end_date.substr(4, 2);
			var end_day = end_date.substr(6, 2);
			var end_hour = end_date.substr(9, 2);
			var end_min = end_date.substr(12, 2);

			var title_str = '<div class="act_name">' + data["活動名稱"] + '</div><div class="act_type">' + data["活動性質"] + '</div><div class="act_join">' + data["參加人數"] + '</div><div class="act_name">' + data["申請人姓名"] + '</div><div class="act_site">' + data["活動場地"] + '</div>' 

			new_data.id = data["活動編號"];
			new_st_obj = new Date(start_year, start_month, start_day, start_hour, start_min);	

			if(new_st_obj == "Invalid Date") {
				return false;
			}else {
				new_st_iso = new_st_obj.toISOString();
			}


			new_end_obj = new Date(end_year, end_month, end_day, end_hour, end_min);
			if(new_end_obj == "Invalid Date") {
				return false;
			}else {
				new_end_iso = new_end_obj.toISOString();
			}

			new_data.start = new_st_iso;
			new_data.end = new_end_iso;
			new_data.title = title_str;

			return new_data;
			
		}

		function _insert_arr (arr, year, month) {
			console.log(process_count);
			var act_str = JSON.stringify(arr);
			fs.writeFile('./convert-data/' + year + '/' + year + '-' + month + '.json', act_str)
		}
	}
})