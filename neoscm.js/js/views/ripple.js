
define( [ "ui/Peek", "ui/Ripple" ], function() {
	
	return function( container ) {
		
		var
		pulse = container.find( "button[name=pulse]" ).ripple( { speed: 800 } ),
		random = container.find( "button[name=random]" ).ripple( { speed: 400, random: true } );
		
		container.find( "button[name=normal]" ).ripple();

		container
		.delegate( "i.icon[name=pulse]", "click", function() {
			
			if ( $( this ).hasClass( "play" ) ) {
				pulse.show();
			} else 
				pulse.hide();
		} )
		.delegate( "i.icon[name=random]", "click", function() {
			
			if ( $( this ).hasClass( "play" ) ) {
				random.show();
			} else 
				random.hide();
		} );

		/** Some exmaple */
		container.find( ".example-div" ).ripple();
		container.find( ".ui.circle" ).ripple();
		container.find( ".ui.select" ).ripple();

		$( document.body ).peek();
	};
} );
