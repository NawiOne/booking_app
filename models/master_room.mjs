import Mongoose from 'mongoose';

const MasterRoomSchema = Mongoose.Schema({
    id: String,
    room_id: String,
    price_per_h: Number
})

export default Mongoose.model('master_room', MasterRoomSchema, 'master_room')