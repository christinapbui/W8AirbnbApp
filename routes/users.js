var express = require('express');
var router = express.Router();
const { createUser, getMyProfile, changeInfo } = require("../controllers/userController");
const { loginRequired } = require("../middleware/auth")

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.route("/")
.get(function(req, res, next) {
  res.send('respond with a resource');
})
.post(createUser)

//localhost:5000/users/me => all current user information
router.route("/me")
.get(loginRequired, getMyProfile)
.put(loginRequired, changeInfo)



module.exports = router;
