require('dotenv').config();
const express =require('express')
const app=express();
const bodyParser =require('body-parser')
const mongoose =require('mongoose');
const methodOverride = require('method-override')
const PORT=process.env.PORT || 4100;


const url=process.env.DATABASE

//SET VIEW ENGINE
app.set('view engine','ejs')

//middleware static serving...
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//put middleware.
app.use(methodOverride('_method'))

//db connection
//const url='mongodb+srv://worldnet:fXkUrNMgYcRL5DFr@cluster0.eoz2y2j.mongodb.net/Diary?retryWrites=true&w=majority'


    // Connect to the MongoDB cluster
     mongoose.connect(
        url,      { useNewUrlParser: true, useUnifiedTopology: true })
      .then(console.log('DB-Connected...'))
      .catch(err=>console.log(err))

      const Diary= require('./models/Diary');
const { findOne } = require('./models/Diary');
 
//ROUTING
app.get('/',(req,res)=>{
    res.render('Home' )
})

app.get('/diary',(req,res)=>{
    Diary.find().then((data)=>{
        res.render('Diary',{data:data})
    }).catch(err=>console.log(err))

    
})


app.get('/add',(req,res)=>{
    res.render('Add')
})
app.post('/add-to-diary',(req,res)=>{

    const Data=new Diary({
      title:req.body.title,
      desc :req.body.desc,
      date:req.body.date

    })
    Data.save().then(()=>{
        res.redirect('/diary');
    }).catch(err=> console.log(err))

   
})
app.get('/diary/:id',(req,res)=>{
    Diary.findOne({
        _id:req.params.id
    }).then((data)=>{
        res.render('Page',{data:data})
    }).catch(err=>console.log(err))
})
//edit
app.get('/diary/edit/:id',(req,res)=>{
    Diary.findOne({
        _id:req.params.id
    }).then((data)=>{
        res.render('Edit',{data:data})
    }).catch(err=>console.log(err))
})

//UPDATE EDIT 
app.put('/diary/edit/:id',(req,res)=>{

    Diary.findOne({
        _id:req.params.id        
    }).then((data)=>{
        data.title=req.body.title
        data.desc=req.body.desc
        data.date=req.body.date
        data.save().then(()=>
            res.redirect('/diary')
        ).catch(err=>console.log(err))

    }).catch(err=>console.log(err))
})
//UPDATE DELETE
app.delete('/data/delete/:id',(req,res)=>{
    
    Diary.deleteOne ({
        _id:req.params.id
    }).then(()=>{
        res.redirect('/diary')
    }).catch(err=>console.log(err))
})


app.get('/about',(req,res)=>{
    res.render('About')
})


app.listen(PORT,()=>{
    console.log(('Server Running...'));
})