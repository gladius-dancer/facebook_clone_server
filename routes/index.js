const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const postsController = require("../controllers/posts-controller");
const commentsController = require("../controllers/comments-controller");
const {body} = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

const router  = new Router();

router.post("/register",
    body("email").isEmail(),
    body("password").isLength({min: 4, max: 16}),
    userController.register);

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);
router.post("/add-post", authMiddleware, postsController.addPost);
router.get("/get-all-posts", authMiddleware, postsController.getAllPosts);
router.post("/add-comment", authMiddleware, commentsController.addComment);
router.get("/get-all-comments", authMiddleware, commentsController.getAllComments);

module.exports = router;
