const router = require("express").Router({mergeParams:true})
const { getExperiences, createExperiences, deleteExperience, updateExperience } = require("../controllers/expController");
const { loginRequired, hostRequired } = require("../middleware/auth") 
const reviewRouter = require("./review")

router.route("/")
.get(getExperiences)
.post(loginRequired, hostRequired, createExperiences)

router.route("/:eid") // eid = "experience id"
.delete(loginRequired, hostRequired, deleteExperience)
.patch(loginRequired, hostRequired, updateExperience)

router.use("/:eid/reviews", reviewRouter)


module.exports = router