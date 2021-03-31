'use strict';

const http        = require('http');
const express     = require('express');
const compression = require('compression');

let { Mongo } = require('./lib/DB/Mongo');
Mongo = new Mongo();

let { MakeAlias } = require('./lib/MakeAlias');
MakeAlias = new MakeAlias();

let { CopyVhost } = require('./lib/CopyVhost');
CopyVhost = new CopyVhost();

let { helper } = require('./lib/helper');
helper = new helper();

const app = express();
app.use( express.json() );

process.on( 'unhandledRejection', error => {
	console.log( 'unhandledRejection', error.message );
	console.log( error );
} );

app.post( '/save', async ( req, res, next ) => {

	let json         = req.body;	
	let form_name    = json['form-name'];
	let linkedin_url = json['linkedin_url'];

	let result = {};

	if ( form_name && linkedin_url && helper.is_valid_linkedin( linkedin_url ) ) {

		// Normalize the url.
		linkedin_url = linkedin_url.replace( /.+(linkedin.+)/, '$1' );

		// Add http back.
		if ( !linkedin_url.match( /^http/ ) ) {
			linkedin_url = 'http://' + linkedin_url;
		}

		// Path type insert.
		// Check if the path is free before creating.
		if ( form_name == 'default' ) {

			if ( json.path.length ) {

				json.path = json.path.replace( /\s+/g, '-' ).toLowerCase();
				let fetch = await Mongo.fetch( { 'data': { 'path': json.path } } );

				if ( !fetch.success.length ) { 
					result = await Mongo.save( { 'data': json } );
					await MakeAlias.init( { 'path': json.path, 'linkedin_url': linkedin_url } );
				} else { 
					result = { 'error': `${json.path} already taken.  Choose another.` };
				}

			} else { 
				result = { 'error': 'Choose a name' };
			}

		} else if ( form_name == 'custom' ) {  

			// Domains, sub-domains, a record creation.
			if ( json.sub_domain.length && json.domain.length ) { 

				json.sub_domain = json.sub_domain.replace( /\s+/g, '-' );
				let is_valid    = helper.is_valid_domain( json.domain );

				if ( is_valid ) {

					let fetch = await Mongo.fetch( { 'data': { 'domain': json.domain, 'sub_domain': json.sub_domain } } );

					if ( !fetch.success.length ) { 
						result = await Mongo.save( { 'data': json } );
						await CopyVhost.init( { 'sub_domain': json.sub_domain, 'linkedin_url': linkedin_url, 'domain': json.domain } );
					} else { 
						result = { 'error': `${json.sub_domain}.${json.domain} already taken.  Choose another` };
					}

				} else { 
					result = { 'error': 'Not a valid domain' };
				}
			}
		}

	} else { 
		result = { 'error': 'Invalid LinkedIn URL' };
	}

	result = JSON.stringify( result, null, 4 );
	res.status( 200 ).send( result );

} );

http.createServer( app ).listen( 3001 );

if ( typeof PhusionPassenger !== 'undefined' ) {
	console.log( 'Running node with passenger' );
} else {
	console.log( 'Running node listening on http://127.0.0.1:3001/' );
}
