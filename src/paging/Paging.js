
define( [ "slick/paging/Local", 
	"slick/paging/Remote",
	"slick/paging/Conditions",
	"slick/core/Dataview" ], function( Local, Remote, Conditions ) {

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

			"<div style='display: inline-block;'>" +
				"<input type='checkbox' class='slick-fast-query' id='slick-fast-query' checked='checked'>" +
				"<label for='slick-fast-query'></label>" +
			"</div>" +

			"<div class='pager-refresh'></div>" +

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

				if ( args.pagingInfo ) {
					pager( args.pagingInfo );
				}
				uiRefresh( dataView.getPagingInfo() );
			} );

			(pager = Local( $G, true ))( dataView.getPagingInfo() );
		} else {

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {

				if ( args.doSearch ) {
				
					pager( args.pagingInfo || {
						pageSize: +size.val(),
						pageNum: +current.val()
					}, args.offset || 0, uiRefresh, Conditions.getConditions() );
					
				} else e.stopImmediatePropagation();
			} );

			(pager = Remote( $G, settings.ajaxOptions, true ))( settings.pagingInfo, 1, uiRefresh );
		}

		/** This function will be cause a refresh */
		Conditions = Conditions( $G, !!ajaxOptions );

		/** Refresh dataview */
		dataView.endUpdate();

		container

		.delegate( ".pager-prev", "click", function( e ) {
		
			e.stopImmediatePropagation();
			e.preventDefault();

			dataView.onPagingInfoChanged.notify( { 
				doSearch: 1, 
				pagingInfo: { pageNum: +current.val() - 2, pageSize: +size.val() }
			} );
		} )
		
		.delegate( ".pager-next", "click", function( e ) {
		
			var value = +current.val()
			
			, max = +total.attr( "data-total" );

			e.stopImmediatePropagation();
			e.preventDefault();

			dataView.onPagingInfoChanged.notify( { 
				doSearch: 1, 
				pagingInfo: { pageNum: +current.val(), pageSize: +size.val() },
				offset: 1
			} );
		} )

		.delegate( "select", "change", function( e ) {

			e.stopImmediatePropagation();

			dataView.onPagingInfoChanged.notify( { 
				doSearch: 1, 
				offset: +!ajaxOptions
			} );
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

						dataView.onPagingInfoChanged.notify( { 
							doSearch: 1, 
							pagingInfo: { pageNum: value + -!ajaxOptions, pageSize: +size.val() }
						} );
					} else {
						current.select();
					}
					break;
			}

			e.stopImmediatePropagation();
		} )

		.delegate( ":checkbox.slick-fast-query", "click", function( e ) {
			
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

		$( $G.getContainerNode() )

			.after( container )

			.focusout( function( e ) { 
				
				var editor = $G.getEditorLock();

				editor.isActive() && editor.cancelCurrentEdit();

				e.stopImmediatePropagation();
			} );
	};
} );
