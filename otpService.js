const twilio = require("twilio");
const express = require("express");
const bodyParser = require("body-parser");

// Twilio credentials
const accountSid = "";
const authToken = "";
const twilioPhoneNumber = ""; // Your Twilio phone number

const client = twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.json());

let generatedOTP = null; // Store OTP for verification

// Endpoint to send OTP
app.post("/send-otp", (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  // Generate a random OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000);

  // Send OTP via SMS using Twilio
  client.messages
    .create({
      body: `Your OTP code is: ${generatedOTP}`,
      from: twilioPhoneNumber,
      to: phoneNumber, // Mobile number of the recipient
    })
    .then((message) => {
      console.log("OTP sent: ", message.sid);
      res.status(200).json({ message: "OTP sent successfully!" });
    })
    .catch((error) => {
      console.error("Error sending OTP:", error);
      res
        .status(500)
        .json({ message: "Failed to send OTP. Please try again." });
    });
});

// Endpoint to verify OTP
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  if (otp === String(generatedOTP)) {
    res.status(200).json({ message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
