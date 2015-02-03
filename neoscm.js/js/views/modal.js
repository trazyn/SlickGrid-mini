
define( [ "ui/Menu", "ui/Amodal" ], function( Menu ) {

	return function( container ) {
	
		container
		.delegate( "button[name!=viewCode]", "click", function() {
			
			$.amodal( { animate: this.name } );
		} )
		.delegate( "a.hamburger", "click", function() {
			
			var self = $( this ).addClass( "active" );

			Menu( function() {
				self.removeClass( "active" );
			} );
		} );
	};
} );
