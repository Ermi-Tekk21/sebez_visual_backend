const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replayMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reqMessage'
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model("resMessage", messageSchema);
module.exports = Message;