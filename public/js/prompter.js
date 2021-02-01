// uses jQuery (cdnjs.com)
// uses socket.io (/socket.io/socket.io.js)

$('html').addClass('has-background-black')

let play = false;
let lineNo = 0;

const PROMPTER_SPEED = 35;

async function fetchPrompterText () {
    return await $.ajax({
        method: 'GET',
        url: '/prompter.txt'
    });
}

let socket = io();
socket.on('perform-refresh', _ => {
    location.reload();
});

socket.on('perform-updatetext', ({ content }) => {
    $('#text').html(sanitizeMeBro(content));
});

socket.on('perform-prompterstart', _ => {
    setPlay(true);
});

socket.on('perform-prompterend', _ => {
    setPlay(false);
})

function sanitizeMeBro(data) {
    // basic xss sanitation; lol do u even cybersecurity bro?

    data = data.replace(/<script>/, 'script');
    data = data.replace(/=/gi, ' equals ');
    data = data.replace(/\(/gi, '[');
    data = data.replace(/\)/gi, ']');
    data = data.replace(/&/gi, ' and ');
    data = data.replace(/;/gi, '.');
    data = data.replace(/(\r\n|\r|\n)/gi, '<br />');

    return data;
}

(async () => {
    let data = await fetchPrompterText();
    data = sanitizeMeBro(data);

    $('#text').html(data);
})();

function setPlay(val) {
    val && (lineNo = val) // funky if statment

    play = val;
}

let interval = setInterval(() => {
    if (play) {
        $(window).scrollTop(++lineNo);

        // end on bottom
        if (lineNo >= $(document).height())
            setPlay(false);
    }
}, PROMPTER_SPEED);

function doHardStop() {
    clearInterval(interval);
}