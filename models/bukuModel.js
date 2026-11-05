// TODO A: Rancang Schema & Model Buku sesuai tabel skema pada README.md
//
// Ketentuan:
//   judul      String, wajib diisi, spasi di awal/akhir dibuang
//   isbn       String, wajib, UNIK, harus tepat 13 digit angka
//   penulis    Array of String (EMBEDDED), minimal 1 penulis
//   penerbit   Subdocument (EMBEDDED, tanpa _id sendiri):
//                nama  String, wajib
//                tahun Number, 1900 s.d. tahun berjalan
//   kategoriId ObjectId (REFERENCING ke model "Kategori"), wajib
//   stok       Number, default 0, tidak boleh negatif
//   createdAt  Date, default waktu saat ini
//
// Petunjuk: lihat models/kategoriModel.js sebagai contoh sintaks dasar,
// dan materi Pertemuan 9-10 (embedding vs referencing).

const mongoose = require("mongoose");

// TODO A1: buat schema subdocument penerbit
const penerbitSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
    },
    tahun: {
      type: Date,
      min: [1990, "Tahun minimal 1990"],
      max: [Date.now, "Tahun maksimal hingga tahun berjalan"],
    },
  },
  { _id: false } // Menghilangkan _id otomatis untuk subdocument
);

// TODO A2: buat bukuSchema
const bukuSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: [true, "Judul wajib diisi"],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, "Kode ISBN wajib diisi"],
    unique: true,
    match: [/^\d{13}$/, "Kode harus tepat 13 digit angka"],
  },
  penulis: {
    type: [String],
    validate: {
      validator: function (val) {
        return Array.isArray(val) && val.length >= 1;
      },
      message: "Minimal harus menyertakan 1 penulis",
    },
  },
  penerbit: {
    type: penerbitSchema,
    required: [true, "Informasi gizi wajib diisi"],
  },
  kategoriId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kategori",
    required: [true, "kategoriId wajib diisi"],
  },
  stok: {
    type: Number,
      min: [0, "Protein tidak boleh negatif"],
      default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// TODO A3: export model dengan nama "Buku"
const Buku = mongoose.model("Buku", bukuSchema);

module.exports = Buku;