const app_config_settings = require('application-configuration')().settings,
    seneca = require('seneca')({timeout: app_config_settings.get('/SENECA_TIMEOUT')}),
    clientInfo = app_config_settings.get('/microservicesClientInfo').hackerNews;


seneca.use('hackerNews.js');

seneca.listen({type:clientInfo.type, port:clientInfo.port });
