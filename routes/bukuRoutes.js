// TODO C: Routing Buku (semua endpoint publik, tanpa autentikasi)
//   GET    /          daftar buku
//   GET    /:id       detail buku
//   POST   /          tambah buku
//   PUT    /:id       ubah buku
//   DELETE /:id       hapus buku

const express = require("express");
const router = express.Router();
// TODO C1: require bukuController dari ../controllers/bukuController
const bukuController = require("../controllers/bukuController");
// TODO C1: daftarkan kelima route di atas ke fungsi controller yang sesuai
router
  .route("/")
  .get(bukuController.getAll)
  .post(bukuController.create);

router
  .route("/:id")
  .get(bukuController.getById)
  .put(bukuController.update)
  .delete(menuController.remove);

module.exports = router;
module.exports = router;
