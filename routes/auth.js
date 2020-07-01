// keep separate from user bc we might have more routes in the future

var express = require('express');
var router = express.Router();
const { loginWithEmail, loginFacebook, facebookAuthHandler, loginGoogle, googleAuthHandler } = require("../controllers/authController")
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

// router.route("logout").get(loginRequired, logout)
router.route("/facebook/login")
.get(loginFacebook)

router.route("/facebook/authorized")
.get(facebookAuthHandler)

router.route("/google/login")
.get(loginGoogle)

router.route("/google/authorized")
.get(googleAuthHandler)

module.exports = router;
