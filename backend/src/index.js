const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const port = 3000;

const db = new sqlite3.Database('cafe.db');
app.use(express.json());
app.use(cors());

app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM produtos WHERE id = ?';
  
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro interno do servidor');
        return;
      }
  
      if (!row) {
        res.status(404).send('Produto não encontrado');
        return;
      }
  
      res.json(row);
    });
  });
app.post('/login', async (req, res) => {
    const { login, senha } = req.body;
    const query = 'SELECT * FROM pessoas WHERE login = ? AND senha = ?';
  
    db.get(query, [login, senha], async (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro interno do servidor');
        return;
      }
  
      if (!row) {
        res.status(404).send('Usuário não encontrado');
        return;
      }

      res.json(row);
    });
});

app.post('/registro', (req, res) => {
    const { login, senha } = req.body;

    const checkQuery = 'SELECT * FROM pessoas WHERE login = ?';
    db.get(checkQuery, [login], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro interno do servidor');
            return;
        }
  
        if (row) {
            res.status(400).send('Login já está em uso');
            return;
        }

        const insertQuery = 'INSERT INTO pessoas (login, senha) VALUES (?, ?)';
        db.run(insertQuery, [login, senha], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro interno do servidor');
            return;
        }

        res.status(200).send('Usuário Criado com sucesso');
        });
    });
});

app.get('/pedidos/:idpessoa', (req, res) => {
    const { idpessoa } = req.params;

    const query = 'SELECT * FROM pedidos WHERE idpessoa = ?';

    db.all(query, [idpessoa], (err, rows) => {
    if (err) {
        console.error(err.message);
        res.status(500).send('Erro interno do servidor');
        return;
    }

    res.json(rows);
    });
});

app.post('/pedidos', (req, res) => {
    const { idpessoa, idproduto, quantidade, cpf, endereco } = req.body;

    const insertQuery ='INSERT INTO pedidos (idpessoa, idproduto, quantidade, cpf, endereco) VALUES (?, ?, ?, ?, ?)';

    db.run(
        insertQuery,
        [idpessoa, idproduto, quantidade, cpf, endereco],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Erro interno do servidor');
                return;
            }

            res.json({ id: this.lastID });
        }
    );
});
  
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});