const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

// Login User
export const loginUser = async (formData) => {
  try {
    const res = await fetch(`${backend}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include", // untuk mengirimkan cookie dari server
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    throw new Error(err.message || "Login gagal");
  }
};

// Register User
export const registerUser = async (formData) => {
  try {
      const res = await fetch(`${backend}/register`, {
        method: "POST",
        body: formData, // ⛔ JANGAN pakai JSON.stringify
        credentials: "include",
      });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    throw new Error(err.message || "Registrasi gagal");
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const res = await fetch(`${backend}/logout`, {
      method: "POST",
      credentials: "include", // penting untuk hapus cookie token
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    throw new Error(err.message || "Logout gagal");
  }
};

// Ambil data user yang sedang login
export const currentUser = async () => {
  try {
    const res = await fetch(`${backend}/me`, {
        method: "GET",
        credentials: "include", // gunakan ini untuk akses token di cookie
        headers: {
          "Content-Type": "application/json",
        },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Gagal mengambil user saat ini:", err.message);
    return null;
  }
};
