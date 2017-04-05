
const hapi        = require('hapi');
const server      = new hapi.Server();
const channels    = require('./channels.js');
const v2_channels = require('./v2_channels.js');
const streaming   = require('./streaming.js');


server.connection({ port: process.env.PORT || 8080});


///---------------------------------
///           v1 api
///---------------------------------

server.route
({
    method: 'GET',
    path: '/channels', 
    handler: function(request, replay) 
    {
        channels(function(boom, result)
        {
            if(boom)
            {
            	replay(boom);
            }
            else
            {
            	replay(result);
            }
        });
    }
});

server.route
({
    method: 'GET',
    path: '/streaming', 
    handler: function(request, replay) 
    {
        var contentId   = request.query.contentId;
        var streamingId = request.query.streamingId;

        streaming(contentId, streamingId, function(boom, streamingURL)
        {
            if(boom)
            {
            	replay(boom);
            }
            else
            {
                replay.redirect(streamingURL);
            }
        });
    }
});

///---------------------------------
///           v2 api
///---------------------------------

/// 與 v1 不同是, 直接返回 Array, 而不是又再包一層 dictionary
server.route
({
    method: 'GET',
    path: '/api/v2/channels', 
    handler: function(request, replay) 
    {
        v2_channels(function(boom, result)
        {
            if(boom)
            {
            	replay(boom);
            }
            else
            {
            	replay(result);
            }
        });
    }
});

/// Same as v1 api
server.route
({
    method: 'GET',
    path: '/api/v2/streaming', 
    handler: function(request, replay) 
    {
        var contentId   = request.query.contentId;
        var streamingId = request.query.streamingId;

        streaming(contentId, streamingId, function(boom, streamingURL)
        {
            if(boom)
            {
            	replay(boom);
            }
            else
            {
                replay.redirect(streamingURL);
            }
        });
    }
});

server.start((err) =>
{
    if (err) 
    {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});
