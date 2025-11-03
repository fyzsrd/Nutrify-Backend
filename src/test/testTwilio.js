import twilio from "twilio";
import dotenv from "dotenv";


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
  .create({
    body: "Test message from Nutraline",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+919188642139", // your phone number in E.164
  })
  .then(msg => console.log("Message SID:", msg.sid))
  .catch(err => console.error("Error:", err.message));
