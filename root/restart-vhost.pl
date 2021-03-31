#!/usr/bin/perl -w 

use strict;
use Proc::Daemon;
use Cache::Memcached;

print "$>\n";

if ( $> ) { 

	my $daemon = Proc::Daemon->new(
		work_dir => './'
	);

	my $memcache = new Cache::Memcached { 'servers' => [ '127.0.0.1:11211' ] };

	my $pid = $daemon->Init();

	if ( !$pid ) { 

		while() { 
		
			sleep 1;
		
			{
				my $base_file = '/home/xxx/projects/lktd-server/vhosts/lktd.in.conf';
				
				my $md5 = `md5sum $base_file`;
				chomp $md5;
				my @md5 = split ' ', $md5;
				
				my $key       = "lktd:base_size";
				my $base_size = $memcache->get( $key ) || '';
				
				if ( $base_size ne $md5[0] ) {
					$memcache->set( $key, $md5[0], 86400 );
					system( '/usr/sbin/apachectl -k graceful' );
				}
			};
		
			{
				my $vhost_dir  = '/home/xxx/projects/lktd-server/vhosts/';
				my $file_count = `ls -1 $vhost_dir | wc -l`;
				chomp $file_count;
				
				my $key       = "lktd:mem_count";
				my $mem_count = $memcache->get( $key ) || 0;
				
				if ( $mem_count != $file_count ) {
					$memcache->set( $key, $file_count, 86400 );
					system( '/usr/sbin/apachectl -k graceful' );
				}
				
			};
		}
	}

} else {
	die "Must be root $!\n";
}
