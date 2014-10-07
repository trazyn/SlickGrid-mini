
define( function() {

	var TextareaEditor = function( args ) {
	
		var
		  wrapper,
		  input,
		  defaultValue;

		$.extend( this, {
			
			init: function() {

				var save = function() {
					
					args.commitChanges();
				}

				, cancel = function() {
					
					input.val( defaultValue );
					args.cancelChanges();
					max && max.html( input.val().length );
				}
				
				, max = (args.column.editorArgs || {}).max;
			
				wrapper = "<div class='slick-textarea-wrapper' style='display: none; position: absolute; z-index: 999; padding: 10px;'>" +
							
						"<textarea rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'></textarea>" +

						"<div>" +
		
							"<small style='display: none'>0/100</small>" +

							"<button name='save'>Save</button>" + 
							"<button name='clear'>Clear</button>" +
							"<button name='cancel'>Cancel</button>" +

						"</div>" +

					"</div>";

				input = (wrapper = $( wrapper ).appendTo( document.body )).find( "textarea" );

				if ( max ) {
					
					input.attr( "maxlength", max );
					max = wrapper.find( "small" ).html( "<i>0</i> / " + max ).css( "display", "" ).find( "i" );
				}

				wrapper

				.delegate( "button[name=save]", "click", save )

				.delegate( "button[name=cancel]", "click", cancel )
				
				.delegate( "button[name=clear]", "click", function() {
					
					input.val( "" ).focus();
				} )
				
				.delegate( "textarea", "keyUp", function( e ) {
					
					if ( e.keyCode === 13 && e.ctrlKey ) {
						save();
					} else if ( e.keyCode === "ESC" ) {
						cancel();
					} else if ( e.keyCode === "TAB" && e.shiftKey ) {
						e.preventDefault();
						args.grid.navigatePrev();
					} else if ( e.keyCode === "TAB" ) {
						e.preventDefault();
						args.grid.navigateNext();
					}

					max && max.html( input.val().length );
				} );

				this.position( args.position );
			},

			destroy: function() {
				wrapper.remove();
			},

			position: function( position ) {
			
				wrapper.css( {
					"top": position.top - 5,
					"left": position.left - 5
				} );
			},

			serializeValue: function() {
				return input.val();
			},

			loadValue: function( item ) {
			
				setTimeout( function() {
					input
					.val( defaultValue = item[ args.column.field ] )
					.focus().select();
				} );
			},

			applyValue: function( item, state ) {
				item[ args.column.field ] = state;
			},

			focus: function() {
				input.focus();
			},

			isValueChanged: function() {
			
				return input.val() != defaultValue;
			},

			validate: function() {
				
				return { valid: true };
			},

			show: function() {
				wrapper.show();
			},

			hide: function() {
				wrapper.hide();
			}
		} );

		this.init();
	};

	return TextareaEditor;
} );
