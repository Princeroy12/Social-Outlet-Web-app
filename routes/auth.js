const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=mongoose.model("User")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../key')
const requirelogin=require('../middleware/requirelogin')



// router.get('/protected',requirelogin,(req,res)=>{
//     res.send("hello user")
// })

router.get('/',(req,res)=>{
    res.send("Hello")
})

router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body
    if(!name || !email || !password){
    return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
        return res.status(422).json({error:"email already registerd"})
      }
      bcrypt.hash(password,12)
      .then(hashedpassword=>{
        const user=new User({
            name,  
            email,
            password:hashedpassword,
            pic
          })
          user.save()
          .then(user=>{
              res.json({message:"registerd succesfully"})
          }).catch(err=>{
              console.log(err)
          })
      })
      
    }).catch(err=>{
        console.log(error)
    })
})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password){
        res.status(422).json({error:"Please provide email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        return res.status(422).json({error:"Invalid email or password"})
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"succesfully loggedin"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const{_id,name,email,followers,following,pic}=savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
        return res.status(422).json({error:"Invalid email or password"})

            }
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
})
module.exports=router