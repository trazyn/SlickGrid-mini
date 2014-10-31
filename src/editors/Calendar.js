
define( [ "self/common/ui/Calendar" ], function() {

	var CalendarEditor = function( args ) {
	
		var
		  input,
		  trigger,
		  defaultValue;

		$.extend( this, {
			
			init: function() {

				input = $( "<INPUT type=text disabled='disabled' class='editor-text dialog' /><small class='calendar-trigger' />" )
					.appendTo( args.container ).first().focus();

				trigger = input.next();

				this.loadValue( args.item );

				$( args.container ).calendar( $.extend( {}, args.column.editorArgs, {
					callback: function( value ) {
						args.commitChanges();
					}
				} ), true );
			},

			destroy: function() {
				input.add( trigger ).remove();
			},

			loadValue: function( item ) {
				input.val( defaultValue = item[ args.column.field ] ).focus();
			},

			serializeValue: function() {
				return input.val();
			},

			applyValue: function( item, state ) {
				item[ args.column.field ] = state;
			},

			isValueChanged: function() {
				/** Fuzzy match */
				return defaultValue != input.val();
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

	return CalendarEditor;
} );
