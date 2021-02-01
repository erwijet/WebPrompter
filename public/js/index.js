// uses jQuery (cdnjs.com)
// uses socket.io (/socket.io/socket.io.js)

let socket = io();

function textDidChange() {
    const text = $('#text').val();

    socket.emit('request-updatetext', { content: text });
}

function startPrompter() {
    socket.emit('request-prompterstart');
}

function stopPrompter() {
    socket.emit('request-prompterend');
}

function loadText() {
    (async () => {
        $('#text').val(await $.ajax({
            method: 'GET',
            url: '/text'
        }));
    })();
}

function saveText() {
    $.ajax({
        method: 'POST',
        url: '/savetext',
        data: {
            text: $('#text').val()
        }
    });
}

$(loadText);