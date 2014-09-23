
define( function() {
	
	var defaults = {

		/** TODO: */
	}

	, rowsToRanges = function( rows, lastCell ) {
		
		var ranges = [];

		for ( var i = 0; i < rows.length; ++i ) {
			ranges.push( new Slick.Range( rows[ i ], 0, rows[ i ], lastCell ) );
		}

		return ranges;
	}

	, rangesToRows = function( ranges ) {
	
		var rows = [];

		for ( var i = 0, length = ranges.length; i < length; ++i ) {
			var range = ranges[ i ];

			for ( var n = range.fromRow; n <= range.toRow; rows.push( n++ ) );
		}
		return rows;
	}

	, Rowselected = function( $G ) {

		var handler = new Slick.EventHandler()
			
		, inHandler = false
		
		, wrapHandler = function( handler ) {
			
			return function() {
			
				if ( !inHandler ) {
					inHandler = !(void handler.apply( this, arguments ));
					inHandler = !inHandler;
				}
			};
		}
	
		/** Store the selected items */
		, _ranges = [];

		$.extend( this, {
			
			init: function() {
				
				handler
					.subscribe( $G.onClick, wrapHandler( handleClick ) )
					.subscribe( $G.onKeyDown, wrapHandler( handleKeyDown ) );
			},
			
			destroy: function() {
				handler.unsubscribeAll();
			},

			onSelectedRangesChanged: new Slick.Event(),

			setSelectedRanges: function( ranges ) {
				_ranges = ranges;
				this.onSelectedRangesChanged.notify( _ranges );
			},

			getSelectedRanges: function() {
				return _ranges;
			},

			setSelectedRows: function( rows ) {
				this.setSelectedRanges( rowsToRanges( rows ) );
			},

			getSelectedRows: function() {
				return rangesToRows( this.getSelectedRanges );
			}
		} );

		function handleClick( e ) {

			var cell = $G.getCellFromEvent( e )
				
			, selecteds, index;

			/** Cell is null */
			if ( !cell || 
				/** Cann't multi select */
				!$G.getOptions().multiSelect ||
				/** Without function key */
				(!e.ctrlKey && !e.shiftKey && !e.metaKey) ||
				/** Cann't focus */
				!$G.canCellBeActive( cell.row, cell.cell ) ) {
				
				return false;
			}
	
			e.stopImmediatePropagation();

			selecteds = rangesToRows( _ranges );

			index = $.inArray( cell.row, selecteds );

			switch ( true ) {
				
				case index === -1 && !e.shiftKey:
					/** Selected */
					selecteds.push( cell.row );
					$G.setActiveCell( cell.row, cell.cell );
					break;

				case index > -1 && !e.shiftKey:
					/** Deselected */
					selecteds = $.grep( selecteds, function( idx ) {
					
						return idx !== cell.row;
					} );
					break;

				case !!(e.shiftKey && selecteds.length):

					var last = selecteds.pop();

					selecteds = [];

					for ( var i = Math.min( cell.row, last ), length = Math.max( cell.row, last ); i < length; 
							selecteds.push( i++ ) );
					$G.setActiveCell( cell.row, cell.cell );
					break;

				default: 
					return;
			}

			this.setSelectedRows( selecteds );
		}

		function handleKeyDown( e ) {
			
			e.stopImmediatePropagation();

			var cell = $G.getActiveCell(), active;

			if ( cell && e.shiftKey && (e.which === 38 || e.which === 40) ) {
				var selecteds = this.getSelectedRows()
					
				, from = Math.min.apply( Math, selecteds )
				, to = Math.max.apply( Math, selecteds );

				Infinity === from && (from = to = cell.row);

				if ( e.which === 40 ) {
					active = cell.row < to || from == to ? ++to : ++from;
				} else {
					active = cell.row < to ? --to : --from;
				}

				if ( active >= 0 && active < $G.getDataLength() ) {
					
					$G.scrollRowIntoView( active );

					for ( selecteds = []; from <= to; selecteds.push( from++ ) );

					this.setSelectedRows( selecteds );
				}
			}
		}
	};

	return function( $G ) {
		
		return new Rowselected( $G );
	};
} );
