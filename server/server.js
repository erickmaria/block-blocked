'use strict';

import http from 'http';
import app from './app';
import dotenv from 'dotenv';

dotenv.config({path: __dirname + '/../.env'});

const PORT = process.env.PORT || 3000;

http.createServer(app).
    listen(PORT, () => {
        console.log(__dirname + '/../.env');
        console.log(`server running on port '${PORT}'`);
    });