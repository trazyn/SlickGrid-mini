
define( function() {

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
				$G.resetActiveCell();
				$G.render();
			} );

			dataView.onPagingInfoChanged.subscribe( function( e, args ) {
				uiRefresh( dataView.getPagingInfo() );
			} );

			$G.onSort.subscribe( function( e, args ) {
			
				var field = args.sortCol.field;

				dataView.sort( function( a, b ) {
					var x = a[ field ], y = b[ field ];

					return (x === y ? 0 : (x > y ? 1 : -1));
				}, args.sortAsc );
			} );

			/** The implementation of local paging */
			pager = dataView.setPagingOptions;

			pager( dataView.getPagingInfo() );
		} else {

			/** All operations in server-side */

			var
			  ajaxOptions = settings.ajaxOptions,
			  loading = $( "<div class='slick-loading' style='display: none;'> <div class='slick-head-mask'> </div> </div>" );

			if ( !ajaxOptions.serviceName ) {
				
				throw "Service name cann't be null";
			}

			$( $G.getContainerNode() ).append( loading );

			pager = function( pagingInfo, field, asc ) {

				var VO = { wpf_dup_token: +new Date() + Math.random() };

				VO[ ajaxOptions.moduleName || (ajaxOptions.moduleName = "gridElement_kiss") ] = JSON.stringify( $.extend( {}, {
				
					pageVO: {
						curPage: pagingInfo.pageNum,
						incrementalPaging: false,
						pageSize: pagingInfo.pageSize,
						remoteSortField: field || "",
						remoteSortOrder: asc === void 0 ? "" : (asc ? "asc" : "desc"),
						totalRows: -1
					}
				}, ajaxOptions.VO ) );

				$.ajax( {

					beforeSend: function() { loading.fadeIn(); },

					data: {
						name: ajaxOptions.serviceName,
						params: JSON.stringify( $.extend( {}, VO, ajaxOptions.params || {} ) )
					}
				} )
					
				.done( function( data ) {

					try {

						data = eval( "(" + data + ")" );
						data = data[ "result" ][ ajaxOptions.moduleName ];
						data = JSON.parse( data );

						dataView.setItems( data.result );

						/** Render all rows */
						$G.invalidate();

						with ( data.pageVO ) {
							uiRefresh( { pageNum: curPage, pageSize: pageSize, totalPages: totalPages } );
						}
					} catch ( ex ) {
						
						throw "Call the service '" + ajaxOptions.serviceName + "' failed:\n" + data;
					}
				} )
				
				.always( function() { 
					loading.fadeOut( 100 ); 
				} );
			};

			$( $G.getContainerNode() ).append( loading );

			$G.onSort.subscribe( function( e, args ) {
			
				pager( {
					pageSize: +size.val(),
					pageNum: current.val()
				}, args.sortCol.field, args.sortAsc );
			} );

			pager( settings.pagingInfo );
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

			pager( { pageSize: +$( this ).val() } );
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

