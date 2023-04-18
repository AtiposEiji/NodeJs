const express = require("express");
const { getAllUsers, getUser, postUser, patchUser, deleteUser } = require("../../controllers/users/usersController");

const router = express.Router();

router.route("/").get(getAllUsers).post(postUser);
router.route("/:id").get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;