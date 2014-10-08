
define( function() {

	var handleSort = function( e, args ) {
		this.getData().onPagingInfoChanged.notify( { doSearch: 1 } );
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

			pager = function( pagingInfo, callback, args ) {

				var VO = { wpf_dup_token: +new Date() + Math.random() }
				
				, request = loading.data( "data-request" );
				
				args = args || {};

				VO[ ajaxOptions.moduleName || (ajaxOptions.moduleName = "gridElement_kiss") ] 

					= JSON.stringify( $.extend( {}, {
				
						pageVO: $.extend( {}, {
							curPage: +pagingInfo.pageNum - 1,
							incrementalPaging: false,
							pageSize: +pagingInfo.pageSize,
							totalRows: -1
						}, args.pageVO || {} )
					}, args.result || {} ) );

				/** Keep one ajax instance */
				request && request.abort();

				request = $.ajax( {

					type: "POST",

					beforeSend: function() { 
						/** Show the loading */
						loading.fadeIn(); 
					},

					data: {
						name: ajaxOptions.serviceName,
						params: JSON.stringify( $.extend( {}, VO, ajaxOptions.params || {}, args.params || {} ) )
					}
				} )
					
				.done( function( data ) {

					try {
						data = eval( "(" + data + ")" );
						data = data[ "result" ][ ajaxOptions.moduleName ];
						data = JSON.parse( data );

					} catch ( ex ) {
						
						throw "Call the service '" + ajaxOptions.serviceName + "' failed:\n" + ex;
					}

					dataView.setItems( data.result );

					/** Render all rows */
					$G.invalidate();
					$G.resizeCanvas();

					with ( data.pageVO ) {
						callback( { pageNum: curPage - 1, pageSize: pageSize, totalPages: totalPages } );
					}
				} )
				
				.always( function() { 
					loading.removeData( "data-request" ).fadeOut( 100 ); 
				} );

				loading.data( "data-request", request );

				return request;
			};

			/** Registe event handler */
			$G.onSort.subscribe( handleSort );
		} else {
			
			$G.onSort.unsubscribe( handleSort );
		}

		return pager;
	};
} );

