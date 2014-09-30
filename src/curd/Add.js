
define( function() {

	var defaults = { }

	, Add = function( $G ) {
		
		var adds = []
	
		, dataView = $G.getData();

		$.extend( this, {
			
			addRow: function( row ) {
				
				var index = dataView.getItems().length

				/** Generate an unique index */
				, label = adds.length ? /^(?:\+\s)?(\d{1,})/.exec( $G.getDataItem( index - 1 )[ "rr" ] + "" )[ 1 ] : 0;

				if ( !row ) {
					
					row = $.extend( {}, defaults, {
						
						rr: (index = "+ " + (+label + 1)),
						_isNew: true
					} );
				}

				dataView.beginUpdate();

				if ( !adds.length ) {
				
					/** Add rows in current viewport */
					dataView.setPagingOptions( { pageSize: 0 }, false );
				} 

				adds.push( index );
				$G.getData().addItem( row );

				dataView.endUpdate();

				$G.scrollRowIntoView( dataView.getLength() );
				$G.onAddRowsChanged.notify( { rows: adds } );
			}
		} );

		$.extend( $G, {
			
			onAddRowsChanged: new Slick.Event(),

			getAddRows: function() {
				
				var rows = [];

				for ( var i = adds.length; --i >= 0; rows.push( dataView.getItemById( adds[ i ] ) ) );

				return rows;
			},

			getAddRowsIndexes: function() {
				
				return adds;
			},

			setAddRows: function( rows ) {

				var index = $G.getDataLength();

				for ( var i = rows.length; --i >= 0; ) {
					rows[ i ] = index - i - 1;
				}

				adds = dataView.idxToId( rows );

				this.onAddRowsChanged.notify( { rows: adds } );
			}
		} );
	};
	
	return function( $G ) {

		return new Add( $G );
	};
} );
