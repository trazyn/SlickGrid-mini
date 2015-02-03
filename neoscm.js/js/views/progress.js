define( [ "ui/Menu", "ui/Ripple", "ui/Progress" ], function( Menu ) {
	
	return function( container ) {
		
		var progress = container.find( ".ui.progress" ).progress();

		container.ripple();

		container
		.delegate( "button[name=play]", "click", function() {
			
			progress.start();
		} )
		.delegate( "button[name=stop]", "click", function() {
			progress.done();
		} )
		.delegate( "a.hamburger", "click", function() {
			
			var self = $( this ).addClass( "active" );

			Menu( function() {
				self.removeClass( "active" );
			} );
		} );
	};
} );
