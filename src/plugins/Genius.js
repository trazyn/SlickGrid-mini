
define( function() {

	var Genius = function( $G ) {
	
		var dataView = $G.getData()
	
		, original, trigger
	
		/**
		 * ADD: 	0000 0001
		 * UPDATE: 	0000 0010
		 * DELETE: 	0000 0100
		 * */
		, settings = 0x0;

		$.extend( $G, {
			
			/** Reset all flags */
			resetGenius: function() {
				
				if ( trigger ) {
					settings = 0;
					trigger.removeClass( "active" );
				}
			},

			isGenius: function() {
				return !!settings;
			}
		} );

		return function( e ) {
			
			var dropdown = "<div class='slick-genius-wrapper' tabindex=-1>" +
					
						"<ul>" +
						"<li data-type='1' " + ((1 !== (settings & 1)) || "class='selected'") + " data-value='" + 
								$G.getAddRows().length + "'>" + $G.getAddRows().length + " Adds</li>" +
						"<li data-type='2' " + ((2 !== (settings & 2)) || "class='selected'") + " data-value='" + 
								$G.getUpdateRows().length + "'>" + $G.getUpdateRows().length + " Updates</li>" +
						"<li data-type='4' " + ((4 !== (settings & 4)) || "class='selected'") + " data-value='" + 
								$G.getDeleteRows().length + "'>" + $G.getDeleteRows().length + " Deletes</li>" +

						/**
						"<li data-type='8' " + ((8 !== (settings & 8)) || "class='selected'") + " data-value='" + 
								$G.getInvalidRows().length + "'>" + $G.getInvalidRows().length + " Invalids</li>" +
						"</ul>" +
						*/

					"</div>"

			, offset;

			trigger = $( this );
			offset = trigger.offset();

			if ( trigger.is( ".open" ) ) { 

				trigger.data( "dropdown" ).focus();
				return e.preventDefault(); 
			}

			trigger.addClass( "open" );

			dropdown = $( dropdown )

				.css( {
					"position": "absolute",
					"top": offset.top,
					"left": offset.left
				} )

				.delegate( "li[data-type]", "click", function() {
					
					var self = $( this )
					
					, type = +self.attr( "data-type" )
					, items = [];

					if ( !settings ) {
						
						/** Take a snapshot */
						original = dataView.getItems();
					}

					if ( self.is( ".selected" ) ) {
						self.removeClass( "selected" );

						/** Reset flag */
						settings &= ~type;
					} else {
						self.addClass( "selected" );

						/** Enable flag */
						settings |= type;
					}

					1 === (settings & 1) && (items = items.concat( $G.getAddRows() ));
					2 === (settings & 2) && (items = items.concat( $G.getUpdateRows() ));
					4 === (settings & 4) && (items = items.concat( $G.getDeleteRows() ));

					if ( settings ) {
						
						trigger.addClass( "active" );
						dataView.setItems( items );
					} else {
						trigger.removeClass( "active" );
						dataView.setItems( original );
					}

					$G.invalidate();
				} )

				.on( "focusout", function( e ) {
					
					if ( e.relatedTarget !== trigger.get( 0 ) ) {
					
						trigger.removeClass( "open" ).removeData( "dropdown" );
						dropdown.removeClass( "slide-down" );

						setTimeout( function() {
							dropdown.remove();
						}, 300 );
					}
				} )
			
				.appendTo( document.body );

			trigger.data( "dropdown", dropdown );

			/** After dom change hold the focus */
			setTimeout( function( e ) { dropdown.addClass( "slide-down" ).focus(); } );
		};
	};

	return function( $G ) {

		return new Genius( $G );
	};
} );
