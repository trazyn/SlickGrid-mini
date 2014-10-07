
define( function() {
	
	var SelectEditor = function( args ) {
		
		var
		  select,
		  options,
		  defaultValue;

		$.extend( this, {
			
			init: function() {
				
				var wrapper = $( "<LABEL class='custom-select'>" +
						"<SELECT></SELECT>"+
						"</LABEL>" );

				if ( !options ) {

					var items = (args.column.editorArgs || {}).items;
				
					options = "";

					for ( var i = 0, length = items.length; i < length; ++i ) {
						
						var item = items[ i ];

						options += "<option value='" + item.value + "'>" + (item.label || item.value) + "</option>";
					}
				}

				select = wrapper.children().html( options );
				wrapper.appendTo( args.container );
				select.focus();
			},

			destroy: function() {
				
				select.remove();
			},

			focus: function() {
				select.focus();
			},

			getValue: function() {
				return select.val();
			},

			setValue: function( value ) {
				select.val( value );
			},

			loadValue: function( item ) {
				
				defaultValue = item[ args.column.field ] || "";
				select.val( defaultValue );
			},

			serializeValue: function() {
				return select.val();
			},

			applyValue: function( item, state ) {
				
				item[ args.column.field ] = state;
			},

			isValueChanged: function() {
			
				return select.val() != defaultValue;
			},

			validate: function( item, column ) {
			
				if ( args.column.validator ) {
					
					return args.column.validator( select.val(), item, column );
				}

				return {
					
					valid: true,
					msg: ""
				};
			}
		} );

		this.init();
	};

	return SelectEditor;
} );
