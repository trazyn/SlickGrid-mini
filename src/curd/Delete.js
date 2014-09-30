
define( function() {
	
	var defaults = {
		
		key: "delete",
		cssClass: "slick-delete",
		sync: true
	}

	, Delete = function( $G, settings ) {

		var handler = new Slick.EventHandler()
	
		, deleteds = [];

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
			
				var result = [];

				for ( var i = deleteds.length; --i >=0; ) {
				
					var item = $G.getDataItem( deleteds[ i ] );

					item[ "grid_action" ] = "delete";

					result.push( item );
				}
				return result;
			},

			getDeleteRowsIndexes: function() {
				return deleteds;
			},

			setDeleteRows: function( rows, sync ) {
			
				var hash = {}

				, adds = $G.getAddRowsIndexes ? $G.getAddRowsIndexes() : []

				, immediate = []

				, removeItem = function( rows ) {
				
					var dataView = $G.getData()
						
					, selecteds = $G.getSelectedRows();

					if ( rows.length ) {
					
						dataView.beginUpdate();

						for ( var i = rows.length; --i >= 0; ) {
							
							var index;

							index = selecteds.indexOf( rows[ i ] );
							index > -1 && selecteds.splice( index, 1 );

							index = adds.indexOf( rows[ i ] );
							index > -1 && adds.splice( index, 1 );

							dataView.deleteItem( $G.getDataItem( rows[ i ] )[ "rr" ] );
						}

						dataView.endUpdate();

						$G.setAddRows( adds );
						$G.setSelectedRows( selecteds );
						$G.invalidate( rows );
						$G.render();
					}
				};

				if ( rows && rows.length ) {
					
					/** Toggle the delete items */
					if ( deleteds.length ) {

						deleteds = deleteds.concat( rows );

						for ( var res = [], i = deleteds.length; --i >= 0; ) {
							
							var index = res.indexOf( deleteds[ i ] );

							if ( index === -1 ) {
								
								res.push( deleteds[ i ] );
							} else res.splice( index, 1 );
						}

						deleteds = res;

					} else 
						/** Set the delete items */
						deleteds = rows;
				} else if ( rows && !rows.length ) {
					/** Remove all delete rows */
					deleteds = [];
				} else
					/** Delete the selecte items */
					deleteds = $G.getSelectedRows();

				deleteds = $.grep( deleteds, function( index ) {
					
					var res = adds.indexOf( index );

					res > -1 && immediate.push( index );

					return res === -1;
				} );

				removeItem( immediate );

				if ( !sync || !settings.sync ) {
					
					for ( var i = deleteds.length; --i >= 0; ) {
						
						hash[ deleteds[ i ] ] = {};

						$G.getColumns().forEach( function( column ) { 
							
							hash[ deleteds[ i ] ][ column.id ] = settings.cssClass;
						} );
					}

					$G.setCellCssStyles( settings.key, hash );
				} else removeItem( rows );

				this.onDeleteRowsChanged.notify( { rows: deleteds } );

				return deleteds;
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
