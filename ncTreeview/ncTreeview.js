$.fn.extend({
	ncTreeview : function(option){
		var proto = this.constructor.prototype;
		var ncTreeview = new __ncTreeview(option);
		
		ncTreeview.$view = this;
		ncTreeview.create();
		
		if(!proto.innerMap){
			proto.innerMap = {};
		}
		proto.innerMap[this.selector] = {
		    view: ncTreeview
		}
		this.constructor.prototype.getNcTreeview = function(){
			var selector = this.attr("innerId");
			return this.constructor.prototype.innerMap[selector].view;
		};
		if(option && option.complete){
			option.complete.call(this);
		}
		
		this.attr("innerId", this.selector);

		return ncTreeview;
	}
});

function __ncTreeview(option){
	this.option = option?option:{};
	
	myself = this;
	
	/**
	 * 加载数据
	 * 数据格式样例 [{id:"", name:"", pid:""},{id:"", name:"", pid:""}]
	 */
	this.loadByPid = function(nodeArr){
		for(var i = 0; i < nodeArr.length; i++){
			var nodeI = nodeArr[i];
			nodeI.childs = [];
			for(var j = 0; j < nodeArr.length; j++){
				var nodeJ = nodeArr[j];
				if(nodeJ.pid == nodeI.id){
					nodeJ.unRoot = true;
					nodeI.childs.push(nodeJ);
				}
			}
		}
		
		var nodes = [];
		
		for(var i = 0; i < nodeArr.length; i++){
			var node = nodeArr[i];
			if(node.unRoot) continue;
			nodes.push(node);
		}
		
		this.load(nodes);
	}
     
	/**
	 * 加载数据
	 * 数据格式样例 [{id:"", name:"", childs:[{id:"", name:""},{id:"", name:""}]},
	 *           {id:"", name:"", childs:[{id:"", name:""},{id:"", name:""}]}]
	 */
	this.load = function(nodeArr){
        var $body = this.$view.find(".ncTreeviewBody");
		$body.html("<div class='ncTreeviewBodyWrapper'></div>");

		if(!nodeArr || nodeArr.length == 0) return;

        for(var i=0;i<nodeArr.length;i++){
		    var node = nodeArr[i];
            this._insertNode(node, $body.children(".ncTreeviewBodyWrapper"), null);
		}

		this.create();
	}

	this._insertNode = function(node, $ele, pid, opt){
	    var $node = $('<div class="ncTreeviewNode" node-id="'+node.id+'" node-name="'+
	        node.name+'"><div class="ncTreeviewNodeContent">'+node.name+'</div></div>');

		$ele.append($node);

		if(pid){
		    $node.attr("node-pid", pid);
		}
		
		if(node.attributes){
			this.setNodeAttribute(node.id, node.attributes);
		}

		if(node.childs && node.childs.length > 0){
			var $childNodes = $('<div class="ncTreeviewNodeChild"></div>');
			$node.append($childNodes);

		    for(var i=0;i<node.childs.length;i++){
			    this._insertNode(node.childs[i], $childNodes, node.id);
			}
		}
		
		return $node;
	}
	
	this._maxWidth = 0;
	this._maxWidthMap = {};
	
	this._setMaxWidth = function($node, refreshUI){
		var maxWidth = 0;
		
		if($node && $node.length > 0){
			var $arrow = $node.children(".ncTreeviewNodeArrow");
			var $check = $node.children(".ncTreeviewNodeCheck");
			var $icon = $node.children(".ncTreeviewNodeIcon");
			var $content = $node.children(".ncTreeviewNodeContent");
			
			var left = this.$view.children(".ncTreeviewBody").offset().left;
			var nodeLeft = $node.offset().left;
			
			maxWidth = (nodeLeft - left) + $node.outerWidth() - $node.width() +
			           $arrow.outerWidth(true) + $check.outerWidth(true) + $icon.outerWidth(true) + $content.outerWidth(true);
			
			this._maxWidthMap[$node.attr("node-id")] = maxWidth;
			
			if(this._maxWidth < maxWidth){
				this._maxWidth = maxWidth;
				if(refreshUI){
					this.$view.children(".ncTreeviewBody").children(".ncTreeviewBodyWrapper").width(this._maxWidth);
				}
			}
		}else{
			var maxW = 0;
			for(var i in this._maxWidthMap){
				var $nd = this.$view.find(".ncTreeviewNode[node-id='"+i+"']");
				if($nd.parent().css("display") == "none"){
					this._maxWidthMap[i] = 0;
				}else if(maxW < this._maxWidthMap[i]){
					maxW = this._maxWidthMap[i];
				}
			}
			this._maxWidth = maxW;
			if(refreshUI){
				this.$view.children(".ncTreeviewBody").children(".ncTreeviewBodyWrapper").width(maxW);
			}
		}
	}
	
    //创建结构
	this.create = function(){
		//搜索框
		var $search = this.$view.find(".ncTreeviewSearch");
        $search.html("");

		var $searchGroupHtml = $("<div class='ncTreeviewSearchGroup'><i class='fa fa-search'></i><input type='text' class='ncTreeviewSearchInput'/></div>");
	    $search.append($searchGroupHtml);

		$searchGroupHtml.find(".ncTreeviewSearchInput").keydown(function(){
		    if(event.keyCode == 13){
			    myself.filter($(this).val());
			}
		});
        
		//设置箭头图标方法
		this._setArrow = function($node){
			var $child = $node.children(".ncTreeviewNodeChild");

			if($node.children(".ncTreeviewNodeArrow").length > 0){
			    if($child.length > 0){
                    $node.children(".ncTreeviewNodeArrow").html("<a><i class='fa fa-caret-right'></i></a>");
				}else{
				    $node.children(".ncTreeviewNodeArrow").html("&nbsp;");
				}
			}else{
				if($child.length > 0){
					$child.hide();
					$node.prepend("<div class='ncTreeviewNodeArrow'><a><i class='fa fa-caret-right'></i></a></div>");
				}else{
					$node.prepend("<div class='ncTreeviewNodeArrow'>&nbsp;</div>");
				}
			}
		}

		//设置选择框
		this._setCheck = function($node, check){
			if(!this.option.showCheck) return;
			if($node.children(".ncTreeviewNodeCheck").length == 0){
			     $node.find(".ncTreeviewNodeArrow").after("<div class='ncTreeviewNodeCheck'><label></label></div>");
			}

			$node.children(".ncTreeviewNodeCheck").attr("node-checked",check?"true":"false");
			var $ele = $node.parent().parent();
			while($ele.length > 0){
				var cssClass = $ele.attr("class");
				if(!cssClass || cssClass.indexOf("ncTreeviewNode") < 0) break;
				var $eleChilds = $ele.children(".ncTreeviewNodeChild").children(".ncTreeviewNode");
				var count = $eleChilds.length;
				var hasMiddle = false;
				$eleChilds.each(function(){
					var $this = $(this);
					var checked = $this.children(".ncTreeviewNodeCheck").attr("node-checked");
					if(checked == "true"){
						count--;
					}else if(checked == "middle"){
					    hasMiddle = true;
					}
				});

				if(count <= 0){
					$ele.children(".ncTreeviewNodeCheck").attr("node-checked","true");
				}else if(count < $eleChilds.length){
                    $ele.children(".ncTreeviewNodeCheck").attr("node-checked","middle");
				}else{
					if(hasMiddle){
						$ele.children(".ncTreeviewNodeCheck").attr("node-checked","middle");
					}else{
						$ele.children(".ncTreeviewNodeCheck").attr("node-checked","false");
					}
				}

				$ele = $ele.parent().parent();
			}

			var $childs = $node.children(".ncTreeviewNodeChild").children(".ncTreeviewNode");
			if($childs.length > 0){
				$childs.each(function(){
				    var $child = $(this);
					myself._setCheck($child, check);
				});
			}
		}

		//设置图标
		this._setIcon = function($node, expand){
			if(!this.option.showIcon) return;
			var length = $node.children(".ncTreeviewNodeChild").children(".ncTreeviewNode").length;
			var icon = expand?(length > 0?"folder-open-o":"leaf"):(length > 0?"folder-o":"leaf");
			if($node.children(".ncTreeviewNodeIcon").length == 0){
			     $node.find(".ncTreeviewNodeArrow").after("<div class='ncTreeviewNodeIcon'><i class='fa fa-"+icon+"'></i></div>");
			}else{
				var $i = $node.children(".ncTreeviewNodeIcon").find("i");
			    $i.removeClass();
				$i.addClass("fa fa-"+icon);
			}
		}

        //有子节点的节点插入箭头图标
		this.$view.find(".ncTreeviewNode").each(function(){
			var $this = $(this);
			
			myself._setArrow($this);
			myself._setIcon($this);
			myself._setCheck($this);
			myself._setMaxWidth($this);
		});

        //绑定选择框点击事件
		this.bindCheckClick = function($node){
		     this._setCheck($node, $node.children(".ncTreeviewNodeCheck").attr("node-checked") == "true"?false:true);
		}

        //checkbox点击事件
		this.$view.find(".ncTreeviewNodeCheck").find("label").click(function(){
			 var $node = $(this).parent().parent();
             myself.bindCheckClick($node);
		});

        //展开收起方法
		this._expandOrCollpaseNode = function($node, expand, recursive){
			var $i = $node.children(".ncTreeviewNodeArrow").find("a>i");
			$i.removeClass();

            var isExpand = expand == undefined?($node.attr("expand") == "true"):!expand;
            var result = false;

            var $childs = null;
			if(isExpand){
				$childs = $node.children(".ncTreeviewNodeChild");
				$childs.hide();
				$i.addClass("fa fa-caret-right");
				$node.removeAttr("expand");
				
				this._setMaxWidth(null, true);
			}else{
				$childs = $node.children(".ncTreeviewNodeChild");
				$childs.show();
				$i.addClass("fa fa-caret-down");
				$node.attr("expand","true");
				
				//重新设置bodyWrapper宽度
				$childs.find(".ncTreeviewNode").each(function(){
					this._setMaxWidth($(this), true);
				});

				result = true;
			}

			this._setIcon($node, result);
            
			//遍历子节点
			if(recursive){
				var $childNodes = $childs.find("ncTreeviewNode");
				$childNodes.each(function(){
					this._expandOrCollpaseNode($(this), isExpand, true);
				});
			}

			return result;
		}

        //绑定箭头点击事件
		this._bindArrowClick = function($node){
		    var isExpand = this._expandOrCollpaseNode($node);
			
			if(this.option){
				if(this.option.expand && isExpand){
					this.option.expand.call(this);
				}else if(this.option.collapse && !isExpand){
				    this.option.collapse.call(this);
				}
			}
		}

        //对箭头图标设置点击事件
		this.$view.find(".ncTreeviewNodeArrow>a").click(function(){
		    myself._bindArrowClick($(this).parent().parent());
		});

        //绑定节点点击事件
        this._bindNodeClick = function($node, doubleTrigger){
			var $this = $node.children(".ncTreeviewNodeContent");

		    if(this.$lastNode){
			    this.$lastNode.removeClass("focus");
			}

			$this.addClass("focus");

			this.$lastNode = $this;

            if(doubleTrigger){
			    if(this.option.nodeDoubleClick){
			        this.option.nodeDoubleClick.call(this, this.getCurrentNode());
			    }
			}else{
			    if(this.option.nodeClick){
			        this.option.nodeClick.call(this, this.getCurrentNode());
			    }
			}
		}

        //节点点击效果
		this.$view.find(".ncTreeviewNodeContent").click(function(){
			myself._bindNodeClick($(this).parent());
		});

		//节点点击效果
		this.$view.find(".ncTreeviewNodeContent").dblclick(function(){
			myself._bindNodeClick($(this).parent(), true);
		});
		
		//设置bodyWrapper宽度
		this.$view.children(".ncTreeviewBody").children(".ncTreeviewBodyWrapper").width(this._maxWidth);
	}


    //插入节点
	this.insertNode = function(id, name, pid){
		var $pNode = null;

		if(pid){
			$pNode = this.$view.find(".ncTreeviewNode[node-id='"+pid+"']");
		}else{
		    $pNode = this.$view.find(".ncTreeviewBody>.ncTreeviewBodyWrapper");
		}

		if(pid && $pNode.children(".ncTreeviewNodeChild").length == 0){
		    $pNode.append('<div class="ncTreeviewNodeChild"></div>');
		}

		if(pid && $pNode.children(".ncTreeviewNodeChild").children(".ncTreeviewNode").length == 1){
			this._setArrow($pNode);
			$pNode.children(".ncTreeviewNodeArrow").children("a").click(function(){
				myself._bindArrowClick($(this).parent().parent());
			});
		}

        var $node = null;

        if(pid){
            $node = this._insertNode({id:id, name:name}, $pNode.children(".ncTreeviewNodeChild"), pid);
		}else{
            $node = this._insertNode({id:id, name:name}, $pNode, pid);
		}

        this._setArrow($node);
		this._setIcon($node);
		this._setCheck($node);
		this._setMaxWidth($node);

        $node.children(".ncTreeviewNodeArrow").children("a").click(function(){
			myself._bindArrowClick($(this).parent().parent());
		}); 

		$node.children(".ncTreeviewNodeContent").click(function(){
			myself._bindNodeClick($(this).parent());
		});

		$node.children(".ncTreeviewNodeCheck").find("label").click(function(){
			 myself.bindCheckClick($(this).parent().parent());
		 });

		this.expand(pid);
	}

    //删除节点
	this.deleteNode = function(id){
	    var $node = this.$view.find(".ncTreeviewNode[node-id='"+id+"']");
		$node.remove();
	}

    //筛选节点
	this.filter = function(name){
		var count = 0;
	    this.$view.find(".ncTreeviewNode").each(function(){
		    var $this = $(this);
			var $nodeContent = $this.children(".ncTreeviewNodeContent");
			$nodeContent.removeClass("found");

            if(!name) return;

			var text = $nodeContent.text();
			if(text && text.indexOf(name) >-1){
			    $nodeContent.addClass("found");
				count++;
			}
		});

        if(count > 0){
		    this.expand();
		}
	}

    //获取当前节点
	this.getCurrentNode = function(){
		var $nodeContent = this.$view.find(".ncTreeviewNodeContent.focus");
		if($nodeContent.length > 0){
		    var $node = $nodeContent.parent();
			this._currentNode = {id:$node.attr("node-id"), 
				                 name:$node.attr("node-name"), 
				                  pid:$node.attr("node-pid")};
			
			this._currentNode = $.extend(this._currentNode, this.getNodeAttribute(this._currentNode.id));
			return this._currentNode;
		}
		return null;
	}

    //获取Dom节点
	this.getDomNode = function(id){
	    return this.$view.find(".ncTreeviewNode[node-id='"+id+"']");
	}

    //展开节点
    this.expand = function(id){
		if(id){
			var $node = this.$view.find(".ncTreeviewNode[node-id='"+id+"']");
			myself._expandOrCollpaseNode($node, true, true);
		}else{
			this.$view.find(".ncTreeviewNode").each(function(){
			    var $this = $(this);
				myself._expandOrCollpaseNode($this, true, true);
			});
		}
	}

    //收起节点
	this.collapse = function(id){
		if(id){
			var $node = this.$view.find(".ncTreeviewNode[node-id='"+id+"']");
			myself._expandOrCollpaseNode($node, false, true);
		}else{
			this.$view.find(".ncTreeviewNode").each(function(){
			    var $this = $(this);
				myself._expandOrCollpaseNode($this, false, true);
			});
		}
	}

    //设置宽度
    this.setWidth = function(){
	     this.$view.width(height);
	}
    
	//设置高度
	this.setHeight = function(height){
		if(height == "auto"){
			this.$view.find(".ncTreeviewBody").css({height:"auto"});
		}else{
		    this.$view.find(".ncTreeviewBody").height(height);
		}
	}
    
	//设置节点属性
	this.setNodeAttribute = function(id, attrs){
	    var $node = this.$view.find(".ncTreeviewNode[node-id='"+id+"']");
		if(typeof(attrs) == "string"){
			attrs = JSON.parse(attrs);
		}
		for(var i in attrs){
		    $node.attr("node-"+i, attrs[i]);
		}
	}
 
    //获取节点属性
	this.getNodeAttribute = function(id, attrName){
	    var $node = this.$view.find(".ncTreeviewNode[node-id='"+id+"']");
		if(attrName){
		    return $node.attr(attrName);
		}else{
			var attrs = {}
			$.each($node[0].attributes, function() {
				var index = this.name.indexOf("node-");
				if(index > -1){
					var n = this.name.substr(index + 5, this.name.length - 5);
					attrs[n] = this.value;
				}
			});
			return attrs;
		}
	}
    
	//获取选择的节点
	this.getSelectedNode = function(){
	    var $checked = this.$view.find(".ncTreeviewNodeCheck>input:checked");
		var $nodes = $checked.parent().parent();
		var nodes = [];
        $nodes.each(function(){
		    var $this = $(this);
			var attr = myself.getNodeAttribute($this.attr("node-id"));
			nodes.push(attr);
		});
		return nodes;
	}
    
	//全选或全不选
	this.selectAll = function(checked){
		this.$view.find(".ncTreeviewNode").each(function(){
		    var $this = $(this);
			myself._setCheck($this, checked);
		});
	}
}