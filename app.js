const express = require("express");
const multer = require("multer");
const { diskStorage } = require("multer");

const path = require("path");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

const destination = (req, file, next) => {
  const localLoc = "./public/uploads";
  next(null, localLoc);
};

const filename = (req, file, next) => {
  const date = Date.now();
  const random = (Math.random() * (10 ^ 8)).toLocaleString();
  const filenameActual = file.originalname;
  const fileName = `${date}--${random}--${filenameActual}`;
  next(null, fileName);
};

const storage = diskStorage({
  destination: destination,
  filename: filename,
});

const upload = multer({ storage: storage });

app.get("/",(req,res)=>{
  res.render("index")
})

app.post("/single", upload.single("myfile"), (req, res) => {
  res.send("One file uploaded");
  console.log(req.file);
});
app.post("/multiple",upload.array("images",3),(req,res)=>{

  console.log(req.files)

res.send("YYaaay you iserted")

})

app.listen(5000, () => {
  console.log("Your app is running on port 5000");
});
