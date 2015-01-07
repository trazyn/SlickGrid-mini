
define( [ "ui/Amodal" ], function() {

	var 
	showMenu = function() {

		$.amodal( {
			
			showHead: false,

			render: function( deferred, loading, close ) {
			
				var self = $( this );

				self
				.parent()
				.css( "overflow", "auto" )
				.parents( ".ui.amodal" )
				.css( {
					"width": 300,
					"height": "100%",
					"padding": 0
				} );

				$.ajax( {
					
					url: "/views/menu.html",
					dataType: "html"
				} )
				.done( function( data ) {
					
					self
					.css( "padding", 0 )
					.html( data )
					.find( "[data-url]" )
					.removeClass( "active" )
					.filter( "[data-url='" + (location.hash.substr( 1 ) || "wiki") + "']" )
					.addClass( "active" );
				} )
				.always( function() {
					deferred.resolve();
				} );

				self
				.delegate( ".logo", "click", function() {

					close();
					window.location.hash = "#";
				} )
				.delegate( "[data-url]", "click", function( e ) {
				
					close();
					window.location.hash = "#" + this.getAttribute( "data-url" );

					e.stopPropagation();
					e.preventDefault();
				} );
			},

			animate: "right"
		} );
	};

	return function() {
		
		$( "#nav" )

		.delegate( ".hamburger", "click", showMenu )
		
		.delegate( "i.icon.github2", "click", function() {
		
		} );

		$( "#canvas" )

		.delegate( "button[name=wiki]", "click", showMenu )

		.delegate( "button[name=github]", "click", function() {
		
		} );
	};

} );
