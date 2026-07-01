require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware agar Express bisa membaca JSON dan file statis jika diperlukan
app.use(express.json());
// ==========================================
// KONEKSI DATABASE MYSQL (Sesuai Poin c & a)
// ==========================================
const db = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   port: process.env.DB_PORT || 3306
});
db.connect((err) => {
   if (err) {
       console.error('Gagal terkoneksi ke database MySQL:', err.message);
       return;
   }
   console.log('Berhasil terkoneksi ke database MySQL.');
});

// ==========================================
// ENDPOINT API (Sesuai Poin b)
// ==========================================
/**
* Poin b.a: Endpoint '/api/quotes/'
* Mengembalikan data JSON yang terdiri dari 9 kutipan secara random
*/
app.get('/api/quotes', (req, res) => {
   // Query MySQL: ORDER BY RAND() digunakan untuk mengacak, LIMIT 9 untuk mengambil 9 baris data
   // Kolom sesuai ketentuan poin a: id, text, author, created_at
   const query = 'SELECT id, text, author, created_at FROM quotes ORDER BY RAND() LIMIT 9';
   db.query(query, (err, results) => {
       if (err) {
           console.error(err);
           return res.status(500).json({
               error: 'Terjadi kesalahan pada server saat mengambil data.'
           });
       }
       // Mengembalikan data berbentuk JSON
       res.json(results);
   });
});
/**
* Poin b.b: Endpoint '/quotes'
* Menampilkan halaman web yang menarik dari quotes
*/
app.get('/quotes', (req, res) => {
   // Mengirim file 'index.html' (template tampilan yang dibuat sebelumnya) ke browser
   res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// MENJALANKAN SERVER
// ==========================================
app.listen(PORT, () => {
   console.log(`Server berjalan di http://localhost:${PORT}`);
   console.log(`Buka http://localhost:${PORT}/quotes untuk melihat tampilan web.`);
});