const { mongoose } = require("mongoose");
const Message = require("../model/resMessageModel");

const createResMessage = async (req, res) => {

    const { sender, reciver, message, replayMessageId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sender, reciver)) {
        return res.status(404).send('sender or reciver\'s is not a valid Id')
    }

    try {
        //check if the message exists
        const isMessageExist = await Message.find({ message: message, sender: sender }).select('_id');
        console.log('isMessageExist leng: ', isMessageExist.length);
        if (isMessageExist.length > 0) {
            console.log("message exists");
            return res.status(409).send('Message already exists.');
        }

        //new message instance
        const newMessage = new Message({
            sender, reciver, replayMessageId, message,
        })
        await newMessage.save()
        res.status(201).send(newMessage)
    }
    catch (error) {
        // fetch
        res.status(404).send(error)
    }
}

const getResMessage = async (req, res) => {
    const { id } = req.params

    try {
        const message = await Message.findById(id)
            .populate('sender', 'name email')
            .populate('reciver', 'name email')

        if (!message) {
            return res.status(404).send("message not found")
        }

        res.status(200).send(message)
    }
    catch (error) {
        res.status(404).send(error)
    }
}

const getReplayMessage = async (req, res) => {
    const reciver = req.userExist._id;
    console.log("received to: ", reciver);

    try {
        console.log("Trying to get messages, please wait...");
        const messages = await Message.find({ reciver: reciver })
            .populate('sender', 'name email')
            .populate('reciver', 'name email')
            .populate('replayMessageId', 'message timestamp');

        if (messages.length === 0) {
            return res.status(404).send("Messages not found");
        }

        res.status(200).send(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send("An error occurred while fetching messages");
    }
};


module.exports = {
    createResMessage,
    getResMessage,
    getReplayMessage
}