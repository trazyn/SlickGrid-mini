define( [ "slick/plugins/RowsModel" ], function( RowsModel ) {

	"use strict";

	var defaults = {
		columnId : "_checkbox_selector",
		toolTip: "Select/Deselect All",
		cssClass: "slick-cell-checkbox",
		width: 35,
		
		/** TODO: Max selected */
		max: 0
	}

	/** CLASS */
	, CheckboxSelectColumn = function( $G, dataView, settings ) {
	
		var handler = new Slick.EventHandler()

		/** Cache the selected items */
		, selecteds = {}

		, instance = {
		
			init: function( grid ) {

				handler
					.subscribe( $G.onSelectedRowsChanged, handleSelectedRowsChanged )
					.subscribe( $G.onClick, handleClick )
					.subscribe( $G.onHeaderClick, handleHeaderClick );
			},

			destroy: function() {
				handler.unsubscribeAll();
			},

			getColumnDefinifion: function() {
			
				return {
					id: settings.columnId,
					name: settings.max ? "" :"<input type='checkbox'><label class='toggle'></label>",
					toolTip: settings.toolTip,
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
						
						var res = index !== row;

						!res && $G.onRowDeselected.notify( { row: row } );

						return res;
					} ) );
				} else {
					$G.onRowSelected.notify( { row: row } );
					$G.setSelectedRows( $G.getSelectedRows().concat( row ) );
				}
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

			/** Select all */
			if ( !$( e.target ).prev().is( ":checked" ) ) {
				
				var rows = [];

				for ( var i = 0, length = $G.getDataLength(); i < length; rows.push( i++ ) );

				$G.setSelectedRows( rows );

			/** Deselect */
			} else $G.setSelectedRows( [] );

			e.preventDefault();
			e.stopImmediatePropagation();
		}

		$.extend( this, instance );
	};

	return function( $G, dataView, options ) {
	
		var
		  settings = $.extend( true, {}, defaults, options || {} ),
		  plugin = new CheckboxSelectColumn( $G, dataView, settings );

		/** Enable rows selected ability */
		$G.setSelectionModel( RowsModel( $G ) );

		/** Register plugin */
		$G.registerPlugin( plugin );

		/** On the rows changed clear the selected */
		dataView.onRowsChanged.subscribe( function( e, args ) {
			$G.setSelectedRows( [] );
		} );

		/** Add events hook */
		$.extend( $G, {
			onRowSelected: new Slick.Event(),
			onRowDeselected: new Slick.Event()
		} );

		/** Return the column definition */
		return plugin.getColumnDefinifion();
	};
} );


