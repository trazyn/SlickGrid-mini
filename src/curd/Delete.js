
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

				var self = this
			
				, update = function() {
				
				};
			
				handler
					.subscribe( $G.onKeyDown, function( e, args ) {
					
						if ( !$G.getEditorLock().isActive() && 8 === e.keyCode ) {
							
							$G.setDeleteRows( [ args.row ] );

							e.preventDefault();
							e.stopImmediatePropagation();
						}
					} )
		
					.subscribe( dataView.onRowsChanged, update )
					.subscribe( dataView.onRowCountChanged, update )
					.subscribe( $G.onCellCssStylesChanged, update );
			},

			destroy: function() {
			
				handler.unsubscribeAll();
			},

		} );

		$.extend( $G, {

			onDeleteRowsChanged: new Slick.Event(),

			getDeleteRows: function(){
			
				var rows = [], item
				, hash = this.getDeleteRowsHash();

				for ( var idx in hash ) {
					
					item = $G.getDataItem( idx );

					item && !item[ "_isNew" ]
						&& rows.push( (item[ "grid_action" ] = "delete", item) );
				}

				return rows;
			},

			getDeleteRowsID: function() {
				
				return deletes;
			},

			getDeleteRowsHash: function() {
				return $G.getCellCssStyles( settings.key ) || {};
			},

			setDeleteRows: function( rows, sync ) {
			
				var stash = [], invalidateRows = [], adds;

				if ( !rows.length ) {
					
					/** Remove the class */
					return void $G.setCellCssStyles( settings.key, {} );
				} else {
				
					adds = $G.getAddRowsID();
					rows = (rows instanceof Array ? rows : [ rows ]).sort();

					dataView.beginUpdate();

					for ( var i = rows.length; --i >= 0; ) {
						
						var id = $G.getDataItem( rows[ i ] )[ "rr" ];

						if ( deletes[ id ] || adds[ id ] ) {
							
							invalidateRows.push( rows[ i ] );

							adds[ id ] && dataView.deleteItem( id );

							delete adds[ id ];
							delete deletes[ id ];

						}

						else stash.push( rows[ i ] );
					}

					$G.invalidateRows( invalidateRows );

					if ( !sync || !settings.sync ) {

						var hash = {}, id;

						for ( var i = stash.length, columns = $G.getColumns(); --i >= 0; ) {
							
							hash[ stash[ i ] ] = {};

							columns.forEach( function( column ) { 
								
								hash[ stash[ i ] ][ column.id ] = settings.cssClass;
							} );

							id = $G.getDataItem( stash[ i ] )[ "rr" ];

							deletes[ id ] = id;
						}

						$G.setCellCssStyles( settings.key, hash );
					} 
					/** Remove item from viewport */
					else {
						
						for ( var i = stash.length; --i >= 0; ) {
							dataView.deleteItem( $G.getDataItem( stash[ i ] )[ "rr" ] );
						}
					}

					dataView.endUpdate();
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
