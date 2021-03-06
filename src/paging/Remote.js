
define( function() {

	var handleSort = function( e, args ) {

		if ( this.isGenius && this.isGenius() ) {
		
			var field = args.sortCol.field
			
			, dataView = this.getData();

			dataView.beginUpdate();

			dataView.sort( function( a, b ) {
				var x = a[ field ], y = b[ field ];

				return (x === y ? 0 : (x > y ? 1 : -1));
			}, args.sortAsc );

			dataView.endUpdate();
		}
		else this.getData().onPagingInfoChanged.notify( { doSearch: 1 } );
	};
	
	return function( $G, ajaxOptions, enable ) {
	
		/** All operations in server-side */
		var pager;

		if ( true === enable ) {

			var dataView, request, dom = $( $G.getContainerNode() );

			if ( !ajaxOptions.serviceName ) {
				
				throw "Service name cann't be null";
			}

			dataView = $G.getData();

			pager = function( pagingInfo, callback, args ) {

				var VO = { wpf_dup_token: +new Date() + Math.random() }
				
				, request = dom.data( "data-request" );
				
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
						$G.showLoading();
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

					dataView.setItems( data.result.concat( $G.getAddRows ? $G.getAddRows() : [] ) );

					/** Render all rows */
					$G.invalidate();
					$G.resizeCanvas();

					with ( data.pageVO ) {
						callback( { pageNum: curPage - 1, pageSize: pageSize, totalPages: totalPages } );
					}
				} )
				
				.always( function() { 
					dom.removeData( "data-request" );
					$G.hideLoading();
				} );

				dom.data( "data-request", request );

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

