
define( function() {
	
	var defaults = {
		
		key: "delete",
		cssClass: "slick-delete",
		sync: true
	}

	, Delete = function( $G, settings ) {

		var handler = new Slick.EventHandler()

		, dataView = $G.getData();

		$.extend( this, {
			
			init: function() {

				var self = this;
			
				handler
					.subscribe( $G.onKeyDown, function( e, args ) {
					
						if ( !$G.getEditorLock().isActive() && 8 === e.keyCode ) {
							
							$G.setDeleteRows( [ args.row ] );

							e.preventDefault();
							e.stopImmediatePropagation();
						}
					} );
			},

			destroy: function() {
			
				handler.unsubscribeAll();
			},

		} );

		$.extend( $G, {

			onDeleteRowsChanged: new Slick.Event(),

			getDeleteRows: function(){
			
				var result = []
			
				, hash = this.getDeleteRowsHash();

				for ( var idx in hash ) {
					
					var item = dataView.getItemByIdx( idx );

					item[ "grid_action" ] = "delete";

					result.push( item );
				}

				return result;
			},

			getDeleteRowsHash: function() {
				return $G.getCellCssStyles( settings.key );
			},

			setDeleteRows: function( rows, sync ) {
			
				var 
				  hash = $G.getCellCssStyles( settings.key ) || {},
				  adds = $G.getAddRowsHash(),
				  	  
				  deletes = [], invalidateRows = [];

				rows = (rows instanceof Array ? rows : [ rows ]).sort();

				dataView.beginUpdate();

				for ( var i = rows.length; --i >= 0; ) {
					
					var idx = rows[ i ];

					if ( hash[ idx ] || adds[ idx ] ) {
					
						delete hash[ idx ];

						invalidateRows.push( idx );

						adds[ idx ] && dataView.deleteItem( $G.getDataItem( idx )[ "rr" ] );
					}
					else deletes.push( idx );
				}

				$G.invalidateRows( invalidateRows );

				if ( !sync || !settings.sync ) {

					for ( var i = deletes.length, columns = $G.getColumns(); --i >= 0; ) {
						
						hash[ deletes[ i ] ] = {};

						columns.forEach( function( column ) { 
							
							hash[ deletes[ i ] ][ column.id ] = settings.cssClass;
						} );
					}

					$G.setCellCssStyles( settings.key, hash );
				} 
				/** Remove item from viewport */
				else {
					
					for ( var i = deletes.length; --i >= 0; ) {
						dataView.deleteItem( $G.getDataItem( deletes[ i ] )[ "rr" ] );
					}
				}

				dataView.endUpdate();

				this.onDeleteRowsChanged.notify( { hash: hash } );
			}
		} );
	};
	
	return function( $G, options ) {
	
		var settings = $.extend( {}, defaults, options || {} )
			
		, plugin = new Delete( $G, settings );

		$G.getData().syncGridCellCssStyles( $G, settings.key );

		$G.registerPlugin( plugin );

		return plugin;
	};
} );
