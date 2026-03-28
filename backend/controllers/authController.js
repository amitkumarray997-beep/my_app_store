const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../config/mongoDb");

/**
 * POST /auth/signup
 */
const signup = async (req, res) => {
  try {
    const { email, password, username, isDev } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "email, password, and username are required" });
    }

    const emailLower = email.toLowerCase();
    const usersCollection = getDb().collection("users");

    const existing = await usersCollection.findOne({ email: emailLower });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(password, rounds);

    const newUser = {
      email: emailLower,
      password: hashed,
      username,
      isDev: !!isDev,
      createdAt: new Date().toISOString()
    };

    const result = await usersCollection.insertOne(newUser);
    const generatedId = result.insertedId.toString();

    const token = jwt.sign({ id: generatedId, email: emailLower }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: { id: generatedId, email: emailLower, username: newUser.username, isDev: newUser.isDev },
    });
  } catch (err) {
    console.error("[signup]", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const emailLower = email.toLowerCase();
    const usersCollection = getDb().collection("users");

    const user = await usersCollection.findOne({ email: emailLower });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: { id: user._id.toString(), email: user.email, username: user.username, isDev: user.isDev },
    });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /auth/me
 */
const me = async (req, res) => {
  try {
    const usersCollection = getDb().collection("users");
    // require('mongodb').ObjectId is needed if queries use native ObjectId
    const { ObjectId } = require('mongodb');

    // Fallback logic incase old string ids were somehow generated
    const queryId = req.user.id.length === 24 ? new ObjectId(req.user.id) : req.user.id;

    const user = await usersCollection.findOne({ _id: queryId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (err) {
    console.error("[me]", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { signup, login, me };
