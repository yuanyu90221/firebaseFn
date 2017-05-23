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
const keys = ["lat","lon","主要產品","工廠名稱","工廠地址","工廠市鎮鄉村里","產業類別","統一編號","x","y"];
exports.login = functions.https.onRequest((req,res)=>{
    admin.database().ref("/users").once('value',(snapshot)=>{
        res.status(200).json({"result":snapshot.val()})
    });
});

exports.getFactorys = functions.https.onRequest((req,res)=>{
    let start = 0;
    let uid = 0;
    let lt = 100;
    let reqKey = Object.keys(req);
    if(reqKey.indexOf('query')!==-1&&req.query!==undefined&& req.query!==null){
        start = (req.query.st)?req.query.st:0;
        uid = (req.query.uid)?req.query.uid:0;
        lt = (req.query.lt)?req.query.lt:100;
    }    
    if(uid){
        admin.database().ref(`/factory/${uid}`).once('value',(snapshot)=>{
            let meta_data = snapshot.val();
            let data = {};
            if(meta_data!==null){
                keys.forEach((key)=>{
                    data[key] = meta_data[key];
                });
            }
            res.status(200).json({"data":data});
        })
        .catch(err=>{
            res.status(200).json({"error":err});
        });
    }
    else{
         admin.database().ref('/factory').orderByKey().startAt(start?start:0).limitToFirst(lt?Number(lt):100).once('value',(snapshot)=>{
            let meta_data = snapshot.val();
            
            let meta_keys = (meta_data!==null)?Object.keys(meta_data):[];
            let data = {};
            if(meta_keys.length > 0 ){
               
                meta_keys.forEach((meta_key)=>{
                    let s_data = {};
                    keys.forEach((key)=>{
                        s_data[key] = meta_data[meta_key][key];
                    });
                    data[meta_key] = s_data;
                });
               
            }
            res.status(200).json({"data":data});
            
        })
        .catch(err=>{
            res.status(200).json({"error":err});
        });
    }
});

