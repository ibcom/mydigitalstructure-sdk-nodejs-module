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

	logon: 	function (fCallBack, oSettings)
			{
				var https = require('https');
				var sData = 'logon=' + oSettings.logon + 
							'&password=' + oSettings.password;

				var options =
				{
					hostname: oSettings.hostname,
					port: 443,
					path: '/rpc/logon/?method=LOGON',
					method: 'POST',
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': sData.length
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
						var oData = JSON.parse(data);
				    	module.exports.data.session = oData;
				    	if (_.isFunction(fCallBack)) {fCallBack({data: oData, settings: oSettings})};
					});
				});

				req.on('error', function(error)
				{
					if (process.env.DEBUG) {console.log('#myds.logon.req.error.response:' + error.message)}
				  	if (_.isFunction(fCallBack)) {fCallBack({error: error})};
				});

				req.write(sData);
				req.end()
			},

	send: 	function (oOptions, sData, fCallBack)
			{
				var https = require('https');
				var oSettings = module.exports.data.settings;
				var oSession = module.exports.data.session;
				var sRequestData;

				if (_.isUndefined(sData))
				{
					sRequestData = oOptions.data
				}
				else
				{
					sRequestData = sData
				}

				if (!_.isUndefined(sRequestData))
				{	
					sRequestData = sRequestData + '&sid=' + oSession.sid + '&logonkey=' + oSession.logonkey;
				}
				else
				{
					sRequestData = 'sid=' + oSession.sid + '&logonkey=' + oSession.logonkey;
				}	

				if (process.env.DEBUG) {console.log('####data:' + sRequestData)};

				if (_.isUndefined(fCallBack))
				{
					fCallBack = oOptions.callBack
				}					
						
				if (oOptions.type == undefined) {oOptions.type = 'POST'}
						
				var options =
				{
					hostname: oSettings.hostname,
					port: 443,
					path: oOptions.url,
					method: oOptions.type,
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': sRequestData.length
					}
				};

				if (process.env.DEBUG) {console.log('####options:' + JSON.stringify(options))};

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
						if (process.env.DEBUG) {console.log('#myds.send.res.end.response:' + data)}
				    	if (_.isFunction(fCallBack)) {fCallBack(oOptions, data)};
					});
				});

				req.on('error', function(error)
				{
					if (process.env.DEBUG) {console.log('#myds.logon.req.error.response:' + error.message)}
				  	if (fCallBack) {fCallBack(oOptions, data, error)};
				});

				req.write(sRequestData);
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