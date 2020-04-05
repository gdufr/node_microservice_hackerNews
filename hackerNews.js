var path = require('path'),
    responseTransformer = require(path.resolve('./utilities/transformer.js')).responseTransformer,
    logging = require('logging')(),
    services = require('services')(),
    getHackerNews = services.getHackerNews.getHackerNews,
    generalLogger = logging.general,
    transactionLogger = logging.transaction,
    logTypes = logging.logTypes,
    config = require(path.resolve('./utilities/config.js'))(),
    baseurl = config.baseurl;

module.exports = function hackerNews(options) {
    var seneca = this;

    // console.log(baseurl);

    seneca.add({init: 'hackerNews'}, init);
    seneca.add({service: 'hackerNews', operation: 'latest'}, LatestArticlesHandler);

    function init(msg, respond) {
        // Can add logging stuff here
        respond();
    };
}

function LatestArticlesHandler(args, done) {

    generalLogger.log.trace("LatestArticleHandler received request: ", args);

    // pass the url to get the latest story
    args.params.url = baseurl+"maxitem.json?print=pretty&type=story";

    return getHackerNews(args)
        .then(function (result) {

            generalLogger.log.trace("LatestArticleHandler received result: ", result);
            console.log("LatestArticleHandler received result: ", result);

            // strip off the line break
            result = result.result.replace(/\r?\n|\r/g, "");

            args.params.url = baseurl+"item/"+result+".json";

            return getHackerNews(args)
                .then(function (result) {

                    return responseTransformer(result)
                        .then(function (transformedResponse) {


                            generalLogger.log.trace("\nhackerNews returning transformedResponse:\n", transformedResponse);
                            done(null, {result: transformedResponse});
                        })
                        .catch(function (err) {
                            generalLogger.log.error(logTypes.fnInside({err: err}), `hackerNews got err`);

                            done(null, {err: err});
                        })
                })
                .catch(function (err) {
                    console.log("getArticle err: ", err);
                })
        })
        .catch(function (err) {
            console.log("getMaxItem err: ", err);

        })

}