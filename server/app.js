'use strict';

import express from 'express';

let app = express();

app.use('/game', express.static(path.join(__dirname, '/../public')));

export default app;