const express = require('express')
const app= express()
const path = require('path');
const objectID = require('mongoose').ObjectID;
const fs = require('fs');
const User = require('./models/user')
const bodyParser = require('body-parser');
require('./db/mongoose1');




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())








//////////////Creating a User///////////////////
app.post('/users',(req,res) => {
  console.log("POST user details %s",req.body)
  const user = new User(req.body);
  user.save().then(() => {
    const comment = '<h1 align="center">User Profile Successfully Created !!!</h1>'
    res.status(200).end(comment)

  }).catch((error) => {
    console.log("ERROR :: POST user details ")
    res.status(400).send(error)
  })
})








//////////////////Reading a User///////////////////
app.get('/users/:id',(req,res) =>{
  const _id = req.params.id
  console.log("GET user details of ID: %s",req.params.id)

  User.findById(_id).then((users) => {

    if(!users){
      return res.status(404).end('<h1>User with this ID Does not Exist!!!!</h1>')
    }

    res.send("<b>The data of the requested user with id: </b>"+users._id + " <b>is as follows :</b><br><br><b>Name :</b> "+users.name+"<br><br><b>Email :</b>  "+users.email+"<br><br><b>Age :</b>  "+users.age)
  }).catch((error) => {
    res.status(404).end('<h1>User with this ID Does not Exist!!!!</h1>')
  })
})






///////////////Updating a User///////////////////


app.post('/users_update', async (req,res) => {
  try{
    const user =  await User.findByIdAndUpdate(req.body.id,
      req.body, {new: true, runValidators:true})
      if(!user)
      {
        return  res.status(404).end('<h1>User with this ID Does not Exist!!!!</h1>')
      }
      res.status(201).end('<h1>User Successfully Updated with id:</h1> '+req.body.id)
  }
  catch(e){
    res.status(404).end('<h1>User with this ID Does not Exist!!!!</h1>')
  }
})




//////////////Deleting a User///////////////////
app.get('/users_delete/:id', async (req,res) => {
  try{
    const ide = req.params.id;
    const user =  await User.findByIdAndDelete(req.params.id)
      if(!user)
      {
        return res.status(404).end('<h1>User Does Not Exist!!!</h1>')
      }
      res.status(201).end('<h1>User  Successfully deleted with id: </h1>'+ ide)
  }
  catch(e){
    res.status(500).end('<h1>User Does not Exist!!!!</h1>')
  }
})





const server = app.listen(8081, function (req,res) {
   const host = server.address().address
   const port = server.address().port
   console.log("Server running up at http://%s:%s:%s", host, port,__dirname)
})
