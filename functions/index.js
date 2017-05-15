var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
 response.status(200).json({"msg":"Hellow"});
});

exports.login = functions.https.onRequest((req,res)=>{
    admin.database().ref("/users").once('value',(snapshot)=>{
        res.status(200).json({"result":snapshot.val()})
    });
});

exports.getFactorys = functions.https.onRequest((req,res)=>{
    let start = 0;
    let uid = 0;
    if(req.query!==undefined&& req.query!==null){
        start = (req.query.st)?req.query.st:0;
        uid = (req.query.uid)?req.query.uid:0;
    }    
    if(uid){
        admin.database().ref(`/factory/${uid}`).once('value',(snapshot)=>{
            res.status(200).json({"data":snapshot.val()});
        })
        .catch(err=>{
            res.status(200).json({"error":err});
        });
    }
    else{
         admin.database().ref('/factory').orderByKey().startAt(start?start:0).limitToFirst(100).once('value',(snapshot)=>{
            res.status(200).json({"data":snapshot.val()});
        })
        .catch(err=>{
            res.status(200).json({"error":err});
        });
    }
});