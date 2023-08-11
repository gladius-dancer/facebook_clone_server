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
router.post("/add-avatar", userController.addAvatar);
router.get("/users", authMiddleware, userController.getUsers);
router.get("/friends", authMiddleware, userController.getFriends);
router.get("/friend-requests", authMiddleware, userController.friendRequests);
router.get("/unfriends", authMiddleware, userController.getUnfriends);
router.get("/familliars", authMiddleware, userController.getFamilliars);
router.post("/add-post", authMiddleware, postsController.addPost);
router.get("/posts", authMiddleware, postsController.getAllPosts);
router.post("/add-comment", authMiddleware, commentsController.addComment);
router.get("/comments", authMiddleware, commentsController.getAllComments);
router.post("/friend-request", authMiddleware, userController.friendRequest);
router.post("/add-to-friend", authMiddleware, userController.addToFriend);
router.post("/cancel-friend-request", authMiddleware, userController.cancelFriendRequest);
router.post("/delete-friend-request", authMiddleware, userController.deleteFriendRequest);


module.exports = router;
