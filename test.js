	var pager = function( dataView, $G, options ) {

		var container = $( options.container )

		, current = container.find( "input.pager-current" )
		, size = container.find( "select:first" )
		, total = container.find( "button.pager-total" )
	
		, loading = $( "<div class='slick-loading'> <div class='slick-head-mask'> </div> </div>" );
	
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

			var 

			  pagingInfo = dataView.getPagingInfo(),

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
		} );

		dataView.onPagingInfoChanged.notify();
	
		container

		.delegate( ".pager-prev", "click", function( e ) {
		
			var value = +current.val();

			e.stopImmediatePropagation();
			e.preventDefault();

			value > 1 && dataView.setPagingOptions( { pageNum: value - 2 } );
		} )
		
		.delegate( ".pager-next", "click", function( e ) {
		
			var value = +current.val()
			
			, max = +total.attr( "data-total" );

			e.stopImmediatePropagation();
			e.preventDefault();

			value <= max && dataView.setPagingOptions( { pageNum: value } );
		} )

		.delegate( "select", "change", function( e ) {

			dataView.setPagingOptions( { pageSize: $( this ).val() } );
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
						dataView.setPagingOptions( { pageNum: value } );
					} else {
						current.select();
					}
					break;
			}

			e.stopImmediatePropagation();
		} );
	};


var dataView = new Slick.Data.DataView()
	
, checkBoxColumn = new Slick.CheckboxSelectColumn();

for ( var i = 0, data = []; i < 1000; ++i ) {
	
	data[ i ] = {
	
		"id": "# " + i,
		"num1": Math.random() * 100,
		"num2": Math.random() * 1000,
		"num3": Math.random() * 10000
	};
}

dataView.setItems( data );
dataView.setPagingOptions( { pageSize: 50, pageNum: 0 } );

var $G = new Slick.Grid( "#myGrid", dataView, [ checkBoxColumn.getColumnDefinition(), {
	
	id: "column1",
	    name: "IDS",
	    field: "id",
	    width: 40
	    
}, {
	id: "column2",
	    name: "Language",
	    field: "num1",
	    editor: Slick.Editors.Text,
	    sortable: true
}, {
	id: "column3",
	    name: "Year",
	    field: "num2",
	    editor: Slick.Editors.Text,
	    sortable: true
}, {
	id: "column4",
	    name: "Value",
	    field: "num3",
	    editor: Slick.Editors.Text,
	    sortable: true
} ], {
	editable: true,

	    /** Enable keybord navigation */
	    enableCellNavigation: true,

	    /** Fast keybord navigation */
	    asyncEditorLoading: true,

	    /** Auto align the columns */
	    forceFitColumns: true,

	    syncColumnCellResize: true,

	    multiColumnSort: true
} );

$G.setSelectionModel( new Slick.RowSelectionModel( { selectActiveRow: false } ) );
$G.registerPlugin( checkBoxColumn );

pager( dataView, $G, { 
	
	container: $( ".pager" )
} );

