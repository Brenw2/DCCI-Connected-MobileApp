window.onload = function() {
	if (getPage() == "prayerWallView.html") {
		setupGetRequest();
	}
};

function getPage() {
	var path = window.location.pathname;
	return path.substring(path.lastIndexOf('/') + 1);
}

var host = "dccmuncieprayerwallapi.azurewebsites.net";
var url = "https://" + host + "/api/PrayerRequest/";

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

const GUID = "@guid";
const PRECANT = "@precant";
const TIMEAGO = "@timeago";
const PRAYER = "@prayer";
const PRAYER_TEMPLATE = //
"<a href='prayerView.html?guid=" + GUID + "'>" + //
"   <div class='prayer'>" + //
"	    <span style='font-weight: bold;'>" + PRECANT + "</span>" + //
"	    &nbsp;-&nbsp;" + //
"		<span style='font-style: italic;'>" + TIMEAGO + "</span>" + //
"		<br/>" + //
"		<div style='background: rgba(144, 144, 144, 0.075); padding: 3px;'>" + //
"			" + PRAYER + //
"		</div>" + //
"   </div>" + //
"</a";

function getHtml(prayer) {
	return PRAYER_TEMPLATE//
	.replace(GUID, prayer.Id)//
	.replace(PRECANT, prayer.PrayerRequesterName)//
	.replace(TIMEAGO, prayer.TimeStamp)//
	.replace(PRAYER, prayer.PrayerRequestMessage);
}

function setupPostRequest() {
	var request = new XMLHttpRequest();
	var name = document.getElementById('nameInput').value;
	var timestamp = (new Date()).toISOString();
	var message = document.getElementById('messageTextArea').value;
	var params = JSON.stringify({
		"PrayerRequesterName" : name,
		"TimeStamp" : timestamp,
		"PrayerRequestMessage" : message
	});
	console.log(params);
	request.open("POST", url);
	request.setRequestHeader("Host", host);
	request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Content-length", params.length);
	request.onreadystatechange = function() {
		console.log(request.readyState + ": " + request.responseText);
		if (request.readyState == 4) {
			window.location.href = "prayerWallView.html";
		}
	};
	request.send(params);
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