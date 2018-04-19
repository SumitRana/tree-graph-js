/*  [name=group protocol]
    parent = {
        connected_with = ["group-name",..],
        content: "",
        left: "",
        top: "",
        width: "",
        height: "",
        childs: {
            "node1": {
                content: "",
                left: 0px,
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

data = { content: '<div class="ocoin">\
                        <div class="icoin">\
                            <div class="half content">\
                                <p>2018</p>\
                            </div>\
                        </div>\
                    </div>',
         left: 120,
         top: 160,
         childs: { "n1": { content: '<div class="ocoin">\
                                        <div class="icoin">\
                                            <div class="half content">\
                                                <p>2018</p>\
                                            </div>\
                                        </div>\
                                    </div>',
                           left: 300,
                           top: 300 ,
                           animationTiming: 0.3
                        },
                   "n2": { content: '<div class="ocoin">\
                                        <div class="icoin">\
                                            <div class="half content">\
                                                <p>2018</p>\
                                            </div>\
                                        </div>\
                                    </div>',
                           left: 450,
                           top: 100,
                           animationTiming: 0.4
                        },
                   "n3": { content:'<div class="ocoin">\
                                        <div class="icoin">\
                                            <div class="half content">\
                                                <p>2018</p>\
                                            </div>\
                                        </div>\
                                    </div>', 
                           left: 250,
                           top: 400,
                           animationTiming: 0.8
                        },
                    "n4": { content: '<div class="ocoin">\
                                        <div class="icoin">\
                                            <div class="half content">\
                                                <p>2018</p>\
                                            </div>\
                                        </div>\
                                    </div>',
                           left: 600,
                            top: 300,
                            animationTiming: 0.2
                        }
                 }
       }

var nodes_group = {
    "group-1": data
};

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
            var n = document.getElementById(nodes_coordinates[k].node_id);
            n.style.left = nodes_coordinates[k].left;
            n.style.top = "-1000px";
            
            var l = document.getElementById(nodes_coordinates[k].line_id);
            l.className = "line hide";
        }
    }
}

function connect_groups(){
    var group_names = Object.keys(nodes_group);
    for(i=0;i<group_names.length-1;i++){
        // line code
        var line = document.createElement("div");
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
    }

}

function initiate(){
    container = document.getElementById("root");
    container.innerHTML = "";
}