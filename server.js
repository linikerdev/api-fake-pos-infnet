const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express(); // instancia do express
app.use(express.json()); // isso é para usar o json na serialização
const port = 3002;

app.use(cors());

const banco = require("./db.json");
const { generateHash, generateToken, verifyToken } = require("./helpers");

// email: seuemail@qualquercoisa.com
// password: 12345 => gerar o hash

app.get("/", (req, res) => {
  res.json({
    name: "Liniker",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = banco.users.find((item) => item.email === email);

  if (!user) {
    res.status(400).json({
      message: "Usuário não existe na base de dados",
    });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400).json({
      message: "O Usuário está desativado",
    });
  }
  delete user.password;
  const token = generateToken(user);
  res.json({
    token,
  });
});

app.get("/users", (req, res) => {
  const authHeader = req.headers.authorization;
  //regras

  if (!authHeader) {
    res.status(401).json("No token provided");
  }
  // 2 regra
  const parts = authHeader?.split(" ");
  if (parts?.length !== 2) {
    res.status(401).json("Token error");
  }
  const [schema, token] = parts;
  if (schema?.toLowerCase() !== "bearer") {
    res.status(401).json("Token malformatted");
  }

  if (!verifyToken(token)){
    res.status(401).json("token inválido");
  }
    res.json([
      {
        id: 1,
        name: "Liniker",
      },
      {
        id: 2,
        name: "Elberth",
      },
    ]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
