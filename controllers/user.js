const User = require('../models').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Validation
const Joi = require("@hapi/joi");

//register & login
const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
})
    
module.exports = {
    
    
    
   async create(req, res) {
        
        const {error} = schema.validate(req.body);
        
        if (error) return res.status(400).send(error.details[0].message)
        
        //Check if username exists
        const usernameExist = await User.findOne({
            where: {
              username: req.body.username
            },
          })
        
        if(usernameExist) return res.status(400).send("User already exists");
        
        //Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        return User
        .create({
            username: req.body.username,
            password: hashPassword
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
    },
    async login(req, res) {
        const {error} = schema.validate(req.body);
        
        if (error) return res.status(400).send(error.details[0].message)
        
        
        const user = await User.findOne({
            where: {
              username: req.body.username
            },
          })
          
        //Check if username exists
        if(!user) return res.status(400).send("Username or password is wrong");
        
        //Check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password)
        if(!validPass) return res.status(400).send('Invalid password')
          
        //Create and assign a token
        const token = jwt.sign({id: user.id}, "fewfew");
        res.header('auth-token',token).send(token);
       
       
        // res.status(202).send("Logged in!").catch(error => res.status(400).send(error));
      return res.status(202).send("Logged in!").catch(error => res.status(400).send(error));
    //    .then(user => res.status(201).send(user))
    //   .catch(error => res.status(400).send(error));
    },
    
};