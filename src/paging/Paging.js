
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

			"<div style='display: inline-block; margin-left: 74%;'>" +
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

		var settings = $.extend( {}, defaults, options || {} )
	
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

			  value = pagingInfo.pageNum >= 0 ? ++pagingInfo.pageNum : 1;
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
		
			$G.setDeleteRows && $G.setDeleteRows( [] );
			$G.setUpdateRows && $G.setUpdateRows( [] );

			$G.setSelectedRows( [] );
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
					}, uiRefresh, Conditions.getConditions() );
					
				} else e.stopImmediatePropagation();
			} );

			(pager = Remote( $G, settings.ajaxOptions, true ))( settings.pagingInfo, uiRefresh );
		}

		/** This function will be cause a refresh */
		Conditions = Conditions( $G, container.find( ":checkbox.slick-fast-query" ) );

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

			reset();

			e.stopPropagation();
		} );

		$( $G.getContainerNode() )

			.after( container );

		$.extend( $G, {
			
			search: function( pagingInfo, VO ) {

				var args = Conditions.getConditions();

				args.result = {

					result: {
					
						items2Create: JSON.stringify( $G.getAddRows ? $G.getAddRows() : [] ),
						items2Update: JSON.stringify( $G.getUpdateRows ? $G.getUpdateRows() : [] ),
						items2Delete: JSON.stringify( $G.getDeleteRows ? $G.getDeleteRows() : [] ),
						items2Selected: JSON.stringify( $G.getSelectedRow ? $G.getSelectedRows() : [] )
					}
				};
			
				reset();

				return pager( pagingInfo || {
					pageSize: +size.val(),
					pageNum: 0
				}, uiRefresh, args );

			}
		} );

	/**
	var Entitys = Storage.get( "cahce.entityId" ) || {};

	(window.entityId = Entitys[ wpf_current_roleid ])
		|| $.ajax( {
			data: {
				name: "scm.common.entity.GetEntityId"
			},

			success: function( data ) {
				
				data = eval( "(" + data + ")" );

				Entitys[ wpf_current_roleid ] = +data.result.entity_id;

				window.entityId = Entitys[ wpf_current_roleid ];

				Storage.set( "cahce.entityId", Entitys );
			}
		} );

	*/
	};
} );
