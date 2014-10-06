
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
			
				var inHandler = false
				, syncStyle = function( e, args ) {
				
					var hash = {}, idxById;

					if ( inHandler ) { return; }

					idxById = dataView.getSnapshot();
					inHandler = !inHandler;

					for ( var id in updates ) {
					
						hash[ idxById[ id ] ] = updates[ id ];
					}

					$G.setCellCssStyles( settings.key, hash );
					$G.onUpdateRowsChanged.notify( { rows: updates } );

					inHandler = !inHandler;
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
						, id = item[ "rr" ];

						/** Ignore new item */
						if ( $G.getAddRowsID()[ id ] ) { return; }

						updates[ id ] = updates[ id ] || {};

						/** Use '==' fuzzy match */
						if ( item[ "_" ][ args.column.field ] == item[ args.column.field ] ) {

							delete updates[ id ][ args.column.id ];
						
							if ( 0 === --updates[ id ][ "_length_" ] ) {
								
								delete updates[ id ];
								delete item[ "grid_action" ];
							}
						
						} else {
							var length = updates[ id ][ "_length_" ] || 0;

							updates[ id ][ args.column.id ] || ++length;
							updates[ id ][ args.column.id ] = settings.cssClass;
							updates[ id ][ "_length_" ] = length;

							item[ "_isNew" ] || (item[ "grid_action" ] = "update");
						}

						$G.invalidateRow( args.row );
						$G.onCellCssStylesChanged.notify( { key: settings.key } );
						$G.render();
					} )

					.subscribe( $G.onCellCssStylesChanged, function( e, args ) {
						
						args.key === settings.key && syncStyle();
					} )

					.subscribe( dataView.onRowsChanged, syncStyle )
					.subscribe( dataView.onRowCountChanged, syncStyle );
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

						rows.push( dataView.getItemById( id ) );
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
