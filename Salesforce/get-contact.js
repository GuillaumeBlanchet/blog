var jsforce = require('jsforce');
var conn = new jsforce.Connection({
    loginUrl : 'https://guillaumeblanchet-dev-ed.develop.my.salesforce.com'
});
var user = '';
var pwd = '';
var token = '';
conn.login('', pwd+token, (err, res) => {
    // clear your synchronized database account table
    // example with firebase:
    firebase.database().ref('account').remove();
    var query = conn.query('SELECT Id, Name FROM Account')
        .on('record', record => {
            console.log(record);
            // insert record into your database
            // example with firebase:
            firebase.database().ref('account').push(record);
        })
        .on('end', () => {
            console.log("total in database : " + query.totalSize);
            console.log("total fetched : " + query.totalFetched);
        })
        .run({ autoFetch : true });
});
