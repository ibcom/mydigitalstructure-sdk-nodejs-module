var _ = require('lodash')

module.exports = 
{
	data: {session: undefined},

	init: function (fCallBack, oSettings)
			{
				var fLogon = module.exports.logon;

				if (oSettings == undefined)
				{	
					var fs = require('fs');

					fs.readFile('settings.json', function (err, buffer)
					{
						if (!err)
						{	
							var sSettings = buffer.toString();
							if (process.env.DEBUG) {console.log('#myds.init.settings:' + sSettings)};
							var oSettings = JSON.parse(sSettings);
							module.exports.data._settings = oSettings;

							if (!_.isUndefined(oSettings))
							{
								if (!_.isUndefined(oSettings.mydigitalstructure))
								{
									oSettings = oSettings.mydigitalstructure;
								}

								module.exports.data.settings = oSettings;
							}

							fLogon(fCallBack, oSettings)
						}	
					});
				}
				else
				{
					module.exports.data.settings = oSettings;
					fLogon(fCallBack, oSettings);
				}	
			},

	logon: function (fCallBack, oSettings)
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

	send: function (oOptions, sData, fCallBack)
			{
				var https = require('https');
				var oSettings = module.exports.data.settings;
				var oSession = module.exports.data.session;

				var sData = sData + '&sid=' + oSession.sid +
									'&logonkey=' + oSession.logonkey;
					
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
						if (process.env.DEBUG) {console.log('#myds.send.res.end.response:' + data)}
				    	if (_.isFunction(fCallBack)) {fCallBack({data: data})};
					});
				});

				req.on('error', function(error)
				{
					if (process.env.DEBUG) {console.log('#myds.logon.req.error.response:' + error.message)}
				  	if (fCallBack) {fCallBack({error: error})};
				});

				req.write(sData);
				req.end()
			}		
}