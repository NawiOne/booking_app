import Mongoose from 'mongoose';
// import Moment from 'moment-timezone';


Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}

const IncomeSchema = Mongoose.Schema({
    id: String,
    source_id: String,
    amount: String,
    created_at: { type: Date, default: new Date().addHours(7) },
    created_by: String,
    updated_at: { type: Date, default: new Date().addHours(7) },
    updated_by: String
})

export default Mongoose.model('income', IncomeSchema, 'income')