'use strict';

exports.helper = class { 

	// Valid custom domain.
	is_valid_domain( domain ) { 
		let re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
    	return domain.match( re );
	} 

	is_valid_sub( sub_domain ) { 
		let re = new RegExp(/^[0-9a-z-]+$/); 
    	return sub_domain.match( re );
	}

	// Support linked in domains. 
	is_valid_linkedin( url ) { 

		let is_valid = 0;
		
		if ( url.match( /linkedin\.com/ ) ) {
			is_valid = 1;
		}

		return is_valid;
	}

}
