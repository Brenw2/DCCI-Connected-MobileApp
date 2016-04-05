const HTTP = "https://";
const HOST = "dccmuncieprayerwallapi.azurewebsites.net";
const PRAYER_REQUEST = HTTP + HOST + "/api/PrayerRequest";
const PRAYER_COMMENT_REQUEST = HTTP + HOST + "/api/PrayerRequestComment";

function genericGet(callback, url) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			callback(JSON.parse(request.responseText));
		}
	};
	request.open("GET", url, true);
	request.send();
}

const DCC = {

	"GUID" : "@guid",
	"ALT_GUID" : "@altguid",
	"PRECANT" : "@precant",
	"TIMEAGO" : "@timeago",
	"PRAYER" : "@prayer",
	"COMMENT" : "@comment",

	"PrayerHTMLFromTemplate" : function(template, prayer) {
		return template//
		.replace(DCC.GUID, prayer.Id)//
		.replace(DCC.PRECANT, prayer.PrayerRequesterName)//
		.replace(DCC.TIMEAGO, prayer.TimeStamp)//
		.replace(DCC.PRAYER, prayer.PrayerRequestMessage);
	},

	"CommentHTMLFromTemplate" : function(template, comment) {
		return template//
		.replace(DCC.GUID, comment.Id)//
		.replace(DCC.PRECANT, comment.Name)//
		.replace(DCC.ALT_GUID, comment.PrayerRequestId)//
		.replace(DCC.TIMEAGO, comment.TimeStamp)//
		.replace(DCC.COMMENT, comment.Comment);
	},

	"TEMPLATE" : {
		"Prayer" : function() {
			return "   <div class='prayer'>" + //
			"	    <span class='prayerPrecant'>" + DCC.PRECANT + "</span>" + //
			"	    &nbsp;-&nbsp;" + //
			"		<span class='prayerTimestamp'>" + DCC.TIMEAGO + "</span>" + //
			"		<br/>" + //
			"		<div class='prayerMessage'>" + //
			"			" + DCC.PRAYER + //
			"		</div>" + //
			"   </div>";
		},

		"PrayerWall" : function() {
			return "<a href='prayerView.html?guid=" + DCC.GUID + "'>" + DCC.TEMPLATE.Prayer() + "</a>";
		},

		"Comment" : function() {
			return DCC.TEMPLATE.Prayer().replace(DCC.PRAYER, DCC.COMMENT);
		}
	},

	"GET" : {

		"PrayerRequest" : function(callback, guid) {
			genericGet(callback, getUrl(PRAYER_REQUEST, guid));
		},

		"PrayerRequestComment" : function(callback, guid) {
			genericGet(callback, getUrl(PRAYER_COMMENT_REQUEST, guid));
		}
	},

	"POST" : {

		"PrayerRequest" : function(callback, name, timestamp, message) {
			var request = new XMLHttpRequest();
			var params = JSON.stringify({
				"PrayerRequesterName" : name,
				"TimeStamp" : timestamp,
				"PrayerRequestMessage" : message
			});
			request.open("POST", getUrl(PRAYER_REQUEST));
			request.setRequestHeader("Host", HOST);
			request.setRequestHeader("Content-type", "application/json");
			request.setRequestHeader("Content-length", params.length);
			request.onreadystatechange = function() {
				if (request.readyState == 4) {
					callback();
				}
			};
			request.send(params);
		},

		"PrayerRequestComment" : function(callback, guid, name, timestamp, message) {
			var request = new XMLHttpRequest();
			var params = JSON.stringify({
				"PrayerRequestId" : guid,
				"Name" : name,
				"TimeStamp" : timestamp,
				"Comment" : message
			});
			request.open("POST", getUrl(PRAYER_COMMENT_REQUEST));
			request.setRequestHeader("Host", HOST);
			request.setRequestHeader("Content-type", "application/json");
			request.setRequestHeader("Content-length", params.length);
			request.onreadystatechange = function() {
				if (request.readyState == 4) {
					callback();
				}
			};
			request.send(params);
		}
	}

};

const GUID_PARAMS = "(guid'" + DCC.GUID + "')";
function getUrl(preUrl, guid) {
	if (!guid) {
		return preUrl + "/";
	} else {
		return preUrl + GUID_PARAMS.replace(DCC.GUID, guid);
	}
}

function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
	    results = regex.exec(url);
	if (!results) {
		return null;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
