
define( [ "slick/paging/Paging",
	"slick/plugins/Radiocolumn",
	"self/common/ui/Dialog" ], function( Paging, Radiocolumn ) {

	var DialogEditor = function( args ) {
	
		var
		  input,
		  trigger,
		  defaultValue;

		$.extend( this, {
			
			init: function() {

				input = $( "<INPUT type=text class='editor-text dialog' /><small class='dialog-trigger' />" )
					.appendTo( args.container ).first().focus();

				trigger = input.next();

				$( args.container ).dialog( $.extend( {}, args.column.editorArgs, {
					
					onOk: function( item ) {
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

	return DialogEditor;
} );
