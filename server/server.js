const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const port = process.env.PORT;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();


const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Message = require('./models/Message');

app.use(cors());
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/pulsepost';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// Set up static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Login route
app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(409).send("User with this email does not exist");
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      const payload = {
        email: user.email,
        name: user.name,
        username: user.username,
      };
      
      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "24h",
      });
      
      res.status(200).json({
        token,
        name: user.name,
        username: user.username,
        userid: user._id,
      });
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (err) {
    console.error("Error occurred during login:", err);
    res.status(500).send("Error occurred during login");
  }
});

// Signup route
app.post("/signup", async function (req, res) {
  const { name, email, username, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(409).send("User already exists");
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword
    });
    
    await newUser.save();
    
    const payload = {
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
    };
    
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
    });
    
    res.status(200).json({
      token,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      userid: newUser._id,
    });
  } catch (err) {
    console.error("Error occurred during signup:", err);
    res.status(500).send("Error occurred during signup");
  }
});

// Get posts route
app.get("/getposts", async function (req, res) {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    const postsWithUserInfo = [];

    for (const post of posts) {
      const user = await User.findById(post.userid);
      if (user) {
        postsWithUserInfo.push({
          postid: post._id,
          post: post.post,
          userid: post.userid,
          name: user.name,
          username: user.username,
          created_at: post.created_at,
          likes: post.likes,
          likedBy: post.likedBy,
          media_path: post.media_path,
        });
      }
    }

    res.status(200).json(postsWithUserInfo);
  } catch (err) {
    console.error("Error occurred during fetching posts:", err);
    res.status(500).send("Error occurred during fetching posts");
  }
});

// Like post route
app.post("/like", async function (req, res) {
  const { postid, userid } = req.body;
  
  if (!userid) {
    return res.status(400).send("User ID is required");
  }
  
  try {
    // Find the post first
    const post = await Post.findById(postid);
    
    if (!post) {
      return res.status(404).send("No post found with the provided post id.");
    }
    
    // Check if user has already liked this post
    const userObjectId = new mongoose.Types.ObjectId(userid);
    if (post.likedBy.some(id => id.equals(userObjectId))) {
      return res.status(400).send("You have already liked this post");
    }
    
    // Update the post with the new like
    const updatedPost = await Post.findByIdAndUpdate(
      postid,
      { 
        $inc: { likes: 1 },
        $push: { likedBy: userid }
      },
      { new: true }
    );
    
    res.status(200).send("Post liked successfully");
  } catch (err) {
    console.error("Error occurred during liking a post:", err);
    res.status(500).send("Error occurred during liking a post");
  }
});

// Create post route
app.post("/post", upload.single("media"), async function (req, res) {
  const { userid, post } = req.body;
  const media = req.file;
  const mediaPath = media ? media.filename : null;
  
  try {
    const newPost = new Post({
      userid,
      post,
      media_path: mediaPath
    });
    
    await newPost.save();
    res.status(200).send("Post was added successfully");
  } catch (err) {
    console.error("Error occurred during adding a post:", err);
    res.status(500).send("Error occurred during adding a post");
  }
});

// Delete post route
app.post("/delete", async function (req, res) {
  const { postid } = req.body;
  
  try {
    const deletedPost = await Post.findByIdAndDelete(postid);
    
    if (!deletedPost) {
      return res.status(404).send("No post found with the provided post id.");
    }
    
    console.log("Post deleted successfully");
    res.status(200).send("Post was deleted successfully");
  } catch (err) {
    console.error("Error occurred during deleting a post:", err);
    res.status(500).send("Error occurred during deleting a post");
  }
});

// Add comment route
app.post("/comment", async function (req, res) {
  const { postid, userid, comment } = req.body;
  
  try {
    const newComment = new Comment({
      postid,
      userid,
      comment
    });
    
    await newComment.save();
    res.status(200).send("Comment was added successfully");
  } catch (err) {
    console.error("Error occurred during adding a comment:", err);
    res.status(500).send("Error occurred during adding a comment");
  }
});

// Get comments for a post route
app.get("/comments/:postid", async function (req, res) {
  const { postid } = req.params;
  
  try {
    // Find all comments for the post
    const comments = await Comment.find({ postid })
      .sort({ created_at: -1 })
      .lean();
    
    // Get user information for each comment
    const commentsWithUserInfo = await Promise.all(comments.map(async (comment) => {
      const user = await User.findById(comment.userid).lean();
      return {
        commentid: comment._id,
        comment: comment.comment,
        username: user.username,
        name: user.name,
        userid: comment.userid,
        created_at: comment.created_at
      };
    }));
    
    res.status(200).send(commentsWithUserInfo);
  } catch (err) {
    console.error("Error while fetching comments", err);
    res.status(500).send("Error while fetching comments");
  }
});

// Delete comment route
app.post("/deletecomment", async function (req, res) {
  const { commentid } = req.body;
  
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentid);
    
    if (!deletedComment) {
      return res.status(404).send("No comment found with the provided comment id.");
    }
    
    console.log("Comment deleted successfully");
    res.status(200).send("Comment was deleted successfully");
  } catch (err) {
    console.error("Error occurred during deleting a comment:", err);
    res.status(500).send("Error occurred during deleting a comment");
  }
});

// Get all users for messaging
app.get("/users", async function (req, res) {
  try {
    const users = await User.find({}, 'name username _id').lean();
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});

// Send a message
app.post("/message", async function (req, res) {
  const { sender, recipient, content } = req.body;
  
  try {
    const newMessage = new Message({
      sender,
      recipient,
      content
    });
    
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).send("Error sending message");
  }
});

// Get conversation between two users
app.get("/messages/:userId/:otherUserId", async function (req, res) {
  const { userId, otherUserId } = req.params;
  
  try {
    // Find messages where current user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ created_at: 1 }).lean();
    
    // Mark messages as read if current user is recipient
    await Message.updateMany(
      { sender: otherUserId, recipient: userId, read: false },
      { $set: { read: true } }
    );
    
    res.status(200).send(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send("Error fetching messages");
  }
});

// Get unread message count
app.get("/messages/unread/:userId", async function (req, res) {
  const { userId } = req.params;
  
  try {
    const unreadCount = await Message.countDocuments({
      recipient: userId,
      read: false
    });
    
    res.status(200).json({ count: unreadCount });
  } catch (err) {
    console.error("Error fetching unread message count:", err);
    res.status(500).send("Error fetching unread message count");
  }
});

// Get recent conversations
app.get("/conversations/:userId", async function (req, res) {
  const { userId } = req.params;
  
  try {
    // Find all users the current user has exchanged messages with
    const sentMessages = await Message.find({ sender: userId })
      .distinct('recipient');
    
    const receivedMessages = await Message.find({ recipient: userId })
      .distinct('sender');
    
    // Combine and remove duplicates
    const conversationUserIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Get user details for each conversation
    const conversations = await Promise.all(conversationUserIds.map(async (otherUserId) => {
      const user = await User.findById(otherUserId, 'name username').lean();
      
      // Get the most recent message
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, recipient: otherUserId },
          { sender: otherUserId, recipient: userId }
        ]
      }).sort({ created_at: -1 }).lean();
      
      // Get unread count
      const unreadCount = await Message.countDocuments({
        sender: otherUserId,
        recipient: userId,
        read: false
      });
      
      return {
        userId: otherUserId,
        name: user.name,
        username: user.username,
        lastMessage: lastMessage.content,
        lastMessageTime: lastMessage.created_at,
        unreadCount
      };
    }));
    
    // Sort by most recent message
    conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    
    res.status(200).send(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).send("Error fetching conversations");
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
