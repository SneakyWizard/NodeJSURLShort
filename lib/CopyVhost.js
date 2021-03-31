
/*

	Copy from the base vhost into another vhost and replace the sub/domain.

*/

const fs   = require('fs');
const util = require('util');

const readFile  = util.promisify( fs.readFile );
const vhost_dir = process.cwd() + '/vhosts';

exports.CopyVhost = class { 

	async init( args ) {

		args = args || [];

		const domain       = args['domain'];
		const sub_domain   = args['sub_domain'];
		const linkedin_url = args['linkedin_url'];

		if ( sub_domain && domain && linkedin_url ) {

			const base_file = `${vhost_dir}/base-short-conf`;
			const new_file  = `${vhost_dir}/${sub_domain}.${domain}.conf`;

			let server = `    ServerName "${sub_domain}.${domain}"`;

			let buf = await readFile( base_file );
			buf     = buf.toString( 'utf8' );
			buf     = buf.replace( /<\/VirtualHost>/, `    Redirect permanent / ${linkedin_url}\n${server}\n</VirtualHost>` );

			await fs.writeFile( new_file, buf, ( err ) => {
				if ( err ) { 
					console.log( err );
				}
			} );

		}
	}
}

