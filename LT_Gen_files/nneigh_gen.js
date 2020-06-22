//This code is not beautiful enough. It simply replace the line-break with space. 
//The judgement of the word consisted by the fronter and backer near line-bread should be added.
//Wrote on 2020-02-27 14:01:59
function euclidean_dist(u, v) {
    // compute the euclidean distance between u and v
    var sum = 0
    for (var i = 0; i < u.length; i++) {
        sum += Math.pow(u[i] - v[i], 2)
    }
    return Math.sqrt(sum)
}

function cosineSimilarity(u, v) {
    // compute the distance between u and v
    var udotv = 0
    var umag = 0
    var vmag = 0
    for (var i = 0; i < u.length; i++) {
        udotv += u[i] * v[i]
        umag += u[i] * u[i]
        vmag += v[i] * v[i]
    }
    umag = Math.sqrt(umag)
    vmag = Math.sqrt(vmag)
    return udotv / (umag * vmag);
}

function range(start, end, step, offset) {
    // Instructions:
    // range (Start, End, Step=1, Offset=0);
    //   inclusive - forward range(5,10)   // [5, 6, 7, 8, 9, 10]
    //   inclusive - backward range(10,5)   // [10, 9, 8, 7, 6, 5]
    //   step - backward range(10,2,2)   // [10, 8, 6, 4, 2]
    //   exclusive - forward range(5,10,0,-1)   // [6, 7, 8, 9]  not 5,10 themselves
    //   offset - expand range(5,10,0,1)   // [4, 5, 6, 7, 8, 9, 10, 11]
    //   offset - shrink range(5,10,0,-2)   // [7, 8]
    //   step - expand range(10,0,2,2)   // [12, 10, 8, 6, 4, 2, 0, -2]

    var len = (Math.abs(end - start) + ((offset || 0) * 2)) / (step || 1) + 1;
    var direction = start < end ? 1 : -1;
    var startingPoint = start - (direction * (offset || 0));
    var stepSize = direction * (step || 1);

    return Array(len).fill(0).map(function (_, index) {
        return startingPoint + (stepSize * index);
    });

}

function argsort_re(list) {
    const clickCount = list;
    const imgUrl = range(0, clickCount.length - 1)
    const result = imgUrl
        .map((item, index) => [clickCount[index], item]) // add the clickCount to sort by
        .sort(([count1], [count2]) => count2 - count1) // sort by the clickCount data
        .map(([, item]) => item); // extract the sorted items
    return result;
}

function argsort(list) {
    const clickCount = list;
    const imgUrl = range(clickCount.length - 1, 0)
    const result = imgUrl
        .map((item, index) => [clickCount[index], item]) // add the clickCount to sort by
        .sort(([count1], [count2]) => count2 - count1) // sort by the clickCount data
        .map(([, item]) => item); // extract the sorted items
    return result;
}

function coordParsing() {
    //parsing the checking mark
    var cosine_mark = document.getElementById("cosDist").checked;
    var euc_mark = document.getElementById("eucDist").checked;


    var inputText = document.getElementById("inputCoord").value;  //get value from input box
    // first handle different types of line breaks:
    inputText = inputText.replace(/(\r\n|\n|\r)/gm, "\n");
    // ======= starts from here ======== ======== ======== ======== ======== ======== ======== ========
    //count how many line breaks at the tail of input text:
    var count_LB = 0;
    for (var i = 1; i < inputText.length; i++) {   // count the line breaks(LB) to remove
        if (inputText[inputText.length - i] == '\n') {
            count_LB += 1;
        } else {
            break;
        }
    }
    //gen list of coordinates, remove the /n in tail.
    var list_coord = inputText.split("\n");   //each item in list_coord is a vector
    for (i = 0; i > -count_LB; i--) {
        list_coord.pop();
    }

    var NN = list_coord.length;    // number of sample nodes
    console.info('NN:', NN);
    var vec_dict = {};  //dict of vectors for each sample
    for (i = 0; i < NN; i++) {   // convert from str to list of float
		// vec_dict[i] = list_coord[i].match(/-?\d+(?:\.\d+)?/g).map(Number);  // this does convert minus number
		var array = list_coord[i].split(',')
		var numbers = array.map(Number);
		vec_dict[i] = numbers;
    }

    // Load distance Matrix. by calculate the distance using cosine similarity
    var distMatrix = new Array(NN);  //similarity matrix
    for (var i = 0; i < NN; i++) {     // Loop to create 2D array using 1D array
        distMatrix[i] = new Array(NN);
    }
    for (var i = 0; i < NN; i++) {
        for (var j = i; j < NN; j++) {
            if (cosine_mark == 1 || cosine_mark == true) {
                distMatrix[i][j] = 1 - cosineSimilarity(vec_dict[i], vec_dict[j]);
            } else if (euc_mark == 1 || euc_mark == true) {
                distMatrix[i][j] = euclidean_dist(vec_dict[i], vec_dict[j]);
            } else {
                document.getElementById("outputCoord").value = 'Error, check the distance calculation method!';
                return   //exit when exception happens
            }
            distMatrix[j][i] = distMatrix[i][j];
        }
    } //distance Matrix loaded.
    // for (var i = 0; i < NN; i++) {
    //   for (var j = 0; j < NN; j++)    {
    //       console.info(distMatrix[i][j]);
    //   }
    //   console.info('\n');
    // }

    var N = Math.round(NN * (NN - 1) / 2);  //# num of effective distances. (up-triangle of dist matrix)
    // var percent = 20;
    var percent = document.getElementById("p_dc").value;
    var position = Math.round(N * percent / 100); //# round
    var dist_items = [];
    for (var i = 0; i < NN; i++) {
        for (var j = i + 1; j < NN; j++)
            dist_items.push(distMatrix[i][j]);
    }
    // console.info('dist_items before sort:', dist_items)

    var position = Math.round(N * percent / 100);   //  # round
    var sda = dist_items.sort();   //sorted(dist_items)    //# sort all distance value
    var dc = sda[position - 1];
    console.info('percent', percent, 'position', position, 'dc', dc)

    var ND = NN;
    var rho = new Array(ND);
    for (var i = 0; i < rho.length; i++) {   //initialize the list of rho
        rho[i] = 0
    }

    //Gaussian kernel for rho calculation
    for (var i = 0; i < (ND - 1); i++) {
        for (var j = (i + 1); j < ND; j++) {
            // console.info('dist1:', Math.exp(-(distMatrix[i][j] / dc) * (distMatrix[i][j] / dc)));
            rho[i] = rho[i] + Math.exp(-(distMatrix[i][j] / dc) * (distMatrix[i][j] / dc));
            rho[j] = rho[j] + Math.exp(-(distMatrix[i][j] / dc) * (distMatrix[i][j] / dc));
        }
    }
    console.info('rho:', rho);

    var line_max = [];
    for (var i = 0; i < NN; i++) {
        var temp_max = Math.max(...distMatrix[i]);
        line_max.push(temp_max);
    }
    var maxd = Math.max(...line_max);
    console.info('maxd:', maxd)

    // the javascript equivalent of numpy argsort(-a):
    var ordrho = argsort_re(rho);
    console.info('ordrho:', ordrho)

    //# process the point has largest rho:
    var delta = new Array(ND);
    for (var i = 0; i < delta.length; i++) {   //initialize the list of delta
        delta[i] = 0
    }
    var nneigh = new Array(ND);
    for (var i = 0; i < nneigh.length; i++) {   //initialize the list of nneigh
        nneigh[i] = -1;
    }

    delta[ordrho[0]] = -1;
    nneigh[ordrho[0]] = -1;

    //# gen array of delta and nneigh:
    for (var i = 1; i < ND; i++) {
        delta[ordrho[i]] = maxd;
        for (var j = 0; j < i; j++) {
            // console.info('ordrho[i]:', ordrho[i]);
            // console.info('ordrho[j]:', ordrho[j]);
            // console.info('delta[ordrho[i]]:', delta[ordrho[i]]);
            // console.info('distMatrix[ordrho[i], ordrho[j]]:', distMatrix[ordrho[i], ordrho[j]])

            if (distMatrix[ordrho[i]][ordrho[j]] < delta[ordrho[i]]) {
                // console.info('im in loop')
                delta[ordrho[i]] = distMatrix[ordrho[i]][ordrho[j]];
                nneigh[ordrho[i]] = ordrho[j];
            }
        }
    }
    //list of nneigh
    // nneigh
    // //root of LT
    // ordrho[0]
    var output_str = "";
    for (i = 0; i < ND; i++) {
        if (nneigh[i] != -1) {
            output_str += i.toString() + " -> " + nneigh[i].toString();
        } else {
            output_str += i.toString() + " (root of Leading Tree)";
        }
        output_str += '\n';
    }

    document.getElementById("outputCoord").value = output_str;  //output value to output box

    //Transfer the nneigh out for tree visualization
    localStorage.setItem('nneigh_list', nneigh) // Persists to browser storage

};


// generate the generalize leading tree by Using the distance_matrix & importance_list
function dist_imp_2_nneigh() {
    // parse the dist_mat
    var inputText = document.getElementById("input_dist_mat").value;
    inputText = inputText.replace(/(\r\n|\n|\r)/gm, "\n");
    // handle the multi line breaks situation:
    var count_LB = 0;  //line breaks
    for (var i = 1; i < inputText.length; i++) {   // count the line breaks(LB) to remove
        if (inputText[inputText.length - i] == '\n') {
            count_LB += 1;
        } else {
            break;
        }
    }
    //gen list of rows of dist, remove the /n in tail:
    var list_distRow = inputText.split("\n");   //each item in list_coord is a vector
    for (i = 0; i > -count_LB; i--) {
        list_distRow.pop();
    }

    var NN = list_distRow.length;    // number of sample nodes
    console.info('NN:', NN);
    var dist_dict = {};  //dict of distance
    for (i = 0; i < NN; i++) {   // convert from str to list of float
        dist_dict[i] = list_distRow[i].match(/\d+(?:\.\d+)?/g).map(Number);
    }

    // Load distance Matrix. by calculate the distance using cosine similarity
    var distMatrix = new Array(NN);  //similarity matrix
    for (var i = 0; i < NN; i++) {     // Loop to create 2D array using 1D array
        distMatrix[i] = new Array(NN);
    }
    for (var i = 0; i < NN; i++) {   // Load distance Matrix
        for (var j = i; j < NN; j++) {
            distMatrix[i][j] = dist_dict[i][j];
            distMatrix[j][i] = distMatrix[i][j];
        }
    } //distance Matrix loaded.
    console.info('distMatrix:', distMatrix)

    // todo: parse the rho list, importance = rho
    var input_imp_txt = document.getElementById("imp_list").value;
    input_imp_txt = input_imp_txt.replace(/(\r\n|\n|\r)/gm, "\n");
    // handle the multi line breaks situation:
    count_LB = 0;  //count line breaks
    for (var i = 1; i < input_imp_txt.length; i++) {   // count the line breaks(LB) to remove
        if (input_imp_txt[input_imp_txt.length - i] == '\n') {
            count_LB += 1;
        } else {
            break;
        }
    }
    //gen list of importances, remove the /n in tail:
    var list_imp = input_imp_txt.split("\n");   //each item in list_coord is a vector
    for (i = 0; i > -count_LB; i--) {
        list_imp.pop();  //remove the /n in tail
    }

    var ND = NN;
    var rho = list_imp;  // list of rho loaded.
    console.info('rho:', rho);

    // get the max distance item
    var line_max = [];
    for (var i = 0; i < NN; i++) {
        var temp_max = Math.max(...distMatrix[i]);
        line_max.push(temp_max);
    }
    var maxd = Math.max(...line_max);
    console.info('maxd:', maxd)

    // the javascript equivalent of numpy argsort(-a):
    var ordrho = argsort_re(rho);
    console.info('ordrho:', ordrho)

    // initialize the list of delta and nneigh:
    var delta = new Array(ND);
    for (var i = 0; i < delta.length; i++) {   //initialize the list of delta
        delta[i] = 0
    }
    var nneigh = new Array(ND);
    for (var i = 0; i < nneigh.length; i++) {   //initialize the list of nneigh
        nneigh[i] = -1;
    }
    delta[ordrho[0]] = -1;
    nneigh[ordrho[0]] = -1;

    //# gen array of delta and nneigh:
    for (var i = 1; i < ND; i++) {
        delta[ordrho[i]] = maxd;
        for (var j = 0; j < i; j++) {
            if (distMatrix[ordrho[i]][ordrho[j]] < delta[ordrho[i]]) {
                delta[ordrho[i]] = distMatrix[ordrho[i]][ordrho[j]];
                nneigh[ordrho[i]] = ordrho[j];
            }
        }
    }

    //string to be output into output_box:
    var output_str = "";
    for (i = 0; i < ND; i++) {
        if (nneigh[i] != -1) {
            output_str += i.toString() + " -> " + nneigh[i].toString();
        } else {
            output_str += i.toString() + " (root of Leading Tree)";
        }
        output_str += '\n';
    }

    //output
    document.getElementById("output_glt").value = output_str;  //output value to output box

    //Transfer the nneigh out for tree visualization
    localStorage.setItem('nneigh_list', nneigh) // Persists to browser storage
};


//reset coord areas for 'web_LT/index.html'
var clr_btn = document.getElementById('clearCoord');
if (clr_btn) {
    clr_btn.addEventListener("click", function () {
        document.getElementById("inputCoord").value = "";
        document.getElementById("outputCoord").value = "";
        document.getElementById("inputCoord").focus();
    });
}


//reset glt input areas for 'web_LT/GLT/index.html'
var clr_btn_glt = document.getElementById('clear_glt_input_boxes');
if (clr_btn_glt) {
    clr_btn_glt.addEventListener(
        "click", function () {
            document.getElementById("input_dist_mat").value = "";
            document.getElementById("imp_list").value = "";
            document.getElementById("output_glt").value = "";
            document.getElementById("input_dist_mat").focus();
        }
    );
}


// document.getElementById("clearCoord").addEventListener("click", function () {
//     document.getElementById("inputCoord").value = "";
//     document.getElementById("outputCoord").value = "";
//     document.getElementById("inputCoord").focus();
// });

// function removeBreaks() {
//
//     var para = document.getElementById("paragraphs").checked;
//     var nopara = document.getElementById("noparagraphs").checked;
//     var noBreaksText = document.getElementById("outputCoord").value;
//
//     noBreaksText = noBreaksText.replace(/(\r\n|\n|\r)/gm, "<1br />");
//
//     re1 = /<1br \/><1br \/>/gi;
//     re1a = /<1br \/><1br \/><1br \/>/gi;
//
//     if (nopara == 1 || nopara == true) {
//         noBreaksText = noBreaksText.replace(re1, " ");
//     } else {
//         noBreaksText = noBreaksText.replace(re1a, "<1br /><2br />");
//         noBreaksText = noBreaksText.replace(re1, "<2br />");
//     }
//
//     re2 = /\<1br \/>/gi;
//     noBreaksText = noBreaksText.replace(re2, " ");    //The charactor that replace \n to
//
//     re3 = /\s+/g;
//     noBreaksText = noBreaksText.replace(re3, " ");    //The charactor that replace \space to
//
//     re4 = /<2br \/>/gi;
//     noBreaksText = noBreaksText.replace(re4, "\n\n");
//     document.getElementById("outputCoord").value = noBreaksText;
// }

var textBox = document.getElementById("outputCoord");
if (textBox) {
    textBox.onfocus = function () {
        textBox.select();
        textBox.onmouseup = function () {
            textBox.onmouseup = null;
            return false;
        };
    };
}
var textBox = document.getElementById("output_glt");
if (textBox) {
    textBox.onfocus = function () {
        textBox.select();
        textBox.onmouseup = function () {
            textBox.onmouseup = null;
            return false;
        };
    };
}
