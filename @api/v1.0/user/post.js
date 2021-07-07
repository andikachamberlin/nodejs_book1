/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const url = require('url');
const Entities = require('html-entities').AllHtmlEntities;
const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Use Module]
-------------------------------------------------------------------*/
const entities = new Entities();
/*------------------------------------------------------------------
[End Use Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Require]
-------------------------------------------------------------------*/
const { dbc } = require('../../../config/dbc');
const { verify_token, random_character } = require('../../../config/functions');
const { api_sct } = require('../../../config/key');
/*------------------------------------------------------------------
[End Require]
-------------------------------------------------------------------*/

router.post('/', verify_token, (request, response) => {

    let routes = url.parse(request.url, true);
    
    let key = entities.encode(request.body.key);
    let sct = entities.encode(request.body.sct);
    
    if (key && sct) {

        jwt.verify(request.token, key, (error, verify) => {
            
            if(error) {
            
                response.json({
                    error: 'Token Denied'
                })
            
            } else {

                if (verify) {

                    let level = verify.auth[0].level;

                    if(level === 'super'){
    
                        if(api_sct === sct){

                            if (routes.pathname == "/" && request.method === "POST") {

                                let action = entities.encode(request.body.action); console.log('action : ', action); if(!action){return response.json({error: 'empty action'})}
                                
                                if(action === 'insert'){

                                    let level = entities.encode(request.body.level); console.log('level : ', level); if(!level){return response.json({error: 'empty level'})}
                                    let status = entities.encode('active'); console.log('status : ', status); if(!status){return response.json({error: 'empty status'})}
                                    let name = entities.encode(request.body.name); console.log('name : ', name); if(!name){return response.json({error: 'empty name'})}
                                    let username = entities.encode(request.body.username).replace(/\s/g, '').toLowerCase(); console.log('username : ', username); if(!username){return response.json({error: 'empty username'})}
                                    let password = entities.encode(request.body.password).replace(/\s/g, ''); console.log('password : ', password); if(!password){return response.json({error: 'empty password'})}
                                    let password_hash = entities.encode(sha1(request.body.password));
                                    
                                    if(password.length > 7){
                            
                                        dbc.query("SELECT username FROM user WHERE username = ?", [username], (error, results) => {

                                            if (error) {
                                                console.log(error)
                                                response.json({
                                                    error : 'Request Error'
                                                })

                                            } else {

                                                if (results.length > 0) {

                                                    response.json({
                                                        error : 'Username Denied'
                                                    })

                                                } else {

                                                    dbc.query('INSERT INTO user (id_key, id_user, level, status, name, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [random_character(64), random_character(64), level, status, name, username, password_hash], (error, results) => {
                                    
                                                        if (error) {
                                                            console.log(error)
                                                            response.json({
                                                                error : 'Request Error'
                                                            })
                                    
                                                        } else {

                                                            response.json({
                                                                result: 'success',
                                                                title : 'Successfully',
                                                                data : null
                                                            })

                                                        }
                                    
                                                    });

                                                }
                                            }
                                        });

                                    }else{

                                        response.json({
                                            error : 'Password Length Min Detected'
                                        })
                                    
                                    }

                                }else if(action === 'update'){

                                    let id_user = entities.encode(request.body.id_user); console.log('id_user : ', id_user); if(!id_user){return response.json({error: 'empty id_user'})}
                                    let name = entities.encode(request.body.name); console.log('name : ', name); if(!name){return response.json({error: 'empty name'})}
                                    let username = entities.encode(request.body.username).replace(/\s/g, '').toLowerCase(); console.log('username : ', username); if(!username){return response.json({error: 'empty username'})}
                                    
                                    dbc.query("SELECT username FROM user WHERE username = ?", [username], (error, results) => {

                                        if (error) {
                                            console.log(error)
                                            response.json({
                                                error : 'Request Error'
                                            })

                                        } else {

                                            if (results.length > 0) {

                                                response.json({
                                                    error : 'Username Denied'
                                                })

                                            } else {

                                                dbc.query("UPDATE user SET name= ?, username= ? WHERE id_user= ?", [name, username, id_user], (error, results) => {

                                                    if (error) {
                                                        console.log(error)
                                                        response.json({
                                                            error : 'Request Error'
                                                        })
                                
                                                    } else {

                                                        response.json({
                                                            result: 'success',
                                                            title : 'Successfully',
                                                            data : null
                                                        })

                                                    }
                                
                                                });

                                            }
                                        }
                                    });
                                
                                }else if(action === 'update_password'){

                                    let id_user = entities.encode(request.body.id_user); console.log('id_user : ', id_user); if(!id_user){return response.json({error: 'empty id_user'})}
                                    let password = entities.encode(request.body.password).replace(/\s/g, ''); console.log('password : ', password); if(!password){return response.json({error: 'empty password'})}
                                    let password_hash = entities.encode(sha1(request.body.password));

                                    dbc.query("UPDATE user SET password= ? WHERE id_user= ?", [password_hash, id_user], (error, results) => {

                                        if (error) {
                                            console.log(error)
                                            response.json({
                                                error : 'Request Error'
                                            })
                    
                                        } else {

                                            response.json({
                                                result: 'success',
                                                title : 'Successfully',
                                                data : null
                                            })

                                        }
                    
                                    });

                                }else if(action === 'delete'){
                                    
                                    let id_user = entities.encode(request.body.id_user); console.log('id_user : ', id_user); if(!id_user){return response.json({error: 'empty id_user'})}
                                    
                                    dbc.query("DELETE FROM user WHERE id_user= ?", [id_user], (error, results) => {

                                        if (error) {
                                            console.log(error)
                                            response.json({
                                                error : 'Request Error'
                                            })
                    
                                        } else {

                                            response.json({
                                                result: 'success',
                                                title : 'Successfully',
                                                data : null
                                            })

                                        }
                    
                                    });

                                }else{

                                    response.json({
                                        error : 'Action Denied'
                                    })
                                    
                                }

                            } else {

                                response.json({
                                    error: 'Error Routes'
                                })

                            }

                        }else {
        
                            response.json({
                                error: 'SCT Denied'
                            })
            
                        }
                    
                    }else{
                        
                        response.json({
                            error: 'Level Denied'
                        })
                        
                    }

                } else {
            
                    response.json({
                        error: 'Verify Denied'
                    })
    
                }

                
            }

        });

    } else {

        response.json({
            error: 'Authentication Denied'
        })

    }

});

module.exports = router;