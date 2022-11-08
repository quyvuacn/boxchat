var socket = io.connect(window.location.href)

socket.on("connect", function (data) {
	var name = prompt("Mời bạn nhập tên hiển thị") || "Guest"
	socket.emit("join", name)
	userID = socket.id

	$("form").submit(function () {
		var message = $("#message").val()
		socket.emit("messages", {
			id: userID,
			name: name,
			message: message,
			path,
		})
		this.reset()
		return false
	})
})

//listen thread event
socket.on("thread", function (data) {
	if (data.id == sessionStorage.getItem("userID")) {
		$("#thread").append(`
        <li class="myseft">
            <span>${data.message}</span>
        </li>
        `)
	} else {
		$("#thread").append(`
            <li>
                <img src="${data.path}" alt="">
                <span>${data.message}</span>
            </li>
        `)
	}
})
