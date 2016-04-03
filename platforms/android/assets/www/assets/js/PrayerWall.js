function gotoPrayerWallView() {
	window.location.href = "prayerWallView.html";
}

function postNewPrayerRequest() {
	var name = document.getElementById('nameInput').value;
	var timestamp = (new Date()).toISOString();
	var message = document.getElementById('messageTextArea').value;
	DCC.POST.PrayerRequest(gotoPrayerWallView, name, timestamp, message);
}

