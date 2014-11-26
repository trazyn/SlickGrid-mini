
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
} );

var DateUtil = function( value ) {

    switch( true ) {
        
        case value instanceof Date:
            break;

        case typeof value === "number":
            value = new Date( value );
            break;

        case typeof value === "string":
            value = new Date( value );
            break;

        default:
            value = new Date();
    }

    this.value = defaultValue = isNaN( value ) ? new Date() : value;
    this.defaults = {
        formatter: "yyyy-MM-dd"
    };
};

DateUtil.prototype = {
    format: function( formatter ) {
        
        var data = this.value;

        return (formatter || this.defaults.formatter)
            .replace( /(yyyy|MM|dd|HH|mm|ss)/g, function( match, post, originalText ) {
            
                switch ( match ) {
                    
                    case "yyyy":
                        return date.getFullYear();
                    case "MM":
                        return date.getMonth() + 1;
                    case "dd":
                        return date.getDate();
                    case "HH":
                        return date.getHours();
                    case "mm":
                        return date.getMinutes();
                    case "ss":
                        return date.getSeconds();
                }
            } );
    },

    day: function( value ) {
        return new Date( this.value - new Date( value * 3600 * 1000 * 24 ) );
    },

    yesterday: function( formatter ) {
        return this.format( this.day( -1 ), formatter );
    },

    tomorrow: function( formatter ) {
        return this.format( this.day( 1 ), formatter );
    },

    week: function( value ) {
        return this.day( value * 7 );
    },

    lastWeek: function( formatter ) {
        return this.format( this.week( -1 ), formatter );
    },

    nextWeek: function( formatter ) {
        return this.format( this.week( 1 ), formatter );
    },

    month: function( value ) {

        var 
        date = this.value,
        current = [ date.getFullYear(), date.getMonth() ],
        offset = [ Math.floor( value / 12 ), value % 12 ];

        return new Date( current[ 0 ] + offset[ 0 ], current[ 1 ] + offset[ 1 ]
                            , date.getDay()
                            , date.getHours()
                            , date.getMinutes()
                            , date.getSeconds() );
    },

    year: function( value ) {

        var date = this.value;

        return new Date( date.getFullYear() + value
                            , date.getDay()
                            , date.getHours()
                            , date.getMinutes()
                            , date.getSeconds() );
    }
};
