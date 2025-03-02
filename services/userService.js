const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userSchema");

dotenv.config();

const userService = {
  async signUp(data) {
    try {
      const { name, email, phone_number, password, role, address } = data;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exists. Please use a different email.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        phone_number,
        password: hashedPassword,
        role,
        address,
      });

      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return { user, token };
    } catch (error) {
      throw new Error("Error while creating user: " + error.message);
    }
  },

  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return { user, token };
    } catch (error) {
      throw new Error("Login failed: " + error.message);
    }
  },

  async getAllUsers() {
    try {
      const users = await User.find({ role: "user" });
      return users;
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },

  async updateUserDetails(updateData) {
    try {
      const { userId, name, email, phone_number, address } = updateData;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (phone_number) user.phone_number = phone_number;
      if (address) user.address = address;

      await user.save();

      return user;
    } catch (error) {
      throw new Error("Error updating user details: " + error.message);
    }
  },

  async forgotPassword(data) {
    try {
      const { userId, newPassword } = data;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      return { message: "Password updated successfully" };
    } catch (error) {
      throw new Error("Error updating password: " + error.message);
    }
  },
};

module.exports = userService;
