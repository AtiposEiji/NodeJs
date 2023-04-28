const express = require("express");
const multer = require("multer");
const { getAllUsers, getUser, patchUser, deleteUser, updateMe, deleteMe, getMe } = require("../../controllers/users/usersController");
const { signup, login, protect, forgotPassword, resetPassword, updatePassword, restrictTo } = require("../../controllers/auth/authController");

const upload = multer({ dest: "public/img/users" });
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Protect all routes after this middleware 
router.use(protect);

router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/updateMe", upload.single("photo"), updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;