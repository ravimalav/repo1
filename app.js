"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var route_1 = require("./routes/route");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(route_1.default);
app.listen(3000);
