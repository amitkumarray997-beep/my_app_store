const router = require("express").Router();
const { listApps, getAppById, publishApp, downloadApk } = require("../controllers/appController");
const auth = require("../middleware/auth");

router.get("/", listApps);                      // GET /apps?search=&category=
router.get("/:id", getAppById);                // GET /apps/:id
router.post("/publish", auth, publishApp);     // POST /apps/publish (protected)
router.get("/download/:file", downloadApk);    // GET /apps/download/:file (APK stream)

module.exports = router;
