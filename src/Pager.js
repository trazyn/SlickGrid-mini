
define( function() {

	var html = 
			"<div class='pager-nav'>" +
				"<button class='pager-prev'></button>" +
				"<button class='pager-next'></button>" +
			"</div>" +

			"<div class='pager-info'>" +
				"<input type='text' class='pager-current' maxlength='5'>" +
				"<button disabled='disabled' class='pager-total'></button>" +
			"</div>" +

			"<div class='pager-refresh'></div>" +

			"<div class='pager-size'>" +
				"<label class='custom-select'>" +
					"<select>" +
						"<option value='50'>50</option>" +
						"<option value='100'>100</option>" +
						"<option value='200'>200</option>" +
						"<option value='500'>500</option>" +
						"<option value='1000'>1000</option>" +
					"</select>" +
				"</label>" +
			"</div>";

	return function( dataView, $G, ajaxOptions ) {
	
		var container = $( options.container )

		, current = container.find( "input.pager-current" )
		, size = container.find( "select:first" )
		, total = container.find( "button.pager-total" )

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

			current.val( value );
			size.val( pagingInfo.pageSize );
			total.html( max ).attr( "data-total", max );
		}
		
		/** A function that implement for paging */
		, pager;

		if ( !container.length ) {
			container = $( "<div class='pager'></div>" );
		}

		container.html( html );

		/** All operations in local */
		if ( !ajaxOptions ) {
		
			/** Skip the first notify */
			dataView.setRefreshHints( { isFilterUnchanged: true } );
			dataView.setPagingOptions( options.pagingInfo || { pageSize: 50, pageNum: 0 } );

			dataView.onRowCountChanged.subscribe( function( e, args ) {
			
				$G.updateRowCount();
				$G.render();
			} );

			dataView.onRowsChanged.subscribe( function( e, args ) {
			
				$G.invalidateRows( args.rows );
				$G.render();
			} );

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {
				uiRefresh( dataView.getPagingInfo() );
			} );

			/** The implementation of local paging */
			pager = dataView.setPagingInfo;
		} else {

			var loading, loadData;

			/** All operations in server-side */
			if ( !ajaxOptions.serviceName ) {
				throw "The service name cann't be null";
			}

			loading = $( "<div class='slick-loading' style='display: none;'> <div class='slick-head-mask'> </div> </div>" );

			$( $G.getContainerNode() ).append( loading );

			loadData = function() {

				loading.fadeIn();

				$.ajax( ajaxOptions )
					
				.done( function( data ) {
				
				} )
				
				.always( function() {
					
					loading.fadeOut( 100 );
				} );
			};

			pager = function() {
			
			};

			$( $G.getContainerNode() ).append( loading );
		}

		dataView.onPagingInfoChanged.notify();
	
		container

		.delegate( ".pager-prev", "click", function( e ) {
		
			var value = +current.val();

			e.stopImmediatePropagation();
			e.preventDefault();

			value > 1 && pager( { pageNum: value - 2 } );
		} )
		
		.delegate( ".pager-next", "click", function( e ) {
		
			var value = +current.val()
			
			, max = +total.attr( "data-total" );

			e.stopImmediatePropagation();
			e.preventDefault();

			value <= max && pager( { pageNum: value } );
		} )

		.delegate( "select", "change", function( e ) {

			pager( { pageSize: $( this ).val() } );
			e.stopImmediatePropagation();
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
						pager( { pageNum: value } );
					} else {
						current.select();
					}
					break;
			}

			e.stopImmediatePropagation();
		} );
	};
} );

