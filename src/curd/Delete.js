
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
					.subscribe( $G.getData().onRowsChanged, function( e, args ) {
						self.setDeleteRows( [] );
					} )
		
					.subscribe( $G.onKeyDown, function( e, args ) {
					
						if ( !$G.getEditorLock().isActive() && 8 === e.keyCode ) {
							
							self.setDeleteRows( [ args.row ] );
						}
					} );
			},

			destroy: function() {
			
				handler.unsubscribeAll();
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
							
							var index = selecteds.indexOf( rows[ i ] );

							index > -1 && selecteds.splice( index, 1 );

							dataView.deleteItem( $G.getDataItem( rows[ i ] )[ "id" ] );
						}

						dataView.endUpdate();

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

				return deleteds;
			},
		} );

		/** Exports */
		$.extend( $G, {

			getDeleteRows: function(){
			
				var result = [];

				for ( var i = deleteds.length; --i >=0; 
						result.push( $G.getDataItem( deleteds[ i ] ) ) );
				return result;
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
