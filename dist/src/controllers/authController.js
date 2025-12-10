"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendError = (code, message, res) => {
    res.status(code).json({ message });
};
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "default_secret";
    //TODO: check if no secret close the server
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || "3600");
    const token = jsonwebtoken_1.default.sign({ _id: userId }, secret, { expiresIn: expiresIn });
    return token;
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return sendError(400, "Email and password are required", res);
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield userModel_1.default.create({ "email": email, "password": hashedPassword });
        const token = generateToken(user._id.toString());
        res.status(201).json({ "token": token });
    }
    catch (err) {
        return sendError(500, "Internal server error", res);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Login logic here
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return sendError(400, "Email and password are required", res);
    }
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (!user) {
            return sendError(401, "Invalid email or password 1", res);
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return sendError(401, "Invalid email or password 2", res);
        }
        const token = generateToken(user._id.toString());
        res.status(200).json({ "token": token });
    }
    catch (err) {
        return sendError(500, "Internal server error", res);
    }
});
exports.default = {
    register,
    login
};
//# sourceMappingURL=authController.js.map