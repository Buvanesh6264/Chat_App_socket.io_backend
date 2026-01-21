const chatModel = require("../model/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    if (!firstId || !secondId)
      return res.status(400).json("two users are required");
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) return res.status(200).json(chat);

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const findChats = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chats = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chats);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = {
    createChat,
    findUserChats,
    findChats,
}