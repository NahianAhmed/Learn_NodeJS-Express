var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
var Schema = mongoose.Schema;

//error checking 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
     console.log("connected");
  });

var DataSchema = new Schema({
    name:{type : String,
           required: true },
    email : String,
    password : String,

}); 

var UserData = mongoose.model('User_tbl',DataSchema);


router.get('/',function(req,res,next){
    
    res.render('pages/index', { title: 'Express',val:false ,array:[1,4,7,9]});
});
router.get('/Get-Request/:id',function(req,res,next){
   
    console.log(req.params.id);
    res.render('pages/getrequest',{val:req.params.id});
});
router.get('/post-view',function(req,res,next){
    res.render('pages/postview');
});

router.post('/post-request',function(req,res,next){
   let id = req.body.id;
   res.redirect('/Get-Request/'+id);
});

router.get('/form-validation',function(req,res,next){

     UserData.find().then(function(doc){
        res.render('pages/formValidation',{data:req.flash('error'),info:doc});   
    });
    //console.log(info);
  
});

router.post('/form-validation',function(req,res,next){
    req.check('name',"Name must be 5 to 20 Char").isLength({min:5,max:20});
    req.check('email','Invalid Email').isEmail();
    req.check('password','Passowrd Donot Match').equals(req.body.confirm_password);
   // console.log(req.body);

    let errors = req.validationErrors();
    if(errors){
      //  console.log(errors);
      //req.session.error=errors;
      
      // flash data
      req.flash('error', errors);
      
      res.redirect('/form-validation');
     // console.log(req.session);
    }
    else{
        
        let data ={
            name: req.body.name,
            email: req.body.email,
            password:req.body.password
        }
        
        var tbl_data = new UserData(data);
        tbl_data.save().then(function(){
               console.log("data insert");
        }).catch(function(err){
            console.log(err);
        });
        req.session.msg="ok";
        res.redirect('/form-validation');
    }
    
});

router.get('/DeleteData/:id',function(req,res,next){
    let id = req.params.id;
    //console.log(d);
      UserData.findByIdAndRemove(id).exec();
      res.redirect('/form-validation')

});

router.get('/Update/:id',function(req,res,next){
     
      let id = req.params.id;
      UserData.findById(id).then(function(doc){
          console.log(doc);
        res.render('pages/update',{data:req.flash('error'),datas:doc});     
      });
       

});
router.post('/Update',function(req,res,next){
     
      let id = req.body.id;
      UserData.findById(id).then(function(doc){
         doc.name=req.body.name;
         doc.email=req.body.email;
         doc.password=req.body.password;
         doc.save();
        res.redirect('/form-Validation');
      });
       

});


module.exports=router;