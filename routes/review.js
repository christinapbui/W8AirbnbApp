var express = require('express');
var router = express.Router({mergeParams:true});
const { getReviewList, createReview, updateReview, deleteReview } = require("../controllers/reviewController");
const { loginRequired } = require("../middleware/auth")

router.route("/")
.get(getReviewList)
.post(loginRequired, createReview)

router.route("/:rid")
.patch(loginRequired, updateReview)
.delete(loginRequired, deleteReview)


module.exports = router;