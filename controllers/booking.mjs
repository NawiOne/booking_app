import { DateTime } from 'luxon'

import BookingSchema from '../models/booking.mjs';
import IncomeShcema from '../models/income.mjs';
import master_room from '../models/master_room.mjs';
import date_format from '../lib/helper.mjs';

const Booking = {
    transaction: async(req, res) => {
        const Booking = BookingSchema;
        const Income = IncomeShcema;
        const {
            id,
            booking_no,
            booking_date,
            schedule_date,
            booking_duration,
            room_no,
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

        let checkData = await Booking.findOne({ id: id });
        if (checkData) {
            return res.send({
                status: false,
                message: `Data with id ${id} has already exist`
            })
        } else {
            try {
                return Booking.createCollection().
                then(() => Booking.startSession()).
                then((_session) => {
                    session = _session;
                    session.startTransaction();
                    return master_room.findOne({ room_id: room_no }).session(session)
                }).
                then((dt) => {
                    let { price_per_h } = dt
                    let newPrice = Number(price_per_h) * Number(booking_duration)

                    Booking.create([{
                        id,
                        booking_no,
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
                    return Income.create([{ source_id: id, amount: dt }], { session: session })
                }).
                then(() => Booking.countDocuments()).
                then(() => {
                        res.send({
                            status: true,
                            message: 'Insert data success'
                        })
                        session.commitTransaction();

                    })
                    .catch((err) => {
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
    },
    cancel: async(req, res) => {
        let Booking = BookingSchema;
        let Income = IncomeShcema;
        let session = null;

        try {
            let { booking_no, booking_date } = req.query;
            let bookDate = date_format(booking_date, 'YYYYMMDDhhmmss');
            let checkData = await Booking.aggregate([{
                    $lookup: {
                        from: "income",
                        localField: "id",
                        foreignField: "source_id",
                        as: "amount"
                    }
                },
                {
                    $match: { booking_no: booking_no, booking_date: Number(bookDate) }
                }
            ])
            if (!checkData.length) {
                return res.send({
                    status: false,
                    message: `Data with booking number ${booking_no} is not found`
                })
            } else {

                return Booking.createCollection().
                then(() => Booking.startSession()).
                then(_session => {
                    session = _session;
                    return session.startTransaction();
                }).then(() => {
                    let { id, schedule_date, status, total_price, amount } = checkData[0];
                    bookDate = bookDate.toString();

                    let schDate = date_format(schedule_date, 'YYYYMMDDhhmmss').toString()
                    let currDate = DateTime.local();
                    let newBookDate = DateTime.fromISO(`${bookDate.substring(0,4)}-${bookDate.substring(4,6)}-${bookDate.substring(6,8)}T${bookDate.substring(8,10)}:${bookDate.substring(10,12)}:00`)
                    let newScheDate = DateTime.fromISO(`${schDate.substring(0,4)}-${schDate.substring(4,6)}-${schDate.substring(6,8)}T${schDate.substring(8,10)}:${schDate.substring(10,12)}:00`)
                    let differ = Number(newScheDate.diff(currDate, "hours").hours.toFixed());
                    let difSdateToNow = Number(currDate.diff(newScheDate, "minutes").minutes.toFixed());
                    let newAmount = Number(amount[0].amount);
                    let { source_id } = amount[0]

                    if (newScheDate > newBookDate) {
                        if (differ <= 48) {
                            newAmount = (50 / 100) * newAmount;
                        } else if (differ > 48) {
                            newAmount = 0;
                        }
                    } else if (currDate > newScheDate) {
                        if (status === 'no_show') {
                            newAmount = newAmount
                        } else if (status === 'active' && difSdateToNow < 60) {
                            newAmount = (75 / 100) * newAmount;
                        }
                    }
                    return Income.findOneAndUpdate({ source_id }, { amount: newAmount }).session(session);
                }).then(() => {
                    res.send({
                        status: true,
                        message: 'success'
                    })
                    session.commitTransaction()
                }).catch((err) => {
                    res.send({
                        status: false,
                        message: err
                    })
                    session.abortTransaction()
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}


export default Booking;