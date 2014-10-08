

define( function( Highlight ) {
	
	"use strict";

	var defaults = {
		
		columnId: "_radio_selector",
		cssClass: "slick-cell-radio",
		width: 35,
		
		key: "radio-select",
		cssCellClass: "slick-radio-radio"
	}

	, RadioSelectColumn = function( $G, settings ) {
	
		var handler = new Slick.EventHandler()

		, dataView = $G.getData()

		, current = {
			
			row: undefined,
			id: undefined
		};

		$.extend( this, {
			
			init: function() {

				var syncStyle = function() {
				
					var idxById, id, hash = {};

					if ( current.id !== undefined ) {
					
						idxById = dataView.getSnapshot();
						id = idxById[ current.id ];
						
						$G.getColumns().forEach( function( column ) {
							
							hash[ id ] = hash[ id ] || {};
							hash[ id ][ column.id ] = settings.cssCellClass;
						} );

						/** Don't trigger 'onCellCssStylesChanged' */
						$G.setCellCssStyles( settings.key, hash, true );
						$G.invalidateRow( current.row );
						$G.render();
					}
				};

				handler
					.subscribe( $G.getData().onPagingInfoChanged, function( e, args ) {
						
						if ( args.doSearch ) {
						
							/** Clear */
							current.row !== undefined && $G.invalidateRow( current );
							current = {};
						}
					} )
		
					.subscribe( $G.onClick, function( e, args ) {

						var editor;

						if ( current.row !== args.row ) {

							editor = $G.getEditorLock();

							editor.isActive( $G.getEditController() ) && editor.commitCurrentEdit();
							
							current.row !== undefined && $G.invalidateRow( current.row );

							syncStyle( current = {
								
								row: args.row,
								id: $G.getDataItem( args.row )[ "rr" ]
							} );
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
			},

			getColumnDefinifion: function() {
				
				return {

					id: settings.columnId,
					name: "",
					width: settings.width,
					resizable: false,
					sortable: false,
					cssClass: settings.cssClass,
					formatter: function( row, cell, value, column, dataContext ) {
						
						return current.id === dataContext[ "rr" ]
							
							? "<input type='checkbox' checked='checked'><label class='toggle'></label>"
							: "<input type='checkbox'><label class='toggle'></label>";
					}

				};
			}
		} );

		$.extend( $G, {
			
			getRadioRow: function() {
				
				if ( current.id ) {
					return dataView.getItemById( current.id );
				}
			}
		} );
	};

	return function( $G, options ) {

		var plugin = new RadioSelectColumn( $G, $.extend( {}, defaults, options || {} ) );

		$G.registerPlugin( plugin );

		return plugin.getColumnDefinifion();
	};
} );
