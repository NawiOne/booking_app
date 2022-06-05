import BookingSchema from '../models/booking.mjs';
import IncomeShcema from '../models/income.mjs';
import master_room from '../models/master_room.mjs';
import date_format from '../lib/helper.mjs';

import mongoose from 'mongoose'

const Booking = {
    create: (req, res) => {

        const {
            id,
            booking_no,
            booking_date,
            schedule_date,
            booking_duration,
            room_no,
            total_price,
            status,
            created_at,
            created_by,
            updated_at,
            updated_by
        } = req.body


        const booking = new BookingSchema({
            id,
            booking_no,
            booking_date,
            schedule_date,
            booking_duration,
            room_no,
            total_price,
            status,
            created_at,
            created_by,
            updated_at,
            updated_by
        })

        booking.save().then((res) => {


        }).catch((err) => {
            res.status(500).send({
                status: false,
                message: 'Some error occurred while creating data',
                data: {}
            });
        });
    },


    findOne: (req, res) => {
        BookingSchema.find({
            id: 3
        }).then(data => {
            res.json(data)
        }).catch(err => {
            res.status(500).send({
                message: err
            })
        })
    },

    transaction: async(req, res) => {
        const dbString = 'mongodb://nawi_skuy:onjanuary@ac-hqddaxm-shard-00-00.imbdcka.mongodb.net:27017,ac-hqddaxm-shard-00-01.imbdcka.mongodb.net:27017,ac-hqddaxm-shard-00-02.imbdcka.mongodb.net:27017/?ssl=true&replicaSet=atlas-8lb7u7-shard-0&authSource=admin&retryWrites=true&w=majority'
        const db = await mongoose.connect(dbString)
        const Booking = BookingSchema;
        const Income = IncomeShcema;

        const {
            id,
            booking_no,
            booking_date,
            schedule_date,
            booking_duration,
            room_no,
            total_price,
            status,
            created_at,
            created_by,
            updated_at,
            updated_by
        } = req.body;

        const bkDate = booking_date === null ? 0 : date_format(booking_date, 'YYYYMMDDhhmmss');
        const schDate = schedule_date === null ? 0 : date_format(schedule_date, 'YYYYMMDDhhmmss');
        const crtd_at = created_at === null ? 0 : date_format(created_at, 'YYYYMMDDhhmmss');
        const upd_at = updated_at === null ? 0 : date_format(updated_at, 'YYYYMMDDhhmmss');

        let session = null;

        try {
            return Booking.createCollection().
            then(() => Booking.startSession()).
            then(_session => {
                session = _session;
                return master_room.findOne({ room_id: room_no }).session(session);
            }).
            then((dt) => {

                session.startTransaction();
                let { price_per_h } = dt
                let newPrice = Number(price_per_h) * Number(booking_duration)

                Booking.create([{
                    id,
                    booking_no: 4,
                    booking_date: bkDate,
                    schedule_date: schDate,
                    booking_duration,
                    room_no,
                    total_price: newPrice,
                    status,
                    created_at: crtd_at,
                    created_by,
                    updated_at: upd_at,
                    updated_by
                }], { session: session });
                return newPrice
            }).
            then((dt) => {
                console.log(dt)
                Income.create([{ source_id: id, amount: dt }], { session: session })
            }).
            then(() => Booking.countDocuments()).
            then(() => {
                res.send({
                    status: true,
                    message: 'Insert data success'
                })
                session.commitTransaction()
            }).catch((err) => {
                console.log(err)
                res.send({
                    status: false,
                    message: 'Failed while inserting data',
                    data: err
                })
                session.abortTransaction()
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export default Booking;