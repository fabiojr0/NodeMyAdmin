import express, { Request, Response } from "express";
import mysql, { Connection } from "mysql2";

const router = express.Router();

// Conexão com o banco
const db: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
});

db.connect((err: Error | null) => {
  if (err) {
    console.error("Erro de conexão com o banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados");
  }
});

// Teste de rota
router.get("/", (_req: Request, res: Response) => {
  res.send("Servidor está funcionando certinho!");
});

// Criar banco
router.post("/create-database", (req: Request, res: Response) => {
  const { dbName } = req.body;
  const query = `CREATE DATABASE IF NOT EXISTS \`${dbName}\``;
  db.query(query, (err: Error | null, result: any) => {
    if (err) return res.status(500).json({ message: "Erro ao criar banco", error: err });
    res.status(200).json({ message: `Banco ${dbName} criado com sucesso!` });
  });
});

// Listar bancos
router.get("/show-databases", (_req: Request, res: Response) => {
  db.query("SHOW DATABASES", (err: Error | null, results: any) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar bancos", error: err });
    res.status(200).json(results);
  });
});

// Listar tabelas
router.get("/show-tables", (req: Request, res: Response) => {
  const dbName = req.query.dbName as string;
  const query = `SHOW TABLES FROM \`${dbName}\``;
  db.query(query, (err: Error | null, results: any) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar tabelas", error: err });
    res.status(200).json(results);
  });
});

// Mostrar colunas
router.get("/show-columns", (req: Request, res: Response) => {
  const dbName = req.query.dbName as string;
  const tableName = req.query.tableName as string;
  const query = `DESCRIBE \`${dbName}\`.\`${tableName}\``;
  db.query(query, (err: Error | null, result: any) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Criar tabela
router.post("/create-table", (req: Request, res: Response) => {
  const { dbName, tableName, columns } = req.body;
  const query = `CREATE TABLE IF NOT EXISTS \`${dbName}\`.\`${tableName}\` (${columns})`;
  db.query(query, (err: Error | null, result: any) => {
    if (err) return res.status(500).json({ message: "Erro ao criar tabela", error: err });
    res.status(200).json({ message: `Tabela ${tableName} criada com sucesso!` });
  });
});

// Inserir registro
router.post("/insert-record", (req: Request, res: Response) => {
  const { dbName, tableName, values } = req.body;
  const query = `INSERT INTO \`${dbName}\`.\`${tableName}\` VALUES (${values})`;
  db.query(query, (err: Error | null, result: any) => {
    if (err) return res.status(500).json({ message: "Erro ao inserir registro", error: err });
    res.status(200).json({ message: "Registro inserido com sucesso!" });
  });
});

// Listar registros
router.get("/list-records", (req: Request, res: Response) => {
  const dbName = req.query.dbName as string;
  const tableName = req.query.tableName as string;
  const query = `SELECT * FROM \`${dbName}\`.\`${tableName}\``;
  db.query(query, (err: Error | null, results: any) => {
    if (err) return res.status(500).json({ message: "Erro ao listar registros", error: err });
    res.status(200).json(results);
  });
});

export default router;
