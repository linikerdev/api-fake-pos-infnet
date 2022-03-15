const express = require("express");
const bcrypt = require("bcrypt");
const app = express(); // instancia do express
app.use(express.json()); // isso é para usar o json na serialização
const port = 3002;
const banco = require("./db.json");
const { generateHash, generateToken } = require("./helpers");

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
  delete user.password
  const token = generateToken(user);
  res.json({
    token,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
