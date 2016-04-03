const GUID = "@guid";
const PRECANT = "@precant";
const TIMEAGO = "@timeago";
const PRAYER = "@prayer";
const PRAYER_TEMPLATE = //
"   <div class='prayer'>" + //
"	    <span style='font-weight: bold;'>" + PRECANT + "</span>" + //
"	    &nbsp;-&nbsp;" + //
"		<span style='font-style: italic;'>" + TIMEAGO + "</span>" + //
"		<br/>" + //
"		<div style='background: rgba(144, 144, 144, 0.075); padding: 3px;'>" + //
"			" + PRAYER + //
"		</div>" + //
"   </div>";
const PRAYER_WALL_TEMPLATE = "<a href='prayerView.html?guid" + GUID + ">" + PRAYER_TEMPLATE + "</a>";

const HTTP = "https://";
const HOST = "dccmuncieprayerwallapi.azurewebsites.net";
const HTTP_HOST = HTTP + HOST;
const GUID_PARAMS = "(guid'" + GUID + "')";
const PRAYER_REQUEST = HTTP_HOST + "/api/PrayerRequest";
const PRAYER_REQUEST_GUID = PRAYER_REQUEST + GUID_PARAMS;
const PRAYER_COMMENT_REQUEST = HTTP_HOST + "/api/PrayerRequestComment";
const PRAYER_COMMENT_REQUEST_GUID = PRAYER_COMMENT_REQUEST + GUID_PARAMS;

window.onload = function() {
	var page = getPage();
	if (page == "prayerWallView.html") {
		runPrayerWallRequest();
	} else if (page == "prayerView.html") {
		runPrayerViewRequest();
	}
};

function getPage() {
	var path = window.location.pathname;
	return path.substring(path.lastIndexOf('/') + 1);
}

function getPrayerCommentRequestUrl(guid) {
	if (!guid) {
		return PRAYER_COMMENT_REQUEST + "/";
	} else {
		return PRAYER_COMMENT_REQUEST_GUID.replace(GUID, guid);
	}
}

function getPrayerRequestUrl(guid) {
	if (!guid) {
		return PRAYER_REQUEST + "/";
	} else {
		return PRAYER_REQUEST_GUID.replace(GUID, guid);
	}
}

function runPrayerWallRequest() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var json = JSON.parse(request.responseText);
			populateWallFromJSON(json);
		}
	};
	request.open("GET", getPrayerRequestUrl(false), true);
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

function getHtml(prayer) {
	return getHtml(PRAYER_WALL_TEMPLATE, prayer);
}

function getHtmlFromTemplate(template, prayer) {
	return template//
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
	request.open("POST", PRAYER_REQUEST);
	request.setRequestHeader("Host", HOST);
	request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Content-length", params.length);
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			window.location.href = "prayerWallView.html";
		}
	};
	request.send(params);
}

function runPrayerViewRequest() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var json = JSON.parse(request.responseText);
			var wall = document.getElementById('wall');
			wall.innerHtml = "<pre>" + JSON.stringify(json) + "</pre>";
		}
	};
	request.open("GET", getPrayerCommentRequestUrl(getParameterByName("guid", false)), true);
	request.send();
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