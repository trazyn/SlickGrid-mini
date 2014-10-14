
define( [ "self/common/ui/Calendar" ], function() {

	var CalendarEditor = function( args ) {
	
		var
		  input,
		  trigger,
		  defaultValue;

		$.extend( this, {
			
			init: function() {

				var options, offset;

				input = $( "<INPUT type=text class='editor-text dialog' /><small class='calendar-trigger' />" )
					.appendTo( args.container ).first().focus();

				offset = input.offset();
				options = $.extend( {}, {

					format: "yyyy-MM-dd HH:mm:ss",
					
					callback: function( value ) {
						input.val( value ).focus();
					},

					defaultValue: function() {
						return input.val() ? new Date( input.val() ) : new Date();
					},

					position: {
						top: offset.top + input.height(),
						left : offset.left
					}
				}, args.column.editorArgs || {} );

				trigger = input.next().calendar( options );
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
