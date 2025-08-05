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
// Allow multiple origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Alternative local port
  process.env.CORS_ORIGIN  // Production frontend URL from environment
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
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
