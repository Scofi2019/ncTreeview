var treeViewDemo = {
    init : function(){
		$(function(){
		    var treeview = $(".ncTreeview").ncTreeview({showIcon:$("#showIcon").prop("checked"), showCheck:$("#showCheck").prop("checked")});
			treeview.load([
				{id:"1",name:"node-one",childs:[{id:"11",name:"node-one-one"},
				{id:"12",name:"node-one-two", childs:[{id:"121",name:"node-one-two-one"},{id:"122",name:"node-one-two-two"}]}]},
				{id:"2",name:"node-two"},
				{id:"3",name:"node-three",childs:[{id:"31",name:"node-three-one"},{id:"32",name:"node-three-two"}]},
				{id:"4",name:"node-four"}]);

			$("#btnAdd").click(function(){
				var tv = $(".ncTreeview").getNcTreeview();
				var id = null;
				var $node = null;
				var count = 0;
				if(tv.getCurrentNode()){
					id = tv.getCurrentNode().id;
					$node = tv.getDomNode(id);
                    count = $node.children(".ncTreeviewNodeChild").children(".ncTreeviewNode").length;
				}else{
				    $node = tv.$view.children(".ncTreeviewBody");
					count = $node.children(".ncTreeviewNode").length;
				}
				
			    tv.insertNode(id+(count+1), "新建节点"+(count+1), id);
			});

			$("#btnRemove").click(function(){
				var tv = $(".ncTreeview").getNcTreeview();
				if(!tv.getCurrentNode()){
				    alert("请选择一个节点");
					return;
				}
			    tv.deleteNode(tv.getCurrentNode().id);
			});

			$("#btnExpand").click(function(){
				var tv = $(".ncTreeview").getNcTreeview();
			    tv.expand();
			});

			$("#btnCollapse").click(function(){
				var tv = $(".ncTreeview").getNcTreeview();
			    tv.collapse();
			});

            $("#selectAll").click(function(){
                $(".ncTreeview").getNcTreeview().selectAll($("#selectAll").prop("checked"));
            });

			$("#showIcon").click(function(){
			    var icon = $(this).prop("checked");
				var treeview = $(".ncTreeview").ncTreeview({showIcon:icon, showCheck:$("#showCheck").prop("checked")});
				treeview.load([
					{id:"1",name:"node-one",childs:[{id:"11",name:"node-one-one"},
					{id:"12",name:"node-one-two", childs:[{id:"121",name:"node-one-two-one"},{id:"122",name:"node-one-two-two"}]}]},
					{id:"2",name:"node-two"},
					{id:"3",name:"node-three",childs:[{id:"31",name:"node-three-one"},{id:"32",name:"node-three-two"}]},
					{id:"4",name:"node-four"}]);

			});

			$("#showCheck").click(function(){
			    var check = $(this).prop("checked");
				var treeview = $(".ncTreeview").ncTreeview({showIcon:$("#showIcon").prop("checked"), showCheck:check});
				treeview.load([
					{id:"1",name:"node-one",childs:[{id:"11",name:"node-one-one"},
					{id:"12",name:"node-one-two", childs:[{id:"121",name:"node-one-two-one"},{id:"122",name:"node-one-two-two"}]}]},
					{id:"2",name:"node-two"},
					{id:"3",name:"node-three",childs:[{id:"31",name:"node-three-one"},{id:"32",name:"node-three-two"}]},
					{id:"4",name:"node-four"}]);

			});

			$("#setHeight").change(function(){
			    var $this = $(this);
				if($this.val() == "0"){
				    $(".ncTreeview").getNcTreeview().setHeight("auto");
					return;
				}
				var height= Number($this.val());

                $(".ncTreeview").getNcTreeview().setHeight(height);
			});

			$("#btnSetAttribute").click(function(){
                var tv = $(".ncTreeview").getNcTreeview();
				if(!tv.getCurrentNode()){
				    alert("请选择一个节点");
					return;
				}
				tv.setNodeAttribute(tv.getCurrentNode().id, $("#textAttribute").val());
				alert("设置成功！")
			});

			$("#btnGetAttribute").click(function(){
				var tv = $(".ncTreeview").getNcTreeview();
				if(!tv.getCurrentNode()){
				    alert("请选择一个节点");
					return;
				}
				var attr = tv.getNodeAttribute(tv.getCurrentNode().id);
				alert(JSON.stringify(attr));
			});

			$("#btnGetSelectedNode").click(function(){
				var nodes = $(".ncTreeview").getNcTreeview().getSelectedNode();
				alert(JSON.stringify(nodes));
			});
		})
	}
}

treeViewDemo.init();