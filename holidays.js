var fs = require('fs');
var path = require('path');
var cache = {};

function getHolidays() {
	if (!cache['holidays']) {
		var strFile = fs.readFileSync("./holidays.txt", 'rs');
		var holidayInfo['AnnualHolidays'] = new Array();
		var strYears = strFile.split("\n");
		for (var i = 0; i < strYears.length; i++) {
			var yearInfo = strYears[i].split("|");
			holidayInfo['AnnualHolidays'].push({'Year':yearInfo[0], 'Restdays':yearInfo[1].split(","), 'Workdays':yearInfo[2].split(",")});
		}
		cache['holidays'] = JSON.stringify(holidayInfo, "    ");
	}
	console.log("cache['holidays'] = " + cache['holidays']);
	return cache['holidays'];
}

exports.getHolidays = getHolidays;