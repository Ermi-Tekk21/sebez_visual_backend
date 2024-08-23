// routes/messageRoute.js
const express = require('express');
const { createReqMessage, getReqMessage, getAllReqMessage, deleteReqMessage } = require('../controller/reqMessageController');
const { createResMessage, getResMessage, getReplayMessage } = require('../controller/resMessageController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/createReqMessage', auth, createReqMessage);
router.get('/getReqMessage/:id', auth, getReqMessage);
router.get('/getAllReqMessage', auth, getAllReqMessage);
router.delete('/deleteReqMessage/:id', auth, deleteReqMessage);


router.post('/createResMessage', auth, createResMessage);
router.get('/getResMessage/:id', auth, getResMessage);
router.get('/getResMessageMe', auth, getReplayMessage);

module.exports = router;
