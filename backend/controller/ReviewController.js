import Review from '../models/ReviewModels.js'
import Product from '../models/ProductModels.js'
import User from '../models/UserModels.js'

export const createReview = async (req, res) =>{
    const {product_id, user_id, rating, comment}= req.body

    try {
        const review = await Review.create({
            product_id,
            user_id:req.user.id,
            rating,
            comment
        })

        res.status(200).json({message:'Review berhasil ditambahkan, terima kasih atas feedbacknya', review})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [{ model: Product }, { model: User, attributes: ["name"] }],
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const reviews = await Review.findAll({
      where: { product_id },
      include: [{ model: User, attributes: ["name"] }],
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    // Validasi kepemilikan review atau admin
    if (req.user.id !== review.user_id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Akses ditolak, bukan pemilik review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.status(200).json({ message: "Review berhasil diperbarui", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);
    if (!review)
      return res.status(404).json({ message: "Review tidak ditemukan" });

    if (req.user.id !== review.user_id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    await review.destroy();
    res.status(200).json({ message: "Review berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};