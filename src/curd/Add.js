
define( function() {

	var defaults = { }

	, Add = function( $G ) {
		
		var adds = []
	
		, dataView = $G.getData();

		$.extend( this, {
			
			addRow: function( row ) {
				
				/** Generate an unique index */
				var index = /^(?:\+\s)?(\d{1,})/.exec( adds.length ? adds[ adds.length - 1 ] : 0)[ 1 ];

				if ( !row ) {
					
					row = $.extend( {}, defaults, {
						
						rr: (index = "+ " + (+index + 1)),
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

				adds = rows;

				this.onAddRowsChanged.notify( { rows: adds } );
			}
		} );
	};
	
	return function( $G ) {

		return new Add( $G );
	};
} );
