'use babel';
const fs = require('fs');
const path = require('path');
const cache = {};

function getHolidays() {
	if (!cache['holidays']) {
		let strFile = fs.readFileSync(path.join(__dirname, "holidays.txt"), "utf-8");
		//console.log("file: " + strFile);
		let holidayInfo = {};
		holidayInfo['AnnualHolidays'] = new Array();
		let holidayInfoYear = {};
		let strYears = strFile.split("\n");
		//console.log("years: " + strYears);
		//console.log("typeof strYears: " + typeof(strYears[0]));
		for (var i = 0; i < strYears.length; i++) {
			if (!strYears[i]) continue;
			let yearInfo = strYears[i].split("|");
			//console.log("yearInfo: " + yearInfo);
			holidayInfo['AnnualHolidays'].push({'Year':yearInfo[0],'Restdays':yearInfo[1].split(","),'Workdays':yearInfo[2].split(",")});
		}
		cache['holidays'] = holidayInfo;
	}
	console.log("cache['holidays'] = " + JSON.stringify(cache['holidays']));
	return JSON.stringify(cache['holidays'], null, "    ");
}

exports.getHolidays = getHolidays;
