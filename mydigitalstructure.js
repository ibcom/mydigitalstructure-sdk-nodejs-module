var _ = require('lodash')

module.exports = 
{
	data: 	{session: undefined},

	init: 	function (callBack, settings)
			{
				if (settings == undefined)
				{	
					var fs = require('fs');

					fs.readFile('settings.json', function (err, buffer)
					{
						if (!err)
						{	
							var _settings = buffer.toString();
							settings = JSON.parse(_settings);
							module.exports.data._settings = settings;

							if (!_.isUndefined(settings))
							{
								if (!_.isUndefined(settings.mydigitalstructure))
								{
									settings = settings.mydigitalstructure;
								}

								module.exports.data.settings = settings;
							}

							module.exports.logon(callBack, settings)
						}	
					});
				}
				else
				{
					module.exports.data.settings = settings;
					module.exports.logon(callBack, settings);
				}	
			},

	logon: 	function (callBack, settings)
			{
				var https = require('https');
				var requestData = 'logon=' + settings.logon + 
									'&password=' + settings.password;

				var options =
				{
					hostname: settings.hostname,
					port: 443,
					path: '/rpc/logon/?method=LOGON',
					method: 'POST',
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': requestData.length
					}
				};

				var req = https.request(options, function(res)
				{
					res.setEncoding('utf8');

					var data = '';
					
					res.on('data', function(chunk)
					{
					  	data += chunk;
					});
					
					res.on('end', function ()
					{	
						if (process.env.DEBUG) {console.log('#myds.logon.res.end.response:' + data)};
						var _data = JSON.parse(data);
				    	module.exports.data.session = _data;
				    	if (_.isFunction(callBack)) {callBack({data: _data, settings: settings})};
					});
				});

				req.on('error', function(error)
				{
					if (process.env.DEBUG) {console.log('#myds.logon.req.error.response:' + error.message)}
				  	if (_.isFunction(callBack)) {callBack({error: error})};
				});

				req.write(requestData);
				req.end()
			},

	send: 	function (options, data, callBack)
			{
				var https = require('https');
				var settings = module.exports.data.settings;
				var session = module.exports.data.session;
				var requestData;

				if (_.isUndefined(data))
				{
					requestData = options.data
				}
				else
				{
					requestData = data
				}

				if (!_.isUndefined(requestData))
				{	
					requestData = requestData + '&sid=' + session.sid + '&logonkey=' + session.logonkey;
				}
				else
				{
					requestData = 'sid=' + session.sid + '&logonkey=' + session.logonkey;
				}	

				if (process.env.DEBUG) {console.log('####data:' + requestData)};

				if (_.isUndefined(callBack))
				{
					callBack = options.callBack
				}					
						
				if (options.type == undefined) {options.type = 'POST'}
						
				var requestOptions =
				{
					hostname: settings.hostname,
					port: 443,
					path: options.url,
					method: options.type,
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': requestData.length
					}
				};

				if (process.env.DEBUG) {console.log('####options:' + JSON.stringify(requestOptions))};

				var req = https.request(requestOptions, function(res)
				{
					res.setEncoding('utf8');

					var data = '';
					
					res.on('data', function(chunk)
					{
					  	data += chunk;
					});
					
					res.on('end', function ()
					{	
						if (process.env.DEBUG) {console.log('#myds.send.res.end.response:' + data)}
				    	if (_.isFunction(callBack)) {callBack(options, data)};
					});
				});

				req.on('error', function(error)
				{
					if (process.env.DEBUG) {console.log('#myds.logon.req.error.response:' + error.message)}
				  	if (callBack) {callBack(options, data, error)};
				});

				req.write(requestData);
				req.end()
			},

	_util: 	{
				search:  
				{	
					init: function ()
					{
						var criteria = 
						{
							"fields": [],
							"summaryFields": [],
							"filters": [],
							"sorts": [],
							"options": {},
							"customoptions": []
						}

						return criteria
					}
				}
			}							

}