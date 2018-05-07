/*  [name=group protocol]
    parent = {
        connected_with = ["group-name",..],
        content: "",
        left: "",
        top: "",
        width: "",
        height: "",
        events: [{'eventType':'click','eventHandler': __handler_function__() }],
        childs: {
            "node1": {
                content: "",
                left: 0px,
                events: [{'eventType':'click','eventHandler': __handler_function__() }],
                top: 0px
            },
            "node2": {},..
        }
    }
*/
// [name=group container]
// container = {
//     "group-name": group_object,
//     "group-name2": group_object, ..
// }


let lines_coordinates = [];
let nodes_coordinates = [];


let container = null;

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

function generateNodes(NodeData,nodeid){
    if(container != null){
        // create parent node
        var pnode = document.createElement("div");
        pnode.className = "node";
        pnode.id = "parent-"+nodeid.toString();
        pnode.innerHTML = NodeData.content;
        pnode.style.left = NodeData.left.toString()+"px";
        pnode.style.top = NodeData.top.toString()+"px";
        pnode.setAttribute("data-toggle","");
        container.appendChild(pnode);

        let nodes = Object.keys(NodeData.childs);
        let i =0;
        for(i=0;i<nodes.length;i++){
            // node code
            var node = document.createElement("div");
            node.className = "node";
            node.id="node-"+nodeid.toString()+"-"+i.toString();
            node.innerHTML = NodeData.childs[nodes[i]].content;
            node.style.left = NodeData.left.toString()+"px";
            node.style.top = NodeData.top.toString()+"px";
            node.style.transitionDuration = NodeData.childs[nodes[i]].animationTiming.toString()+"s";
            var e =0;
            for(e=0;e<nodes[i].events.length;e++){
                node.addEventListener(nodes[i][e].eventType,nodes[i][e].eventHandler);
            }
            container.appendChild(node);
            // node.style.left = NodeData.childs[nodes[i]].left.toString()+"px";
            // node.style.top = NodeData.childs[nodes[i]].top.toString()+"px";
            
            // sleep(2000);

            // line code
            var line = document.createElement("div");
            line.id = "line-"+nodeid.toString()+"-"+i.toString();
            line.className = "line hide";

            var nl = Number(NodeData.childs[nodes[i]].left);
            var nt = Number(NodeData.childs[nodes[i]].top);
            var pl = Number(NodeData.left);
            var pt = Number(NodeData.top);
            var ldiff = nl-pl;
            var tdiff = pt-nt;
            var lwidth = Math.floor(Math.sqrt(ldiff*ldiff+tdiff*tdiff));
            line.style.width = lwidth.toString()+"px";

            var temp = tdiff;
            if(tdiff <0){
                temp = (-1)*tdiff;
            }
            var ElAngle = Math.asin(temp/lwidth)*(180/(Math.PI));
            var rotangle = null;
            if(ldiff>0 && tdiff >0)//1quad
            {
                rotangle = (-1)*ElAngle;
            }
            else if(ldiff<0 && tdiff>0)//2quad
            {
                rotangle = (-1)*(180-ElAngle);
            }
            else if(ldiff<0 && tdiff<0)//3quad
            {
                rotangle = 180-ElAngle;
            }
            else if(ldiff>0 && tdiff<0)//4quad
            {
                rotangle = ElAngle;
            }

            line.style.transformOrigin = "top left";
            line.style.transform = 'rotate('+rotangle.toString()+'deg)';

            line.style.left = (NodeData.left+30).toString()+"px";
            line.style.top = (NodeData.top+30).toString()+"px";

            container.appendChild(line);

            nodes_coordinates.push({
                node_id: node.id,
                group_id: pnode.id,
                line_id: line.id,
                left: NodeData.childs[nodes[i]].left.toString()+"px",
                top: NodeData.childs[nodes[i]].top.toString()+"px"
            }); 

        }
    }
    
}

function pop_childs(group_id){
    for(k=0;k<nodes_coordinates.length;k++){
        if(nodes_coordinates[k].group_id == "parent-"+group_id.toString())
        {   
            var group = document.getElementById("parent-"+group_id.toString());
            group.setAttribute("data-toggle","open");
            var n = document.getElementById(nodes_coordinates[k].node_id);
            n.style.left = nodes_coordinates[k].left;
            n.style.top = nodes_coordinates[k].top;
            
            var l = document.getElementById(nodes_coordinates[k].line_id);
            l.className = "line show";
        }
    }
}

function collapse_childs(group_id){
    for(k=0;k<nodes_coordinates.length;k++){
        if(nodes_coordinates[k].group_id == "parent-"+group_id.toString()){
            var group = document.getElementById("parent-"+group_id.toString());
            group.setAttribute("data-toggle","close");
            var n = document.getElementById(nodes_coordinates[k].node_id);
            n.style.left = group.style.left;
            n.style.top = group.style.top;
            
            var l = document.getElementById(nodes_coordinates[k].line_id);
            l.className = "line hide";
        }
    }
}

function toggle_childs(group_id){
    var group = document.getElementById("parent-"+group_id.toString());
    if(group.getAttribute("data-toggle")==""){
        pop_childs(group_id);
        group.setAttribute("data-toggle","open");
    }

    if(group.getAttribute("data-toggle") == "close"){
        pop_childs(group_id);
        group.setAttribute("data-toggle","open");
    }else{
        collapse_childs(group_id);
        group.setAttribute("data-toggle","close");
    }
}

function connect_groups(nodes_group){
    var group_names = Object.keys(nodes_group);
    for(i=0;i<group_names.length-1;i++){
        // line code
        var line = document.createElement("div");
        line.className = "line";
        line.style = "border:solid 1px red;";

        var nl = Number(nodes_group[group_names[i+1]].left);
        var nt = Number(nodes_group[group_names[i+1]].top);
        var pl = Number(nodes_group[group_names[i]].left);
        var pt = Number(nodes_group[group_names[i]].top);
        var ldiff = nl-pl;
        var tdiff = pt-nt;
        var lwidth = Math.floor(Math.sqrt(ldiff*ldiff+tdiff*tdiff));
        line.style.width = lwidth.toString()+"px";

        var temp = tdiff;
        if(tdiff <0){
            temp = (-1)*tdiff;
        }
        var ElAngle = Math.asin(temp/lwidth)*(180/(Math.PI));
        var rotangle = null;
        if(ldiff>0 && tdiff >0)//1quad
        {
            rotangle = (-1)*ElAngle;
        }
        else if(ldiff<0 && tdiff>0)//2quad
        {
            rotangle = (-1)*(180-ElAngle);
        }
        else if(ldiff<0 && tdiff<0)//3quad
        {
            rotangle = 180-ElAngle;
        }
        else if(ldiff>0 && tdiff<0)//4quad
        {
            rotangle = ElAngle;
        }

        line.style.transformOrigin = "top left";
        line.style.transform = 'rotate('+rotangle.toString()+'deg)';

        line.style.left = (nodes_group[group_names[i]].left+30).toString()+"px";
        line.style.top = (nodes_group[group_names[i]].top+30).toString()+"px";

        // generate parent
        generateNodes(nodes_group[group_names[i]],group_names[i]);
        pop_childs(group_names[i]);
        // generate next
        generateNodes(nodes_group[group_names[i+1]],group_names[i+1]);
        pop_childs(group_names[i+1]);

        // append group connector
        container.appendChild(line);

    }

}

function initiate(){
    container = document.getElementById("root");
    container.innerHTML = "";
}