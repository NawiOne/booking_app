import Express from 'express';
import route from './routes/route.mjs';
import Mongoose from 'mongoose'

const app = Express();
const PORT = 3001;
const dbString = 'mongodb://nawi_skuy:onjanuary@ac-hqddaxm-shard-00-00.imbdcka.mongodb.net:27017,ac-hqddaxm-shard-00-01.imbdcka.mongodb.net:27017,ac-hqddaxm-shard-00-02.imbdcka.mongodb.net:27017/?ssl=true&replicaSet=atlas-8lb7u7-shard-0&authSource=admin&retryWrites=true&w=majority'

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(route);



app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`)
});


Mongoose.connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database is connected')
}).catch((err) => {
    console.log(err);
    console.log('Database is not connected')
})