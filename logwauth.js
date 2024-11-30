// import {
//     qrController,
//     deleteCookie,
//   } from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.2.1/whatsauth.js";
//   import { wauthparam } from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.2.1/config.js";
  
//   wauthparam.auth_ws = "d3NzOi8vYXBpLndhLm15LmlkL3dzL3doYXRzYXV0aC9wdWJsaWM=";
//   wauthparam.keyword = "  aHR0cHM6Ly93YS5tZS82Mjg1MTU3OTc5NzU5P3RleHQ9d2g0dDVhdXRoMA==";
//   wauthparam.tokencookiehourslifetime = 18;
//   wauthparam.redirect = "https://itung.in.my.id/dashboard/";
//   deleteCookie(wauthparam.tokencookiename);
//   qrController(wauthparam);
  
import {
  qrController,
  deleteCookie,
} from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.2.1/whatsauth.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";

const backendAuthAPI = "https://your-backend-api-url.com/api/auth/verify";

// Konfigurasi WhatsAuth
const wauthparam = {
  auth_ws: "d3NzOi8vYXBpLndhLm15LmlkL3dzL3doYXRzYXV0aC9wdWJsaWM=", // Ganti dengan parameter dari API Anda
  keyword: "aHR0cHM6Ly93YS5tZS82Mjg1MTU3OTc5NzU5P3RleHQ9d2g0dDVhdXRoMA==",
  tokencookiehourslifetime: 18,
};
deleteCookie("wauthToken"); // Hapus token lama

// QR Controller
qrController(wauthparam);

// Fungsi Callback setelah QR dipindai
window.addEventListener("message", async (event) => {
  if (event.origin !== "https://wa.my.id") return; // Ganti dengan domain valid WhatsAuth Anda
  const { token } = event.data;

  if (token) {
      try {
          // Kirim token ke backend untuk verifikasi
          const response = await fetch(backendAuthAPI, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
          });
          const result = await response.json();

          if (response.ok && result.role) {
              // Cek role dari response
              if (result.role === "admin") {
                  Swal.fire({
                      icon: "success",
                      title: "Login Admin Berhasil",
                      text: "Anda akan diarahkan ke halaman Admin.",
                  }).then(() => {
                      window.location.href = "https://pos-akuntan.github.io/adminpage/"; // Halaman admin
                  });
              } else if (result.role === "user") {
                  Swal.fire({
                      icon: "success",
                      title: "Login User Berhasil",
                      text: "Anda akan diarahkan ke halaman User.",
                  }).then(() => {
                      window.location.href = "https://pos-akuntan.github.io/db/"; // Halaman user
                  });
              }
          } else {
              throw new Error(result.message || "Login gagal. Silakan coba lagi.");
          }
      } catch (error) {
          Swal.fire({
              icon: "error",
              title: "Login Gagal",
              text: error.message || "Terjadi kesalahan saat memproses login.",
          });
      }
  }
});
