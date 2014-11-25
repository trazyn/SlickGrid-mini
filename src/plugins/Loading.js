
define( function() {
	
	return function( $G ) {
		
		var loading = $( "<div class='slick-loading fade' style='display: none;'> <div class='slick-head-mask'></div></div>" );

		$( $G.getContainerNode() ).append( loading );

		$.extend( $G, {
			showLoading: function() {
				loading.fadeIn();
			},

			hideLoading: function() {
				loading.is( ":visible" ) ? loading.fadeOut( 100 ) : loading.css( "display", "none" );
			}
		} );
	};
} );
