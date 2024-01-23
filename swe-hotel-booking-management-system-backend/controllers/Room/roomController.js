
const Room = require("../../models/room/roomModel");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "roomUploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const addRoomMethod = async (req, res) => {
  const Id = uuidv4();
  try {
    upload.single("roomPhoto")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(500)
          .json({ message: "An error occurred while uploading the photo", err });
      } else if (err) {
        return res
          .status(500)
          .json({
            message: "An unknown error occurred while uploading the photo",
            error: err.message,
          });
      }
      //  console.log( req.file)
      const photoPath = req.file.path;
      const title = req.body.title;
      const description = req.body.description;
      const status = req.body.status;
      const price = req.body.price;
      const availableRooms = req.body.availableRooms;



      const addRoom = await Room.create({
        uuid: Id,
        photo: photoPath,
        title,
        description,
        status,
        price,
        availableRooms,
      });

      res.status(200).json(addRoom);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while creating the room",
        error: error.message,
      });
  }
};

module.exports = { addRoomMethod };
