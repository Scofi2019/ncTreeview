var treeViewDemo = {
    init : function(){
		$(function(){
		    var treeview = $(".ncTreeview").ncTreeview();
			treeview.load([
				{id:"1",name:"node-one",childs:[{id:"11",name:"node-one-one"},
				{id:"12",name:"node-one-two", childs:[{id:"121",name:"node-one-two-one"},{id:"122",name:"node-one-two-two"}]}]},
				{id:"2",name:"node-two"},
				{id:"3",name:"node-three",childs:[{id:"31",name:"node-three-one"},{id:"32",name:"node-three-two"}]},
				{id:"4",name:"node-four"}]);
		})
	}
}

treeViewDemo.init();