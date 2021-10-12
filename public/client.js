var socket = io.connect('http://localhost:8000');
socket.on('connect', function (data) {
    var name=prompt('Hay nhap ten hien thi')
    socket.emit('join',name);

    $('form').submit(function(){
        var message = $('#message').val();
        socket.emit('messages',
            {
                name:name,
                message:message,
            }
        );
        this.reset();
        return false;
    });

});

//listen thread event
socket.on('thread', function (data) {
    $('#thread').append('<li class="li">' + data.name +": " + data.message  + '</li>')
});

