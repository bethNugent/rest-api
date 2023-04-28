const bcrypt = require("bcrypt")
const User = require("../users/model")
const jwt = require("jsonwebtoken")

const hashPass = async (req, res, next) => {
    try {
        console.log("hashPass middlewear function")
        console.log(req.body)
        req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS))
        // req.body,password = await bcrypt.hash()
        //only if the code is executed successfully we will move on to our next() code otherwise throw and error
        next()
    } catch (error){
        res.status(501).json({ errorMessage: error.message, error: error });
    }
}



const comparePass = async (req, res, next) => {
    try{
        console.log(req.body)
        //see if someone exists in the DB with the specified username
        //we are adding to the request object a new object called user 
        //which allows us to have access to this data (outside of this middlewear function) 
        //which we can use again in the login controller
        req.user = await User.findOne({where: {username: req.body.username}})
        next()

        if (req.user === null) {
            throw new Error ("User does not exist")
        }

        //req.body.password = plain text password
        //req.user.password = hashed password loaded from the DB
        const comparePassord = await bcrypt.compare(req.body.password, req.user.password)

        //if the passwords don't match throw an error
        if (!comparePassord) { 
            throw new Error ("Sorry your password or username is incorrect")
        }
        next()
    } catch (error) {
        res.status(501).json({ errorMessage: error.message, error: error });
    }
}



const tokenCheck = async (req, res, next) => {
    try {
        //check is this request coming from a user on our DB and does it contain the key
        if (!req.header("Authorization")) {
            throw new Error ("No authorisation header sent in the request")
            //if there is a header present then it will pass this if statement above
        }
        //then we need to get the token and verify it
        const token = req.header("Authorization").replace("Bearer ", "")
        console.log(token)
        //check the token contains the key that was encoded into the token when it was signed
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log(decodedToken)
        console.log(decodedToken.id)
        
        const user = await User.findOne({where: {id: decodedToken.id}})
        console.log(user)

        if(!user){
            throw new Error ("User is not authorised")
        }

        req.authUser = user
        next()
    } catch (error) {
        res.status(501).json({ errorMessage: error.message, error: error });   
    }
}

module.exports = {
 hashPass,
 comparePass,
 tokenCheck
}