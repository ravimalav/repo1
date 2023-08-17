"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const route_1 = __importDefault(require("./routes/route"));
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(route_1.default);
app.listen(3000);
