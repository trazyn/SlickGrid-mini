(function( $ ) {

	var defaults = {
		columnId : "_checkbox_selector",
		toolTip: "Select/Deselect All",
		cssClass: "slick-cell-checkbox",
		width: 35,
		
		/** TODO: Max selected */
		max: 2
	}

	/** Class */
	, CheckboxSelectColumn = function( options ) {
	
		var settings = $.extend( true, {}, defaults, options || {} )
	
		, $G
		, selecteds = {}
		, handler = new Slick.EventHandler();

		var instance = {
		
			init: function( grid ) {
			
				$G = grid;

				handler
					.subscribe( $G.onSelectedRowsChanged, handleSelectedRowsChanged )
					.subscribe( $G.onClick, handleClick )
					.subscribe( $G.onHeaderClick, handleHeaderClick );
			},

			destroy: function() {
				handler.unsubscribeAll();
			},

			getColumnDefinition: function() {
			
				return {
					id: settings.columnId,
					name: settings.max ? "" :"<input type='checkbox'><label class='toggle'></label>",
					toolTip: settings.toolTip,
					field: "sel",
					width: settings.width,
					resizable: false,
					sortable: false,
					cssClass: settings.cssClass,
					formatter: function( row, cell, value, column, dataContext ) {

						var condition = settings.condition, res = true;

						if ( dataContext ) {

							if ( "function" === typeof condition ) {
							
								res = condition.apply( this, arguments );
							}

							return res && selecteds[ row ] 
								? "<input type='checkbox' checked='checked'><label class='toggle'></label>"
								: "<input type='checkbox'><label class='toggle'></label>";
						}
					}
				};
			}
		};

		function handleSelectedRowsChanged( e, args ) {
		
			var lookup = {}, rows = $G.getSelectedRows();

			for ( var i = 0, row, length = rows.length; i < length; ) {
				
				row = rows[ i++ ];
				lookup[ row ] = true;

				if ( lookup[ row ] !== selecteds[ row ] ) {
					$G.invalidateRow( row );
					delete selecteds[ row ];
				}
			}

			for ( i in selecteds ) {
				$G.invalidateRow( i );
			}

			selecteds = lookup;

			$G.render();

			$G.updateColumnHeader( settings.columnId
						, settings.max ? "" : (rows.length && rows.length === $G.getDataLength() ? "<input type='checkbox' checked='checked'><label class='toggle'></label>" : "<input type='checkbox'><label class='toggle'></label>")
						, settings.toolTip );
		}

		function handleClick( e, args ) {

			var toggleRowSelection = function( row ) {
			
				if ( selecteds[ row ] ) {
					$G.setSelectedRows( $.grep( $G.getSelectedRows(), function( index ) {
						return index !== row;
					} ) );
				} else $G.setSelectedRows( $G.getSelectedRows().concat( row ) );
			};
		
			if ( $G.getColumns()[ args.cell ][ "id" ] === settings.columnId ) {

				/** If editing, try to commit */
				if ( $G.getEditorLock().isActive() && !$G.getEditorLock().commitCurrentEdit() ) {

					e.preventDefault();
					e.stopImmediatePropagation();
					return;
				}

				toggleRowSelection( args.row );
			}
		}

		function handleHeaderClick( e, args ) {
		
			if ( args.column.id !== settings.columnId ||

					/** If editing, try to commit and return */
					($G.getEditorLock().isActive() && !$G.getEditorLock().commitCurrentEdit()) ) { 

						e.preventDefault();
						e.stopImmediatePropagation();
						return; 
					}

			/** Deselect all */
			if ( $( e.target ).is( ":checked" ) ) {
				
				var rows = [];

				for ( var i = 0, length = $G.getDataLength(); i < length; rows.push( i++ ) );

				$G.setSelectedRows( rows );

			/** Select all */
			} else $G.setSelectedRows( [] );

						e.preventDefault();
						e.stopImmediatePropagation();
		}

		$.extend( this, instance );
	};

	$.extend( true, window, {
		
		Slick: {
			"CheckboxSelectColumn": CheckboxSelectColumn
		}
	} );

})( window.jQuery );
