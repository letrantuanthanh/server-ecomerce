const User = require("../models/user");
const Room = require("../models/room");
const io = require("../socket");

exports.getRoomById = (req, res, next) => {
  const roomId = req.query.roomId;
  Room.findById(roomId)
    .then((room) => {
      res.status(200).json(room);
    })
    .catch((err) => console.log(err));
};

exports.createRoom = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    // Create a new room
    const newRoom = new Room({
      creator: {
        userId: user._id,
        userName: user.fullName,
      },
      content: [], // Initially, the content can be an empty array
    });

    // Save the room to the database
    const savedRoom = await newRoom.save();
    user.rooms.push(newRoom);
    await user.save();
    // Respond with the new room information
    res.json({ room: savedRoom });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addMessage = async (req, res, next) => {
  const message = req.body.message;
  const is_admin = req.body.is_admin;
  const roomId = req.body.roomId;

  try {
    // const { roomId, is_admin, message } = data;

    // Find the room by ID
    const room = await Room.findById(roomId);

    if (!room) {
      // Handle the case where the room doesn't exist
      return;
    }

    // Add the new message to the content array
    room.content.push({ is_admin, message });

    // Save the updated room to MongoDB
    await room.save();

    // Emit the new message to all clients in the room
    io.getIO().emit("receive_message", { message, roomId, is_admin });
    res.status(200).json({ message: "Room updated!" });
  } catch (error) {
    console.error(error);
  }
};

exports.getAllRoom = async (req, res, next) => {
  Room.find()
    .then((rooms) => {
      res.status(200).json(rooms);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// exports.addMessage = async (req, res, next) => {
//   const message = req.body.message;
//   const is_admin = req.body.is_admin;
//   const roomId = req.body.roomId;

//   try {
//     const room = await Room.findById(roomId).populate("creator");
//     if (!room) {
//       const error = new Error("Could not find room.");
//       error.statusCode = 404;
//       throw error;
//     }
//     if (room.creator._id.toString() !== req.userId) {
//       const error = new Error("Not authorized!");
//       error.statusCode = 403;
//       throw error;
//     }

//     room.content = [...room.content].push({
//       message: message,
//       is_admin: is_admin,
//     });

//     const result = await room.save();
//     io.getIO().emit("rooms", { action: "update", room: result });
//     res.status(200).json({ message: "Room updated!", room: result });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
