
define( function() {

	var TextEditor = function( args ) {

		var 
		  input,
		  defaultValue;

		$.extend( this, {
			
			init: function() {
				input = $( "<INPUT type=text class='editor-text' />" )
					.appendTo( args.container )
					.on( "keydown.nav", function( e ) {
						
						if ( e.keyCode === 37 || 39 === e.keyCode ) {
							
							e.stopImmediatePropagation();
						}
					} )
					.focus()
					.on( "change", function() {
						args.commitChanges();
					} );
			},

			destroy: function() {
				input.remove();
			},

			focus: function() {
				input.focus();
			},

			getValue: function() {
				
				return input.val();
			},

			setValue: function( value ) {
				input.val( value );
			},

			loadValue: function( item ) {
				
				defaultValue = item[ args.column.field ] || "";
				input.val( defaultValue );
				input.select();
			},

			serializeValue: function() {
				return input.val();
			},

			applyValue: function( item, state ) {
			
				item[ args.column.field ] = state;
			},

			isValueChanged: function() {
				return input.val() != defaultValue;
			},

			validate: function( item, column ) {
			
				if ( args.column.validator ) {
					
					return args.column.validator( input.val(), item, column );
				}

				return {
					
					valid: true,
					msg: ""
				};
			}
		} );

		this.init();
	};

	return TextEditor;
} );
