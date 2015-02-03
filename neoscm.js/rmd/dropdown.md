### HTML
```html
<div class="ui dropdown">
    <div class="title">
        <p></p>
        <i class="icon arrow"></i>
    </div>
    <div class="content"></div>
</div>
```

### Constructor
`$( selector ).dropdown( options )`
> `selector` - 选择器或 DOM 元素
> `options` - 参数设置
	$( ".ui.dropdown" ).dropdown( data: [ { 
		value: "AD",
		text: "Andorra"
	}, {
		value: "BS",
		text: "Bulgaria"
	} ] );


**Options**
> `nothing` - `Please Select`
默认的显示内容, 即无任何选择项时的显示内容

`data` - `[]`
存放`JSON`值的数组对象

`textKey` - `text`
通过该值解析`data`中`JSON`对象, 取值用于显示

`valueKey` - `value`
实际数据取值

> `selector4title` - `.title:first > p`
标题选择器或 DOM 元素

> `selector4content` - `.content:first`
内容区域选择器(列表部分)或 DOM 元素

> `type` - `click`
默认通过`click`事件展开下拉区域, 取值事件类型名称, 比如`hover`, `mouseenter`等, 见 [W3 DOM事件](http://www.w3school.com.cn/js/js_htmldom_events.asp)

> `multiple` - `false`
是否可多选, 设置为`true`后可进行多选

`required` - `false`
设置为`true`后, 必须有一个选中项, 即无法取消所有的已选择项

`formatter` - 见代码实现
用于格式化列表项, 接受两个参数`item`和`settings`, 需实现`data-item-value`属性用于存放原始值, 如下:
	$( ".ui.dropdown" ).dropdown( {
		data: [ ... ],
		formatter: function( item, settings ) {
			return "<li data-item-value=" + item[ settings.valueKey ] + "><span>" + (item[ settings.textKey ] || item[ settings.valueKey ]) + "</span></li>";
		}
	} );

**Method**
`dropdown.val( [value] )`
> `value` - JSON 数组, 通过`textKey`和`valueKey`进行解析
参数为空时返回选数组类型的选中值, 不为空时, 选中指定项(通过`valueKey`匹配)

`dropdown.add( data )`
> `data` - 同`options`中`data`参数
用于新增记录(对于 Ajax 服务会统一在 Render.js 中处理进行异步管理, 所以不会单独写入 UI 控件)

`dropdown.selectAll()`
全选所有列表项

`dropdown.deselectAll()`
取消全选

`dropdown.disabled()`
禁用控件, 和在其 HTML 添加 `disabled="disabled"` 等效

`dropdown.enabled()`
启用控件

**Event**
从结构来看所有节点均在`.ui.dropdown`下, 所以冒泡即可, 简单高效灵活, 所以不要问 XXX 事件是否支持等问题

```javascript
	var dropdown = $( ".ui.dropdown" ).dropdown( { data: [ ... ] } );
	dropdown.$node
		.delegate( "li[data-item-value=1]", "click", function() { ... } )
		.delegate( "li[data-item-value=2]", "mouseover", function() { ... } );
```