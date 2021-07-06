/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const url = require('url');
const sha1 = require('sha1');
const Entities = require('html-entities').AllHtmlEntities;
/*------------------------------------------------------------------
[End Node Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Use Module]
-------------------------------------------------------------------*/
const entities = new Entities();
/*------------------------------------------------------------------
[Use Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Require]
-------------------------------------------------------------------*/
const { dbc } = require('../../../config/dbc');
const { random_character } = require('../../../config/functions');
/*------------------------------------------------------------------
[End Require]
-------------------------------------------------------------------*/

router.post('/', (request, response) => {

    let routes = url.parse(request.url, true);
        
    if (routes.pathname == "/" && request.method === "POST") {

        let level = entities.encode('user'); console.log('level : ', level); if(!level){return response.json({error: 'empty level'})}
        let status = entities.encode('active'); console.log('status : ', status); if(!status){return response.json({error: 'empty status'})}
        let name = entities.encode(request.body.name); console.log('name : ', name); if(!name){return response.json({error: 'empty name'})}
        let username = entities.encode(request.body.username).replace(/\s/g, '').toLowerCase(); console.log('username : ', username); if(!username){return response.json({error: 'empty username'})}
        let password = entities.encode(request.body.password).replace(/\s/g, ''); console.log('password : ', password); if(!password){return response.json({error: 'empty password'})}
        let password_hash = entities.encode(sha1(request.body.password));
        
        let action = entities.encode(request.body.action); console.log('action : ', action); if(!action){return response.json({error: 'empty action'})}

        if(action === 'register'){

            if(password.length > 7){

                dbc.query("SELECT username FROM user WHERE username = ?", [username], (error, results) => {

                    if (error) {
                        console.log(error)
                        response.json({
                            error: 'Request Error',
                        })

                    } else {

                        if (results.length > 0) {

                            response.json({
                                error : 'Username Sudah Digunakan'
                            })

                        } else {

                            dbc.query('INSERT INTO user (id_key, id_user, level, status, name, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [random_character(64), random_character(64), level, status, name, username, password_hash], (error, results) => {
            
                                if (error) {
                                    console.log(error)
                                    response.json({
                                        error: 'Request Error',
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

        }else{

            response.json({
                error : 'Action Denied'
            })
            
        }

    }else{

        response.json({
            error: 'Method Detected'
        })
        
    }

});

module.exports = router;