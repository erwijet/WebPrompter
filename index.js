const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const PORT = process.env.PORT || 7676;

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(morgan('common'));
app.use(express.static('public'));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/prompter', (req, res) => {
    res.render('prompter');
});

app.get('/text', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end(fs.readFileSync( __dirname + '/public/prompter.txt' ));
});

app.use((req, res) => res.redirect('/prompter')); // handle 404 with flair lol

io.on('connection', socket => {
    socket.on('request-refresh', _ => {
        io.emit('perform-refresh', {});
    });

    socket.on('request-updatetext', ({ content }) => {
        io.emit('perform-updatetext', { content });
    });

    socket.on('request-prompterstart', _ => {
        io.emit('perform-prompterstart')
    });

    socket.on('request-prompterend', _ => {
        io.emit('perform-prompterend')
    });
});

http.listen(PORT, () => {
    console.log('server listening on port ' + PORT);
});
