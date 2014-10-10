
define( function() {

	"use strict";

	var getSort = function() {
		
		var sortColumn = this.getSortColumns()[ 0 ], column;

		if ( !sortColumn ) {
		
			return {};
		}
		
		column = this.getColumns()[ this.getColumnIndex( sortColumn.columnId ) ];

		return {
			remoteSortField: column.field,
			remoteSortOrder: sortColumn.sortAsc ? "asc" : "desc"
		};
	};

	return function( $G, fastQuery ) {
	
		var dataView = $G.getData()
		
		, bar = $( $G.getHeaderRow() )

		, filters = {};
	
		$G.onHeaderRowCellRendered.subscribe( function( e, args ) {
		
			if ( args.column.filter ) {
				$( args.node ).html( "<input type='text' data-column-field='" + args.column.field + "' placeholder='Search...' >" );
			} else if ( args.column.id === "_checkbox_selector" ) {
				$( args.node ).html( "<button class='slick-filter-clear'></button>" );
			}
		} );

		/** Set the filter */
		dataView.setFilter( function( row, args ) {
			
			var value;

			/** Skip the new line */
			if ( row[ "_isNew" ] ) { return true; }

			for ( var field in filters ) {

				value = filters[ field ];

				if ( value 
					/** Fuzzy search */
					&& (row[ field ] || "").toString().toLowerCase().indexOf( value.toLowerCase() ) === -1 ) {
					return false;
				}
			}

			return true;
		} );

		bar

		.delegate( "input:visible", "keyup", function( e ) {
			
			var self = $( this )
			, field = self.attr( "data-column-field" );

			if ( field ) {
				
				filters[ field ] = self.val().replace( /^\s+|\s+$/g, "" );
				dataView.refresh();

				if ( fastQuery.is( ":checked" ) && 13 === e.keyCode ) {
					
					$G.search();

					e.stopPropagation();
				}
			}
		} )

		.delegate( "button.slick-filter-clear", "click", function( e ) {
		
			bar.find( "div.slick-headerrow-column input[data-column-field]" )

				.each( function() {
					$( this ).val( "" );
				} );

			filters = {};
			dataView.refresh();

			e.stopPropagation();
			e.preventDefault();
		} )
		
		.delegate( ".slick-headerrow-column", "click", function( e ) {
		
			$G.getEditorLock().isActive() && $G.getEditorLock().cancelCurrentEdit();

			e.stopPropagation();
		} );

		return {

			getConditions: function() {

				var criteria = [], value;

				for ( var field in filters ) {
					
					(value = filters[ field ])

						&& criteria.push( {
							field: field,
							operator: "like",
							value: value
						} );
				}

				return {
					pageVO: fastQuery.is( ":checked" ) ? getSort.call( $G ) : {},

					params: { criteria: JSON.stringify( criteria ) }
				};
			}
		};
	};
} );
