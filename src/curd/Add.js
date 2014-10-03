
define( function() {

	var defaults = { 
		
		add: {
		
			key: "add",
			cssClass: "slick-add"
		},

		invalid: {
			
			key: "invalid",
			cssClass: "slick-invalid"
		}
	}

	, Add = function( $G, settings ) {
		
		var index = 0
	
		, dataView = $G.getData()

		, handler = new Slick.EventHandler()

		, inHandler;

		$.extend( this, {

			init: function() {
			
				handler
					.subscribe( $G.onValidationError, function( e, args ) {
						
						var hash = $G.getCellCssStyles( settings.invalid.key ) || {};

						hash[ args.row ] = hash[ args.row ] || {};

						hash[ args.row ][ args.column.id ] = settings.invalid.cssClass;

						if ( !inHandler ) {

							$G.setCellCssStyles( settings.invalid.key, hash );
						}

					} )
				
					.subscribe( $G.onCellChange, function( e, args ) {
					
						var hash = $G.getCellCssStyles( settings.invalid.key );

						if ( hash[ args.row ] ) {
							
							delete hash[ args.row ];
							$G.invalidateRow( args.row );
							$G.setCellCssStyles( settings.invalid.key, hash );
						}
					} );
			},

			destroy: function() {
			
				handler.unsbscribeAll();
			}
		} );

		$.extend( $G, {
			
			getAddRows: function() {
				
				var rows = [];

				for ( var idx in $G.getAddRowsHash() ) {
					
					rows.push( dataView.getItemByIdx( idx ) );
				}

				return rows;
			},

			getAddRowsHash: function() {
				
				return $G.getCellCssStyles( settings.add.key ) || {};
			},

			setAddRows: function( row ) {

				var columns = $G.getColumns()
					
				, hash = this.getAddRowsHash()
				
				, idx = dataView.getLength();

				if ( !row ) {
					
					row = $.extend( {}, defaults, {
						
						rr: "+ " + ++index,
					    	_isNew: true
					} );
				}

				dataView.beginUpdate();

				if ( index === 1 ) {
				
					/** Add rows in current viewport */
					dataView.setPagingOptions( { pageSize: 0 }, false );
				} 

				for ( var i = columns.length; --i >= 0; ) {
				
					var column = columns[ i ];

					if ( column.defaultValue && !row[ column.field ] ) {

						row[ column.field ] = column.defaultValue;
					}

					hash[ idx ] = hash[ idx ] || {};

					hash[ idx ][ column.id ] = settings.add.cssClass;
				}

				$G.getData().addItem( row );

				dataView.endUpdate();

				for ( var i = columns.length; --i >= 0; ) {
					
					var column = columns[ i ]

					, validator = column.validator;

					inHandler = i === 0 ? true : false;

					if ( "function" === typeof validator ) {
						
						var validationResults = validator( row[ column[ "field" ] ], row, column );

						validationResults.valid || $G.onValidationError.notify( {
							validationResults: validationResults,
							row: $G.getDataLength() - 1,
							cell: i,
							column: column,
							item: row
						} );
					}
				}

				$G.setCellCssStyles( settings.add.key, hash );
				$G.scrollRowIntoView( idx );
				$G.onAddNewRow.notify( { row: row } );
			}
		} );
	};
	
	return function( $G, options ) {

		var settings = $.extend( {}, defaults, options || {} )
			
		, plugin = new Add( $G, settings );

		$G.getData().syncGridCellCssStyles( $G, settings.add.key );
		$G.getData().syncGridCellCssStyles( $G, settings.invalid.key );

		$G.registerPlugin( plugin );

		return plugin;
	};
} );
