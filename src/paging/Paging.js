
define( [ "slick/paging/LocalSort", 
	"slick/paging/RemoteSort",
	"slick/paging/Filter",
	"slick/core/Dataview" ], function( LocalSort, RemoteSort, Filter ) {

	var html = 
			"<div class='pager'>" +
			"<div class='pager-nav'>" +
				"<button class='pager-prev' disabled='disabled'></button>" +
				"<button class='pager-next' disabled='disabled'></button>" +
			"</div>" +

			"<div class='pager-info'>" +
				"<input type='text' class='pager-current' maxlength='5' value='1'>" +
				"<button disabled='disabled' class='pager-total'>1</button>" +
			"</div>" +

			"<div class='pager-refresh'></div>" +

			"<div style='display: inline-block;'>" +
				"<input type='checkbox' class='slick-fast-query' id='slick-fast-query' checked='checked'>" +
				"<label for='slick-fast-query'></label>" +
			"</div>" +

			"<div class='pager-size'>" +
				"<label class='custom-select'>" +
					"<select></select>" +
				"</label>" +
			"</div>" +
			"</div>"
			
	, defaults = {
		
		container: undefined,

		pagingInfo: {
			pageSize: 50,
			pageNum: 0,

			sizes: [ 50, 100 ]
		}
	};

	return function( $G, dataView, options ) {

		var settings = $.extend( true, {}, defaults, options || {} )
	
		, container = $( html )

		, current = container.find( "input.pager-current" )
		, size = container.find( "select:first" )
		, total = container.find( "button.pager-total" )

		, ajaxOptions = options.ajaxOptions

		/** Update the paging info to UI */
		, uiRefresh = function( pagingInfo ) {
		
			var 

			  prev = container.find( ".pager-prev" ), 
			  next = container.find( ".pager-next" ),

			  value = pagingInfo.pageNum + 1,
			  max = pagingInfo.totalPages || 1;

			/** Clear the last state, prevent has been disabled after the size change */
			prev.removeAttr( "disabled" ), next.removeAttr( "disabled" );

			(value < max && value > 1) && ( prev.removeAttr( "disabled" ), next.removeAttr( "disabled" ) );

			value === 1 && prev.attr( "disabled", "disabled" );
			value === max && next.attr( "disabled", "disabled" );

			$G.resetActiveCell();

			current.val( value );
			size.val( pagingInfo.pageSize );
			total.html( max ).attr( "data-total", max );
		}
		
		/** A function that implement for paging */
		, pager;

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
				uiRefresh( dataView.getPagingInfo() );
			} );

			(pager = LocalSort( $G, true ))( dataView.getPagingInfo() );
		} else {

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {

				if ( args.sortCol ) {
				
					pager( {
						pageSize: +size.val(),
						pageNum: +current.val()
					}, 0, uiRefresh, args.sortCol.field, args.sortAsc );
					
				} else e.stopImmediatePropagation();
			} );

			(pager = RemoteSort( $G, settings.ajaxOptions, true ))( settings.pagingInfo, 1, uiRefresh );
		}

		/** This function will be cause a refresh */
		Filter( $G, !!ajaxOptions );

		/** Refresh dataview */
		dataView.endUpdate();

		container

		.delegate( ".pager-prev", "click", function( e ) {
		
			var value = +current.val();

			e.stopImmediatePropagation();
			e.preventDefault();

			ajaxOptions && $G.setSortColumns( [] );

			value > 1 && pager( { pageNum: value - 2, pageSize: +size.val() }, 0, uiRefresh );
		} )
		
		.delegate( ".pager-next", "click", function( e ) {
		
			var value = +current.val()
			
			, max = +total.attr( "data-total" );

			e.stopImmediatePropagation();
			e.preventDefault();

			ajaxOptions && $G.setSortColumns( [] );

			value <= max && pager( { pageNum: value, pageSize: +size.val() }, 1, uiRefresh );
		} )

		.delegate( "select", "change", function( e ) {

			pager( { pageSize: +$( this ).val(), pageNum: 0 }, 1, uiRefresh );

			e.stopImmediatePropagation();

			ajaxOptions && $G.setSortColumns( [] );
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
						pager( { pageNum: value, pageSize: +size.val() }, 0, uiRefresh );
					} else {
						current.select();
					}
					break;
			}

			e.stopImmediatePropagation();

			ajaxOptions && $G.setSortColumns( [] );
		} )

		.delegate( ":checkbox.slick-fast-query", "click", function( e ) {
			
			if ( $( this ).is( ":checked" ) ) {
				
				LocalSort( $G, false );
				RemoteSort( $G, ajaxOptions, true );
			} else {
				LocalSort( $G, true );
				RemoteSort( $G, ajaxOptions, false );
			}
		} )
		
		.delegate( "div.pager-refresh", "click", function( e ) {
		
			pager( {
				pageSize: +size.val(),
				pageNum: +current.val()
			}, 0, uiRefresh );

			$G.setSortColumns( [] );

			e.stopPropagation();
		} );

		$( $G.getContainerNode() ).after( container );
	};
} );

