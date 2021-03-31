/*
    sudo docker exec -it ce996470a658 bash
    mongo -uroot -pxxx

	> use lktd
	> db.createCollection('redir')
	{ "ok" : 1 }

	> show collections
	redir

	> show dbs
	lktd          0.000GB
	local         0.000GB
	pymongo_test  0.000GB
*/

'use strict';

const MongoClient = require('mongodb').MongoClient;
const user        = 'example';
const pass        = 'xxx';
const url         = `mongodb://${user}:${pass}@localhost:27017/`;

const def_db_name    = 'lktd';
const def_collection = 'redir';

exports.Mongo = class { 

	// Write.
	async save( args ) {

		args = args || [];

		const data       = args['data'];
		const db_name    = args['db_name']    || def_db_name;
		const collection = args['collection'] || def_collection;

		if ( data && db_name && collection ) {

			return new Promise( ( resolve, reject ) => {

				MongoClient.connect( url, ( err, db ) => {

					const dbo = db.db( db_name );

					dbo.collection( collection ).insertOne( data, ( err, res ) => {

						if ( err ) { 
							reject( { 'error': err } );
						} else { 
							resolve( { 'success': res.insertedId } );
						}

					} );

					db.close();

		 		} );

			} );

		} else {
			return { 'error': 'Missing data, db_name, collection' } 
		}
	}

	// Read.
	async fetch( args ) {

		args = args || [];

		const data       = args['data'];
		const db_name    = args['db_name']    || def_db_name;
		const collection = args['collection'] || def_collection;

		if ( data && db_name && collection ) {

			return new Promise( ( resolve, reject ) => {

				MongoClient.connect( url, ( err, db ) => {

					const dbo = db.db( db_name );

					dbo.collection( collection ).find( data ).toArray( ( err, res ) => {

						if ( err ) { 
							reject( { 'error': err } );
						} else { 
							resolve( { 'success': res } );
						}

					} );

					db.close();

		 		} );

			} );

		} else {
			return { 'error': 'Missing data, db_name, collection' } 
		}
	}
}
