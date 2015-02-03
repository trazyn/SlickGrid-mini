
define( [ "ui/Countdown" ], function() {

	return function( container ) {
	
		var
		logo = container.find( "#logo" ),
		intro = container.find( "#intro" ),
		avatars = container.find( "#avatars" ),
		pages = container.find( "> li.page" );
		
		container

		.delegate( "a[data-palette]", "mouseover", function() {

			pages.first().addClass( this.getAttribute( "data-palette" ) );
		} )
		.delegate( "a[data-palette]", "mouseout", function() {
			
			pages.first().removeClass( this.getAttribute( "data-palette" ) );
		} )
		
		.delegate( "#next", "click", function( e ) {
			
			var
			page = pages.filter( ".show" ),
			next = page.next();

			page
			.css( {
				"transition": "all .5s linear",
				"opacity": 1,
				"visibility": "visible"
			} );

			page
			.css( {
				"opacity": 0,
				"visibility": "hidden",
				"-webkit-transform": "translateY(-100%)"
			} );

			setTimeout( function() {
				
				page
				.removeClass( "show" )
				.css( {
					"-webkit-transform": "",
					"opacity": 1,
					"visibility": "visible"
				} );

				next.fadeIn( function() {
					next.css( "display", "" ).addClass( "show" );
				} );
			}, 500 );
		} )
		
		.delegate( "#prev", "click", function( e ) {
			
			var 
			page = pages.filter( ".show" ),
			prev = page.prev();

			page
			.css( {
				"transition": "all .5s linear",
				"opacity": 1,
				"visibility": "visible"
			} );

			page
			.css( {
				"opacity": 0,
				"visibility": "hidden",
				"-webkit-transform": "translateY(100%)"
			} );

			intro.addClass( "out" );

			setTimeout( function() {
				
				page
				.removeClass( "show" )
				.css( {
					"-webkit-transform": "",
					"opacity": 1,
					"visibility": "visible"
				} );

				prev.addClass( "show" );

				setTimeout( function() {
					intro.removeClass( "out" );
				}, 450 );
			}, 500 );
		} )
		
		.delegate( "button[name=demo]", "click", function( e ) {
			location.hash = "wiki";

			e.stopPropagation();
			e.preventDefault();
		} );

		logo.removeClass( "out" );

		setTimeout( function() { logo.addClass( "down" ); }, 450 );
		setTimeout( function() { intro.removeClass( "out" ); }, 750 );

		[ "1774898", "1734148", "117185", "5271843", "649249", "1284428", "737374", "665142", "1724426" ]

			.forEach( function( value ) {
			
				avatars.append( "<a class='tooltip top' data-tooltip='Hello~'><img src='https://avatars3.githubusercontent.com/u/" + value + "' class='avatar transition fade out' onload='this.classList.remove(\"out\")'>" );
			} );

		setTimeout( function() {
			
			avatars.addClass( "down" );
		}, 300 );

		container.find( "#clock" ).countdown( { date: "2015/02/18" } );
	};
} );
