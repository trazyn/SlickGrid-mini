
define( function() {

	var defaults = {
		
		key: "invalid",
		cssClass: "slick-invalid"
	}

	, Validation = function( $G, settings ) {

		var invalids = {}
	
		, handler = new Slick.EventHandler();
	
		$.extend( this, {
			
			init: function() {

				var sync = function() {
				
					var idxById, hash = {};

					idxById = dataView.getSnapshot();

					for ( var id in invalids ) {
						
						hash[ idxById[ id ] ] = {};

						hash[ idxById[ id ] ] = invalids[ id ][ "hash" ];
					}

					$G.setCellCssStyles( settings.key, hash, true );
				};
			
				handler
					.subscribe( $G.onValidationError, function( e, args ) {

						var id = args.item[ "rr" ], length;

						invalids[ id ] = invalids[ id ] || {};
						invalids[ id ][ "hash" ] = invalids[ id ][ "hash" ] || {};

						length = invalids[ id ][ "hash" ][ "_length_" ] || 0;

						invalids[ id ][ "hash" ][ "_length_" ] || ++length;
						invalids[ id ][ "hash" ][ args.column.id ] = settings.cssClass;
						invalids[ id ][ "hash" ][ "_length_" ]  = length;
						invalids[ id ][ "item" ] = args.item;

						$G.onCellCssStylesChanged.notify( { key: settings.key } );
					} )
				
					.subscribe( $G.onCellChange, function( e, args ) {
					
						var id = args.item[ "rr" ];

						if ( invalids[ id ] && invalids[ id ][ "hash" ][ args.column.id ] ) {
							
							delete invalids[ id ][ "hash" ][ args.column.id ];

							if ( 0 === --invalids[id ][ "hash" ][ "_length_" ] ) {
								delete invalids[ id ];
							}

							$G.invalidateRow( args.row );
							$G.onCellCssStylesChanged.notify( { key: settings.key } );
							$G.render();
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
			}
		} );

		$.extend( $G, {
			
			getInvalidRows: function() {
			
				var rows = [];

				for ( var id in invalids ) {
					rows.push( invalids[ id ][ "item" ] );
				}

				return rows;
			},

			setInvalidRows: function( hash ) {
				
				var invalids = hash;

				this.onCellCssStylesChanged.notify( { key: settings.key } );
			},

			getInvalidRowsID: function() {
				
				return invalids;
			}
		} );
	};

	return function( $G, options ) {
		
		var plugin = new Validation( $G, $.extend( {}, defaults, options || {} ) );

		$G.registerPlugin( plugin );

		return plugin;
	};
} );
