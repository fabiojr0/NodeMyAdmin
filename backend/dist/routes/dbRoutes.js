"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mysql2_1 = __importDefault(require("mysql2"));
var router = express_1.default.Router();
// Conexão com o banco
var db = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
});
db.connect(function (err) {
    if (err) {
        console.error("Erro de conexão com o banco de dados:", err);
    }
    else {
        console.log("Conectado ao banco de dados");
    }
});
// Teste de rota
router.get("/", function (_req, res) {
    res.send("Servidor está funcionando certinho!");
});
// Criar banco
router.post("/create-database", function (req, res) {
    var dbName = req.body.dbName;
    var query = "CREATE DATABASE IF NOT EXISTS `".concat(dbName, "`");
    db.query(query, function (err, result) {
        if (err)
            return res.status(500).json({ message: "Erro ao criar banco", error: err });
        res.status(200).json({ message: "Banco ".concat(dbName, " criado com sucesso!") });
    });
});
// Listar bancos
router.get("/show-databases", function (_req, res) {
    db.query("SHOW DATABASES", function (err, results) {
        if (err)
            return res.status(500).json({ message: "Erro ao buscar bancos", error: err });
        res.status(200).json(results);
    });
});
// Listar tabelas
router.get("/show-tables", function (req, res) {
    var dbName = req.query.dbName;
    var query = "SHOW TABLES FROM `".concat(dbName, "`");
    db.query(query, function (err, results) {
        if (err)
            return res.status(500).json({ message: "Erro ao buscar tabelas", error: err });
        res.status(200).json(results);
    });
});
// Mostrar colunas
router.get("/show-columns", function (req, res) {
    var dbName = req.query.dbName;
    var tableName = req.query.tableName;
    var query = "DESCRIBE `".concat(dbName, "`.`").concat(tableName, "`");
    db.query(query, function (err, result) {
        if (err)
            return res.status(500).send(err);
        res.json(result);
    });
});
// Criar tabela
router.post("/create-table", function (req, res) {
    var _a = req.body, dbName = _a.dbName, tableName = _a.tableName, columns = _a.columns;
    var query = "CREATE TABLE IF NOT EXISTS `".concat(dbName, "`.`").concat(tableName, "` (").concat(columns, ")");
    db.query(query, function (err, result) {
        if (err)
            return res.status(500).json({ message: "Erro ao criar tabela", error: err });
        res.status(200).json({ message: "Tabela ".concat(tableName, " criada com sucesso!") });
    });
});
// Inserir registro
router.post("/insert-record", function (req, res) {
    var _a = req.body, dbName = _a.dbName, tableName = _a.tableName, values = _a.values;
    var query = "INSERT INTO `".concat(dbName, "`.`").concat(tableName, "` VALUES (").concat(values, ")");
    db.query(query, function (err, result) {
        if (err)
            return res.status(500).json({ message: "Erro ao inserir registro", error: err });
        res.status(200).json({ message: "Registro inserido com sucesso!" });
    });
});
// Listar registros
router.get("/list-records", function (req, res) {
    var dbName = req.query.dbName;
    var tableName = req.query.tableName;
    var query = "SELECT * FROM `".concat(dbName, "`.`").concat(tableName, "`");
    db.query(query, function (err, results) {
        if (err)
            return res.status(500).json({ message: "Erro ao listar registros", error: err });
        res.status(200).json(results);
    });
});
exports.default = router;
