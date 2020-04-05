var Promise = require('bluebird'),
    logging = require('logging')(),
    generalLogger = logging.general,
    logTypes = logging.logTypes;

module.exports.responseTransformer = function (httpResponseObject) {

    let resultJSON = {};
    try {
        resultJSON = JSON.parse(httpResponseObject.result);
    } catch (err) {
        console.log("err: ", err);
        // return {err: err}
    }

    return Promise.all([
        authorMapping(resultJSON),
        scoreMapping(resultJSON),
        timeMapping(resultJSON),
        titleMapping(resultJSON),
        textMapping(resultJSON),
        urlMapping(resultJSON),
        mapAll(resultJSON)
    ])
        .then(function (allResponseData) {
            let returnObject = {};

            returnObject.author = allResponseData[0];
            returnObject.score = allResponseData[1];
            returnObject.time = allResponseData[2];
            returnObject.title = allResponseData[3];
            returnObject.text = allResponseData[4];
            returnObject.url = allResponseData[5];
            returnObject.allResult = allResponseData[6];

            generalLogger.log.info(logTypes.fnInside({returnObject: returnObject}), 'hackerNews transformer returnObject');
            return returnObject;
        })
        .catch(function (err) {

            generalLogger.log.debug(logTypes.fnInside({err: err}), 'hackerNews transformer error');
            return {message: "Error transforming response: ", err: err};
        })
}

// return object mapping functions
function authorMapping(resultJSON) {


    if (resultJSON && resultJSON.hasOwnProperty('by')) {

        return resultJSON.by;
    } else {
        return null;
    }
}

function scoreMapping(resultJSON) {
    if (resultJSON && resultJSON.hasOwnProperty('score')) {

        return resultJSON.score;
    } else {
        return null;
    }
}

function timeMapping(resultJSON) {
    if (resultJSON && resultJSON.hasOwnProperty('time')) {

        // for now just return unixTime, later figure out conversion to pretty datetime
        return resultJSON.time;

        // let unixTime = new Date(httpResponseObject.time);
        //
        // try{
        //     let formattedTime = convertDateToMMDDYYY(unixTime);
        // }catch(err){
        //     generalLogger.log.error("error formatting utc time ", err);
        // }
        // return formattedTime;
    } else {
        return null;
    }
}

function textMapping(resultJSON) {
    if (resultJSON && resultJSON.hasOwnProperty('text')) {

        return resultJSON.text;
    } else {
        return null;
    }
}

function titleMapping(resultJSON) {
    if (resultJSON && resultJSON.hasOwnProperty('title')) {

        return resultJSON.title;
    } else {
        return null;
    }
}

function urlMapping(resultJSON) {
    if (resultJSON && resultJSON.hasOwnProperty('url')) {

        return resultJSON.url;
    } else {
        return null;
    }
}

function mapAll(resultJSON) {

    let allResults = {};
    Object.getOwnPropertyNames(resultJSON).forEach(function (key) {
        allResults[key] = resultJSON[key];
    })

    return allResults;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}