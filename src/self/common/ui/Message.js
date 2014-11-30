
define( [ "ui/Amodal" ], function() {
	
	var show = function( options ) {
	
		var defaults = {
		
			showButtons: false,
			showHead: false,
			showOverlay: true,
			showProgress: false,
			fadeIn: false
		};

		setTimeout( function() {
			
			$.amodal( $.extend( true, {}, defaults, options ) );
		}, 277 );
	};

	$.message = {
	
		bubble: function( message, delay ) {
		
			var options = {

				width: 200,

				showOverlay: false,
			
				render: function( ready, loading, close ) {
				
					this.css( "padding", 0 )
					
					.html( "<div class='amodal-bubble'> <p class='su-message-bubble'>" + message + "</p> </div>" )
					
					.parent().css( { "background": "none", "overflow": "visible" } );

					loading.start( function() {

						var self = this.css( {
							
							height: 0,
							top: -40,
						} );

						/** Hack the opacity */
						setTimeout( function() {
							
							self.css( "opacity", 1 );
						} );
					} );

					if ( delay = +delay, delay > 100 ) {
						
						setTimeout( close, delay );
					}

					ready.resolve();
				}
			};

			show( options );
		},

		message: function( type, title, message, delay ) {
		
			var options = {
			
				render: function( ready, loading, close ) {
				
					var template = [ "<div class='amodal-msg' data-type='", type || "info", "'>", 
					
								"<p class='amodal-msg-title'>", title || type, "</p>",
								"<div class='amodal-msg-content'>", message || "", "</div>",

							"</div>" ];

					this.css( "padding", 0 ).html( template.join( "" ) ).parent().css( "background", "none" );

					if ( delay = +delay, delay > 100 ) {
						
						setTimeout( close, delay );
					}
					ready.resolve();
				}
			};

			if ( title && (!message || +message) ) {

				+message && (delay = +message);

				message = title;
				title = undefined;
			}

			show( options );
		},

		error: function( title, message, delay ) {
		
			this.message( "error", title, message, delay );
		},

		info: function( title, message, delay ) {

			this.message( "info", title, message, delay );
		},

		warn: function( title, message, delay ) {
		
			this.message( "warn", title, message, delay );
		},

		success: function( title, message, delay ) {

			this.message( "success", title, message, delay );
		}
	};
} );

