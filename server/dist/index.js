"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const passenger_1 = __importDefault(require("./routes/passenger"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const PORT = process.env.EXPRESS_SERVER_PORT || 5001;
app.use((0, cors_1.default)({ origin: '*' })); // You can allow all origins or restrict to your Expo address
app.use(express_1.default.json()); // 👈 Enable JSON body parsing
(0, db_1.default)(); // ✅ Initialize MongoDB connection
// Test endpoint
app.get('/api/value', (req, res) => {
    res.json({ value: 'Express Server Status: WORKING!' });
});
// Driver registration routes
app.use('/api/passenger', passenger_1.default);
app.listen(PORT, () => {
    console.log(`✅ Server running at ${process.env.EXPRESS_SERVER_IP}:${PORT}`);
});
