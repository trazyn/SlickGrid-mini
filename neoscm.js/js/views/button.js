
define( [ "ui/Ripple" ], function() {
	
	return function( container ) {
		
		var random;

		container = $( container );

		container.find( "button.ripple[name=ripple]" ).ripple();

		random = container.find( "button.ripple[name=random]" )
			.ripple( {
				speed: 400,
				random: true
			} );

		container
		.delegate( ".icon.play", "click", function() {
			
			random.show();
		} )
		.delegate( ".icon.stop", "click", function() {
			
			random.hide();
		} );
	};
} );
