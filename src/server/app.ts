import express from 'express';
import path from 'path';
import dotenvWapper from '../utils/dotenv-wapper';

dotenvWapper();

let app = express();

app.set('port', process.env.PORT || 3000);
app.use('/', express.static(path.join(__dirname, '/../public')));

export default app;