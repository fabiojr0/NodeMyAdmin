"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dbRoutes_1 = __importDefault(require("./routes/dbRoutes"));
var app = (0, express_1.default)();
var port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/", dbRoutes_1.default);
app.listen(port, function () {
    console.log("Servidor rodando na porta ".concat(port));
});
