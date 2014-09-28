
define( function() {

	var defaults = {
		
		id: "+"
	}

	, Add = function( $G ) {
		
		var adds = [];

		$.extend( this, {
			
			addRow: function( row ) {
				
				var dataView = $G.getData()
				, index = dataView.getItems().length;

				if ( !row ) {
					
					row = {
						
						id: "+ " + index
					};
				}

				dataView.beginUpdate();

				if ( !adds.length ) {
				
					/** Add rows in current viewport */
					dataView.setPagingOptions( { pageSize: 0 }, false );
				} 

				adds.push( index );
				$G.getData().addItem( row );

				dataView.endUpdate();

				$G.scrollRowIntoView( index );
				$G.onAddNewRow.notify( { row: row } );
			}
		} );

		$.extend( $G, {
			
			getAddRows: function() {
				
				var rows = [];

				for ( var i = adds.length; --i >= 0; rows.push( $G.getDataItem( adds[ i ] ) ) );

				return rows;
			},

			getAddRowsIndexes: function() {
				
				return adds;
			},

			setAddRows: function( rows ) {
				adds = rows;
			}
		} );
	};
	
	return function( $G ) {

		return new Add( $G );
	};
} );
