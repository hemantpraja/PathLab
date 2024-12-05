import dotenv from 'dotenv';
import { connectDB } from './src/config/db.config.js';
import { app } from './src/app.js';

dotenv.config({
    path: "./.env"
});

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("Error : server > index > connectDB > catch : ", error)
});
