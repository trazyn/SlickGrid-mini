
(function( exports ) {
	
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
	};

	DateUtil.defaults = {
		formatter: "yyyy-MM-dd"
	};

	DateUtil.prototype = {
		format: function( formatter ) {

			var date = this.value;

			return (formatter || DateUtil.defaults.formatter)
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
			return new Date( +this.value + value * 3600 * 1000 * 24 );
		},

		name: function( name, formatter ) {

			var 
			date = this.value,
			mapping = {
				"monday":       1,
				"tuesday":      2,
				"wednesday":    3,
				"thursday":     4,
				"friday":       5,
				"saturday":     6,
				"sunday":       7
			};

			return this.format.apply( { value: this.day( -(date.getDay() - mapping[ name ]) ) }, formatter );
		},

		monday: function( formatter ) {
			return this.name( "monday", formatter );
		},


		tuesday: function( formatter ) {
			return this.name( "tuesday", formatter );
		},

		wednesday: function( formatter ) {
			return this.name( "wednesday", formatter );
		},

		thursday: function( formatter ) {
			return this.name( "thursday", formatter );
		},

		friday: function( formatter ) {
			return this.name( "friday", formatter );
		},

		saturday: function( formatter ) {
			return this.name( "saturday", formatter );
		},

		sunday: function( formatter ) {
			return this.name( "sunday", formatter );
		},

		yesterday: function( formatter ) {
			return this.format.apply( { value: this.day( -1 ) }, formatter );
		},

		tomorrow: function( formatter ) {
			return this.format.apply( { value: this.day( 1 ) }, formatter );
		},

		week: function( value ) {
			return this.day( value * 7 );
		},

		lastWeek: function( formatter ) {
			return this.format.apply( { value: this.week( -1 ) }, formatter );
		},

		nextWeek: function( formatter ) {
			return this.format.apply( { value: this.week( 1 ) }, formatter );
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

	exports.DateUtil = DateUtil;
})( window );

