// TODO B: Controller Buku - CRUD lengkap (Pertemuan 3-4, 9-12)
//
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Buku tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;

// GET /buku
// Query opsional:
//   kategoriId  filter berdasarkan kategori
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=judul,isbn
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kategoriId yang ter-populate (objek Kategori)
exports.getAll = async (req, res) => {
  // TODO B1
  const filter = {};
  if (req.query.kategoriId) {
    filter.kategoriId = req.query.kategoriId;
  }
  const total = await Buku.countDocuments(filter);

  const page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }
  const skip = (page - 1) * limit;

  let query = Buku.find(filter)
    .populate("kategoriId")
    .skip(skip)
    .limit(limit);

    if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("createdAt");
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  }

  const data = await query;

  res.status(200).json({
    data,
    page,
    limit,
    total,
  });

};

// GET /buku/:id
//   - 200 -> dokumen buku, kategoriId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  // TODO B2
  const buku = await Buku.findById(req.params.id).populate("kategoriId");
  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }
  res.status(200).json(buku);
};

// POST /buku
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  // TODO B3
  const buku = await Buku.create(req.body);
  res.status(201).json(buku);
};

// PUT /buku/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  // TODO B4
  const buku = await Buku.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }
  res.status(200).json(buku);
};

// DELETE /buku/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  // TODO B5
  const buku = await Buku.findByIdAndDelete(req.params.id);
  if (!buku) {
    throw { status: 404, message: "Buku tidak ditemukan" };
  }
  res.status(204).send();
};
