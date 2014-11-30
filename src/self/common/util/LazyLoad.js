
define( [ "ui/Loading" ], function() {

	"use strict";

	var defaults = {
	
		trigger: window,

		/** AjaxOptions / Function */
		dataSource: undefined
	}
	
	/** Private process flag, Singleton mode */
	, processing

	, loading = $( "<div class=su-lazyLoad-loading></div>" ).loading()

	, loader = function( e ) {
	
		var settings = e.data
		
		, trigger = settings.trigger, content = settings.content

		/** Prevent multiple reflow */
		, doLoad = !processing && trigger.scrollTop() >= $( document ).height() - trigger.height();

		if ( doLoad ) {
		
			var dataSource = settings.dataSource
			
			/** Asynchronous support */
			, deferred;

			loading.$node.css( {
				
				"top": $( document ).height()
			} ).appendTo( document.body );

			loading.start();

			processing = true;

			/** Fetch data */
			switch ( true ) {

				/** Handle raw data */
				case dataSource instanceof Array:
					break;
				
				case dataSource instanceof Function:

					dataSource = dataSource( deferred = $.Deferred() );
					break;

				/** Ajax */
				case "string" === typeof dataSource:
					dataSource = { data: { params: { name: dataSource } } };

				case "object" === typeof dataSource:
					dataSource = $.extend( true, {}, dataSource );
					deferred = $.ajax( dataSource );
			}

			/** Hold request */
			$.when( deferred ).done( function( data ) {
			
				if ( deferred ) {
					
					data = data || deferred.data || dataSource;
				}

				loading.done( function() {
				
					loading.$node.remove();

					processing = false;
					$( content ).append( settings.render( data ) );
				} );
			} );

			e.stopPropagation();
		}
	};

	$.fn.lazyLoad = function( options ) {
		
		var settings = $.extend( true, {}, defaults, options || {} );

		return this.each( function() {

			var self = $( this );

			settings.content = self;
			settings.trigger = $( settings.trigger );
			
			settings.trigger

			/** Keep one instance */
			.off( "scroll", loader )
			.on( "scroll", settings, loader )
			.trigger( "scroll" );
		} );
	};
} );
