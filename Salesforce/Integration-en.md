# Synchronize Salesforce Data to Your System

## Introduction

Salesforce is one of the most powerful CRM systems
on the market. This "low-code" platform can replace an entire IT department by offering
a website to manage your clients, your billing, your marketing campaigns,
your field interventions, and much more.

Even though it can manage your entire back office, it can't replace your brand image
or certain systems at the core of your business model.
Integrating Salesforce data is therefore fundamental work to present your customers with
custom products while transferring their data to the CRM to ensure consistency of your
data across your systems.

## Install the Salesforce CLI ("sf")

The first step to working with Salesforce data efficiently
[is installing "sf"](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm).

This command-line tool will allow you to quickly test your queries to the CRM, for example:

```shell
sf org login web
sf org list
sf data query --query "SELECT Id, Name, Account.Name FROM Contact" -o <ORG_USERNAME>
```

These three commands allow you to connect to your Salesforce instance, view details of
your organization, and finally connect with these details to execute a query. Here's what it looks like on a [developer test instance](https://developer.salesforce.com/signup/):

![sf](./img/sf.png)

As you can see, Salesforce does you a favor by creating the instance with prepopulated data.

## Program Synchronization Thanks to Salesforce's REST API

Once you have tested the queries that can be used in your synchronization program with
`sf`, all that's left is to program the code that will execute these queries to perform the synchronization.

Of course, contacting the REST API directly would require recoding the data transfer objects (DTOs), which we
want to avoid. Salesforce provides an excellent NodeJs wrapper (https://github.com/jsforce/jsforce) for its API, and it's the one I recommend
for several reasons:

- [Salesforce recommends this ecosystem](https://developer.salesforce.com/blogs/2021/01/what-is-node-js-and-why-does-it-matter-as-a-salesforce-developer);
- `sf` was coded with NodeJS;
- [It's one of the 2 only wrappers proposed by the system's documentation](https://trailhead.salesforce.com/content/learn/modules/api_basics/api_basics_rest);
- jsforce is maintained by Salesforce unlike other wrappers in other major programming languages (example: https://github.com/simple-salesforce/simple-salesforce)
- The documentation is superior to other wrappers, as you have [a website dedicated to jsforce documentation](https://jsforce.github.io/)

### Example of Data Retrieval with Jsforce

Jsforce will need a "security token" and not just your password to connect to your Salesforce instance.
Navigate to "Setup":
![settings](img/settings.png)
Then create a security token for yourself:
![img.png](img/security-token.png)

Here is an example code that retrieves contacts from the Salesforce database:

```javascript
var jsforce = require('jsforce');
var username = '<email>';
var securityToken = '<security-token>';
var password = '<password>';
var conn = new jsforce.Connection({
loginUrl : 'https://guillaumeblanchet-dev-ed.develop.my.salesforce.com'
});
conn.login(username, password + securityToken, function(err, res) {
conn.query('SELECT Id, Name FROM Account', function(err, res) {
console.log(res);
});
});
```

You should have something like this in your console:

![contacts.png](img/contacts.png)

As you can see, the API returns information for you to paginate requests.
Since we are using a top-tier wrapper, JsForce can manage pagination
itself with the `record' event.

### Example of Firebase <-> Salesforce Synchronization

Here is a more complete example that first destroys the synchronized table in the target system
(here a Firebase database) and then inserts the Salesforce entries one by one:

```javascript
conn.login(username, password + securityToken, (err, res) => {
// clear your synchronized database account table (example with firebase)
firebase.database().ref('account').remove();
var query = conn.query('SELECT Id, Name FROM Account')
.on('record', record => {
console.log(record);
// insert record into your database (example with firebase)
firebase.database().ref('account').push(record);
})
.on('end', () => {
console.log("total in database : " + query.totalSize);
console.log("total fetched : " + query.totalFetched);
})
.run({ autoFetch : true });
});
```

I've deliberately omitted initializing the Firebase connection to extract the relevant code. However,
you can consult the documentation for NodeJS here: https://firebase.google.com/docs/reference/node.

Note the `autoFetch` functionality, which allows for automatic query pagination and demonstrates the utility
of choosing your wrapper well before integrating with Salesforce (or any other system).

## Conclusion

You now have the tools to synchronize your Salesforce data with your system. If the load becomes
too large in your synchronizations, you can revert to custom pagination to load data batches into your
database with a "bulk insert" strategy. For Firebase this could be something like this:

```javascript
firebase.database().ref('account').set(records);
```
Which means replacing the entire contact data table at once for the `records` list given as a parameter.

Note that we have only dealt with synchronization to your system and not to Salesforce. If we wanted
to push new data to Salesforce this time, we could also use the same wrapper, as Jsforce offers
a "bulk insert" functionality to efficiently push several entries for large systems:
https://jsforce.github.io/document/#bulk-api.

## References

- https://jsforce.github.io/
- https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_unified.htm
- https://trailhead.salesforce.com/content/learn/modules/api_basics/api_basics_rest
