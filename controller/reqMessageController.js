const Message = require('../model/reqMessageModel');
const mongoose = require('mongoose');
const { User } = require('../model/userModel');

const createReqMessage = async (req, res) => {
    const { sender, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sender)) {
        return res.status(400).send('Invalid sender ID.');
    }

    try {
        // Fetch all users with role "admin"
        const admins = await User.find({ role: 'admin' }).select('_id'); console.log("Sending");
        const isMessageExit = await Message.find({ message: message, sender: sender }).select('_id');
        if (isMessageExit.length > 0) {
            console.log("message existed");
            return res.status(409).send('Message already exists. wait for the response');
        }
        if (admins.length === 0) {
            return res.status(404).send('No admin users found.');
        }
        const adminIds = admins.map(admin => admin._id);
        // Create a new message instance
        const newMessage = new Message({
            sender,
            receivers: adminIds,
            message
        });

        // Save the new message to the database
        await newMessage.save();
        res.status(201).send(newMessage);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getReqMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const message = await Message.findById(id)
            .populate('sender', 'name email')  // Adjust fields as needed
            .populate('receivers', 'name email'); // Adjust fields as needed

        if (!message) {
            return res.status(404).send('Message not found.');
        }
        res.status(200).send(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(400).send('Error fetching message');
    }
};
const getAllReqMessage = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender', 'name email')  // Adjust fields as needed
            .populate('receivers', 'name email'); // Adjust fields as needed

        if (!messages || messages.length === 0) {
            return res.status(404).send('Messages not found.');
        }

        res.status(200).send(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(400).send('Error fetching messages');
    }
};

const deleteReqMessage = async (req, res) => {
    const id = req.params.id;
    const messageExists = await Message.findById(id);
    if (!messageExists) {
        return res.status(404).json({ message: "User not found" }); // 404 Not Found if user not found
    }
    try {
        await Message.findByIdAndDelete(id);
        res.status(200).json({ message: "message deleted successfully." }); // 200 OK with success message
    } catch (error) {
        res.status(500).json({ error: "Internal server error" }); // 500 Internal Server Error for unexpected errors
    }
}


module.exports = {
    createReqMessage,
    getReqMessage,
    getAllReqMessage,
    deleteReqMessage,
};
