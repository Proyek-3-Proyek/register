let emailGlobal = "";

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

    try {
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

      if (response.ok) {
        emailGlobal = email; // Simpan email untuk proses verifikasi OTP

        // Kirim permintaan OTP ke email
        const otpResponse = await fetch(
          "https://backend-eight-phi-75.vercel.app/api/auth/request-reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        const otpResult = await otpResponse.json();

        if (otpResponse.ok) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pendaftaran berhasil! Silakan verifikasi email Anda.",
          }).then(() => {
            window.location.href = "/verify-otp.html"; // Halaman verifikasi OTP
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
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Terjadi kesalahan pada server.",
      });
    }
  });

// Tambahkan fungsi untuk verifikasi OTP
if (window.location.pathname === "/verify-otp.html") {
  document
    .getElementById("verifyOtpButton")
    .addEventListener("click", async function () {
      const otpCode = document.getElementById("otpCode").value;

      if (!otpCode) {
        Swal.fire({
          icon: "warning",
          title: "Peringatan",
          text: "Harap masukkan kode OTP!",
        });
        return;
      }

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

        if (verifyResponse.ok) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Verifikasi berhasil! Anda akan diarahkan ke halaman login.",
          }).then(() => {
            window.location.href = "/login"; // Halaman login
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
        Swal.fire({
          icon: "error",
          title: "Kesalahan",
          text: "Terjadi kesalahan pada server.",
        });
      }
    });
}
