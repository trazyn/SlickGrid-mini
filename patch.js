    function appendCellHtml(stringArray, row, cell, colspan, item) {
      var m = columns[cell];
      var value = item ? getDataItemValueForColumn( item, m ) : "";
      var cellCss = "slick-cell l" + cell + " r" + Math.min(columns.length - 1, cell + colspan - 1) +
          (m.cssClass ? " " + m.cssClass : "") +(m.enableCopy ? " slick-copy" : "");
      if (row === activeRow && cell === activeCell) {
        cellCss += (" active");
      }

      // TODO:  merge them together in the setter
      for (var key in cellCssClasses) {
        if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
          cellCss += (" " + cellCssClasses[key][row][m.id]);
        }
      }

      stringArray.push("<div " + (m.showTitle && value ? "title='" + value + "'": "") 
                          + " class='" + cellCss + "'>" + (m.enableCopy ? "<div class='slick-copy-outer'>" : ""));

      // if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
      if (item) {
        stringArray.push(getFormatter(row, m)(row, cell, value, m, item));
        m.enableCopy && stringArray.push("<div class='slick-copy-inner'></div>");
      }

      stringArray.push("</div>" + (m.enableCopy ? "</div>" : ""));

      rowsCache[row].cellRenderQueue.push(cell);
      rowsCache[row].cellColSpans[cell] = colspan;
    }



    function setupColumnReorder() {

      $headers.find( "div.slick-header-column" ).each( function() {

        var $this = $( this ), current
              
        , mouseenter = function( e ) {
          current && current.removeClass( "slick-column-reorder" );
          current = $( this ).addClass( "slick-column-reorder" );
        };

        $this

        .drag( "start", function( e, dd ) {
          current = null;

          $headers.find( "> .slick-header-column" ).on( "mouseenter", mouseenter );

          dd.proxy = $this.clone()
          .css( {
            "pointer-events": "none",
            "position": "absolute",
            "background": "#86DFAB",
            "opacity": 0.5,
            "z-index": 999,
            "cursor": "move",
            "left": dd.offsetX,
            "top": dd.offsetY
          } )
          .appendTo( document.body );

          return dd.proxy;
        } )
        
        .drag( function( e, dd ) { 
          $( dd.proxy ).css( { "left": dd.offsetX } );
        } )
        
        .drag( "end", function( e, dd ) {

          $headers.find( "> .slick-header-column" ).off( "mouseenter", mouseenter );

          $( dd.proxy ).remove();

          if ( !current 
                  || current.removeClass( ".slick-column-reorder" )[ 0 ] === dd.drag ) { 
                          return; 
                  }

          var 
            targetIndex = +current.attr( "data-column-index" ),
            dragIndex = +dd.drag.getAttribute( "data-column-index" ),
            swap,
            hash = [ {
              id: columns[ dragIndex ][ "id" ],
              index: dragIndex
            }, {
              id: columns[ targetIndex ][ "id" ],
              index: targetIndex
            } ];

          swap = columns[ targetIndex ];
          columns[ targetIndex ] = columns[ dragIndex ];
          columns[ dragIndex ] = swap;

          setColumns( columns );
          trigger( self.onColumnsReordered, { hash: hash } );
        } );
      } );
    }
