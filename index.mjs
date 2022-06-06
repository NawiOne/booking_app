import 'dotenv/config'
import Express from 'express';
import route from './routes/route.mjs';
import Mongoose from 'mongoose';


const app = Express();

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(route);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port :${process.env.PORT}`)
});

Mongoose.connect(process.env.DBSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database is connected')
}).catch((err) => {
    console.log(err);
    console.log('Database is not connected')
})