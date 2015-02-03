
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
			
				var sync = function( e, args ) {
				
					var hash = {}, idxById;

					idxById = dataView.getSnapshot();

					for ( var id in updates ) {
					
						hash[ idxById[ id ] ] = updates[ id ][ "hash" ];

						/** Restore data */
						$.extend( dataView.getItemById( id ), updates[ id ][ "item" ] );
					}

					$G.setCellCssStyles( settings.key, hash, true );
					$G.onUpdateRowsChanged.notify( { rows: updates } );
				};

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
						
						var item = args.item
						, id = item[ dataView.getIdProperty() ];

						/** Ignore new item */
						if ( $G.getAddRowsID()[ id ] ) { return; }

						updates[ id ] = updates[ id ] || {};
						updates[ id ][ "hash" ] = updates[ id ][ "hash" ] || {};

						/** Use '==' fuzzy match */
						if ( item[ "_" ][ args.column.field ] == item[ args.column.field ] ) {

							delete updates[ id ][ "hash" ][ args.column.id ];
						
							if ( 0 === --updates[ id ][ "hash" ][ "_length_" ] ) {
								
								delete updates[ id ];
								delete item[ "grid_action" ];
							}
						
						} else {
							var length = updates[ id ][ "hash" ][ "_length_" ] || 0;

							updates[ id ][ "hash" ][ args.column.id ] || ++length;
							updates[ id ][ "hash" ][ args.column.id ] = settings.cssClass;
							updates[ id ][ "hash" ][ "_length_" ] = length;

							item[ "grid_action" ] = "update";
							updates[ id ][ "item" ] = item;
						}

						$G.invalidateRow( args.row );
						$G.onCellCssStylesChanged.notify( { key: settings.key } );
						$G.render();
					} )

					.subscribe( $G.onCellCssStylesChanged, function( e, args ) {
						
						args.key === settings.key && sync();
					} )

					.subscribe( dataView.onRowsChanged, sync )
					.subscribe( dataView.onRowCountChanged, sync );
			},

			destroy: function() {
				handler.unsubscribeAll();
			}
		} );

		$.extend( $G, {

			onUpdateRowsChanged: new Slick.Event(),
			
			getUpdateRows: function() {
				
				var
				  deletes = this.getDeleteRowsID ? this.getDeleteRowsID() : {},
				  rows = [];

				for ( var id in updates ) {

					if ( !deletes[ id ] ) {

						rows.push( updates[ id ][ "item" ] );
					}
				}

				return rows;
			},

			getUpdateRowsID: function() {
			
				return updates;
			},

			setUpdateRows: function( hash ) {

				updates = hash;

				this.onCellCssStylesChanged.notify( { key: settings.key } );
				this.onUpdateRowsChanged.notify( { rows: updates } );
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
