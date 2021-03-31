let { CopyVhost } = require('./lib/CopyVhost');
CopyVhost = new CopyVhost();

process.on( 'unhandledRejection', error => {
        console.log( 'unhandledRejection', error.message );
} );

//MakeAlias.init( { 'path': 'eit8i', 'linkedin_url': 'http://www.linkedin.com/now' } );
CopyVhost.init( { 'sub_domain': 'eit8i', 'linkedin_url': 'http://www.linkedin.com/now', 'domain': 'fkrt.com' } );

