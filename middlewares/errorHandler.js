// TODO D: Middleware error handling terpusat (Pertemuan 5 & 11-12)
// Didaftarkan PALING AKHIR pada app.js. Respons error SELALU berbentuk { message }.
//
// Pemetaan error -> status:
//   err.status ada (mis. { status: 404, message })  -> pakai status & message tersebut
//   ValidationError (Mongoose)                        -> 400, message dari error
//   CastError (format id/ObjectId salah)              -> 400, "Format <err.path> tidak valid"
//   Duplicate key (err.code === 11000)                -> 400, "Data dengan nilai unik tersebut sudah ada"
//   error lain yang tidak terduga                     -> 500, catat ke console.error,
//                                                        message ke client TETAP generik
//                                                        ("Terjadi kesalahan pada server"),
//                                                        stack trace jangan dibocorkan

function errorHandler(err, req, res, next) {
  // TODO D1
  let statusCode = 500;
  let message = "Terjadi kesalahan pada server";

  // 1. Jika err.status sudah diset manual (misal: throw { status: 404, message })
  if (err.status) {
    statusCode = err.status;
    message = err.message || message;
  } 
  // 2. Mongoose ValidationError
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } 
  // 3. Mongoose CastError (format id / ObjectId salah)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Format ${err.path} tidak valid`;
  } 
  // 4. Mongoose Duplicate Key Error (err.code === 11000)
  else if (err.code === 11000) {
    statusCode = 400;
    message = "Data dengan nilai unik tersebut sudah ada";
  } 
  // 5. Error lain yang tidak terduga (Internal Server Error)
  else {
    console.error("Unexpected Error:", err);
  }

  // Kirim respons JSON SELALU berbentuk { message }
  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
