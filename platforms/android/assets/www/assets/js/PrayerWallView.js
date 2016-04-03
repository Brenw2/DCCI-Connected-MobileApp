function populateWallFromJSON(json) {
	var wall = document.getElementById('wall');
	var prayerlist = json.value;
	wall.innerHTML = "";
	var html = "";
	for (var i = 0; i < prayerlist.length; i++) {
		html += DCC.PrayerHTMLFromTemplate(DCC.TEMPLATE.PrayerWall(), prayerlist[i]) + "<br />";
	}
	wall.innerHTML = html;
}

window.onload = function() {
	DCC.GET.PrayerRequest(populateWallFromJSON);
};
