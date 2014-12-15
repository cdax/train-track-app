var
	moment = require('moment');

var types = module.exports = {

	//Station Code
	//Alphanumeric, 1-4 characters
	stationCode: {
		isValid: function(val) {
			return /^[0-9A-Z]{1,4}$/.test(val);
		}
	},

	//Date
	//D-MMM-YYYY
	date: {
		isValid: function(val) {
			return moment(val, 'D-MMM-YYYY').isValid() || moment(val, 'DD-MMM-YYYY').isValid();
		}
	},

	//Train Number
	//5 digits
	trainNumber: {
		isValid: function(val) {
			return /^[0-9]{5}$/.test(val);
		}
	},

	//PNR Number
	//10 digits
	pnr: {
		isValid: function(val) {
			return /^[0-9]{10}$/.test(val);
		}
	},

	//Date Code
	//{TD, YS, TM}
	dateCode: {
		isValid: function(val) {
			return /^(TD|YS|TM)$/.test(val);
		}
	},

	//Class 
	//{1A, 2A, 3A, CC, FC, SL, 2S, 3E, GN}
	class: {
		isValid: function(val) {
			return /^(1A|2A|3A|CC|FC|SL|2S|3E|GN)$/.test(val);
		}
	},

	//Quota
	//{CK, LD, DF, FT, DP, HP, PH, SS, YU, GN}
	quota: {
		isValid: function(val) {
			return /^(CK|LD|DF|FT|DP|HP|PH|SS|YU|GN)$/.test(val);
		}
	},

	//Age
	//Positive integer less than 150
	age: {
		isValid: function(val) {
			var age = parseInt(val, 10);
			return /^[1-9][0-9]{0,2}$/.test(val) && age > 0 && age <= 150;
		}
	},

	//Hour
	//Positive integer less than or equal to 24
	hour: {
		isValid: function(val) {
			var hour = parseInt(val, 10);
			return /^[1-9][0-9]{0,1}$/.test(val) && hour > 0 && hour <= 24;
		}
	}
};