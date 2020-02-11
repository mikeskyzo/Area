const MongoClient = require('mongodb').MongoClient;

const dev_db = 'mongodb+srv://MikeTest:GrosSexDu44@cluster0-boacc.mongodb.net/test?retryWrites=true&w=majority'
const prod_db = 'mongodb://db:27017/Db_Area'

exports.initDb = function () {
	try {
		MongoClient.connect(prod_db, (err, client) => {
			if (err) return global.terminateServer('A error occured');
			global.clientDb = client;
			global.db  = client.db('Area51');
			create_Collection(global.CollectionToken);
			create_Collection(global.CollectionUsers);
			create_Collection(global.CollectionArea);
		})
	} catch (err){
		global.terminateServer(err);
	};
}

function create_Collection(dbName)
{
	global.db.createCollection(dbName, function(err, result) {
		if (err) console.log(err);
		console.log('Collection ' + dbName + ' created');
	});
}