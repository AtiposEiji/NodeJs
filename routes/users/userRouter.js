const express = require("express");
const { getAllUsers, getUser, postUser, patchUser, deleteUser } = require("../../controllers/users/usersController");
const { signup } = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/signup", signup)
router.route("/").get(getAllUsers).post(postUser);
router.route("/:id").get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;