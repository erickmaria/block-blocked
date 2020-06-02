import dotenv from 'dotenv';
import path from 'path';

export default () => {
    return dotenv.config({ path: path.join(__dirname, '../../.env') });
}