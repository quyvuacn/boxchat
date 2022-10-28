var socket = io.connect(window.location.href)
    
socket.on('connect', function (data) {
    var name=$('#name').val()
    var userID = $('#id').val()
    var path = $('#path').val()
    socket.emit('join',name)
    sessionStorage.setItem("userID", userID)

    $('form').submit(function(){
        var message = $('#message').val();
        socket.emit('messages',
            {
                id : userID,
                name:name,
                message:message,
                path
            }
        )
        this.reset()
        return false
    });
});



//listen thread event
socket.on('thread', function (data) {
    if(data.id == sessionStorage.getItem("userID")) {
        $('#thread').append(`
        <li class="myseft">
            <span>${data.message}</span>
        </li>
        `)
    }else{
        $('#thread').append(`
            <li>
                <img src="${data.path}" alt="">
                <span>${data.message}</span>
            </li>
        `)
    }
})
