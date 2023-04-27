const express = require("express");
const { getAllTours, getTour, postTour, patchTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan, getToursWithin, getDistances } = require("../../controllers/tours/toursController");
const { protect, restrictTo } = require("../../controllers/auth/authController");
const reviewRouter = require("../reviews/reviewRouter");
// const { getAllReviews, postReview } = require("../../controllers/reviews/reviewsController");

const router = express.Router();

// router.param("id", checkId);

router.use("/:tourId/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);
router.route("/tours-within/:distance/center/:latlng/unit/:unit").get(getToursWithin);
router.route("/distances/:latlng/unit/:unit").get(getDistances);
router.route("/").get(getAllTours).post(protect, restrictTo("admin", "lead-guide"), postTour);
router.route("/:id").get(getTour).patch(protect, restrictTo("admin", "lead-guide"), patchTour).delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// This is pretty messi 'cause we put a route for creatina a review in the tour router.
// router.route("/:tourId/reviews").post(protect, restrictTo("user"), postReview);

module.exports = router;