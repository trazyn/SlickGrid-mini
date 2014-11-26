
$( document ).on( "mousewheel", function( e ) {
    
    var 
    header = $( "#head_div" ),
    content = $( "[id^=wpflib_builders_HWScmMainPane]:first" );

    /** Down */
    if ( e.originalEvent.wheelDelta < 0 ) {
        content.scrollTop() >= 100 && header.fadeOut();
    } else {
        header.is( ":visible" ) || header.fadeIn( "fast" );
    }
} )
