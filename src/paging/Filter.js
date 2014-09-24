
define( function() {

	var handleHeaderRowCellRendered = function( e, args ) {
	
		$( args.node )
			.html( "<input type='text' data-column-field='" + args.column.field + "' >" );
	};

	return function( $G, isAjax ) {
	
		var dataView = $G.getData(), filters = {};
	
		$G.onHeaderRowCellRendered.unsubscribe( handleHeaderRowCellRendered );
		$G.onHeaderRowCellRendered.subscribe( handleHeaderRowCellRendered );

		if ( !isAjax ) {
			
			/** Set the filter */
			dataView.setFilter( function( row ) {
				
				for ( var field in filters ) {
					
					if ( filters[ field ] && row[ field ] !== filters[ field ] ) {
						
						return false;
					}
				}
				return true;
			} );
		}

		$( $G.getHeaderRow() )

		/** Remove all keyup handler */
		.undelegate( "input:visible", "keyup" )	

		.delegate( "input:visible", "keyup", function() {
			
			var self = $( this )
			, field = self.attr( "data-column-field" );

			if ( field ) {
				
				filters[ field ] = self.val().replace( /^\s+|\s+$/g, "" );
				dataView.refresh();

				if ( isAjax && !key.keyCode ) {
					
					dataView.onPagingInfoChanged.notify( filters );
				}
			}
		} );
	};
} );
