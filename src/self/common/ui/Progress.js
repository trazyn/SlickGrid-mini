
define( [ "self/common/util/Poll" ], function( Poll ) {

	"use strict";

	var defaults = {
		
		seed: 0.05,
		speed: 800,

		max: 0.99123,

		template: "<div class='bar' role='bar'><div class='peg'></div></div><div class='spinner' role='spinner'><div class='spinner-icon'></div></div>",

		selector4bar: ".bar",
		selector4icon: ".spinner"
	}

	, render = function( status, icon ) {
		
		this.css( {
			"-webkit-transform": "translate3d(-" + status + "%,0px,0px)",
			"transition": "all 200ms ease",
			"-webkit-transition": "all 200ms ease"
		} );
	}

	, runner = function( settings ) {
		
		var self = this;

		return Poll.add( {
			
			action: function( deferred ) {
				
				var status = +self.status || 0;

				status += Math.random() * settings.seed;

				status = status > settings.max ? settings.max : status;

				self.set( status );

				deferred.resolve();
			},

		       delay: true,

		       interval: settings.speed
		} );
	}
	
	, Progress = function( target, settings ) {
		
		var self = this;

		this.node = target;

		this.settings = settings;

		if ( settings.template ) {
			this.node.html( settings.template );
		}
	};

	Progress.prototype = {
		
		start: function() {
		
			var settings = this.settings;
				
			this.set( 0 );

			this.runner && Poll.remove( this.runner );

			this.runner = runner.call( this, settings );

			/** Fadein */
			this.node.find( settings.selector4bar + "," + settings.selector4icon ).css( {
				
				"opacity": 1,
				"visibility": "visible",
				"display": ""
			} );

			Poll.start( this.runner );

			return this;
		},

		set: function( status ) {
			
			var settings = this.settings
				
			, node = this.node;

			+status > 1 && this.done();

			this.status = status;

			this.settings.render.call( node.find( settings.selector4bar ), (1 - status) * 100, node.find( settings.selector4icon ) );

			return this;
		},

		done: function() {
			
			var self = this, settings = this.settings;

			self.set( 1 );

			setTimeout( function() {
				
				self.node.find( settings.selector4bar + "," + settings.selector4icon ).css( {
					
					"opacity": 0,
					"visibility": "hidden"
				} );

				self.node.find( settings.selector4icon ).css( "display", "none" );

				self.set( 0 );
			/** After '-webkit-transform' */
			}, 277 );

			Poll.remove( self.runner );

			return this;

		}
	};

	$.fn.progress = function( options ) {
		
		var instance = this.data( "progress" );

		if ( !instance ) {
			
			options = $.extend( {}, defaults, options || {} );

			"function" !== typeof options.render && (options.render = render);

			options.max = options.max > 1 ? 0.99123 : options.max;

			instance = new Progress( this, options );

			this.data( "progress", instance );
		}
		
		return instance;
	};
} );

