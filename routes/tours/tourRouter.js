const express = require("express");
const { getAllTours, getTour, postTour, patchTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan } = require("../../controllers/tours/toursController");

const router = express.Router();

// router.param("id", checkId);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(getAllTours).post(postTour);
router.route("/:id").get(getTour).patch(patchTour).delete(deleteTour);

module.exports = router;