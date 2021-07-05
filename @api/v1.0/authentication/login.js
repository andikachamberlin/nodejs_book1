/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const url = require('url');
const sha1 = require('sha1');
const Entities = require('html-entities').AllHtmlEntities;
const jwt = require('jsonwebtoken');
const ExpressBrute = require('express-brute');
/*------------------------------------------------------------------
[End Node Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Use Module]
-------------------------------------------------------------------*/
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);
const entities = new Entities();
/*------------------------------------------------------------------
[End Use Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Require]
-------------------------------------------------------------------*/
const { dbc } = require('../../../config/dbc');
/*------------------------------------------------------------------
[End Require]
-------------------------------------------------------------------*/

router.post('/', bruteforce.prevent, (request, response) => {
       
    let routes = url.parse(request.url, true);
    
    if (routes.pathname == "/" && request.method === "POST") {
        
        let username = entities.encode(request.body.username); console.log('username : ', username); if(!username){return response.json({error: 'empty username'})}
        let password = entities.encode(sha1(request.body.password)); console.log('password : ', password); if(!password){return response.json({error: 'empty password'})}
        
        dbc.query('SELECT id_key, level, status FROM user WHERE username = ? AND password = ?', [username, password], (error, data) => {
            
            if (error) {
                console.log(error)
                response.json({
                    error: 'Request Error'
                })

            } else {

                if (data.length > 0) {

                    if(data[0].status == 'active'){

                        let key = data[0].id_key;
                        let level = data[0].level;
                        let status = data[0].status;

                        let auth = [
                            {
                                "level": level,
                                "status": status
                            }
                        ]

                        if(auth.length > 0){

                            jwt.sign({auth}, key, (error, token) => {
                                
                                if(error){
                                    console.log(error)
                                    response.json({
                                        error: 'Request Error'
                                    })
                                    
                                }else{

                                    dbc.query('SELECT id_key, id_user, level, status, name, username FROM user WHERE username = ? AND password = ?', [username, password], (error, user) => {

                                        if(error){
                                            console.log(error)
                                            response.json({
                                                error: 'Request Error'
                                            })

                                        }else{

                                            response.json({
                                                result: 'success',
                                                title: 'Successfully',
                                                data: {
                                                    token : token,
                                                    user : user
                                                }
                                            });

                                        }

                                    });
                                }
                                
                            });
                        
                        }else{

                            response.json({
                                error: 'Auth Error'
                            });

                        }
                        
                    } else {

                        response.json({
                            error: 'Account Deactive'
                        });

                    }

                } else {

                    response.json({
                        error: 'Username Atau Password Salah'
                    });

                }
            }

        });

    }else{

        response.json({
            error: 'Method Detected'
        })
        
    }

});

module.exports = router;