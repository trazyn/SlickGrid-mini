
define( [ "slick/paging/Local", 
	"slick/paging/Remote",
	"slick/paging/Conditions" ], function( Local, Remote, Conditions ) {

	"use strict";

	var defaults = {
		
		container: undefined,

		autoSearch: true,
		switcher: true,
		fastMode: true,

		pagingInfo: {
			pageSize: 50,
			pageNum: 0,

			sizes: [ 50, 100 ]
		}
	};

	return function( $G, dataView, options ) {

		var settings = $.extend( {}, defaults, options || {} )
	
		, container = $( 
			"<div class='pager'>" +
				"<div class='pager-left'>" +
					"<div class='pager-nav'>" +
						"<button class='pager-prev' disabled='disabled'></button>" +
						"<button class='pager-next' disabled='disabled'></button>" +
					"</div>" +

					"<div class='pager-info'>" +
						"<input type='text' class='pager-current' maxlength='5' value='1'>" +
						"<button disabled='disabled' class='pager-total'>1</button>" +
					"</div>" +
				"</div>" +

				"<div class='pager-right'>" +

					(settings.switcher
					? ("<div style='display: inline-block;'>" +
						"<input type='checkbox' class='slick-fast-query' id='slick-fast-query-" + $G.getUid() + "' " + (settings.fastMode ? "" : "checked='checked'") + ">" +
						"<label for='slick-fast-query-" + $G.getUid() + "'></label>" +
					"</div>")  
					: "") +

					"<div class='pager-refresh'></div>" +

					"<div class='pager-size'>" +
						"<label class='custom-select'>" +
							"<select></select>" +
						"</label>" +
					"</div>" +
				"</div>" +
			"</div>" )

		, current = container.find( "input.pager-current" )
		, size = container.find( "select:first" )
		, total = container.find( "button.pager-total" )

		, ajaxOptions = options.ajaxOptions

		, conditions

		/** Update the paging info to UI */
		, uiRefresh = function( pagingInfo ) {
		
			var 

			  prev = container.find( ".pager-prev" ), 
			  next = container.find( ".pager-next" ),

			  value = pagingInfo.pageNum >= 0 ? ++pagingInfo.pageNum : 1,
			  max = pagingInfo.totalPages || 1;

			/** Clear the last state, prevent has been disabled after the size change */
			prev.removeAttr( "disabled" ), next.removeAttr( "disabled" );

			(value < max && value > 1) && ( prev.removeAttr( "disabled" ), next.removeAttr( "disabled" ) );

			value <= 1 && prev.attr( "disabled", "disabled" );
			value === max && next.attr( "disabled", "disabled" );

			$G.resetActiveCell();

			current.val( value );
			size.val( pagingInfo.pageSize );
			total.html( max ).attr( "data-total", max );
		}

		, reset = function() {
		
			$G.resetGenius && $G.resetGenius();

			!$G.getOptions().keepSelection && $G.getSelectionModel() && $G.setSelectedRows( [] );
		}
		
		/** A function that implement for paging */
		, pager;

		dataView.onRowCountChanged.subscribe( function() {
			$G.updateRowCount();
			$G.render();
		});

		dataView.onRowsChanged.subscribe( function( e, args ) {
			$G.invalidateRows( args.rows );
			$G.render();
		} );

		/** Prevent refresh dataview */
		dataView.beginUpdate();

		for ( var sizes = settings.pagingInfo.sizes, length = sizes.length, i = 0; i < length; ) {
			
			/** Right now DOM is not in the render tree, so there is no reflow */
			size.append( "<option value=" + sizes[ i ] + ">" + sizes[ i++ ] + "</option>" );
		}

		/** All operations in local */
		if ( !ajaxOptions ) {

			dataView.setItems( settings.data );
		
			/** Skip the first notify */
			dataView.setPagingOptions( settings.pagingInfo );

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {

				if ( args.doSearch ) {

					pager( args.pagingInfo || {
						
						pageSize: +size.val(),
						pageNum: +current.val() - 1
					} );
				} else uiRefresh( dataView.getPagingInfo() );
			} );

			(pager = Local( $G, true ))( dataView.getPagingInfo() );
		} else {

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {

				if ( args.doSearch ) {

					pager( args.pagingInfo || {
						pageSize: +size.val(),
						/** In SCM the 'pageNum' start from 1, so you should specify an offset to patch it */
						pageNum: +current.val() + 1
					}, uiRefresh, conditions.getConditions() )
					
					.done( reset );
				} else e.stopImmediatePropagation();
			} );

			pager = Remote( $G, settings.ajaxOptions, true );
			
			if ( true === settings.autoSearch ) {
				pager( settings.pagingInfo, uiRefresh );
			}
		}

		if ( ajaxOptions && settings.fastMode ) {
			Local( $G, true );
			Remote( $G, ajaxOptions, false );
		}

		/** This function will be cause a refresh */
		conditions = Conditions( $G, settings.switcher ? container.find( ":checkbox#slick-fast-query-" + $G.getUid() + "" ) : false );

		/** Refresh dataview */
		dataView.endUpdate();

		container

		.delegate( ".pager-prev", "click", function( e ) {
		
			e.stopImmediatePropagation();
			e.preventDefault();

			current.val( +current.val() - 1 );

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
		} )
		
		.delegate( ".pager-next", "click", function( e ) {
		
			e.stopImmediatePropagation();
			e.preventDefault();

			current.val( +current.val() + 1 );

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
		} )

		.delegate( "select", "change", function( e ) {

			e.stopImmediatePropagation();

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
		} )
		
		.delegate( "input.pager-current", "keyup", function( e ) {

			var value = +current.val() || 1
			, max = +total.attr( "data-total" ) || 1;
			
			switch ( e.keyCode ) {
				
				case 38:
					++value <= max 
						? current.val( value ) 
						: --value;
					break;

				case 40:
					--value >= 1 
						? current.val( value ) 
						: ++value;
					break;

				case 13:

					if ( value <= max && value >= 1 ) {

						current.blur();

						dataView.onPagingInfoChanged.notify( { doSearch: 1 } );
					} else {
						current.select();
					}
					break;
			}

			e.stopImmediatePropagation();
		} )

		.delegate( ":checkbox[id^=slick-fast-query-]", "click", function( e ) {
			
			if ( $( this ).is( ":checked" ) ) {
				
				Local( $G, false );
				Remote( $G, ajaxOptions, true );
			} else {
				Local( $G, true );
				Remote( $G, ajaxOptions, false );
			}
		} )
		
		.delegate( "div.pager-refresh", "click", function( e ) {

			dataView.onPagingInfoChanged.notify( { doSearch: 1 } );

			e.stopPropagation();
		} );

		if ( $G.getOptions().keepSelection ) {
		
			$G.onCellCssStylesChnage.subscribe( function( e, args ) {
				$G.onSelectedRowsChanged.notify();
			} );
		} else $G.getSelectionModel() && $G.getData().syncGridSelection( $G );

		$( $G.getContainerNode() )

			.after( container );

		$.extend( $G, {
			
			search: function( args ) {

				var input = conditions.getConditions();

				args = args || {};

				input.result = {
					result: {
						items2Create: JSON.stringify( $G.getAddRows ? $G.getAddRows() : [] ),
						items2Update: JSON.stringify( $G.getUpdateRows ? $G.getUpdateRows() : [] ),
						items2Delete: JSON.stringify( $G.getDeleteRows ? $G.getDeleteRows() : [] ),
						items2Selected: JSON.stringify( $G.getSelectedRow ? $G.getSelectedRows() : [] )
					}
				};

				$.extend( input.params, args.params || {} );
			
				return pager( args.pagingInfo || {
					pageSize: +size.val(),
					pageNum: 0
				}, uiRefresh, input )
				
				.done( function() {
					reset();
					$G.scrollRowToTop( 0 );
				} );
			}
		} );
	};
} );
