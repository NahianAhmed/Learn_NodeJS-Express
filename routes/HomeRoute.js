var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
//mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test",{ useNewUrlParser: true });
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;
const AddressBook = new Schema({
    name: String,
    address: String,
    mobile: String
  });
var Data = mongoose.model("AddressBook", AddressBook);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./pages/index', { title: 'Express' });
});



router.post('/post',function(req,res,next){

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let sampleFile = req.files.sampleFile;
  sampleFile.mv('../NodeApp/public/images/'+req.files.sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);
  });
  
    var myData = new Data(req.body);
    myData.save()
    .then(item => {
        res.send("item saved to database");
        })
        .catch(err => {
        res.status(400).send("unable to save to database");
        });

   // console.log(req.body);
   // res.redirect('/');
});

router.get('/Email',function(req,res,next){

  res.render('./pages/mail');
 
});
router.post('/email',function(req,res,next){
  let name = req.body.name;
  let email = req.body.email;

 var transport = nodemailer.createTransport({
   service:'gmail',
   auth:{
     
     user:'heartsoft420@gmail.com',
     pass:'S01714415122'

   }
 });

 var option= {
   from : 'heartsoft420@gmail.com',
   to : email,
   subject : 'Hello '+name,
   html: '<h1 style="color:red" >Welcome</h1><p>That was easy! '+ name +' </p>'
 };
 transport.sendMail(option, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

  console.log(name,email);

  res.redirect("back");

});


module.exports = router;