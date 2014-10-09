
define( function() {

	return function( $G ) {

		var dropdown = "<div class='slick-genius-wrapper'>" +
				
					"<ul>" +
					"<li data-type='add' data-value='" + $G.getAddRows().length + "'>" + $G.getAddRows().length + " Adds</li>" +
					"<li data-type='udpate' data-value='" + $G.getUpdateRows().length + "'>" + $G.getUpdateRows().length + " Updates</li>" +
					"<li data-type='delete' data-value='" + $G.getDeleteRows().length + "'>" + $G.getDeleteRows().length + " Deletes</li>" +
					"<li data-type='invalid' data-value='" + $G.getInvalidRows().length + "'>" + $G.getInvalidRows().length + " Invalids</li>" +
					"</ul>" +
				"</div>"

		, offset = $( this ).offset();

		dropdown = $( dropdown )

			.css( {
				
				"top": offset.top + 32,
				"left": offset.left
			} )
		
			.appendTo( document.body );
	};
} );
