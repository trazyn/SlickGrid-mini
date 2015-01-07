
define( [ "ui/Loading", "ui/Progress" ], function() {

	$.fn.amodal = function( options ) {
		
		var 
		amodal = $( template ),
		
		close = function() {
		
			$( document ).off( "keyup", closeByESC ).off( "click", closeByDocument );

			options.unload instanceof Function && options.unload();

			amodal.removeClass( "show" );

			setTimeout( function() { amodal.remove(); }, 300 );
		},
	
		closeByESC = function( e ) {
			
			27 === e.keyCode && close();
		},
		
		closeByDocument = function( e ) {
			
			$( e.target ).hasClass( "overlay" ) && close();
		},
		
		loading = amodal.find( ".ui.loading:first" ).loading( {
			
			before: function() {
				
				this.css( "z-index", 10000 );
			}, 
			after: function() {
				
				this.css( "z-index", -999 );
			}
		} ),

		progress = amodal.find( ".ui.progress:first" ).progress( {

			seed: 0.7,
			
			render: function( status, icon ) {
				
				this.css( {
					"-webkit-transform": "translate3d(-" + status + "%,0px,0px)",
					"transition": "all 200ms ease",
					"-webkit-transition": "all 200ms ease"
				} );

				icon.css( {
					
					"top": 54,
					"right": 14
				} );
			}
		} ),

		deferred = $.Deferred(),

		show = function() {

			var 
			  head = amodal.find( ".title" ),
			  body = amodal.find( ".content" ),
			  overlay = amodal.last();

			/** ~Head~ */
			options.showHead ? head.html( options.title ) : head.hide().next().hide();

			/** ~Body~ */
			if ( options.render instanceof Function ) {

				options.render.call( body, deferred, loading, close );
			} else {

				body.html( options.render );
				deferred.resolve();
			}

			amodal.delegate( ".close", "click", close );

			/** Set animate */
			amodal.addClass( options.animate );
			
			/** Show the overlay */
			overlay.addClass( options.showOverlay ? "show" : "blank" );

			/** Show progress */
			true === options.showProgress && progress.start();

			/** Content fade in */
			true === options.fadeIn && body.addClass( "fade out" );

			/** Do something for init */
			deferred

			.done( function() {
				typeof options.success === "function" && options.success.call( body, loading, close );
			} )
			.fail( function() {
				typeof options.error === "function" && options.error.call( body, loading, close );
			} )
			.always( function() { 

				true === options.fadeIn && setTimeout( function() { body.removeClass( "out" ); } );
				true === options.showProgress && setTimeout( function() { progress.done(); }, 300 );
			} );
			
			/** Close the modal */
			if ( options.closeByESC || options.closeByDocument ) {

				var trigger = $( document ).add( amodal );
				
				true === options.closeByDocument 
					&& amodal.off( "click", closeByDocument ).on( "click", closeByDocument );

				if ( "boolean" === typeof options.closeByESC ) {
				
					trigger.off( "keyup", closeByESC ).on( "keyup", closeByESC );
				}
			}

			amodal.first().css( options.css ).attr( options.attr );

			amodal.appendTo( document.body );

			setTimeout( function() {
				
				amodal.first().addClass( "show" );
			}, 77 );
		};

		options = $.extend( {}, $.fn.amodal.defaults, options || {} );

		if ( this === $ ) {
			options.target ? $( options.target ).on( "click", show ) : show();
		/** Use a dom as trigger */
		} else this.on( "click", show );
	};

	var 

	noop = function() {},

	template = [ "<div class='ui amodal animate'>",
		
				"<div style='height: 100%;'>",
					"<h3 class='title'></h3><div class='icon close transition rotate'></div>",

					"<div class='ui loading'></div>",

					"<div class='ui progress'></div>",

					"<div class='content'></div>",
				"</div>",
				
			"</div>",
			"<div class='ui overlay'></div>" ].join( "" );

	$.fn.amodal.defaults = {
	
		title 		: "Amodal.JS",

		css 		: {}, 
		attr 		: {},

		showHead 	: true,
		showOverlay 	: true,
		showProgress 	: true,

		fadeIn 		: true,

		closeByESC 	: true,
		closeByDocument : true,

		animate 	: "slide",
		render 		: "<p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don't forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click the outside close the modal.</li> </ul>",

		success 	: noop,
		error 		: noop,
		unload 		: noop,
	};

	/** Export to $ */
	$.amodal = $.fn.amodal;
} );

