
define( function() {
	
	var defaults = {
		
		key: "delete",
		cssClass: "slick-delete",
		sync: true
	}

	, Delete = function( $G, settings ) {

		var handler = new Slick.EventHandler()

		, dataView = $G.getData()
	
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
				
					var item = dataView.getItemById( deleteds[ i ] );

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
				
					var selecteds = $G.getSelectedRows()
					, updateds = $G.getUpdateRowsIndexes();

					/** Sort array asc, don't interrupt the index */
					rows = dataView.idToIdx( rows ).sort();
					adds = dataView.idToIdx( adds );

					if ( rows.length ) {
					
						dataView.beginUpdate();

						for ( var i = rows.length; --i >= 0; ) {
							
							var index;

							/** Update selection */
							index = selecteds.indexOf( rows[ i ] );
							index > -1 && selecteds.splice( index, 1 );

							adds.splice( adds.indexOf( rows[ i ] ), 1 );

							index = dataView.getIdByIdx( rows[ i ] );
							updateds[ index ] && delete updateds[ index ];

							dataView.deleteItem( index );
						}

						dataView.endUpdate();

						$G.setAddRows( adds );
						$G.setUpdateRows( updateds, true );
						$G.setSelectedRows( selecteds );
						$G.invalidate( rows );
						$G.render();
					}
				};

				if ( rows && rows.length ) {

					rows = dataView.idxToId( rows );
					
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
					deleteds = dataView.idxToId( $G.getSelectedRows() );

				/** Remove the new rows from viewport */
				deleteds = $.grep( deleteds, function( index ) {
					
					var res = adds.indexOf( index );

					res > -1 && immediate.push( index );

					return res === -1;
				} );

				if ( !sync || !settings.sync ) {

					var idx = dataView.idToIdx( deleteds );
					
					removeItem( immediate );

					for ( var i = idx.length; --i >= 0; ) {
						
						hash[ idx[ i ] ] = {};

						$G.getColumns().forEach( function( column ) { 
							
							hash[ idx[ i ] ][ column.id ] = settings.cssClass;
						} );
					}

					$G.setCellCssStyles( settings.key, hash );
				} 
				/** Remove item from viewport */
				else removeItem( deleteds.concat( immediate ) );

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
