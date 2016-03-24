window.onload = function() {
	setupRequest();
};

function setupRequest() {
	var request = new XMLHttpRequest();
	var url = "http://prayerwall-test.azurewebsites.net/api/PrayerRequest/";

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

