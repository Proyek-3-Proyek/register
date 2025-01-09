let emailGlobal = "";

// Event Listener untuk Tombol Daftar
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("signupButton")
    .addEventListener("click", async function () {
      const email = document.getElementById("email").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const noHp = document.getElementById("no_hp").value;

      // Validasi input
      if (!email || !username || !password || !confirmPassword || !noHp) {
        Swal.fire({
          icon: "warning",
          title: "Peringatan",
          text: "Harap isi semua data!",
        });
        return;
      }

      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Peringatan",
          text: "Password tidak sesuai!",
        });
        return;
      }

      const phoneRegex = /^[0-9]{10,13}$/;
      if (!phoneRegex.test(noHp)) {
        Swal.fire({
          icon: "error",
          title: "Peringatan",
          text: "Nomor HP tidak valid! Gunakan format angka 10-13 digit.",
        });
        return;
      }

      // Tampilkan loading sebelum permintaan dikirim
      let loading;
      Swal.fire({
        title: "Mendaftar...",
        text: "Harap tunggu sementara kami memproses permintaan Anda.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          loading = Swal;
        },
      });

      try {
        // Kirim permintaan ke endpoint register
        const response = await fetch(
          "https://backend-eight-phi-75.vercel.app/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              nama: username,
              password,
              no_hp: noHp,
            }),
          }
        );

        const result = await response.json();

        // Tutup loading
        loading.close();

        if (response.ok) {
          emailGlobal = email; // Simpan email untuk proses OTP
          localStorage.setItem("email", email); // Simpan di localStorage

          // Kirim OTP ke email
          const otpResponse = await fetch(
            "https://backend-eight-phi-75.vercel.app/api/auth/request-reset-password",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );

          const otpResult = await otpResponse.json();

          if (otpResponse.ok) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Pendaftaran berhasil! Silakan verifikasi email Anda.",
            }).then(() => {
              window.location.href = "/register/OTP"; // Halaman verifikasi OTP
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: otpResult.message || "Gagal mengirim OTP.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: result.message || "Pendaftaran gagal!",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        loading.close(); // Tutup loading jika terjadi error
        Swal.fire({
          icon: "error",
          title: "Kesalahan",
          text: "Terjadi kesalahan pada server.",
        });
      }
    });

  // Event Listener untuk Verifikasi OTP
  if (window.location.pathname.includes("/register/OTP")) {
    const emailGlobal = localStorage.getItem("email");
    if (!emailGlobal) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Email tidak ditemukan. Silakan ulangi proses registrasi.",
      });
      window.location.href = "/register";
    }

    document
      .getElementById("verifyOtpButton")
      .addEventListener("click", async function () {
        const otpInputs = document.querySelectorAll(".otp-input");
        const otpCode = Array.from(otpInputs)
          .map((input) => input.value)
          .join("");

        console.log("Email:", emailGlobal); // Debugging
        console.log("OTP Code:", otpCode); // Debugging

        if (otpCode.length !== 6) {
          Swal.fire({
            icon: "warning",
            title: "Peringatan",
            text: "Harap masukkan kode OTP dengan lengkap!",
          });
          return;
        }

        // Tampilkan loading sebelum permintaan dikirim
        let loading;
        Swal.fire({
          title: "Verifikasi OTP...",
          text: "Harap tunggu sementara kami memverifikasi OTP Anda.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            loading = Swal;
          },
        });

        try {
          const verifyResponse = await fetch(
            "https://backend-eight-phi-75.vercel.app/api/auth/verify-otp",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: emailGlobal,
                otp: otpCode,
              }),
            }
          );

          const verifyResult = await verifyResponse.json();
          console.log("Verify Response:", verifyResult); // Debugging

          // Tutup loading
          loading.close();

          if (verifyResponse.ok) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Verifikasi berhasil! Anda akan diarahkan ke halaman login.",
            }).then(() => {
              window.location.href = "/login";
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: verifyResult.message || "Kode OTP tidak valid!",
            });
          }
        } catch (error) {
          console.error("Error:", error);
          loading.close(); // Tutup loading jika terjadi error
          Swal.fire({
            icon: "error",
            title: "Kesalahan",
            text: "Terjadi kesalahan pada server.",
          });
        }
      });

    // Event Listener untuk Kirim Ulang OTP
    document
      .getElementById("resendOtp")
      .addEventListener("click", async function () {
        try {
          const resendResponse = await fetch(
            "https://backend-eight-phi-75.vercel.app/api/auth/request-reset-password",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: emailGlobal }),
            }
          );

          const resendResult = await resendResponse.json();

          if (resendResponse.ok) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "OTP berhasil dikirim ulang ke email Anda.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: resendResult.message || "Gagal mengirim ulang OTP.",
            });
          }
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Kesalahan",
            text: "Terjadi kesalahan pada server.",
          });
        }
      });
  }
});
