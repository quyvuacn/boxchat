var socket = io.connect(window.location.href)
socket.on("connect", function (data) {
	var name = prompt("Hay nhap ten hien thi") || "Guest"
	socket.emit("join", name)

	$("form").submit(function () {
		var message = $("#message").val()
		socket.emit("messages", {
			name: name,
			message: message,
		})
		this.reset()
		return false
	})
})

//listen thread event
socket.on("thread", function (data) {
	$("#thread").append(
		'<li class="li">' + data.name + ": " + data.message + "</li>",
	)
})
