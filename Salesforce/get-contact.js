var jsforce = require('jsforce');
var conn = new jsforce.Connection({
    loginUrl : 'https://guillaumeblanchet-dev-ed.develop.my.salesforce.com'
});
console.log('Test env variables:');
console.log(process.env.TEST);

var pwd = process.env.SF_PWD;
var token = process.env.SF_SECURITY_TOKEN;
conn.login('guillaume.blanchet2@gmail.com', pwd+token, (err, res) => {
    // clear your synchronized database account table
    // example with firebase:
    //firebase.database().ref('account').remove();
    var query = conn.query('SELECT Id, Name FROM Account')
        .on('record', record => {
            console.log(record);
            // insert record into your database
            // example with firebase:
            //firebase.database().ref('account').push(record);
        })
        .on('end', () => {
            console.log("total in database : " + query.totalSize);
            console.log("total fetched : " + query.totalFetched);
        })
        .run({ autoFetch : true });
});
