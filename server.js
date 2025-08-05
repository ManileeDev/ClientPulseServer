require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const morgan = require("morgan");
const userRouter = require("./routes/userRoute");
const otpRouter = require("./routes/Otp");
const feedbackRouter = require("./routes/feedbackRoute");
const featureRouter = require("./routes/featureRoute");
const configRouter = require("./routes/configRoute");


app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use("/api", userRouter);
app.use("/api", otpRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/features", featureRouter);
app.use("/api/configurations", configRouter);
app.get("/test",(req,res)=>{
  res.send("HI da")
})
mongoose
  .connect(process.env.MONG_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB Connected and Served is running on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
