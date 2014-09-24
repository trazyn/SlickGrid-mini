
define( function() {
	
	var 
	  handleSort = function( e, args ) {
	  
		var field = args.sortCol.field;

		this.getData().sort( function( a, b ) {
			var x = a[ field ], y = b[ field ];

			return (x === y ? 0 : (x > y ? 1 : -1));
		}, args.sortAsc );

		this.getData().$G = this;
	  },

	  handleRowCountChanged = function() {

	  	  var $G = Slick.Event.$G;
	  
		  $G.updateRowCount();
		  $G.render();
	  },

	  handleRowsChanged = function( e, args ) {

	  	  var $G = Slick.Event.$G;

		  $G.invalidateRows( args.rows );
		  $G.render();
	  };

	return function( $G, enable ) {

		var pager;

		if ( $G && true === enable ) {

			pager = $G.getData().setPagingOptions;
			
			$G.onSort.subscribe( handleSort );
			$G.getData().onRowCountChanged.subscribe( handleRowCountChanged );
			$G.getData().onRowsChanged.subscribe( handleRowsChanged );
		} else {
		
			$G.onSort.unsubscribe( handleSort );
			$G.getData().onRowCountChanged.unsubscribe( handleRowCountChanged );
			$G.getData().onRowsChanged.unsubscribe( handleRowsChanged );
		}

		return pager;
	};
} );

