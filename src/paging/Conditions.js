
define( function() {

	var handleHeaderRowCellRendered = function( e, args ) {
	
		if ( args.column.filter ) {
			$( args.node ).html( "<input type='text' data-column-field='" + args.column.field + "' placeholder='Search...' >" );
		} else if ( args.column.id === "_checkbox_selector" ) {
			$( args.node ).html( "<button class='slick-filter-clear'></button>" );
		}
	}
	
	, getSort = function() {
		
		var sortColumn = this.getSortColumns()[ 0 ], column;

		if ( !sortColumn ) {
		
			return {};
		}
		
		column = $G.getColumns()[ $G.getColumnIndex( sortColumn.columnId ) ];

		return {
			remoteSortField: column.field,
			remoteSortOrder: sortColumn.sortAsc ? "asc" : "desc"
		};
	};

	return function( $G, isAjax ) {
	
		var dataView = $G.getData(), filters = {};
	
		$G.onHeaderRowCellRendered.unsubscribe( handleHeaderRowCellRendered );
		$G.onHeaderRowCellRendered.subscribe( handleHeaderRowCellRendered );

		/** Set the filter */
		dataView.setFilter( function( row ) {
			
			var value;

			for ( var field in filters ) {

				value = filters[ field ];

				if ( value && row[ field ].toString().indexOf( value ) === -1 ) {
					return false;
				}
			}
			return true;
		} );

		$( $G.getHeaderRow() )

		/** Remove all keyup handler */
		.undelegate( "input:visible", "keyup" )	

		.delegate( "input:visible", "keyup", function( e ) {
			
			var self = $( this )
			, field = self.attr( "data-column-field" );

			e.stopPropagation();

			if ( field ) {
				
				filters[ field ] = self.val().replace( /^\s+|\s+$/g, "" );
				dataView.refresh();

				if ( isAjax && 13 === e.keyCode ) {
					
					dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
				}
			}
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
					pageVO: getSort.call( $G ),

					params: {

						criteria: JSON.stringify( criteria ) ,

						result: {
							
							items2Create: [],
							items2Delete: JSON.stringify( $G.getDeleteRows() ),
							items2Update: [],
							items2Selected: []
						}
					}
				};
			}
		};
	};
} );
