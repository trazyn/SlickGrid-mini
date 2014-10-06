
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

				var inHandler = false
			
				, syncStyle = function() {
				
					var idxById, hash = {};

					if ( inHandler ) { return; }

					inHandler = !inHandler;

					idxById = dataView.getSnapshot();

					for ( var id in deletes ) {
						
						hash[ idxById[ id ] ] = {};

						$G.getColumns().forEach( function( column ) {
							
							hash[ idxById[ id ] ][ column.id ] = settings.cssClass;
						} );
					}

					$G.setCellCssStyles( settings.key, hash );

					inHandler = !handler;
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
						
						!inHandler && args.key === settings.key && syncStyle();
					} )

					.subscribe( dataView.onRowsChanged, syncStyle )
					.subscribe( dataView.onRowCountChanged, syncStyle );
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
					
					item = dataView.getItemById( id );

					item && !item[ "_isNew" ]
						&& rows.push( (item[ "grid_action" ] = "delete", item) );
				}

				return rows;
			},

			getDeleteRowsID: function() {
				
				return deletes;
			},

			setDeleteRows: function( rows, sync ) {
			
				var stash = [], invalidateRows = [], adds, invalids, preventMultipleEvent = false;

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
						
						var id = this.getDataItem( rows[ i ] )[ "rr" ];

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

						var hash = {}, id, i = stash.length;

						/** Don't trigger multiple event */
						if ( i | invalidateRows.length ) {
						
							for ( var columns = this.getColumns(); --i >= 0; ) {
								
								id = this.getDataItem( stash[ i ] )[ "rr" ];

								deletes[ id ] = id;
							}

							!preventMultipleEvent && this.onCellCssStylesChanged.notify( { key: settings.key } );
						}
					} 
					/** Remove item from viewport */
					else {
						
						for ( var i = stash.length; --i >= 0; ) {
							dataView.deleteItem( this.getDataItem( stash[ i ] )[ "rr" ] );
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

