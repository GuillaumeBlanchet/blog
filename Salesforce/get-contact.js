var jsforce = require('jsforce');
var conn = new jsforce.Connection({
    loginUrl : 'https://guillaumeblanchet-dev-ed.develop.my.salesforce.com'
});
conn.login('guillaume.blanchet2@gmail.com', '<pwd><token>', function(err, res) {
    conn.query('SELECT Id, Name FROM Account', function(err, res) {
        console.log(res);
    });
});
