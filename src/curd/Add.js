
define( function() {

	"use strict";

	var defaults = { 
		
		key: "add",
		cssClass: "slick-add"
	}

	, Add = function( $G, settings ) {
		
		var adds = {}, index = 0

		, dataView = $G.getData()
		, handler = new Slick.EventHandler();

		$.extend( this, {

			init: function() {
			
				var sync = function( e, args ) {
				
					var hash = {}, idxById;

					idxById = dataView.getSnapshot();

					for ( var id in adds ) {
					
						hash[ idxById[ id ] ] = adds[ id ][ "hash" ];
					}

					$G.setCellCssStyles( settings.key, hash, true );
				};

				handler
					.subscribe( $G.onCellCssStylesChanged, function( e, args ) {
						
						args.key === settings.key && sync();
					} )

					.subscribe( dataView.onRowsChanged, sync )
					.subscribe( dataView.onRowCountChanged, sync );
			},

			destroy: function() {
			
				handler.unsbscribeAll();
			}
		} );

		$.extend( $G, {
			
			getAddRows: function() {
				
				var rows = [];

				for ( var id in adds ) {
					rows.push( dataView.getItemById( id ) );
				}

				return rows;
			},

			getAddRowsID: function() {
			
				return adds;
			},

			setAddRows: function( hash ) {

				var columns, id, row;

				if ( hash ) {

					adds = hash;
				} else {
				
					row = {
						
						rr: "+ " + ++index,
						_isNew: true,
						"grid_action": "add"
					};
					columns = this.getColumns();

					dataView.beginUpdate();

					id = row[ "rr" ];

					if ( index === 1 ) {
					
						/** Add rows in current viewport */
						dataView.setPagingOptions( { pageSize: 0 }, false );
					} 

					for ( var i = columns.length; --i >= 0; ) {
					
						var column = columns[ i ];

						if ( column.defaultValue && !row[ column.field ] ) {

							row[ column.field ] = column.defaultValue;
						}

						adds[ id ] = adds[ id ] || {};
						adds[ id ][ "hash" ] = adds[ id ][ "hash" ] || {};
						adds[ id ][ "hash" ][ column.id ] = settings.cssClass;
					}

					adds[ id ][ "item" ] = row;

					this.getData().addItem( row );

					dataView.endUpdate();

					for ( var i = columns.length; --i >= 0; ) {
						
						var column = columns[ i ]

						, validator = column.validator;

						if ( "function" === typeof validator ) {
							
							var validationResults = validator( row[ column[ "field" ] ], row, column );

							validationResults.valid || this.onValidationError.notify( {
								validationResults: validationResults,
								row: this.getDataLength() - 1,
								cell: i,
								column: column,
								item: row
							} );
						}
					}

				}

				this.scrollRowIntoView( this.getDataLength() );
				this.onCellCssStylesChanged.notify( { key: settings.key } );
				this.onAddNewRow.notify( { row: row } );
			}
		} );
	};
	
	return function( $G, options ) {

		var settings = $.extend( {}, defaults, options || {} )
			
		, plugin = new Add( $G, settings );

		$G.registerPlugin( plugin );

		return plugin;
	};
} );
