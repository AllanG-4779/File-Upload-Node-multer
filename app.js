const express = require("express");
const multer = require("multer");
const { diskStorage } = require("multer");

const path = require("path");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
//set the location of the files to be uploaded
const destination = (req, file, next) => {
  const localLoc = "./public/uploads";
  next(null, localLoc);
};
//set the file name as it will be saved in the server
const filename = (req, file, next) => {
  const date = Date.now();
  const random = (Math.random() * (10 ^ 8)).toLocaleString();
  const filenameActual = file.originalname;
  const fileName = `${date}--${random}--${filenameActual}`;
  next(null, fileName);
};

//initialize the storage using the above parameters
const storage = diskStorage({
  destination: destination,
  filename: filename,
});

/*
 This method filters the files uploaded and only allow the ones that meets the criteria i.e.
 The file extensions matched the ones in the regEx and the mimeType as well e.g. application/json, application/jpg
 */

const filefilter = (file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const extension = allowed.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  //check the Type file being uploaded if it matches the ones allowed

  const mimeType = allowed.test(file.mimetype);

  if (mimeType && extension) {
    return cb(null, true);
  } else {
    return cb("File uploaded is not supported");
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
  fileFilter: (req, file, callback) => {
    filefilter(file, callback);
  },
}).single("myfile");

app.get("/", (req, res) => {
  res.render("index", { msg: "" });
});

app.post("/single", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      if (req.file === undefined) {
        res.render("index", { msg: "No file Choosen" });
      } else {
        res.render("index", { msg: "Image Uploaded", file:`uploads/${req.file.filename}` });
      }
    }
  });

  console.log(req.file);
});
app.post("/multiple", (req, res) => {
  console.log(req.files);

  res.send("YYaaay you iserted");
});

app.listen(5000, () => {
  console.log("Your app is running on port 5000");
});
