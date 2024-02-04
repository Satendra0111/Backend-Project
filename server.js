const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// mongo URL

const mongoURL ="mongodb+srv://gragerssam:admin123@cluster0.jvrjui0.mongodb.net/StudentDB";

// connecting mongoose

mongoose.connect(mongoURL).then(()=>{
    console.log("DB Connected")
})
.catch(()=>{
    console.log("connetion failed")
})

// Student Schema
const studentSchema= new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
})

const Student= mongoose.model('Student', studentSchema);

// Student Schema
const subjectSchema= new mongoose.Schema({
    name: String,
})

const Subject= mongoose.model('Subject', subjectSchema);

// get API for add details

app.get("/", (req,res)=>{
    res.send("API s working")
})

//post API

app.post("/register",(req,res)=>{
    const {name,email,phone,password}= req.body;
    const alreadyRegistered = Student.findOne({email:email});
    if(alreadyRegistered){
        res.send("This user is already Registered")
    }
    const newStudent = new Student({ name, email, phone, password });
    newStudent.save();
    if(newStudent){
        res.send({"Student Added Successfully":newStudent})
    }
    else{
        res.send("error occuured")
    }
});

// post API for Login

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.send("Please Enter Email and Password");
    }
    const foundStudent = await Student.findOne({email:email});
    if(foundStudent){
        if(foundStudent.password == password){
            res.send({"Login Success : ": `${foundStudent.name},${foundStudent.email},${foundStudent.phone}`})
        }
        else
        res.send("Wrong Password entered, Please try again")
    }
    else{
        res.send("Unregistered Email");
    }
});

// subject 
app.post("/subjects" , async(req, res) => {
    const name = req.body.name;
    const foundSubject = await Subject.findOne({name:name});
    if(foundSubject){
      res.send("subect already exist")
    }
    const newSubject = new Subject({name});
    newSubject.save()
    if (newSubject){
      res.send("new subject added")
    }
    
  } )


//listen to server

app.listen(3000,()=>{
    console.log("Server connetced on Port: 3000");
})
