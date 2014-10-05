
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
						
						var node = $( $G.getCellNode( args.row, args.cell ) )

						, item = args.item;

						item[ "_" ] = item[ "_" ] || {};

						if ( !item[ "_" ].hasOwnProperty( args.column.field ) ) {
							item[ "_" ][ args.column.field ] = item[ args.column.field ];
						}
					} )
		
					.subscribe( $G.onCellChange, function( e, args ) {
						
						var index = args.row
						, hash = $G.getCellCssStyles( settings.key ) || {}
						, item = args.item;

						hash[ index ] = hash[ index ] || {};

						if ( item[ "_" ][ args.column.field ] === item[ args.column.field ] ) {

							delete hash[ index ][ args.column.field ];
						
							if ( 0 === --hash[ index ][ "_length_" ] ) {
								
								delete hash[ index ];
								delete item[ "grid_action" ];
								$G.invalidateRow( index );
							}
						}
						else {

							hash[ index ][ args.column.id ] = settings.cssClass;
							hash[ index ][ "_length_" ] = (hash[ index ][ "_length_" ] || 0) + 1;

							item[ "_isNew" ] || (item[ "grid_action" ] = "update");
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
				  deletes = $G.getDeleteRowsHash ? $G.getDeleteRowsHash() : {},
				  adds = $G.getAddRowsHash ? $G.getAddRowsHash() : {};

				  rows = [];

				for ( var idx in this.getUpdateRowsHash() ) {

					if ( !deletes[ idx ] && !adds[ idx ] ) {
						rows.push( $G.getDataItem( idx ) );
					}
				}

				return rows;
			},

			getUpdateRowsHash: function() {
			
				return $G.getCellCssStyles( settings.key ) || {};
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
