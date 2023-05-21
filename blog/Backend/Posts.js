const mongoose = require('mongoose');

const table = new mongoose.Schema({
    
    Nickname: {  //to tell who is making the post
      type: String,
      required: true
    },
    Post: {     //the post itself
      type: String,
      required: true
    },
    Comments: [{ //comments on the post
      text: {
        type: String,
        required: false
      },
      username: {  //commented by:
        type: String,
        required: false
      }
    }]
});

const mymodel = mongoose.model("Posts",table);
module.exports = mymodel;