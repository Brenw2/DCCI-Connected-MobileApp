window.onload = function() {
	var guid = getParameterByName("guid");
	var newCommentButtonArea = document.getElementById('newCommentButtonArea');
	newCommentButtonArea.innerHTML = "<a href='newComment.html?guid=" + guid + "' class='button big special'>New Comment</a>";
	DCC.GET.PrayerRequest(handlePrayerJSON, guid);
	DCC.GET.PrayerRequestComment(handleCommentJSON, guid);
};

function handlePrayerJSON(json) {
	var prayerContent = document.getElementById('prayerContent');
	prayerContent.innerHTML = "";
	prayerContent.innerHTML = DCC.PrayerHTMLFromTemplate(DCC.TEMPLATE.Prayer(), json);
}

function handleCommentJSON(json) {
	console.log(json);
	var commentContent = document.getElementById('commentContent');
	var commentlist = json.value;
	commentContent.innerHTML = "";
	var html = "";
	for (var i = 0; i < commentlist.length; i++) {
		console.log(commentlist[i]);
		html += DCC.CommentHTMLFromTemplate(DCC.TEMPLATE.Comment(), commentlist[i]);
	}
	if (html == "") {
		html = "<div class='prayer'>NO COMMENTS</div>";
	}
	commentContent.innerHTML = html;
}