const newman = require('newman'); // newman should be a dependency in the package.json of your project

newman.run({
    collection: require('./../hackerNews.postman_collection.json'),
    reporters: 'cli'
}, function (err, runSummary) {
    if (err) {
        console.log("err: ", err);
    }
    // runSummary.run.executions.forEach(function(result){
    //     // haven't been able to find a way to show the response body, newman doesn't seem to
    //     // console.log('collection run complete!\nSummary: \n', result);
    // })
});


