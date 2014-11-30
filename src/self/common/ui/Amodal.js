
define( [ "self/common/ui/Loading", "self/common/ui/Progress" ], function() {

	var defaults = {
		
		title: "Amodal.JS",

		css: {}, 
		attr: {},

		showHead: true,
		showButtons: true,
		showOverlay: true,
		showProgress: true,

		fadeIn: true,

		showOk: true,
		okText: "Ok",
		
		showClose: true,
		closeText: "Cancel",

		closeByESC: true,
		closeByDocument: true,

		extBtns: [],

		animate: "slide-bottom",
		render: "<p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don't forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click on the button below to close the modal.</li> </ul>",

		success: undefined,
		error: undefined,

		unload: undefined,

		onOk: function( container ) {
			
		},
		onClose: function( container ) {
		
		}
	}
	
	, template = [ "<div class=amodal>",
		
				"<div style='height: 100%;'>",
					"<h3 class=amodal-title></h3><div class=amodal-close></div>",

					"<div class='loading'>",
					"<span class='love love1'></span>",
					"<span class='love love2'></span>",
					"<span class='love love3'></span>",
					"<span class='love love4'></span>",
					"<span class='love love5'></span>",
					"</div>",

					"<div class='progress'></div>",

					"<div class='amodal-content'></div>",
					"<div class=amodal-bar><button class=amodal-ok>Ok</button><button class=amodal-cancel>Cancel</button></div>",
				"</div>",
				
			"</div>",
			"<div class=amodal-overlay></div>" ].join( "" );

	/** Just one instance */
	$.fn.amodal = function( options ) {
		
		var amodal = $( template )
		
		, close = function() {
		
			$( document ).off( "keyup", closeByESC ).off( "click", closeByDocument );

			options.unload instanceof Function && options.unload();

			amodal.removeClass( "amodal-show" ).removeClass( "amodal-overlay-show" );

			setTimeout( function() { amodal.remove(); }, 277 );
		}
	
		, closeByESC = function( e ) {
			
			27 === e.keyCode && close();
		}
		
		, closeByDocument = function( e ) {
			
			$( e.target ).is( ".amodal-overlay" ) && close();
		}
		
		, loading = amodal.find( ".loading" ).loading( {
			
			before: function() {
				
				this.css( "z-index", 10000 );
			}, 
			after: function() {
				
				this.css( "z-index", -999 );
			}
		} )
		, progress = amodal.find( "div.progress:first" ).progress( {

			seed: 0.7,
			
			render: function( status, icon ) {
				
				this.css( {
					"-webkit-transform": "translate3d(-" + status + "%,0px,0px)",
					"transition": "all 200ms ease",
					"-webkit-transition": "all 200ms ease"
				} );

				icon.css( {
					
					"top": 45,
					"right": 26
				} );
			}
		} )

		, _deferred = $.Deferred().always( function() { 

			/** After fadein */
			setTimeout( function() { progress.done(); }, 277 );
		} )

		, show = function() {

			var 
			  head = amodal.find( ".amodal-title" ),
			  body = amodal.find( ".amodal-content" ),
			  foot = amodal.find( ".amodal-bar" ),
			  overlay = amodal.last();

			/** ~Head~ */
			options.showHead ? head.html( options.title ) : head.hide().next().hide();

			/** ~Body~ */
			if ( options.render instanceof Function ) {

				options.render.call( body, _deferred, loading, close );
			} else {

				body.html( options.render );
				_deferred.resolve();
			}

			/** ~Foot~ */
			if ( options.showButtons ) {
			
				foot.css( "display", "block" );

				options.showOk ?
					amodal.find( ".amodal-bar .amodal-ok" ).html( options.okText ) :
					amodal.find( ".amodal-bar .amodal-ok" ).hide();

				options.showClose ?
					amodal.find( ".amodal-bar .amodal-cancel" ).html( options.closeText ) :
					amodal.find( ".amodal-bar .amodal-cancel" ).hide();

				if ( options.extBtns.length ) {
					
					/** TODO: */
				}

				/** Register events */
				amodal
					.delegate( ".amodal-bar button.amodal-ok", "click", function( e ) {
						
						options.onOk instanceof Function && options.onOk.call( this, e, body );

						close();
					} )
					.delegate( ".amodal-bar button.amodal-close", "click", function( e ) {
						
						"function" === typeof options.onClose && options.onClose.call( this, e, body );

						close();
					} );
			}

			amodal.delegate( ".amodal-close", "click", close );

			/** Set animate */
			amodal.addClass( options.animate );
			
			/** Show the overlay */
			overlay.addClass( options.showOverlay ? "amodal-overlay-show" : "amodal-overlay-show-blank" );

			/** Show progress */
			true === options.showProgress && progress.start();

			/** Content fade in */
			true === options.fadeIn && body.addClass( "fade out" );

			/** Do something for init */
			_deferred

			.done( function() {
				
				"function" === typeof options.success && options.success.call( body, loading, close );
			} )
			.fail( function() {
				
				"function" === typeof options.error && options.error.call( body, loading, close );
			} )
			.always( function() { 

				true === options.fadeIn && body.removeClass( "out" ); 
				true === options.showProgress && setTimeout( function() { progress.done(); }, 277 );
			} );
			
			/** Close the modal */
			if ( options.closeByESC || options.closeByDocument ) {

				var trigger = $( document ).add( amodal );
				
				true === options.closeByDocument && amodal.off( "click", closeByDocument ).on( "click", closeByDocument );

				if ( "boolean" === typeof options.closeByESC ) {
				
					trigger.off( "keyup", closeByESC ).on( "keyup", closeByESC );
				}
			}

			amodal.first().css( options.css ).attr( options.attr );

			amodal.appendTo( document.body );

			setTimeout( function() {
				
				amodal.first().addClass( "amodal-show" );
			}, 77 );
		};

		options = $.extend( {}, defaults, options || {} );

		if ( this === $ ) {
			options.target ? $( options.target ).on( "click", show ) : show();
		/** Use a dom as trigger */
		} else this.on( "click", show );
	};

	/** Export to $ */
	$.amodal = $.fn.amodal;
} );

