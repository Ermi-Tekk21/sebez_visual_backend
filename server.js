const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRouter");
const messageRoute = require("./routes/messageRouter");
const { authenticateUser } = require("./controller/authenticateUser");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3004;
const mongoURI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/auth", authenticateUser);
app.use("/api/product", productRoute);
app.use("/api/message", messageRoute);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("database connected..");
    app.listen(port, () => {
      console.log(`Server is running on port -> ${port}`);
    });
  })
  .catch((error) => console.log(error));
