
define( [ "self/common/ui/Progress" ], function() {

	var options = {
	
		selector4bar: ".progress-inner",
		selector4icon: ".circle",
	
		class4success: "progress-success",
		class4error: "progress-error",

		template: false,
		render: function( status ) {
			
			this.css( {
				
				"opacity": "0.7",
				"width": (100 - status) + "%"
			} );
		},

		seed: 0.5,
		max: 0.9
	}

	, identifier = "$ProgressButton"
	
	, ProgressButton = function( target, callback ) {
		
		var self = this
		, progress = target.progress( options );

		target.on( "click", function() {
			
			if ( "function" === typeof callback && callback.call( self, $( this ) ) ) {
				progress.start();
				target.attr( "disabled", true );
			}
		}  );

		self.$node = target;

		self.done = function( success ) {
			
			var clazz = success ? options.class4success : options.class4error;

			clazz = clazz || options.class4success;

			progress.done();
			target.attr( "disabled", false ).addClass( clazz );

			setTimeout( function() {
				
				target.removeClass( clazz );
			}, 1777 );
		};

		self.start = function() {
			target.attr( "disabled", true );
			progress.start();
		};
	};
	
	$.fn.progressButton = function( callback ) {
	
		var self = $( this )
		
		, instance = self.data( identifier );

		if ( instance ) {
			
			return instance;
		}

		instance = new ProgressButton( self, callback );

		self.data( identifier, instance );

		return instance;
	};
} );


