
define( function() {
	
	var defaults = {
		
		key: "delete",
		cssClass: "slick-delete",
		sync: true
	}
	
	, deleteItems = function( rows ) {
		
		var dataView = this.getData();

		for ( var i = rows.length; --i >= 0; ) {
			
			dataView.deleteItem( this.getDataItem( i )[ "id" ] );
		}

		this.invalidate( rows );
		this.render();
	};

	return function( $G, options ) {
	
		var settings = $.extend( {}, defaults, options || {} )
	
		, deleteds = [];

		$G.getData().onRowsChanged.subscribe( function() {
			
			$G.setDeleteRows( [] );
		} );
	
		$.extend( $G, {
		
			setDeleteRows: function( rows, sync ) {
			
				var hash = {};

				if ( rows && rows.length ) {
					
					if ( deleteds.length ) {

						deleteds = deleteds.concat( rows );

						for ( var res = [], i = deleteds.length; --i >= 0; ) {
							
							var index = res.indexOf( deleteds[ i ] );

							if ( index === -1 ) {
								
								res.push( deleteds[ i ] );
							} else res.splice( index, 1 );
						}

						deleteds = res;

					} else deleteds = rows;
				} else if ( rows && !rows.length ) {
					/** Remove the deleted rows */
					deleteds = [];
				} else
					deleteds = $G.getSelectedRows();

				if ( !sync || !settings.sync ) {
					
					for ( var i = deleteds.length; --i >= 0; ) {
						
						hash[ deleteds[ i ] ] = {};

						$G.getColumns().forEach( function( column ) { 
							
							hash[ deleteds[ i ] ][ column.id ] = settings.cssClass;
						} );
					}

					$G.setCellCssStyles( settings.key, hash );
				} else {
					
					deleteItems.call( $G, deleteds );
				}

				return deleteds;
			},

			getDeleteRows: function() {
				return deleteds;
			},

			getDeleteRowsData: function(){
			
				var result = [];

				for ( var i = deleteds.length; --i >=0; 
						result.push( $G.getDataItem( deleteds[ i ] ) ) );
				return result;
			}
		} );
	};
} );
