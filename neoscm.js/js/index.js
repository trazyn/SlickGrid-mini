
require.config( {
	
	baseUrl: "js/src",

	paths: {
		views: "../views"
	}
} );

require( [ "ui/Menu", "util/Router" ], function( Menu ) {

	$( function() {
		$( document.body ).removeClass( "out" );
	} );

	$( "#nav" )

	.delegate( ".hamburger", "click", Menu )
	
	.delegate( "i.icon.github2", "click", function() {
	
	} );

	$( "#canvas" )

	.delegate( "button[name=wiki]", "click", Menu )

	.delegate( "button[name=github]", "click", function() {
	
	} );
} );
