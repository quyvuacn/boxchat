var socket = io.connect(window.location.href)
    
socket.on('connect', function (data) {
    var name=prompt('Hay nhap ten hien thi') || 'Guest'
    socket.emit('join',name)
    let userID = socket.id
    let color = '#'+Math.floor(Math.random()*16777215).toString(16)
    sessionStorage.setItem("userID", userID)

    $('form').submit(function(){
        var message = $('#message').val();
        socket.emit('messages',
            {
                id : userID,
                name:name,
                message:message,
                color : color
            }
        )
        this.reset()
        return false
    });
});



//listen thread event
socket.on('thread', function (data) {
    if(data.id == sessionStorage.getItem("userID")) {
        $('#thread').append(`<li class="li"><b style="color: ${data.color}">You</b> : ${data.message} </li>`)
    }else{
        $('#thread').append(`<li class="li"><b style="color: ${data.color}">${data.name}</b> : ${data.message} </li>`)
    }
})
