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

	this.load = function(nodeArr){
        var $body = this.$view.find(".ncTreeviewBody");
		$body.html("");

		if(!nodeArr || nodeArr.length == 0) return;

        for(var i=0;i<nodeArr.length;i++){
		    var node = nodeArr[i];
            this._insertNode(node, $body);
		}

		this.create();
	}

	this._insertNode = function(node, $ele){
	    var $node = $('<div class="ncTreeviewNode" id="'+node.id+'"><div class="ncTreeviewNodeContent">'+node.name+'</div></div>');
		$ele.append($node);

		if(node.childs && node.childs.length > 0){
			var $childNodes = $('<div class="ncTreeviewNodeChild"></div>');
			$node.append($childNodes);

		    for(var i=0;i<node.childs.length;i++){
			    this._insertNode(node.childs[i], $childNodes);
			}
		}
	}

	this.create = function(){
		//搜索框
		var $search = this.$view.find(".ncTreeviewSearch");
        $search.html("");

		var searchGroupHtml = "<div class='ncTreeviewSearchGroup'><i class='fa fa-search'></i><input type='text' class='ncTreeviewSearchInput'/></div>";
	    $search.append(searchGroupHtml);

        //有子节点的节点插入箭头图标
		this.$view.find(".ncTreeviewNode").each(function(){
			var $this = $(this);
			var $child = $this.children(".ncTreeviewNodeChild");
			if($child.length > 0){
				$child.hide();
			    $this.prepend("<div class='ncTreeviewNodeArrow'><a><i class='fa fa-caret-right'></i></a></div>");
			}else{
				$this.prepend("<div class='ncTreeviewNodeArrow'>&nbsp;</div>");
			}
		});

        //对箭头图标设置点击事件
		this.$view.find(".ncTreeviewNodeArrow>a").click(function(){
		    var $this = $(this);

			var $i = $this.find("i");
			$i.removeClass();

			if($this.attr("expand") == "true"){
				$this.parent().parent().children(".ncTreeviewNodeChild").hide();
				$i.addClass("fa fa-caret-right");
				$this.removeAttr("expand");
			}else{
				$this.parent().parent().children(".ncTreeviewNodeChild").show();
				$i.addClass("fa fa-caret-down");
				$this.attr("expand","true");
			}
			
		});
 
        //节点点击效果
		this.$view.find(".ncTreeviewNodeContent").click(function(){
			var $this = $(this);

		    if(myself.$lastNode){
			    myself.$lastNode.removeClass("focus");
			}

			$this.addClass("focus");

			myself.$lastNode = $this;
		});
	}
}