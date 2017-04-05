
const request = require('request');
const Boom    = require('boom');

module.exports = function (contentId, streamingId, callback) 
{
    if(parseInt(contentId, 0) > 100000)
    {
        return callback(null, streamingId);
    }

    options = 
    {
        url: 'http://gtapi.wowotv.tw/gttv-api/token/get',
        headers: 
        {
            'Authorization': 'Basic R1RUVihJUCk6ODY3YTFkYWMzMGQyYzYzNjk2YWM3NzZlODY4NTIwYTQ5NDE5ZTkyOQ==',
            'Platform': 'IPhone',
            'Model': 'iPhone 6',
            'Version': '1.0.4'
        }
    }

    request.post(options ,function(error, response, body)
    {
        try
        {
            token = JSON.parse(body).data.accessToken;  
        }
        catch (err)
        {
            return callback(Boom.badRequest('Get token fail'), null);
        }

        request.post('http://gtapi.wowotv.tw/gttv-api/streaming/get',
        {
            'auth':
            {
                'bearer': token
            },
            'form':
            {
                'contentId': contentId,
                'streamingId': streamingId
            }
        },
        function (error2, response2, body2)
        {
            try
            {
                streamingUrl = JSON.parse(body2).data.streamingUrl;
            }
            catch (err)
            {
                return callback(Boom.badRequest('Get result fail'), null);
            }

            callback(null, streamingUrl);
        });
    });
}
