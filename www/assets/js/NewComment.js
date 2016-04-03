function gotoPrayerView() {
	var guid = getParameterByName("guid");
	window.location.href = "prayerView.html?guid=" + guid;
}

function postNewComment() {
	var guid = getParameterByName("guid");
	var name = document.getElementById('nameInput').value;
	var timestamp = (new Date()).toISOString();
	var message = document.getElementById('messageTextArea').value;
	DCC.POST.PrayerRequestComment(gotoPrayerView, guid, name, timestamp, message);
}

