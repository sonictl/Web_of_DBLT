// var simple_chart_config = {
// 	chart: {
// 		container: "#OrganiseChart-simple"
// 	},
//
// 	nodeStructure: {
// 		text: { name: "Parent node" },
// 		children: [
// 			{
// 				text: { name: "First child" }
// 			},
// 			{
// 				text: { name: "Second child" }
// 			}
// 		]
// 	}
// };

// // // // // // // // // // // // // // // // // // // // // // // // 

// var config = {
// 	container: "#OrganiseChart-simple"
// };
//
// var parent_node = {
// 	text: { name: "Parent node" }
// };
//
// var first_child = {
// 	parent: parent_node,
// 	text: { name: "First child" }
// };
//
// var second_child = {
// 	parent: parent_node,
// 	text: { name: "Second child" }
// };
//
// var simple_chart_config = [
// 	config,
// 		first_child, parent_node,second_child
// ];


// const nneigh = [3, -1, 1, 1, 3];
var nneigh = localStorage.getItem('nneigh_list').split(",");
for (var i = 0; i < nneigh.length; i++) {
    nneigh[i] = parseInt(nneigh[i])
}
console.info(nneigh)

var par_dict = {};  //dict of parent
for (var i = 0; i < nneigh.length; i++) {
    par_dict[i] = nneigh[i]
}

// init the container
var config = {
    container: "#OrganiseChart-simple",
    connectors: {
        type: "curve",
        style: {
            "stroke-width": 2,
            "stroke": "purple",
            // "stroke-dasharray": "--",
            "arrow-start": "open-wide-long"
        }
    }
};

var node_dict = {};
var simple_chart_config = [config];

NN = nneigh.length


//initialize node dict
for (var i = 0; i < NN; i++) {
    node_dict[i] = {
        text: {name: "" + i.toString()}
    };
}

//assigning parent for each node in node_dict
for (var i = 0; i < NN; i++) {
    if (par_dict[i] != -1) {    //non-parent node
        node_dict[i].parent = node_dict[par_dict[i]]
    }
    simple_chart_config.push(node_dict[i]);
}

function reName_from_1() {
    var nneigh = localStorage.getItem('nneigh_list').split(",");
    for (var i = 0; i < nneigh.length; i++) {
        nneigh[i] = parseInt(nneigh[i])
    }
    console.info(nneigh)

    var par_dict = {};  //dict of parent
    for (var i = 0; i < nneigh.length; i++) {
        par_dict[i] = nneigh[i]
    }

// init the container
    var config = {
        container: "#OrganiseChart-simple",
        connectors: {
            type: "curve",
            style: {
                "stroke-width": 2,
                "stroke": "purple",
                // "stroke-dasharray": "--",
                "arrow-start": "open-wide-long"
            }
        }
    };

    var node_dict = {};
    var simple_chart_config = [config];

    NN = nneigh.length


//initialize node dict
    for (var i = 0; i < NN; i++) {
        node_dict[i] = {
            text: {name: "" + (i+1).toString()}     //node idx plus one
        };
    }

//assigning parent for each node in node_dict
    for (var i = 0; i < NN; i++) {
        if (par_dict[i] != -1) {    //non-parent node
            node_dict[i].parent = node_dict[par_dict[i]]
        }
        simple_chart_config.push(node_dict[i]);
    }

    new Treant(simple_chart_config);
}



