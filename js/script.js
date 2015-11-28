(function() {
	var canvas= document.getElementById("board");
	var width= canvas.width= 300;
	var height= canvas.height= 300;

	var ctx= canvas.getContext("2d");
	ctx.lineCap= "round";

	var global= {
		offset: [canvas.offsetLeft,canvas.offsetTop],
		tic: [
			["a","b","c"],
			["d","e","f"],
			["g","h","i"]
		],
		chance:true, // true= x, false= y (First Chance)
		score: [0,0]
	};
	
	var grid= []; // Data for each block
	(function() {
		for(var i_grid= 0; i_grid< 3; i_grid++) {
			for(var j_grid= 0; j_grid< 3; j_grid++) {
				arr= {
					pos:i_grid+"_"+j_grid,
					coord: [
						i_grid*width/3,
						j_grid*height/3
					]
				};
				grid.push(arr);
			}
		}
	})();

	var showScore= function() {
		document.querySelector(".score").innerHTML= "<small>X-</small>"+global.score[0]+" / <small>O-</small>"+global.score[1];
	};

	// Do something for the winner
	var winAnounce= function() {
		var win= winListener();
		switch (win) {
			case "x":
				alert("X Won");
				global.score[0]++;
				clearAll();
				break;
			case "o":
				alert("O Won");
				global.score[1]++;
				clearAll();
				break;
		}

		showScore();
	};

	// Reset the board
	var clearAll= function() {
		ctx.clearRect(0,0,width,height);
		drawLines();
		global.tic= [
			["a","b","c"],
			["d","e","f"],
			["g","h","i"]
		];
		global.chance= true;
	};

	// Check if someone won
	var winListener= function() {
		var winner= "-";

		for (var i= 0; i < 3; i++) {
		    if ((global.tic[i][0] == global.tic[i][1]) && (global.tic[i][1] == global.tic[i][2])) {	
		        winner = global.tic[i][0];
		    }
		}

		for (var j= 0; j < 3; j++) {
		    if ((global.tic[0][j] == global.tic[1][j]) && (global.tic[1][j] == global.tic[2][j])) {
		        winner = global.tic[0][j];
		    }
		}

		if ((global.tic[0][0] == global.tic[1][1] && 
			global.tic[1][1] == global.tic[2][2]) || 
			(global.tic[0][2] == global.tic[1][1] && 
			global.tic[1][1] == global.tic[2][0])) {
			winner = global.tic[1][1];
		}

		return winner;
	};

	// Co-ordinates relative to canvas instead of window
	var true_coord= function(arr) {
		arr[0]-= global.offset[0];
		arr[1]-= global.offset[1];
		return arr;
	};

	// Get Block position
	var getBlock= function(x,y) {
		co= true_coord([x,y]);
		for(var i= 0; i< grid.length; i++) {
			var grid_block= grid[i];
			var cond= ((co[1]> grid_block.coord[1]) &&
				(co[0]> grid_block.coord[0]) &&
				(co[1]<= grid_block.coord[1] + height/3) &&
				(co[0]<= grid_block.coord[0] + width/3));
			if(cond) {
				return grid_block;
			}
		}
		return;
	};

	// Draw calling
	var drawVal= function(block) {
		var x= block.coord[0];
		var y= block.coord[1];
		ctx.beginPath();
		ctx.lineWidth= 10;
		var cor= [(width/3)-30,(width/3)-30];

		if(global.chance) {
			ctx.strokeStyle= "#F44336";
			ctx.moveTo(x+30,y+30);
			ctx.lineTo(x+cor[0],y+cor[1]);
			ctx.moveTo(x+30,y+cor[1]);
			ctx.lineTo(x+cor[0],y+30);
		} else {
			ctx.strokeStyle= "#3B50CE";
			ctx.arc(x+(width/6),y+(height/6),(width/6)-30,0,Math.PI*2);
			ctx.closePath();
		}

		ctx.stroke();
	};

	var showChance= function() {
		var bar= (global.chance) ? "X":"O";
		document.querySelector(".chance").innerHTML= bar;
	};

	// When you click, this is triggered
	var clickHappens= function(e) {
		var block= Object.create(getBlock(e.pageX,e.pageY));
		if(block) {
			block.pos= block.pos.split("_");
			block.pos[0]= parseInt(block.pos[0]);
			block.pos[1]= parseInt(block.pos[1]);
		}

		if(global.tic[block.pos[1]][block.pos[0]] !== "x" &&
			global.tic[block.pos[1]][block.pos[0]] !== "o") {
			drawVal(block);
			var bar= (global.chance) ? "x":"o";
			global.tic[block.pos[1]][block.pos[0]]= bar;
			global.chance= !global.chance;
			showChance();
		}

		winAnounce();
	};

	// draw lines on the board
	var drawLines= function() {
		ctx.strokeStyle= "#888";
		ctx.lineWidth= 1;
		ctx.beginPath();

		ctx.moveTo(width/3,10);
		ctx.lineTo(width/3,height-10);
		ctx.moveTo(width*2/3,10);
		ctx.lineTo(width*2/3,height-10);

		ctx.moveTo(10,width/3);
		ctx.lineTo(height-10,width/3);
		ctx.moveTo(10,width*2/3);
		ctx.lineTo(height-10,width*2/3);

		ctx.stroke();
	};

	document.addEventListener('DOMContentLoaded',function() {
		drawLines();
		canvas.addEventListener('click',clickHappens);
	});
})();