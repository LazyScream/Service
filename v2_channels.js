
const request = require('request');
const Boom    = require('boom');
const customChannels = require('./customChannels.js');


module.exports = function (callback) 
{
    // 取客製化頻道
    customChannels(function(custom_channels)
    {
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

        // 取 token
        request.post(options ,function(error, response, body)
        {
            try
            {
                token = JSON.parse(body).data.accessToken;	
            }
            catch (err)
            {
                // 取 token 失敗
                return callback(custom_channels, null);
            }

            // 取 GT行動電視頻道
            request.post('http://gtapi.wowotv.tw/gttv-api/content/list',
            {
                'auth':
                {
                    'bearer': token
                },
                'form':
                {
                    'menuId': '1',
                    'length': '500'
                }
            },
            function (error2, response2, body2)
            {
                try
                {
                    contentList = JSON.parse(body2).data.contentList;
                }
                catch (err)
                {
                    // 取 GT 頻道失敗
                    return callback(custom_channels, null);
                }

                contentList = JSON.parse(body2).data.contentList;

                contentList.push.apply(contentList, custom_channels);

                sort = contentList.sort(function (a, b)
                {
                    if (a.name < b.name )
                        return -1;
                    else if (a.name >= b.name)
                        return 1;
                    else 
                        return 0;
                });

                callback(null, sort);
            });
        });
    });
}
