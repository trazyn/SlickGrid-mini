
define( function() {
	
	var defaults = {
		
		key: "update",
		cssClass: "slick-update"
	}
	
	, Update = function( $G, settings ) {
	
		var handler = new Slick.EventHandler()
		
		, dataView = $G.getData();

		$.extend( this, {
		
			init: function() {
			
				handler
					.subscribe( $G.onBeforeEditCell, function( e, args ) {
						
						var node = $( $G.getCellNode( args.row, args.cell ) );

						node.is( "[data-original]" )
							|| node.attr( "data-original", node.text().replace( /^\s+|\s+$/g, "" ) );
					} )
		
					.subscribe( $G.onCellChange, function( e, args ) {
						
						var index = args.row, hash = $G.getCellCssStyles( settings.key ) || {};

						hash[ index ] = hash[ index ] || {};

						if ( $( $G.getCellNode( args.row, args.cell ) )
							.attr( "data-original" ) === args.item[ args.column.field ] ) {

							if ( 0 === --hash[ index ][ "_length_" ] ) {
								
								delete hash[ index ];
								$G.invalidateRow( index );
							}
						} else {

							hash[ index ][ args.column.id ] = settings.cssClass;
							hash[ index ][ "_length_" ] = (hash[ index ][ "_length_" ] || 0) + 1;
						}

						$G.setCellCssStyles( settings.key, hash );
					} );
			},

			destroy: function() {
				handler.unsubscribeAll();
			}
		} );

		$.extend( $G, {

			onUpdateRowsChanged: new Slick.Event(),
			
			getUpdateRows: function() {
				
				var
				  deletes = $G.getDeleteRowsHash ? $G.getDeleteRowsHash() : [],
				  adds = $G.getAddRowsHash ? $G.getAddRowsHash() : [],

				  rows = [];

				for ( var idx in this.getUpdateRowsHash() ) {

					!deletes[ idx ] && !adds[ idx ] && rows.push( dataView.getItemByIdx( idx ) );
				}

				return rows;
			},

			getUpdateRowsHash: function() {
			
				return $G.getCellCssStyles( settings.key );
			},

			setUpdateRows: function( hash ) {

				$G.setCellCssStyles( settings.key, hash );

				this.onUpdateRowsChanged.notify( { hash: hash } );
			}
		} );
	};

	return function( $G, options ) {

		var settings = $.extend( {}, defaults, options || {} )
			
		, plugin = new Update( $G, settings );

		$G.getData().syncGridCellCssStyles( $G, settings.key );
		
		$G.registerPlugin( plugin );

		return plugin;
	};
} );
