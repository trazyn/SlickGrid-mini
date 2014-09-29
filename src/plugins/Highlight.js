
define( function() {
	
	var defaults = {};

	var Highlight = function( $G ) {
		
	};

	return function( $G ) {
	
		$.extend( $G, {
			
			/**
			 * Set the rows class by a unique key
			 *
			 * @param rows 	Array
			 * @param key 	String, 	UNIQUE KEY, Slick save a hash object as index, so the key should be unique
			 * @param [cssClass] String, 	Multiple class separated by a space, if the value is null will remove class by key
			 * */
			setRowsClass: function( rows, key, cssClass ) {
			
				rows = rows instanceof Array ? rows : [ rows ];

				if ( cssClass ) {
					
					var hash = {}, columns = $G.getColumns();

					hash[ key ] = {};

					for ( var i = rows.length; --i >= 0; ) {
						
						hash[ i ] = {};

						columns.forEach( function( column ) {
							
							hash[ i ][ column.id ] = cssClass;
						} );
					}

					$G.setCellCssStyles( key, hash );
				} 
				else this.removeRowsClass( rows, key );
			},

			removeRowsClass: function( rows, key ) {
			
				var hash = $G.getCellCssStyles( key ), invalidate = [];

				if ( hash ) {
				
					for ( var i = rows.length; --i >= 0; ) {
						
						if ( void 0 !== hash[ i ] ) {
							invalidate.push( i );
							delete hash[ i ];
						}
					}

					$G.setCellCssStyles( key, hash );
					$G.invalidateRows( invalidate );
					$G.render();
				}
			}
		} );
	};
} );
