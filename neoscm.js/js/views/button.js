
define( [ "ui/Ripple", "ui/ProgressButton", "ui/Peek" ], function() {
	
	return function( container ) {
		
		var 
		progress,
		random;

		container = $( container );

		container.find( "button.ripple[name=ripple]" ).ripple();

		random = container.find( "button.ripple[name=random]" )
			.ripple( {
				speed: 400,
				random: true
			} );
		progress = container.find( "button.progress[name=progress]" ).progressButton();

		container
		.delegate( ".icon.play[name=ripple]", "click", function() {
			
			random.show();
		} )
		.delegate( ".icon.stop[name=ripple]", "click", function() {
			
			random.hide();
		} )
		.delegate( ".icon.play[name=progress]", "click", function() {
			progress.start();
		} )
		.delegate( ".icon.stop[name=progress]", "click", function() {
			progress.done();
		} );

		$( document.body ).peek();
	};
} );
