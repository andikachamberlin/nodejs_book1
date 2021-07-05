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
const { verify_token } = require('../../../config/functions');
const { api_sct } = require('../../../config/key');
/*------------------------------------------------------------------
[End Require]
-------------------------------------------------------------------*/

router.get('/', verify_token, (request, response) => {

    let q = url.parse(request.url, true);
    let routes = url.parse(request.url, true);
    
    let key = entities.encode(q.query.key);
    let sct = entities.encode(q.query.sct);
    
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

                            if (routes.pathname == "/" && request.method === "GET") {
                                
                                let action = entities.encode(q.query.action); console.log('action : ', action);
                                let limit = parseInt(entities.encode(q.query.limit)); console.log('limit : ', limit);
                                let offset = parseInt(entities.encode(q.query.offset)); console.log('offset : ', offset);
                                let search = entities.encode(q.query.search); console.log('search : ', search);
                                   
                                if (action === 'read'){

                                    dbc.query("SELECT id FROM user", [] , (error, count) => {

                                        if(error){

                                            response.json({
                                                error: 'Count Error'
                                            })

                                        }else{

                                            let data_count = Math.ceil(count.length / limit);

                                            let count_array = [];

                                            let i;
                                            for (i = 0; i < data_count; i++) {
                                                count_array.push(i+1)
                                            }

                                            if(count_array){

                                                dbc.query("SELECT * FROM user ORDER BY id DESC LIMIT ? OFFSET ?", [limit, offset] , (error, data) => {
                                
                                                    if (error) {
                                                        console.log(error)
                                                        response.json({
                                                            error: 'Limit Error'
                                                        })
                                
                                                    } else {
                                                        
                                                        response.json({
                                                            result: 'success',
                                                            title: 'Successfully',
                                                            data : {
                                                                count: count.length,
                                                                pages: count_array,
                                                                limit : limit,
                                                                offset : offset,
                                                                list : data
                                                            }
                                                        })
                                                                        
                                                    }
                                
                                                });
                                                
                                            }


                                        }


                                    });

                                }else if(action === 'search'){

                                    if(search){
    
                                        let combine_search = "%" + search + "%";
                    
                                        dbc.query("SELECT * FROM user WHERE name LIKE ? LIMIT 4", [combine_search] , (error, like) => {
                            
                                            if (error) {
                                                console.log(error)
                                                response.json({
                                                    error: 'Search Error'
                                                })
                        
                                            } else {
                                                
                                                if(like.length > 0){

                                                    response.json({
                                                        result: 'success',
                                                        title: 'Successfully',
                                                        data : {
                                                            pages: [1],
                                                            list : like
                                                        }
                                                    })
                    
                                                }else{
                    
                                                    response.json({
                                                        error: 'Search Not Found'
                                                    })
                    
                                                }
                                                                
                                            }
                        
                                        });
                                                    
                                    }else {
                                      
                                        response.json({
                                            error: 'Keyword Not Found'
                                        })
                    
                                    }
                                       
                                }else{

                                    response.json({
                                        error: 'Action Denied'
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