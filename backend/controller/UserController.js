import User from "../models/UserModels.js";

export const getUser = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedData = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      image: req.file ? req.file.filename : user.image,
      address: req.body.address,
      no_hp: req.body.no_hp
    };

    await user.update(updatedData);
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id); // hanya user yang login
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Password lama salah" });

    if (!newPassword || newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Konfirmasi password tidak cocok" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password berhasil diubah" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.image) {
          const imageArray = user.image
            .split(", ")
            .filter((img) => img.trim() !== "");
          imageArray.forEach((img) => {
            const imagePath = path.join(__dirname, "..", "public", "uploads", img);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          });
        }

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
