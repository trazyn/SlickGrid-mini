
define( function() {

	var defaults = {
		
		key: "invalid",
		cssClass: "slick-invalid"
	}

	, Validation = function( $G, settings ) {

		var invalid = {}
	
		, handler = new Slick.EventHandler();
	
		$.extend( this, {
			
			init: function() {

				var syncStyle = function() {
				
					var idxById, hash = {};

					idxById = dataView.getSnapshot();

					for ( var id in invalid ) {
						
						hash[ idxById[ id ] ] = {};

						hash[ idxById[ id ] ] = invalid[ id ];
					}

					$G.setCellCssStyles( settings.key, hash, true );
				};
			
				handler
					.subscribe( $G.onValidationError, function( e, args ) {

						var id = args.item[ "rr" ], length;

						invalid[ id ] = invalid[ id ] || {};

						length = invalid[ id ][ "_length_" ] || 0;

						invalid[ id ][ "_length_" ] || ++length;
						invalid[ id ][ args.column.id ] = settings.cssClass;
						invalid[ id ][ "_length_" ]  = length;

						$G.onCellCssStylesChanged.notify( { key: settings.key } );
					} )
				
					.subscribe( $G.onCellChange, function( e, args ) {
					
						var id = args.item[ "rr" ];

						if ( invalid[ id ] && invalid[ id ][ args.column.id ] ) {
							
							delete invalid[ id ][ args.column.id ];

							if ( 0 === --invalid[id ][ "_length_" ] ) {
								delete invalid[ id ];
							}

							$G.invalidateRow( args.row );
							$G.onCellCssStylesChanged.notify( { key: settings.key } );
							$G.render();
						}
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
			
			getInvalidRows: function() {
			
				var rows = [];

				for ( var id in invalid ) {
					rows.push( dataView.getItemById( id ) );
				}

				return rows;
			},

			setInvalidRows: function( hash ) {
				
				var invalids = hash;

				this.onCellCssStylesChanged.notify( { key: settings.key } );
			},

			getInvalidRowsID: function() {
				
				return invalid;
			}
		} );
	};

	return function( $G, options ) {
		
		var plugin = new Validation( $G, $.extend( {}, defaults, options || {} ) );

		$G.registerPlugin( plugin );

		return plugin;
	};
} );
