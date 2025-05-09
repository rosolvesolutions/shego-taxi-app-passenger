"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passengerSchema = new mongoose_1.default.Schema({
    _id: Number,
    phoneNumber: String,
    firstName: String,
    lastName: String,
    email: String,
    pfp: String,
    createdAt: Date,
    updatedAt: Date,
    rating: Number,
});
const Passenger = mongoose_1.default.model('Passenger', passengerSchema);
exports.default = Passenger;
