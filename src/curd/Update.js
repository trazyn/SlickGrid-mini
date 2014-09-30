
define( function() {
	
	var defaults = {
		
		key: "update",
		cssClass: "slick-update"
	}
	
	, Update = function( $G, settings ) {
	
		var handler = new Slick.EventHandler()
		
		, dataView = $G.getData()
	
		, updateds = {};

		$.extend( this, {
		
			init: function() {
			
				handler
					.subscribe( $G.onBeforeEditCell, function( e, args ) {
						
						var node = $( $G.getCellNode( args.row, args.cell ) );

						node.is( "[data-original]" )
							|| node.attr( "data-original", node.text().replace( /^\s+|\s+$/g, "" ) );
					} )
		
					.subscribe( $G.onCellChange, function( e, args ) {
						
						var index = args.item.rr, hash = {};

						updateds[ index ] = updateds[ index ] || {};

						if ( $( $G.getCellNode( args.row, args.cell ) )
							.attr( "data-original" ) === $G.getCellEditor().getValue() ) {

							--updateds[ index ][ "_length_" ] || delete updateds[ index ];
						} else {

							updateds[ index ][ args.column.id ] = settings.cssClass;
							updateds[ index ][ "_length_" ] = (updateds[ index ][ "_length_" ] || 0) + 1;
						}

						for ( var id in updateds ) {
							hash[ dataView.getIdxById( id ) ] = updateds[ id ];
						}

						$G.setCellCssStyles( settings.key, 
							/** Break the refrence */
							$.extend( true, {}, hash ) );
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
				  deleteds = $G.getDeleteRowsIndexes ? $G.getDeleteRowsIndexes() : [],
				  adds = $G.getAddRowsIndexes ? $G.getAddRowsIndexes() : [],

				  rows = [],
				  ignore = deleteds.concat( adds );

				for ( var id in updateds ) {
					
					-1 === ignore.indexOf( id ) && rows.push( dataView.getItemById( id ) );
				}

				return rows;
			},

			getUpdateRowsIndexes: function() {
			
				return updateds;
			},

			setUpdateRows: function( hash, rebuild ) {

				if ( true === rebuild ) {
				
					updateds = {};

					for ( var id in hash ) {
						updateds[ dataView.getIdxById( id ) ] = hash[ id ];
					}
				}
			
				$G.setCellCssStyles( settings.key, updateds );

				/** Use ID as index, because the 'idx' will be rebuild by sort or filter */
				updateds = hash;

				this.onUpdateRowsChanged.notify( { rows: updateds } );
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
