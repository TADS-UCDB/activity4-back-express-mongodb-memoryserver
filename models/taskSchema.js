import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name:{type: String},
    priority:{type: String},
    status:{type: String},
})

export default mongoose.model('Task', taskSchema);