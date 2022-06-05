import Mongoose from 'mongoose';
// import Moment from 'moment-timezone';


Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}

const BookingSchema = Mongoose.Schema({
    id: String,
    booking_no: String,
    booking_date: {
        type: Number,
        get: v => Math.floor(v),
        set: v => Math.floor(v),
        alias: 'i',
        default: function() {
            return null;
        }
    },
    schedule_date: {
        type: Number,
        get: v => Math.floor(v),
        set: v => Math.floor(v),
        alias: 'i',
        default: function() {
            return null;
        }
    },
    booking_duration: String,
    room_no: String,
    total_price: String,
    status: String,
    created_at: {
        type: Number,
        get: v => Math.floor(v),
        set: v => Math.floor(v),
        alias: 'i',
        default: function() {
            return null;
        }
    },
    created_by: String,
    updated_at: {
        type: Number,
        get: v => Math.floor(v),
        set: v => Math.floor(v),
        alias: 'i',
        default: function() {
            return null;
        }
    },
    updated_by: String
})

export default Mongoose.model('booking', BookingSchema, 'booking')