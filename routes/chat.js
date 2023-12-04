const express = require("express");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

const chatController = require("../controllers/chat");

router.post("/chatrooms/createNewRoom", isAuth, chatController.createRoom);

router.get("/chatrooms/getById", isAuth, chatController.getRoomById);

router.put("/chatrooms/addMessage", isAuth, chatController.addMessage);

router.get("/chatrooms/getAllRoom", isAuth, chatController.getAllRoom);

module.exports = router;
