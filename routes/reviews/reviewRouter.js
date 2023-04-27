const express = require("express");
const { getAllReviews, postReview, deleteReview, patchReview, setTourUserId, getReview } = require("../../controllers/reviews/reviewsController");
const { protect, restrictTo } = require("../../controllers/auth/authController")

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route("/").get(getAllReviews).post(restrictTo("user"), setTourUserId, postReview)
router.route("/:id").get(getReview).patch(restrictTo("admin", "user"), patchReview).delete(restrictTo("admin", "user"), deleteReview)

module.exports = router;