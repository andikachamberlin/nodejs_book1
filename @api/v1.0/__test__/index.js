/*------------------------------------------------------------------
[Node Module]
-------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const url = require('url');
/*------------------------------------------------------------------
[End Node Module]
-------------------------------------------------------------------*/

router.get('/', (request, response) => {

    let routes = url.parse(request.url, true);

    if (routes.pathname === "/" && request.method === "GET") {
        
        response.json({
            data : 'api test'
        })

    } else {

        response.json({
            error: 'Error Routes'
        })

    }

});

module.exports = router;