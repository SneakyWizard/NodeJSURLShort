
/*

	Copy from the base vhost into another vhost and replace the sub/domain.

*/

const fs   = require('fs');
const util = require('util');

const readFile  = util.promisify( fs.readFile );
const vhost_dir = process.cwd() + '/vhosts';

exports.MakeAlias = class { 

	async init( args ) {

		args = args || [];

		const path         = args['path'];
		const linkedin_url = args['linkedin_url'];

		if ( path && linkedin_url ) { 

			const base_file = `${vhost_dir}/lktd.in.conf`;

			let buf = await readFile( base_file );
			buf     = buf.toString( 'utf8' );
			buf     = buf.replace( /<VirtualHost \*:80>/, `<VirtualHost *:80>\n    <LocationMatch "(?i)/${path}">\n        ProxyPass !\n    </LocationMatch>` );
			buf     = buf.replace( /<\/VirtualHost>/, `    RedirectMatch permanent (?i)^/${path} ${linkedin_url}\n</VirtualHost>` );

			await fs.writeFile( base_file, buf, ( err ) => {
				if ( err ) { 
					console.log( err );
				}
			} );

		}
	}
}
