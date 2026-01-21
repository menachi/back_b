"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.');
        cb(null, Date.now() + "." + ext);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/', upload.single("file"), function (req, res) {
    const parts = req.file.path.split('/');
    const url = base + "uploads/" + parts[parts.length - 1];
    console.log("router.post(/file: " + url);
    res.status(200).send({ url: url });
});
module.exports = router;
//# sourceMappingURL=multerRoute.js.map