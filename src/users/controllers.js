const User = require("./model");
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    try {
      console.log(req.body)
  
      const user = await User.create(req.body);
  
      res.status(201).json({ message: "success", user: { username: req.body.username, email: req.body.email } });
    } catch (error) {
      res.status(501).json({ errorMessage: error.message, error: error });
    }
  };


  const login = async (req, res) => {
    try{
      //req.user is passed from the comparePass middlewear function
      //send response with credentials of the user who logged in
      console.log("in login controller")
      console.log(req.user)
      //we use the users id as this is always unique and the key which is hardcoded into the token
      const token = jwt.sign({ "id": req.user.id }, process.env.SECRET)
      console.log(token)
        res.status(200).json({ 
            message: "success", 
            user: {
                username: req.user.username,
                email: req.body.email,
                token: token
        }
    })
    } catch (error) {
        res.status(501).json({ errorMessage: error.message, error:error });
    }
  }



  const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();

      //remove passwords from users object
      for (let user of users) {
        user.password = "";
      }
      res.status(200).json({ message: "success", users: users });
    } catch (error) {
      res.status(501).json({ errorMessage: error.message, error:error });      
    }
  }

  

  module.exports = {
    registerUser,
    login,
    getAllUsers
  }