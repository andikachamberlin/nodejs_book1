/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const url = require('url');
const Entities = require('html-entities').AllHtmlEntities;
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

    console.log('key : ', key)
    console.log('sct : ', sct)
    
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
                                
                                if(action === 'logout'){

                                    dbc.query("UPDATE user SET id_key = ? WHERE id_key = ?", [random_character(64), key], (error, data) => {
                    
                                        if (error) {
                    
                                            response.json({
                                                error: 'Query Detected'
                                            })
                    
                                        } else {
                    
                                                
                                            response.json({
                                                result: 'success',
                                                title: 'Successfully'
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