const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hackaton_test',
});

app.get('/api/tekst', (req, res) => {
  connection.query('SELECT * FROM teksty', (error, results) => {
    if (error) {
      console.error('Błąd SQL:', error);
      res.status(500).json({ error: 'Błąd serwera' });
    } else {
      res.json({ teksty: results });
    }
  });
});

app.post('/api/dodaj-tekst', (req, res) => {
  const { tresc, data_wykonania, status = 'pending' } = req.body;
  if (!tresc || !data_wykonania) {
    return res.status(400).json({ error: 'Treść i data wykonania są wymagane' });
  }

  const query = 'INSERT INTO teksty (tresc, data_wykonania, status) VALUES (?, ?, ?)';
  connection.query(query, [tresc, data_wykonania, status], (error, results) => {
    if (error) {
      console.error('Błąd SQL:', error);
      res.status(500).json({ error: 'Błąd podczas dodawania tekstu' });
    } else {
      res.status(201).json({ message: 'Tekst dodany pomyślnie', id: results.insertId });
    }
  });
});

app.put('/api/aktualizuj-tekst/:id', (req, res) => {
  const { id } = req.params;
  const { tresc, data_wykonania } = req.body;
  if (!tresc || !data_wykonania) {
    return res.status(400).json({ error: 'Treść i data wykonania są wymagane' });
  }

  const query = 'UPDATE teksty SET tresc = ?, data_wykonania = ? WHERE id = ?';
  connection.query(query, [tresc, data_wykonania, id], (error, results) => {
    if (error) {
      console.error('Błąd SQL:', error);
      res.status(500).json({ error: 'Błąd podczas aktualizacji tekstu' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Nie znaleziono tekstu o podanym ID' });
    } else {
      res.status(200).json({ message: 'Tekst zaktualizowany pomyślnie' });
    }
  });
});

app.put('/api/aktualizuj-status/:id', (req, res) => {
  const { id } = req.params;
  const { status, explanation } = req.body;
  
  console.log('Otrzymane dane:', { id, status, explanation }); // Log dla debugowania

  if (!status) {
    return res.status(400).json({ error: 'Status jest wymagany' });
  }

  let query, params;
  if (status === 'failed' && explanation) {
    query = 'UPDATE teksty SET status = ?, explanation = ? WHERE id = ?';
    params = [status, explanation, id];
  } else {
    query = 'UPDATE teksty SET status = ?, explanation = NULL WHERE id = ?';
    params = [status, id];
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('Błąd SQL:', error);
      res.status(500).json({ error: 'Błąd podczas aktualizacji statusu' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Nie znaleziono tekstu o podanym ID' });
    } else {
      res.status(200).json({ message: 'Status zaktualizowany pomyślnie' });
    }
  });
});

app.delete('/api/usun-tekst/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM teksty WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Błąd SQL:', error);
      res.status(500).json({ error: 'Błąd podczas usuwania tekstu' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Nie znaleziono tekstu o podanym ID' });
    } else {
      res.status(200).json({ message: 'Tekst usunięty pomyślnie' });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});