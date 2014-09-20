
define( [ "slick/core/Dataview" ], function() {

	var html = 
			"<div class='pager'>" +
			"<div class='pager-nav'>" +
				"<button class='pager-prev' disabled='disabled'></button>" +
				"<button class='pager-next' disabled='disabled'></button>" +
			"</div>" +

			"<div class='pager-info'>" +
				"<input type='text' class='pager-current' maxlength='5'>" +
				"<button disabled='disabled' class='pager-total'></button>" +
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

		for ( var sizes = settings.pagingInfo.sizes, length = sizes.length, i = 0; i < length; ) {
			
			/** Right now DOM is not in the render tree, so there is no reflow */
			size.append( "<option value=" + sizes[ i ] + ">" + sizes[ i++ ] + "</option>" );
		}

		/** All operations in local */
		if ( !settings.ajaxOptions ) {

			dataView.setItems( settings.data );
		
			/** Skip the first notify */
			dataView.setRefreshHints( { isFilterUnchanged: true } );
			dataView.setPagingOptions( settings.pagingInfo );

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
			pager = dataView.setPagingOptions;

			pager( dataView.getPagingInfo() );
		} else {

			/** All operations in server-side */
			var
			  ajaxOptions = settings.ajaxOptions,
			  loading = $( "<div class='slick-loading' style='display: none;'> <div class='slick-head-mask'> </div> </div>" );

			$( $G.getContainerNode() ).append( loading );

			pager = function() {

				$.extend( ajaxOptions, {
					
					from: +current.val() * size.val(),
					to: +size.val()
				} );
			
				loading.fadeIn();

				$.ajax( ajaxOptions )
					
				.done( function( data ) {
				
					;;for ( var i = 0, data = []; i < 1000; ++i ) {
						
						data[ i ] = {
						
							"id": "# " + i,
							"num1": Math.random() * i * 100,
							"num2": Math.random() * i * 1000,
							"num3": Math.random() * i * 10000
						};
					}

					dataView.setItems( data );

					/** Rerender all the rows */
					$G.invalidate();

					//uiRefresh( { pageNum: 1 + current.val(), pageSize: +size.val(), totalPages: 1000 } );
				} )
				
				.always( function() { 

					setTimeout( function() {
						loading.fadeOut( 100 ); 
					}, 3000 );
				} );
			};

			$( $G.getContainerNode() ).append( loading );
		}
	
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
						pager( { pageNum: value, pageSize: +size.val() } );
					} else {
						current.select();
					}
					break;
			}

			e.stopImmediatePropagation();
		} );

		$( $G.getContainerNode() ).after( container );
	};
} );

