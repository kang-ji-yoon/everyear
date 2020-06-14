var router = require('express').Router();

var {PythonShell} = require('python-shell');

var admin = require('firebase-admin');

var sdk = require("microsoft-cognitiveservices-speech-sdk");

var fs = require('fs');

var subscriptionKey = "YourSubscriptionKey";

var serviceRegion = "YourServiceRegion";

var filename = "YourAudioFile.wav";

var pushStream = sdk.AudioInputStream.createPushStream();

var path = require('path');

var express = require('express');
var app = express();

var serviceAccount = require("./solar2-firebase-adminsdk-9pqmw-7a4d85acf3.json");
 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://solar2.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("/");

router.route('/web').get((req, res)=>{
    res.render('webcam.html');
});

router.route('/animate2').get((req, res)=>{
    res.render('animate2.html');
});

router.route('/bill-user').get((req, res)=>{
    res.render('bill-user.html');
});

router.route('/ending2-admin').get((req, res)=>{
    res.render('ending2_Admin.html');
});

router.route('/ending2').get((req, res)=>{
    res.render('ending2.html');
});

router.route('/ending1').get((req, res)=>{
    res.render('ending1.html');
});

router.route('/ending-more').get((req, res)=>{
    res.render('ending-more.html');
});

router.route('/camera').get((req, res)=>{
    res.render('camera.html');
});

router.route('/camera-admin').get((req, res)=>{
    res.render('Camera_Admin.html');
});

router.route('/bill').get((req, res)=>{
    res.render('bill.html');
});

router.route('/user').get((req, res)=>{
    res.render('user.html');
});

router.route('/animate').get((req, res)=>{
    res.render('animate.html');
});

router.route('/').get((req, res)=>{
    res.render('EVERYEAR_main.html');
});

router.route('/enter').get((req, res)=>{
    res.render('EVERYEAR_Enter.html');
});

router.route('/pystart').get((req, res)=>{
    res.render('pystart.html');
});

router.route('/SignUp').get((req, res)=>{
    res.render('SignUp.html');
});

router.route('/SignUpout').get((req, res)=>{
    res.render('SignUpout.html');
});

router.route('/failoutput').get((req, res)=>{
    res.render('failoutput.html');
});

router.route('/output').get((req, res)=>{
    res.render('output.html');
});

router.route('/login').get((req, res)=>{
    res.render('EVERYEAR_login.html');
});

router.route('/pystartoutput').get((req, res)=>{
    PythonShell.run('solar.py', null, function (err, result) {
        if (err) throw err;
        console.log(result);
        var pr = 0;

        if(result == 0){
            pr = '닭다리';
        }
        else if(result == 1) {
            pr = '가나';
        }
        else if(result == 2) {
            pr = '마이구미';
        }
        else {
            pr = '없음';
        }

        var result1 = {
            resultvalue:pr
        };

        res.render('pystartoutput.html', result1);
    });
    
});

router.route('/SignUpout').post((req, res)=>{

    console.log('SignUpmartout 처리함')
  
    var user = {
        id:req.body.id, 
        password:req.body.password, 
        name:req.body.name, 
        age:req.body.age, 
        number:req.body.number
    };
  
    res.render('SignUpout.html', user);
  
    var usersRef = ref.child("users")
  
    usersRef.child(req.body.id).set({
        id:req.body.id,
        password:req.body.password,
        name:req.body.name,
        age:req.body.age,
        number:req.body.number
    });
  
});

router.route('/output').post((req, res)=>{
    console.log('output 처리함')

    var user = {
        id:req.body.id, 
        password:req.body.password
    }

    var usersRef = ref.child("users")

    console.log('sess.token');

    usersRef.orderByChild("id").equalTo(user.id).once("value", function(data){
             
        if(data.val() == null){
            
        console.log('failoutput 처리함');

        res.render('failoutput.html');
        }
            
        else{
            var datapost = data.val();
            var code;
            for(var temp in datapost)
            code = temp;
            
            if(datapost[code].password == user.password){
                res.render('output.html', user); 
            }
                
            else{
                console.log('failoutput 처리함');

                res.render('failoutput.html');
            }
        }
    });
});

module.exports = router;