### Constructor
`new Slick.Grid( container, data, columns, options )`

> `container` - 容器节点, DOM元素或者 jQuery 元素, 或选择器
> `data` - 常规数组, 或 Slick.Data.DataView 实例, 或实现getItem(index) 和 getLength() 的对象
> `columns` - 定义列的数组对象, 详细参数见 [Column Options](#columnOptions "Column Options")
> `options` - 附加的参数, 见 [Grid Options](#gridOptions "Grid Options")

### Core

`grid.init()`
初始化表格, 设置`explicitInitialization`后会自动调用该方法, 大部分情况是初始化前需要加载一些Plugin, 所以`explicitInitialization` 默认是 false 的, 因此你需要显性的调用该方法初始化表格

`grid.getData()`
返回`Constructor`输入的`data`

`grid.setData( newDate, scrollTop )`
> `newData` - 新的数据模型, 见上文
> `scrollTop` - 参数 true 时, 重置Grid 视口位置(重置滚动条位置)
该方法不会导致 Grid 的重新渲染, 你需要调用 render 去重新渲染

`grid.getDataLength()`
返回当前视口数据数量

`grid.getOptions()`
返回当前 Grid 的 Options 

`grid.setOptions( args )`
> `args` - JSON 对象, extend 到当前 Options
会重新渲染Grid

`grid.setSelectionModel( selectionModel )`
> `selectionModel` - 选择模式
单元格的选中或行的选中, 目前的行选择以在 Plugin 部分实现, 见 [CheckboxColumn](#checkboxColumn)

`grid.getSelectionModel()`
获取当前的选择模式

### Columns
`grid.getColumns()`
返回当前 Grid 的所有列配置

`grid.setColumns( columnsDefinitions )`
> `columnsDefinitions` - 数组, 包含列配置的数组

`grid.getColumnIndex( id )`
> `id` - 列的 ID
返回对应列在 Columns 定义中的索引

`grid.updateColumnHeader( columnId, title, tooltip )`
> `columnId` - 列的 ID
> `title` - 新的列显示名称
> `tooltip` - 新的提示信息
更新以存在的列的列头DOM

`grid.autosizeColumns()`
强制对齐所有列, 去除水平滚动条, 等效 `forceFitForce`

### Cells
`grid.addCellCssStyles( key, hash )`
> `key` - 唯一, 通过该值添加删除附加样式
> `hash` - 附加的样式可能是针对指定的单元格, 所以该值为 Hash 串, 结构如下
	{
	  rownum: {
	    "columnId": "className",
	    "columnId": "className className"
	  }
	}
通过 key 值应用 hash 串中对应样式到对应单元格, 可以同时存在多个, 比如现有的行选中以及删除行的样式等都是通过该方法去控制样式

`grid.getCellCssStyles( key )`
返回对应 hash 值

`grid.removeCellCssStyles( key )`
移除 key 值对应的附加样式

`grid.canCellBeActive( row, col )`
> `row` - 行的序号
> `col` - 列的序号
判断指定单元格是否可激活(单元格选中后会增加 active 样式)

`grid.canCellBeSelected( row, col )`
> `row` - 行的序号
> `col` - 列的序号
指定单元格存在`selectedCellCssClass`时返回 true, 单元格在存在于当前 Grid 以及列的定义中未配置`unselectable`时可被选中

`grid.flashCell( row, cell, speed )`
> `row` - 行号
> `cell` - 单元格的序号
> `speed` - 可选, flash 样式的延时时间值, 单位毫秒, 默认100
指定的单元格闪烁

`grid.getActiveCell()`
获取当前 Grid 中 active 的单元格, 返回值为 hash 串, 结构如下:
	{
	  row: 0,
	  cell: 0
	}

`grid.setActiveCell( row, cell )`
> `row` - 行号
> `cell` - 单元格序号
设置指定单元格 active

`grid.resetActiveCell()`
重置 active 的单元格

`grid.getActiveCellNode()`
获取处于激活状态单元格的 DOM 节点

`grid.getActiveCellPosition()`
	{ 
	  bottom:  [numPixels],
	  height:  [numPixels],
	  left:    [numPixels], 
	  right:   [numPixels], 
	  top:     [numPixels], 
	  visible: [boolean], 
	  width:   [numPixels] 
	}

`grid.getCellFromEvent( e )`
> `e` - event 对象
返回包含row和cell 值的 hash 对象

`grid.getCellNode( row, cell )`
> `row` - 行号
> cell - 列的序号
返回指定单元格的 DOM 节点

### Rendering
`grid.invalidate()`
抛弃所有的缓存, 重新渲染 Grid

`grid.invalidateAllRows()`
清除所有缓存, 但是不会重新渲染表格

`grid.invalidateRow( row )`
> `row` - 行号
清除指定行的缓存, 然后调用 `render` 将重新渲染 invalid 的行

`grid.invalidateRows( rows )`
> `rows` - 包含行号的数组
同上, 清除多行的缓存

`grid.render()`
重新生成行的 DOM

`grid.resizeCanvas()`
Resize Grid 的大小, 比如在初始化一个不可见的 Grid 后, 在切换到可见时你需要调用该方法重新渲染表格

`grid.scrollCellIntoView( row, cell )`
> `row` - 行号
> `cell` - 单元格序号
滚动视口到指定单元格

`grid.scrollRowToTop( row )`
> `row` - 行号
滚动到指定行

### Header
`grid.getSortColumns()`
获取当前的排序列
	{ 
	  columnId: [string],
	  sortAsc:  [boolean]
	}

`grid.setHeaderRowVisibility( visible )`
> `visible` - true/false
在`enableHeaderRow`为 true 时有效, 主要用于过滤的行

`grid.toggleHeaderRow()`
隐藏或显示头行

### Checkbox
引入`self/plugins/Checkboxcolumn` 模块

	require( [ "self/plugins/Checkboxcolumn"
				...
			], function( Checkboxcolumn, ... ) {
		
		var columns, grid;
		...
		grid.setColumns( (columns.unshift( Checkboxcolumn( grid ) ), columns) );
		...
	} );

`Checkboxcolumn( grid, [options] )`

**Options**
> `columnId` - `_checkbox_selector`
见 [Column Options](#) 部分

> `tooltip` - `Select/Deselect All`
见 [Column Options](#) 部分

> `cssClass` - `slick-cell-checkbox`
见 [Column Options](#) 部分

> `frozen` - `true`
是否冻结

> `width` - `35`
见 [Column Options](#) 部分

**Method**
`grid.setSelectedRows( [rows] )`
> `rows` - 包含行号的数组
设置指定行为选中行, 参数空时清除所有选中行

`grid.getSelectedRows()`
返回选中行的行号

`grid.getSelectedRowsData()`
返回选中行的完整数据

### Radiocolumn
引入`self/plugins/Radiocolumn` 模块

	require( [ "self/plugins/Radiocolumn"
				...
			], function( Radiocolumn, ... ) {
		
		var columns, grid;
		...
		grid.setColumns( (columns.unshift( Radiocolumn( grid ) ), columns) );
		...
	} );

**Options**
> `columnId` - `_radio_selector`
见 [Column Options](#) 部分

> `cssClass` - `slick-cell-radio`
见 [Column Options](#) 部分

> `frozen` - `true`
是否冻结

> `width` - `35`
见 [Column Options](#) 部分

> `key` - `radio-select`
选中样式对应的 key 值

> `cssCellClass` - `slick-radio-radio`
单行选中时的附加样式

> `autoSelected` - `false`
是否默认选中第一行

> `duplicate` - `false`
选中行时是否允许再次产生单选事件

**Method**
`grid.getRadioRow()`
获取当前单选行

`grid.setRadioRow( row )`
> `row` - 行号
设置单选行

### Actionbar
引入`self/plugins/Actionbar` 模块

	require( [ "self/plugins/Actionbar"
				...
			], function( Actionbar, ... ) {
		
		...
	
		Actionbar( grid, {
			save: { enable: true, selector: "button[name=save]" },
			del: { enable: true },
			add: { enbale: true },
			genius: { enable: true },
			lab: { enable: true, options: { key: "i'm unique" } },
			filter: { enable: true, selector: "button[name=filter]" },
			fullscreen: { enable: true }
		} );
		...
	} );

`Actionbar( grid, options )`

所有`action`默认为`false`

**Options**
> `genius` - 是否记忆增删改数据
> `lab` - 表格自定义等附加功能性配置
> `add` - 增加行
> `del` - 删除行
> `save` - 保存记录
> `filter` - 过滤栏隐藏显示
> `fullscreen` - Grid 最大化显示

### Pager
引入`self/plugins/Actionbar` 模块

	require( [ "self/plugins/Paging"
				...
			], function( Paging, ... ) {
		
		Paging( grid, options );
		...
	} );

**Options**
> `container` - `null`
选择器或 DOM 节点, 用于产生分页栏

> `autoSearch` - `false`
Grid 加载后自动查询

> `parmas` - `null`
固化参数, 每次 ajax 服务都会附加的参数

> `fastMode` - `false`
用于本地端和服务器端的数据过滤排序的操作切换, true 为本地端模式

> `pagingInfo`
	{
			pageSize: 50,
			pageNum: 0,
			sizes: [ 50, 100, 200 ]
	}
分页信息

> `ajaxOptions` - WPF 服务参数
	{
			name: 服务名称
			module: 模块名称, 默认值为 kiss
			params: 参数输入
	}

**Method**
`grid.search( params )`
> `params` - Function 或 Object
Grid 查询, 返回 Promise 对象

`grid.commit()`
提交当前变更数据到服务器端, 返回 Promise 对象

### Column Options
`cssClass` - ``
列的附加样式

`editor` - `null`
> `slick/editors/Text` - 文本编辑器
> `slick/editors/Select` - 下拉框编辑器
> `slick/editors/TextArea` - 文本域
> `slick/editors/Calendar` - 日期
> `slick/editors/Dialog` - 弹窗框

	require( [ "slick/editors/Text", "slick/editors/Select" ], function( Text, Dialog ) {
		var coluns = [ {
			id: "column1",
			name: "No.2",
			field: "num2",
			editor: Text,
			filter: true,
			sortable: true,
			width: 200,
			require: true
		}, {
		id: "column2",
			name: "Yes No",
			field: "yesNo",
			editor: Select,
			editorArgs: { items: [ { value: "N", label: "No" }, { value: "Y", label: "Yes" } ] },
			filter: true,
			width: 200,
			sortable: false
		} ];
	
		...
	}
见 [Editor](##)部分

> `field` - ``
字段键值名称

> `focusable` - `true`
设置为 false 时, 该单元格无法被选中, Tab 键导航时也会被忽略

> `formatter` - `null`
单元格格式化, 同`defaultFormatter`优先级大于`defaultFormatter`

> `headerCssClass` - `null`
头行的附加样式

> `id` - 唯一

> `maxWidth` - `null`
列的最大宽度

> `minWidth` - `30`
列的最小宽度, 避免拖动列宽度过小而看不见

> `width` - ``
取值范围大于 minWidth 小于 maxWidth

> `name` - ``
显示名称, 可以是 Html, 所以你可以显示一些奇怪的东西...

> `resizable` - `true`
是否允许拖动改变列宽

> `sortable` - `false`
排序

> `validator` - `null`
		validator: function( value, item, column ) {
			var result = { valid: true };
			if ( !value ) {
				result.valid = false;
			}
			return result;
		}
单元格校验器

> `tooltip` - ``
列头 title

> `showTooltip` - `true`
是否显示列头 title

> `showTitle` - `true`
单元格 title, 内容为其 name

### Grid Options
> `asyncEditorLoading` -  `false`
单元格编辑器通过定时器加载, 有助于快速的键盘导航时性能的提高

> `asyncEditorLoadDelay` - `100`
异步记载延时, 单位毫秒

> `autoEdit` - `false`
为 true 时单击单元格进入编辑状态, 默认双击

> `autoHeight` - false
表格高度根据行数据自动撑高, [示例](#)

> `cellFlashingCssClass` - `flashing`
单元格闪烁样式, 通过`falshCell()` 方法调用

> `selectedCellCssClass` - `selected`
单元格选中时的高亮样式

> `defaultColumnWidth` - `80`
默认列宽

> `defaultFormatter`
用于单元格的格式化, 通过定制的格式化, 给予 Grid 丰富的展示, 参考 [示例1](#) [示例2](#)

> `editable` - `false`
表格是否可编辑

> `enableCellNavigation` - `true`
通过键盘上下左右移动 active 单元格

> `enableColumnReorder` - `false`
列的拖动重新排序, 开启自定义列后数据会保存至 localStorage, 刷新或重新打开浏览器, 显示为最后的列配置顺序

> `enableTextSelectionOnCells` - `false`
单元格文本可选中, 不推荐设置为 true, 文本很长时, 无法完整选中意义不大, 单元格可编辑时, 错误的文本选中和单元格编辑状态的切换会很迷惑, 建议通过 Column 的配置`enableCopy`产生浮动框进行选中操作

> `forceFitColumns` - `false`
对齐所有列, 去除水平滚动条

> `forceSyncScrolling` - `false`
发生滚动时强制渲染 Grid, 默认是通过定时器去模拟异步加载, 抛弃上一个定时器, 达到性能的最大化, 非特殊场景不要设置 true

> `rowHeight` - `35`
默认行高, 目前受样式影响, 所以请不要轻易修改该值, 以免发生样式的错误

> `headerRowHeight` - `35`
头行高度, 同上不要轻易修改该值, 没有特殊需求也不要修改该节点, 目前用来产生过滤栏

> `enableHeaderRow` - `false`
加载`Paging.js`后用于创建头过滤栏

> `headerRowVisibility` - `false`
默认展示过滤栏

### Event
- onScroll
- onSort
- onHeaderClick
- onMouseEnter
- onMouseLeavel
- onClick
- onDbClick
- onValidationError
- onColumnsReordered
- onColumnsResized
- onCellChange
- onBeforeEditCell
- onBeforeCellEditorDestroy
- onHeaderCellRendered
- onActiveCellChanged
- onSelectedRowsChanged
- onCellCssStylesChanged
- onRadioRow

注册事件
		grid.onXXXEvent.subscribe( function( e, args ) {
			...
	} );

解除事件绑定
		grid.onXXXEvent.unsubscribe( fn );

### Editor(TODO)
