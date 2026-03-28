const fs = require("fs");
const path = require("path");
const { getDb } = require("../config/mongoDb");
const { scanText } = require("../ml/scanner");
const { ObjectId } = require('mongodb');

/**
 * GET /apps
 * Returns all apps. Supports rudimentary search.
 */
const listApps = async (req, res) => {
  try {
    const appsCollection = getDb().collection("apps");
    const query = {};

    if (req.query.search) {
      const q = req.query.search;
      // Native Mongo regex query for case string match
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    // Connect to collection, find matching queries, sort dynamically, and resolve as pure array
    const apps = await appsCollection.find(query).sort({ createdAt: -1 }).toArray();

    return res.json(apps);
  } catch (err) {
    console.error("[listApps]", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /apps/:id
 */
const getAppById = async (req, res) => {
  try {
    const appsCollection = getDb().collection("apps");
    const queryId = req.params.id.length === 24 ? new ObjectId(req.params.id) : req.params.id;

    const app = await appsCollection.findOne({ _id: queryId });
    if (!app) return res.status(404).json({ error: "App not found" });

    return res.json(app);
  } catch (err) {
    console.error("[getAppById]", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * POST /apps/publish
 */
const publishApp = async (req, res) => {
  try {
    const { name, description, apk, version, category, iconUrl } = req.body;

    if (!name || !description || !apk) {
      return res.status(400).json({ error: "name, description, and apk filename are required" });
    }

    // ML content moderation
    const isBad = await scanText(description);
    if (isBad) {
      return res.status(422).json({ error: "Description contains unsafe content" });
    }

    const appsCollection = getDb().collection("apps");

    const newApp = {
      name,
      description,
      apk,
      version: version || "1.0.0",
      category: category || "General",
      iconUrl: iconUrl || "",
      developer: req.user.email,
      developerId: req.user.id,
      safe: true,
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    const result = await appsCollection.insertOne(newApp);
    newApp._id = result.insertedId;

    return res.status(201).json(newApp);
  } catch (err) {
    console.error("[publishApp]", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /apps/download/:file
 * Streams the APK file and increments download counter safely via atomic increment.
 */
const downloadApk = async (req, res) => {
  try {
    const filename = path.basename(req.params.file);
    const filePath = path.join(__dirname, "..", "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "APK file not found" });
    }

    // Fire & Forget MongoDB Atomic Increment
    const appsCollection = getDb().collection("apps");
    appsCollection.updateOne(
      { apk: filename },
      { $inc: { downloads: 1 } }
    ).catch(e => console.error("Failed atomic download increment", e));

    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error("[downloadApk]", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { listApps, getAppById, publishApp, downloadApk };
