import Express from 'express';
import route from './routes/route.mjs';
import Mongoose from 'mongoose'

const app = Express();
const PORT = 3001;
const dbString = 'mongodb://localhost:27017/booking_skuy'

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(route);



app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`)
});


Mongoose.connect(dbString).then(() => {
    console.log('Database is connected')
}).catch((err) => {
    console.log(err);
    console.log('Database is not connected')
})