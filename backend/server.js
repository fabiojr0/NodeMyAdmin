const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 5000;

const cors = require("cors");
app.use(cors()); // Habilita o CORS

// conexão com o MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Erro de conexão com o banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados");
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor está funcionando certinho!");
});

// Rota -->
app.post("/create-database", (req, res) => {
  const { dbName } = req.body;
  const query = `CREATE DATABASE IF NOT EXISTS ${dbName}`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao criar banco de dados", error: err });
    }
    res.status(200).json({ message: `Banco de dados ${dbName} criado com sucesso!!!!!` });
  });
});

//Rota -->
app.get("/show-databases", (req, res) => {
  const query = "SHOW DATABASES";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar bancos de dados", error: err });
    }
    res.status(200).json(results);
  });
});

// Rota -->
app.get("/show-tables", (req, res) => {
  const { dbName } = req.query;
  const query = `SHOW TABLES FROM ${dbName}`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar tabelas", error: err });
    }
    res.status(200).json(results);
  });
});

// Rota -->
app.get("/show-columns", (req, res) => {
  const { dbName, tableName } = req.query;
  db.query(`DESCRIBE ${dbName}.${tableName}`, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Rota ==>
app.post("/create-table", (req, res) => {
  const { dbName, tableName, columns } = req.body;
  const query = `CREATE TABLE IF NOT EXISTS ${dbName}.${tableName} (${columns})`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao criar tabela", error: err });
    }
    res.status(200).json({ message: `Tabela ${tableName} criada no banco de dados ${dbName} com sucesso!` });
  });
});

// Rota -->
app.post("/insert-record", (req, res) => {
  const { dbName, tableName, values } = req.body;
  const query = `INSERT INTO ${dbName}.${tableName} VALUES (${values})`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao inserir registro", error: err });
    }
    res.status(200).json({ message: "Registro inserido com sucesso!" });
  });
});

// Rota -->
app.get("/list-records", (req, res) => {
  const { dbName, tableName } = req.query;
  const query = `SELECT * FROM ${dbName}.${tableName}`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao listar registros", error: err });
    }
    res.status(200).json(results);
  });
});

// Inicia
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
