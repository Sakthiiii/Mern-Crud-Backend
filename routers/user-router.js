const userRouter = require("express").Router();
const User = require("../user-model");
const multer = require("multer");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
uuidv4();

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

userRouter.post("/", upload.single("img"), async (req, res) => {
  const { body } = req;
  try {
    const image = req.file
      ?  "/public/" + req.file.filename
      : "/public/default-img.jpg";
    if (!/^[a-zA-Z]{3,}$/.test(body.name)) {
      res.status(500).json({ error: "not a valid name" });
      return;
    }
    if (!(/^[0-9]{1,3}$/.test(body.age) && body.age >= 13 && body.age <= 140)) {
      res.status(500).json({ error: "not a valid age" });
      return;
    }
    if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        body.email
      )
    ) {
      res.status(500).json({ error: "not a valid email" });
      return;
    }

    const user = new User({
      name: body.name,
      email: body.email,
      age: body.age,
      img: image,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});
userRouter.patch("/:id", upload.single("img"), async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  try {
    let user = {};
    if (req.file) {
      user.img = "/public/" + req.file.filename;
    }
    if (body.name) {
      if (!/^[a-zA-Z]{3,}$/.test(body.name)) {
        res.status(500).json({ error: "not a valid name" });
        return;
      } else {
        user.name = body.name;
      }
    }
    if (body.age) {
      if (
        !(/^[0-9]{1,3}$/.test(body.age) && body.age >= 13 && body.age <= 140)
      ) {
        res.status(500).json({ error: "not a valid age" });
        return;
      } else {
        user.age = body.age;
      }
    }
    if (body.email) {
      if (
        !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          body.email
        )
      ) {
        res.status(500).json({ error: "not a valid email" });
        return;
      } else {
        user.email = body.email;
      }
    }
    const savedUser = await User.updateOne({ _id: id }, user);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  res.status(200).json(user);
  // console.log(payload)
});

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.deleteOne({ _id: id });
  res.status(200).json(user);
});

try {
  userRouter.get("/", async ({ query }, res) => {
    if (query.name) {
      let regName = new RegExp(`^${query.name}`, "i");
      users = await User.find({ name: regName });
      res.status(200).json(users);
    } else {
      users = await User.find({});
      res.status(200).json(users);
    }
  });
} catch (err) {
  res.status(500).json(err);
}

module.exports = userRouter;
