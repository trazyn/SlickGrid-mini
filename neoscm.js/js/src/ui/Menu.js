
define( [ "ui/Amodal" ], function() {

	return function( unload ) {

		$.amodal( {
			
			showHead: false,

			unload: unload,

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
} );
