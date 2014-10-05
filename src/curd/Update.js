
define( function() {

	"use strict";
	
	var defaults = {
		
		key: "update",
		cssClass: "slick-update"
	}
	
	, Update = function( $G, settings ) {
	
		var updates = {}

		, dataView = $G.getData()
		, handler = new Slick.EventHandler();

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
						, item = args.item;

						updates[ index ] = updates[ index ] || {};

						if ( item[ "_" ][ args.column.field ] === item[ args.column.field ] ) {

							delete updates[ index ][ args.column.field ];
						
							if ( 0 === --updates[ index ][ "_length_" ] ) {
								
								delete updates[ index ];
								delete item[ "grid_action" ];
								$G.invalidateRow( index );
							}
						}
						else {

							updates[ index ][ args.column.id ] = settings.cssClass;
							updates[ index ][ "_length_" ] = (updates[ index ][ "_length_" ] || 0) + 1;

							item[ "_isNew" ] || (item[ "grid_action" ] = "update");
						}

						$G.setCellCssStyles( settings.key, updates );
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
				  deletes = $G.getDeleteRowsID ? $G.getDeleteRowsID() : {},
				  adds = $G.getAddRowsID ? $G.getAddRowsID() : {},

				  rows = [];

				for ( var idx in updates ) {

					var id = $G.getDataItem( idx )[ "rr" ];

					if ( !deletes[ id ] || !adds[ id ] ) {

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
