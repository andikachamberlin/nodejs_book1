/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const fs = require('fs');
const express = require('express');
const router = express.Router();
const url = require('url');
const Entities = require('html-entities').AllHtmlEntities;
const multer = require('multer');
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
const { uploadPathProduct } = require('../../../config/uploadPath');
const { maxSize } = require('../../../config/uploadLimit');
const { random_character, verify_token} = require('../../../config/functions');
const { jpg, png } = require('../../../config/mimetype');
const { api_sct } = require('../../../config/key');
/*------------------------------------------------------------------
[Require]
-------------------------------------------------------------------*/

router.post('/', verify_token, (request, response) => {

    let filename = random_character(16) + '-' + Date.now();
    let path = random_character(32);

    let routes = url.parse(request.url, true);

    if (routes.pathname == "/" && request.method === "POST") {

        const upload = multer({

            storage: multer.diskStorage({
                destination: (request, file, cb) => {
                    
                    const fieldname = file.fieldname;
                    const mimetype = file.mimetype;
            
                    const key = entities.encode(request.body.key); console.log('key : ', key)
                    const sct = entities.encode(request.body.sct); console.log('sct : ', sct)

                    if(key && sct && fieldname && mimetype){
        
                        if (mimetype !== jpg && mimetype !== png) {
        
                            response.json({
                                error: 'Mimetype Denied Destination'
                            })
        
                        } else {
                            
                            let dir = uploadPathProduct + '/' + path + '/';

                            if (!fs.existsSync(dir)){
                                
                                let folder = fs.mkdirSync(dir);
                                
                                if(folder === undefined){
                                    cb(null, dir);
                                }

                            }else{

                                console.log("Directory already exist");
                                cb(null, dir);

                            }
                        
                        }
                    
                    }else{

                        response.json({
                            error: 'Empty Denied Destination'
                        })
                        
                    }    
                },
                filename: function (request, file, cb) {
                    cb(null, filename + '-' + file.originalname);
                }
            }),
            fileFilter: (request, file, cb) => {

                const mimetype = entities.encode(file.mimetype);

                if (mimetype !== jpg && mimetype !== png) {
            
                    response.json({
                        error: 'Mimetype Detected File Filter'
                    })

                } else {
                    
                    cb(null, true);
                
                }

            },
            limits: { fileSize: maxSize }

        }).array('file', 1);

        upload(request, response, error => {

            if (error) {

                console.log(error);

                if (error.code === 'LIMIT_FILE_SIZE') {
                    response.json({
                        error: 'File Size Too Large'
                    })
                }else if(error.code === 'LIMIT_UNEXPECTED_FILE'){
                    response.json({
                        error: 'Data Limited Upload'
                    })
                }else if(error.code === 'LIMIT_UNEXPECTED_FILE'){
                    response.json({
                        error: 'Limit Error'
                    })
                }else{
                    response.json({
                        error: 'Upload Error'
                    })
                }

            } else {

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

                                                let name = entities.encode(request.body.name); console.log('name : ', name); if(!name){return response.json({error: 'empty name'})}
                                                let price = entities.encode(request.body.price); console.log('price : ', price); if(!price){return response.json({error: 'empty price'})}
                                                let category = entities.encode(request.body.category); console.log('category : ', category); if(!category){return response.json({error: 'empty category'})}
                                                let file = request.files.length > 0 ? filename + '-' + request.files[0].originalname : null; console.log('file : ', file); if(!file){return response.json({error: 'empty file'})}
                                                
                                                dbc.query('INSERT INTO product (id_product, name, price, category, path, file) VALUES (?, ?, ?, ?, ?, ?)', [random_character(16), name, price, category, path, file], (error, results) => {
                                
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

                                            }else if(action === 'update_text'){

                                                let id_product = entities.encode(request.body.id_product); console.log('id_product : ', id_product); if(!id_product){return response.json({error: 'empty id_product'})}
                                                let name = entities.encode(request.body.name); console.log('name : ', name); if(!name){return response.json({error: 'empty name'})}
                                                let price = entities.encode(request.body.price); console.log('price : ', price); if(!price){return response.json({error: 'empty price'})}
                                                let category = entities.encode(request.body.category); console.log('category : ', category); if(!category){return response.json({error: 'empty category'})}
                                                
                                                dbc.query('UPDATE product SET id_product=?, name=?, price=?, category=? WHERE id_product= ?', [id_product, name, price, category, id_product], (error, results) => {
                                
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
                                            
                                            }else if(action === 'update_file'){

                                                let id_product = entities.encode(request.body.id_product); console.log('id_product : ', id_product); if(!id_product){return response.json({error: 'empty id_product'})}
                                                let name = entities.encode(request.body.name); console.log('name : ', name); if(!name){return response.json({error: 'empty name'})}
                                                let price = entities.encode(request.body.price); console.log('price : ', price); if(!price){return response.json({error: 'empty price'})}
                                                let category = entities.encode(request.body.category); console.log('category : ', category); if(!category){return response.json({error: 'empty category'})}
                                                let file = request.files.length > 0 ? filename + '-' + request.files[0].originalname : null; console.log('file : ', file); if(!file){return response.json({error: 'empty file'})}
                                                
                                                dbc.query('UPDATE product SET id_product=?, name=?, price=?, category=?, path=?, file=? WHERE id_product= ?', [id_product, name, price, category, path, file, id_product], (error, results) => {
                                
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
                                                
                                                let id_product = entities.encode(request.body.id_product); console.log('id_product : ', id_product); if(!id_product){return response.json({error: 'empty id_product'})}
                                                
                                                dbc.query("DELETE FROM product WHERE id_product= ?", [id_product], (error, results) => {

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

            }
                                                
        });        

    } else {

        response.json({
            error: 'Method Detected'
        })

    }

});

module.exports = router;