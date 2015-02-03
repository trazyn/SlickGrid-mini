
define( [ "ui/Message", "ui/Peek" ], function() {
	
	return function( container ) {
		
		container
		.delegate( ".ui.button", "click", function() {
		
			var self = $( this );

			switch ( true ) {
				
				case self.hasClass( "success" ):
					$.message.success( "This is a message telling you that everything is a-okay" );
					break;

				case self.hasClass( "warn" ):
					$.message.warn( "It warns the users that to expect some changes or limitations." );
					break;

				case self.hasClass( "error" ):
					$.message.error( "This is a notification that something is wrong..." );
					break;

				case self.hasClass( "info" ):
					$.message.info( "This is an 'information message' div." );
					break;
			}
		} )

		.delegate( ".ui.button[name=confirm]", "click", function() {
			
			$.message.confirm( {
				
				title: "Please confirm",
				message: "Exported successfully. Do you want to open the export query page?",
				onOk: function() {
					
					window.open( "//www.google.com", "_blank" );
				}
			} );
		} )
		
		.delegate( ".ui.button[name=bubble]", "click", function() {
			
			$.message.bubble( "Thank You~", 3000 );
		} );

		$( document.body ).peek();
	};
} );
