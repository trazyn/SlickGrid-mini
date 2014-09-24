
define( function() {

	var handleSort = function( e, args ) {
		this.getData().onPagingInfoChanged.notify( args );
	};

	return function( $G, ajaxOptions, enable ) {
	
		/** All operations in server-side */
		var pager;

		if ( true === enable ) {

			var dataView, request, loading;

			if ( !ajaxOptions.serviceName ) {
				
				throw "Service name cann't be null";
			}

			dataView = $G.getData();
			loading = $( "<div class='slick-loading' style='display: none;'> <div class='slick-head-mask'> </div> </div>" );

			$( $G.getContainerNode() ).append( loading );

			/** In SCM the 'pageNum' start from 1, so you should specify an offset to patch it */
			pager = function( pagingInfo, offset, callback, field, asc ) {

				var VO = { wpf_dup_token: +new Date() + Math.random() }
				
				, request = loading.data( "data-request" );

				offset = offset || 0;

				VO[ ajaxOptions.moduleName || (ajaxOptions.moduleName = "gridElement_kiss") ] = JSON.stringify( $.extend( {}, {
				
					pageVO: {
						curPage: +pagingInfo.pageNum + offset,
						incrementalPaging: false,
						pageSize: +pagingInfo.pageSize,
						remoteSortField: field || "",
						remoteSortOrder: asc === void 0 ? "" : (asc ? "asc" : "desc"),
						totalRows: -1
					}
				}, ajaxOptions.VO ) );

				/** Keep one ajax instance */
				request && request.abort();

				request = $.ajax( {

					beforeSend: function() { 
						/** Show the loading */
						loading.fadeIn(); 
					},

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

					} catch ( ex ) {
						
						throw "Call the service '" + ajaxOptions.serviceName + "' failed:\n" + data;
					}

					dataView.setItems( data.result );

					/** Render all rows */
					$G.invalidate();

					with ( data.pageVO ) {
						callback( { pageNum: curPage - 1, pageSize: pageSize, totalPages: totalPages } );
					}
				} )
				
				.always( function() { 
					loading.removeData( "data-request" ).fadeOut( 100 ); 
				} );

				loading.data( "data-request", request );
			};

			/** Registe event handler */
			$G.onSort.subscribe( handleSort );
		} else {
			
			$G.onSort.unsubscribe( handleSort );
		}

		return pager;
	};
} );

