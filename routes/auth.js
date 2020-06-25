// keep separate from user bc we might have more routes in the future

var express = require('express');
var router = express.Router();
const { loginWithEmail } = require("../controllers/authController")
const { logout } = require("../controllers/userController");
const { loginRequired } = require("../middleware/auth")


/* end goal: localhost:500/auth/login */
// change password, reset password

// localhost:5000/auth
router.route("/login")
.post(loginWithEmail)

//logout
router
.get("/logout", loginRequired, logout)

module.exports = router;
