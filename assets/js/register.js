const modal = document.getElementById("modalAlert");
const closeModal = document.getElementById("closeModal");
const modalMessage = document.getElementById("modalMessage");

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
      modalMessage.textContent = "Harap isi semua data!";
      modal.classList.remove("hidden"); // Tampilkan modal error
      return;
    }

    if (password !== confirmPassword) {
      modalMessage.textContent = "Password tidak sesuai!";
      modal.classList.remove("hidden"); // Tampilkan modal error
      return;
    }

    // Validasi format nomor HP (opsional)
    const phoneRegex = /^[0-9]{10,13}$/; // Format: hanya angka, panjang 10-13 karakter
    if (!phoneRegex.test(noHp)) {
      modalMessage.textContent =
        "Nomor HP tidak valid! Gunakan format angka 10-13 digit.";
      modal.classList.remove("hidden"); // Tampilkan modal error
      return;
    }

    try {
      // Kirim permintaan POST ke endpoint register backend
      const response = await fetch(
        "https://backend-eight-phi-75.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            nama: username, // Sesuaikan dengan backend yang menerima "nama"
            password,
            no_hp: noHp, // Kirim nomor HP yang dimasukkan user
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Jika berhasil, alihkan ke halaman login
        alert("Pendaftaran berhasil! Anda akan diarahkan ke halaman login.");
        window.location.href = "/login";
      } else {
        // Jika gagal, tampilkan pesan error dari backend
        modalMessage.textContent = result.message || "Pendaftaran gagal!";
        modal.classList.remove("hidden"); // Tampilkan modal error
      }
    } catch (error) {
      console.error("Error:", error);
      modalMessage.textContent = "Terjadi kesalahan pada server.";
      modal.classList.remove("hidden"); // Tampilkan modal error
    }
  });

closeModal.addEventListener("click", function () {
  modal.classList.add("hidden"); // Sembunyikan modal error
});
