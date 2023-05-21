const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("REPLACE WITH YOUR LINK", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("DB Connection Established"))
.catch(console.error);

const users = require('./Accounts.js');
const posts = require("./Posts.js");


app.get('/',cors(),(req,res) => {
    
});

app.post('/login', async (req, res) => {
  const {Email, Password} = req.body;

  try {
    // Find the user in MongoDB by email
    const user = await users.findOne({ Email });

    if (!user) {
      // If the user doesn't exist, return "User doesn't exist"
      return res.json("User doesn't exist");
    }

    // Check if the password is correct
    if (user.Password !== Password) {
      // If the password is incorrect, return an error message
      return res.json("Incorrect password");
    }

    // If the email and password are correct, return the username along with the response
    console.log(user.Nickname);
    return res.json(user.Nickname);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while processing the login");
  }
});

app.post('/signup', async (req, res) => {
  const { Email, Password, Nickname } = req.body;

  try {
    // Check if the user already exists in MongoDB by email
    const existingUserEmail = await users.findOne({ Email });
    const existingUserNickname = await users.findOne({ Nickname });

    if (existingUserEmail) {
      // If the user already exists with the same email, return an error message
      return res.json("User already exists with the same email");
    }

    if (existingUserNickname) {
      // If the nickname is already taken, return an error message
      return res.json("Nickname is already taken");
    }

    // Create a new user in MongoDB
    const newUser = await users.create({ Email, Password, Nickname });

    // Return the newly created user's information
    return res.json(newUser);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while processing the signup");
  }
});

app.post('/updateProfile', async (req, res) => {
  
  const { Email, Password, Nickname } = req.body;

  try {
    // Find the user in MongoDB by email
    const user = await users.findOne({ Email });

    if (!user) {
      // If the user doesn't exist, return an error message
      return res.json("User doesn't exist");
    }

    // Check if the new nickname already exists for another user
    const existingUserWithNickname = await users.findOne({ Nickname });

    if (existingUserWithNickname && existingUserWithNickname.Email !== Email) {
      // If the nickname already exists for another user, return an error message
      return res.json("Nickname is already taken");
    }

    // Update the user's nickname and password
    user.Nickname = Nickname;
    user.Password = Password;

    // Save the updated user in MongoDB
    await user.save();

    // Return a success message or the updated user's information
    return res.json("Profile updated successfully");
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while processing the update");
  }
});

app.post('/postBlog', async (req, res) => {
  const { Nickname, Post } = req.body;

  try {
    // Create a new post in MongoDB
    const newPost = await posts.create({ Nickname, Post });

    // Return the newly created post
    return res.json(newPost);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while creating the post");
  }
});

app.post('/readOthersBlogPosts', async (req, res) => {
  const { Nickname } = req.body;

  try {
    // Retrieve all blog posts except the ones by the specified nickname
    const otherPosts = await posts.find({ Nickname: { $ne: Nickname } });

    // Return the other blog posts
    return res.json(otherPosts);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while retrieving the blog posts");
  }
});

app.post('/readOwnBlogPosts', async (req, res) => {
  const { Nickname } = req.body;

  try {
    // Retrieve blog posts by the specified nickname
    const ownPosts = await posts.find({ Nickname });

    // Return the blog posts belonging to the nickname
    return res.json(ownPosts);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while retrieving the blog posts");
  }
});

app.post('/updateOwnBlogPost', async (req, res) => {
  const { _id, Post } = req.body;

  try {
    // Find the blog post by _id and update the Post field
    const updatedPost = await posts.findByIdAndUpdate(_id, { Post }, { new: true });

    // Check if the post was found and updated successfully
    if (!updatedPost) {
      return res.json("Failed to update the blog post");
    }

    // Return the updated blog post
    return res.json(updatedPost);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while updating the blog post");
  }
});

app.post('/deleteOwnBlogPost', async (req, res) => {
  const { _id } = req.body;

  try {
    // Find the blog post by _id and delete it
    const deletedPost = await posts.findByIdAndDelete(_id);

    // Check if the post was found and deleted successfully
    if (!deletedPost) {
      return res.json("Failed to delete the blog post");
    }

    // Return a success message
    return res.json("Blog post deleted successfully");
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while deleting the blog post");
  }
});

app.post('/commentOnPost', async (req, res) => {
  const { _id, Nickname, Comment } = req.body;

  try {
    // Find the blog post by _id
    const post = await posts.findById(_id);

    // Check if the post exists
    if (!post) {
      return res.json("Blog post not found");
    }

    // Add the comment to the post's Comments array
    post.Comments.push({ text: Comment, username: Nickname });

    // Save the updated post
    await post.save();

    // Return the updated post
    return res.json(post);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.json("An error occurred while adding the comment");
  }
});











app.listen(8000, () => console.log("Server : Port 8000"));


