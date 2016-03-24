window.onload = function() {
	if (getPage() == "prayerWallView.html") {
		setupGetRequest();
	}
};

function getPage() {
	var path = window.location.pathname;
	return path.substring(path.lastIndexOf('/') + 1);
}

var url = "http://prayerwall-test.azurewebsites.net/api/PrayerRequest/";

function setupGetRequest() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var json = JSON.parse(request.responseText);
			populateWallFromJSON(json);
		}
	};
	request.open("GET", url, true);
	request.send();
}

function populateWallFromJSON(json) {
	var wall = document.getElementById('wall');
	var prayerlist = json.value;
	wall.innerHTML = "";
	var html = "";
	for (var i = 0; i < prayerlist.length; i++) {
		html += getHtml(prayerlist[i]) + "<br />";
	}
	wall.innerHTML = html;
}

const PRECANT = "@precant";
const TIMEAGO = "@timeago";
const PRAYER = "@prayer";
const PRAYER_TEMPLATE = //
"<div>" + //
"	<span style='font-weight: bold;'>" + PRECANT + "</span>" + //
"	&nbsp;-&nbsp;" + //
"	<span style='font-style: italic;'>" + TIMEAGO + "</span>" + //
"	<br/>" + //
"	<div style='background: rgba(144, 144, 144, 0.075); padding: 3px;'>" + //
"		" + PRAYER + //
"	</div>" + //
"</div>";

function getHtml(prayer) {
	return PRAYER_TEMPLATE//
	.replace(PRECANT, prayer.PrayerRequesterName)//
	.replace(TIMEAGO, prayer.TimeStamp)//
	.replace(PRAYER, prayer.PrayerRequestMessage);
}

function setupPostRequest() {
	var http = new XMLHttpRequest();
	var name = document.getElementById('nameInput').value;
	var timestamp = (new Date()).toISOString();
	var message = document.getElementById('messageTextArea').value;
	var params = JSON.stringify({
		"PrayerRequesterName" : name,
		"TimeStamp" : timestamp,
		"PrayerRequestMessage" : message
	});
	console.log(params);
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("Content-length", params.length);
	// http.setRequestHeader("Connection", "close");
	http.onreadystatechange = function() {
		console.log(http.readyState + ": " + http.responseText);
	};
	http.send(params);
}

/*
 POST http://localhost:55558/api/PrayerRequest/ HTTP/1.1
 User-Agent: Fiddler
 Host: localhost:55558
 Content-type: application/json
 Content-Length: 117

 {
 "PrayerRequesterName":"Tristan",
 "TimeStamp":"2009-04-12T20:44:55",
 "PrayerRequestMessage":"Ryan is the best"
 }
 HTTP/1.1 201 Created
 Cache-Control: no-cache
 Pragma: no-cache
 Content-Type: application/json; charset=utf-8
 Expires: -1
 Location: http://localhost:55558/api/PrayerRequest(guid'd96e2c98-f348-427c-9417-b5c5dcd1a205')
 Server: Microsoft-IIS/10.0
 DataServiceVersion: 3.0
 X-AspNet-Version: 4.0.30319
 X-SourceFiles: =?UTF-8?B?QzpcVXNlcnNcdHJpc3RfMDAwXE9uZURyaXZlXFNvZnR3YXJlRGV2ZWxvcG1lbnRcVmlzdWFsU3R1ZGlvMjAxNVxQcm9qZWN0c1xQcmF5ZXJXYWxsXFByYXllcldhbGwuV2ViQXBpXGFwaVxQcmF5ZXJSZXF1ZXN0XA==?=
 X-Powered-By: ASP.NET
 Date: Wed, 09 Mar 2016 03:48:11 GMT
 Content-Length: 238

 {
 "odata.metadata":"http://localhost:55558/api/$metadata#PrayerRequest/@Element","Id":"d96e2c98-f348-427c-9417-b5c5dcd1a205","PrayerRequesterName":"Tristan","TimeStamp":"2009-04-12T20:44:55","PrayerRequestMessage":"Ryan is the best"
 }
 */
