import bcrypt from "bcrypt";
import crypto from "crypto"; //to generate reset token
import { User } from "../models/User.js";
import nodemailer from "nodemailer";

/* Forgot Password */
export const resetPassEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a reset token and expiration time
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  // Send reset link via email
  const resetUrl = `http://localhost:5173/resetpass/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: user.email,
    subject: "Password Reset Request",
    text: `You have requested to reset your password. Click the link below to reset it: \n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Email could not be sent" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Password reset link sent" });
    }
  });
};

/* RESET PASSWORD */
export const resetPass = async (req, res) => {
  const { token, newpass } = req.body;
  console.log(newpass);
  const hashedtoken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(hashedtoken);
  const user = await User.findOne({
    resetPasswordToken: hashedtoken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(newpass, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset" });
};

/* CHANGE PASSWORD */
export const changePass = async (req, res) => {
  try {
    let { oldpass, newpass, id } = req.body;
    const user = await User.findById(id);
    const validPass = await bcrypt.compare(oldpass, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid Password" });
    const salt = await bcrypt.genSalt();
    let hashedPassword = await bcrypt.hash(newpass, salt);
    user.password = hashedPassword;
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    res.status(200).json({ message: "Password has been changed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
