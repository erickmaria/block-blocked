import http from 'http';
import app from './app';

const PORT = app.get('port');
const SERVER_START_MSG = `\n >> server running on port '${PORT}' <<`;

http.createServer(app).
    listen(PORT, () => {
        console.log(SERVER_START_MSG);
    });