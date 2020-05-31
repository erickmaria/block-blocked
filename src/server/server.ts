import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../../.env')});

const PORT = process.env.PORT || 3000;

http.createServer(app).
    listen(PORT, () => {
        console.log(`server running on port '${PORT}'`);
    });