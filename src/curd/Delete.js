
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
	
		, deleteds = {};
	
		$G.setDeleteRows = function( rows, sync ) {
		
			var hash = {};

			if ( rows ) {
				
				deleteds = rows;
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
		};

		$G.getDeleteRows = function() {
			return deleteds;
		};

		$G.getDeleteRowsData = function(){
		
			var result = [];

			for ( var i = deleteds.length; --i >=0; 
					result.push( $G.getDataItem( deleteds[ i ] ) ) );
			return result;
		};
	};
} );
