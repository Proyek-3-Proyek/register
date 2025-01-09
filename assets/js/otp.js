document.addEventListener("DOMContentLoaded", () => {
  const emailGlobal = localStorage.getItem("email");
  if (!emailGlobal) {
    Swal.fire({
      icon: "error",
      title: "Kesalahan",
      text: "Email tidak ditemukan. Silakan ulangi proses registrasi.",
    });
    window.location.href = "/register";
    return;
  }

  // Event Listener untuk Verifikasi OTP
  const verifyButton = document.getElementById("verifyOtpButton");
  if (verifyButton) {
    verifyButton.addEventListener("click", async function () {
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

        // Tutup loading setelah respons diterima
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
  }

  // Event Listener untuk Kirim Ulang OTP
  const resendButton = document.getElementById("resendOtp");
  if (resendButton) {
    resendButton.addEventListener("click", async function () {
      // Tampilkan loading sebelum permintaan dikirim
      let loading;
      Swal.fire({
        title: "Mengirim ulang OTP...",
        text: "Harap tunggu sementara kami mengirim ulang OTP ke email Anda.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          loading = Swal;
        },
      });

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

        // Tutup loading setelah respons diterima
        loading.close();

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
        loading.close(); // Tutup loading jika terjadi error
        Swal.fire({
          icon: "error",
          title: "Kesalahan",
          text: "Terjadi kesalahan pada server.",
        });
      }
    });
  }
});
