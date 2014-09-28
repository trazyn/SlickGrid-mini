
define( function() {
	
	var defaults = {
		
		key: "update",
		cssClass: "slick-update"
	}
	
	, Update = function( $G, settings ) {
	
		var handler = new Slick.EventHandler()
	
		, updateds = {};

		$.extend( this, {
		
			init: function() {
			
				handler
					.subscribe( $G.onBeforeEditCell, function( e, args ) {
						
						var node = $( $G.getCellNode( args.row, args.cell ) );

						node.is( "[data-original]" )
							|| node.attr( "data-original", node.text().replace( /^\s+|\s+$/g, "" ) );
					} )
		
					.subscribe( $G.onCellChange, function( e, args ) {
						
						var node = $( $G.getCellNode( args.row, args.cell ) )
						, value = $G.getCellEditor().getValue();

						updateds[ args.row ] = updateds[ args.row ] || {};

						if ( node.attr( "data-original" ) === value ) {

							delete updateds[ args.row ][ args.column.id ];

							--updateds[ args.row ][ "_length_" ] || delete updateds[ args.row ];
						} else {

							updateds[ args.row ][ args.column.id ] = settings.cssClass;
							updateds[ args.row ][ "_length_" ] = (updateds[ args.row ][ "_length_" ] || 0) + 1;
						}

						$G.setCellCssStyles( settings.key, 
							/** Beak the refrence */
							$.extend( updateds.concat( [] ) ) );
					} );
			},

			destroy: function() {
				handler.unsubscribeAll();
			},

			setUpdateRows: function( hash ) {
			
				$G.setCellCssStyles( settings.key, updateds = hash );
			}
		} );

		$.extend( $G, {
			
			getUpdateRows: function() {
				
				var deleteds = $G.getDeletedRows ? $G.getDeletedRows() : []
			
				, rows = [];

				for ( var row in updateds ) {
					
					deleteds.indexOf( row ) === -1 && rows.push( $G.getDataItem( row ) );
				}

				return rows;
			}
		} );
	};

	return function( $G, options ) {

		var settings = $.extend( {}, defaults, options || {} )
			
		, plugin = new Update( $G, settings );
		
		$G.registerPlugin( plugin );

		return plugin;
	};
} );
