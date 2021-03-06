
define( function() {

	"use strict";
	
	var defaults = {
		
		key: "delete",
		cssClass: "slick-delete",
		sync: true
	}

	, Delete = function( $G, settings ) {

		var deletes = {}

		, dataView = $G.getData()
		, handler = new Slick.EventHandler();

		$.extend( this, {
			
			init: function() {

				var sync = function() {
				
					var idxById, hash = {};

					idxById = dataView.getSnapshot();

					for ( var id in deletes ) {
						
						hash[ idxById[ id ] ] = {};

						$G.getColumns().forEach( function( column ) {
							
							hash[ idxById[ id ] ][ column.id ] = settings.cssClass;
						} );

						$.extend( dataView.getItemById( id ), deletes[ id ] );
					}

					$G.setCellCssStyles( settings.key, hash, true );
				};
			
				handler
					.subscribe( $G.onKeyDown, function( e, args ) {
					
						if ( !$G.getEditorLock().isActive() && 8 === e.keyCode ) {
							
							$G.setDeleteRows( [ args.row ] );

							e.preventDefault();
							e.stopImmediatePropagation();
						}
					} )
		
					.subscribe( $G.onCellCssStylesChanged, function( e, args ) {
						
						args.key === settings.key && sync();
					} )

					.subscribe( dataView.onRowsChanged, sync )
					.subscribe( dataView.onRowCountChanged, sync );
			},

			destroy: function() {
			
				handler.unsubscribeAll();
			},

		} );

		$.extend( $G, {

			onDeleteRowsChanged: new Slick.Event(),

			getDeleteRows: function(){
			
				var rows = [], item;

				for ( var id in deletes ) {
					
					item = deletes[ id ];

					item && !item[ "_isNew" ]
						&& rows.push( (item[ "grid_action" ] = "delete", item) );
				}

				return rows;
			},

			getDeleteRowsID: function() {
				
				return deletes;
			},

			setDeleteRows: function( rows, sync ) {
			
				var stash = [], invalidateRows = [], adds, invalids, preventMultipleEvent = false
					
				, idProperty = dataView.getIdProperty();

				if ( !rows.length ) {

					deletes = {};
					
					/** Remove the class */
					this.onCellCssStylesChanged.notify( { key: settings.key } );
				} else {
				
					adds = this.getAddRowsID();
					invalids = this.getInvalidRowsID();
					rows = (rows instanceof Array ? rows : [ rows ]).sort();

					dataView.beginUpdate();

					for ( var i = rows.length; --i >= 0; ) {
						
						var id = this.getDataItem( rows[ i ] )[ idProperty ];

						if ( deletes[ id ] || adds[ id ] ) {
							
							deletes[ id ] && invalidateRows.push( rows[ i ] );

							/** Trigger 'RowsChanged' */
							if ( adds[ id ] ) {

								dataView.deleteItem( id );
								preventMultipleEvent = !1;
								invalids[ id ] && delete invalids[ id ];
							}

							delete adds[ id ];
							delete deletes[ id ];

						}

						else stash.push( rows[ i ] );
					}

					this.invalidateRows( invalidateRows );

					if ( !sync || !settings.sync ) {

						var hash = {}, id, item;

						/** Don't trigger multiple event */
						if ( i | invalidateRows.length ) {
						
							for ( var i = stash.length; --i >= 0; ) {
								
								item = this.getDataItem( stash[ i ] );
								id = item[ idProperty ];

								deletes[ id ] = item;
							}

							!preventMultipleEvent && this.onCellCssStylesChanged.notify( { key: settings.key } );
						}
					} 
					/** Remove item from viewport */
					else {
						
						for ( var i = stash.length; --i >= 0; ) {
							dataView.deleteItem( this.getDataItem( stash[ i ] )[ idProperty ] );
						}
					}

					dataView.endUpdate();
					$G.render();
				}

				this.onDeleteRowsChanged.notify( { rows: deletes } );
			}
		} );
	};
	
	return function( $G, options ) {
	
		var settings = $.extend( {}, defaults, options || {} )
			
		, plugin = new Delete( $G, settings );

		$G.registerPlugin( plugin );

		return plugin;
	};
} );

