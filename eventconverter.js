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

			var title_str = data["活動名稱"] + '(' + data["活動性質"] + ')'
			var other_obj = {};
			other_obj.population = data["參加人數"];
			other_obj.name = data["申請人姓名"];
			other_obj.site = data["活動場地"];

			new_data.id = data["活動編號"];
			new_st_obj = new Date(start_year, start_month - 1, start_day, start_hour, start_min);	

			if(new_st_obj == "Invalid Date") {
				return false;
			}

			new_end_obj = new Date(end_year, end_month - 1, end_day, end_hour, end_min);
			if(new_end_obj == "Invalid Date") {
				return false;
			}
			new_data.start = "new Date(" + start_year + ", " + (parseInt(start_month, 10) - 1) + ", " + start_day + ", " + start_hour + ", " + start_min + ")";
			new_data.end = "new Date(" + end_year + ", " + (parseInt(end_month, 10) - 1) + ", " + end_day + ", " + end_hour + ", " + end_min + ")";
			new_data.title = title_str;
			new_data.other = other_obj;

			return new_data;
			
		}

		function _insert_arr (arr, year, month) {
			console.log(process_count);
			var act_str = JSON.stringify(arr);
			fs.writeFile('./convert-data/' + year + '/' + year + '-' + month + '.json', act_str)
		}
	}
})