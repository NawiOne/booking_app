import Mongoose from 'mongoose';
// import Moment from 'moment-timezone';


Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}

const IncomeSchema = Mongoose.Schema({
    source_id: String,
    amount: String,
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

export default Mongoose.model('income', IncomeSchema, 'income')