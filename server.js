const express=require('express');
const mongoose=require('mongoose');
var exphbs=require("express-handlebars");
var bodyparser=require("body-parser");//middle wrae to send the data to database use bodyparser
var multer=require('multer');//multer is used for to upload the files and photos by the client
var Handlebars=require("handlebars");//handlebars loaded for triming purpose
var HandlebarsIntl=require("handlebars-intl");//to load the date formats install handlebars-intl
HandlebarsIntl.registerWith(Handlebars);//register with handlebars to use it link is (http://format.js/handlebars)
const app=express();
//triming done here and the name is trimString that registered in the html
Handlebars.registerHelper("trimString",(passedString)=>{
    var theString=[...passedString].splice(6).join("");
    return new Handlebars.SafeString(theString);
}); //pipe in angular like that to remove public image url

require('./Model/post');
const post=mongoose.model('posts');
//middleware...
app.engine("handlebars",exphbs());
app.set("view engine","handlebars");
// end of middleware
const mongoUrl="mongodb+srv://Bhagath:Papireddy@cluster0-nih49.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(
    mongoUrl,{ useNewUrlParser: true},(err)=>{
        if(err) throw err
        else{
            console.log("database is connected");
         }
    }
);

// app.use((req,res,next)=>{
// console.log(new Date().toString());
// next();
// })
app.use(express.static(__dirname+"/public"));
//body parser middleware
app.use(bodyparser.urlencoded({ extended:false}));
app.use(bodyparser.json());
//multer middleware used to store the data
const storage=multer.diskStorage({
    //to give the destination of the file
          destination:function(_req,_res,cb){
              cb(null,"public/upload");

          },
          //to create the filename cb is the callback name
          filename:function(req,file,cb){
              cb(null,Date.now() + file.originalname)
          }
});
//to store the data in the uploads files locally
const upload=multer({storage:storage})
//create express routes here
app.get('/',(_req,res)=>{
    res.render("home.handlebars");//render home template to 
});
//addpost route get method here why because getting template
app.get("/posts/addpost",(_req,res)=>{
    res.render("posts/addpost");
});
//today to get data from database
app.get("/posts/posts" ,(_req,res)=>{
   post.find({}).then(post=>{
       res.render("posts/posts",{
           post
       })
   }).catch(err=>{console.log(err);
   })
})
//create form data use http post method..
app.post("/posts/addpost",upload.single('photo')  ,(req,res)=>{
  
    const errors=[];
    if(!req.body.title){
        errors.push({text:"Title is required"});
    }
    if(!req.body.phone){
        errors.push({text:"phone is required"});
    }
    if(!req.body.email){
        errors.push({text:"email is required"});
    }
    if(!req.body.details){
        errors.push({text:"detais is required"});
    }
    if(errors.length>0){
        res.render("posts/addpost",{
            errors:errors,
          });
    }else{
        //to get the from the form input using body parser
        const newPosts={
            photo:req.file,
            title:req.body.title,
            phone:req.body.phone,
            email:req.body.email,
            details:req.body.details
        };
        new post(newPosts).save().then(post=>{
            console.log(post);
            res.redirect("/posts/posts");
        }).catch((err)=>{
            console.log(err);
             })
      }
    });

const port=process.env.PORT||5555

app.listen(port,(err)=>{
    if(err) {
    console.log(err);
    }
});

