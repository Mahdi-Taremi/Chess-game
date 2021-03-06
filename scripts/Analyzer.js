CHESSAPP.Analyzer ={
	castlingInfo: {
		W: {
			left: false,
			right: false
		},	
		B: {
			left: false,
			right: false
		}
	},
	makeAllOptions : function(settings){
		var stg = {
			pieces: null
		};
		this.castlingInfo.B.left = false;
		this.castlingInfo.B.right = false;
		this.castlingInfo.W.left = false;
		this.castlingInfo.W.right = false;
		CHESSAPP.utils.extend(stg, settings);
		var pieces = stg.pieces;
		var max = pieces.length;
		var resp = {
			kingInCheck : false,
			allOptions : []
		};
		var r,
			whiteKingIndex,
			blackKingIndex;
		for(var i = 0; i < pieces.length; i++){
			if(pieces[i] && pieces[i].pieceType == "king"){
				if(pieces[i].color == "W"){
					whiteKingIndex = i;
				}
				else{
					blackKingIndex = i;
				}
			}
			if(pieces[i] && CHESSAPP.GamePlay.getTurn() == pieces[i].color){
				pieces[i].justMoved = false;
			}
			r = this.getOptions({pieces: pieces, piece: pieces[i], checkTest : false});
			if(r && r.checkDetected){
				if(r.checkDetected){
					resp.kingInCheck = r.checkDetected;
				}
			}
			resp.allOptions.push(r.pieceOptions);
		}
		if(resp.kingInCheck != "W"){
			r = this.getOptions({pieces: pieces, piece: pieces[whiteKingIndex], checkTest: false, castleTest: true});
			if(r && r.checkDetected){
				if(r.checkDetected){
					resp.kingInCheck = r.checkDetected;
				}
			}
			console.log("HERE : " , r);
			resp.allOptions[whiteKingIndex] = resp.allOptions[whiteKingIndex].concat(r.pieceOptions);
		}
		if(resp.kingInCheck != "B"){
			resp.allOptions.push(r.pieceOptions);
			r = this.getOptions({pieces: pieces, piece: pieces[blackKingIndex], checkTest: false, castleTest: true});
			if(r && r.checkDetected){
				if(r.checkDetected){
					resp.kingInCheck = r.checkDetected;
				}
			}
			resp.allOptions[blackKingIndex] = resp.allOptions[blackKingIndex].concat(r.pieceOptions);
		}
		resp.allOptions.push(r.pieceOptions);
		return resp;
	},
	checkTest : function(settings){
		var stg = {
			pieces: null,
			color: 'W'
		};
		CHESSAPP.utils.extend(stg, settings);
		var pieces = stg.pieces,
		    color = stg.color;

		for(var i = 0; i < pieces.length; i++){
			var r = this.getOptions({pieces: pieces, piece: pieces[i], checkTest : color});   
			if(r && r.checkDetected == color){
				return true;
			}
		}
		return false;
	},
	getOptions : function(settings){
		var stg = {
			pieces: null,
			piece: null,
			checkTest : false,
			castleTest: false
		};
		CHESSAPP.utils.extend(stg, settings);
		var piece = stg.piece,
		    pieces = stg.pieces;
		var resp = {
			checkDetected : false,
			pieceOptions: null
		};
		if(!piece){
			return resp;
		}
		var pieceOptions = [],
		    curx = parseInt(piece.x),
		    cury = parseInt(piece.y),
		    color = piece.color,
		    type = piece.pieceType;

		var checkFound = false;
		var mk = function(x,y,m,a,s){
			var r =  CHESSAPP.Analyzer.makeOption({pieces: pieces, x: x, y: y, piece: piece, canMove: m, canAttack: a, checkTest: stg.checkTest, special: s});
			if(r.checkDetected){
				resp.checkDetected = r.checkDetected;
			}
			if(r.valid){
				if(stg.castleTest){
					console.log("Adding castle", r);
				}
				if(!stg.checkTest){
					if(piece.color == "B"){
						if((x == 3 || x == 2) && y == 7){
							CHESSAPP.Analyzer.castlingInfo.W.left = true;
						}
						else if((x == 5 || x == 6) && y == 7){
							CHESSAPP.Analyzer.castlingInfo.W.right = true;
						}
					}
					else if(piece.color == "W"){
						if((x == 3 || x == 2)&& y == 0){
							CHESSAPP.Analyzer.castlingInfo.B.left = true;
						}
						else if((x == 5 || x == 6) && y == 0){
							CHESSAPP.Analyzer.castlingInfo.B.right = true;
						}
					}
				}
				pieceOptions.push(r);
			}
			return r.canMovePast;
		};
		var flip = (color == 'B') ? 1 : -1;
		switch(type){
			case "pawn": 
				var tmp = mk(curx,cury + 1 * flip, true, false);
				if(piece.numOfMoves == 0 && tmp){
					mk(curx, cury + 2 * flip, true, false);
				}
				var rp = CHESSAPP.Analyzer.pieceExists({pieces: pieces, x: (curx + 1), y: cury});
				if(rp != null && rp.color != piece.color && rp.pieceType == "pawn" && rp.justMoved && rp.numOfMoves == 1 && (rp.y == 3 || rp.y == 4)){
					var special = {
						type: "en",
						enx : curx + 1,
						eny : cury
					};
					mk(curx+1, cury + 1 * flip, true, true, special);
				}
				rp = CHESSAPP.Analyzer.pieceExists({pieces: pieces, x: (curx - 1), y: cury});
				if(rp != null && rp.color != piece.color && rp.pieceType == "pawn" && rp.justMoved && rp.numOfMoves == 1 && (rp.y == 3 || rp.y == 4)){
					var special = {
						type: "en",
						enx : curx - 1,
						eny : cury
					};
					mk(curx+1, cury - 1 * flip, true, true, special);
				}
				if(CHESSAPP.Analyzer.pieceExists({pieces: pieces, x: (curx + 1), y: (cury + 1 * flip)})){
					mk(curx + 1,cury + 1 * flip, false, true);
				}
				if(CHESSAPP.Analyzer.pieceExists({pieces: pieces, x: (curx - 1), y: (cury + 1 * flip)})){
					mk(curx - 1,cury + 1 * flip, false, true);
				}
				break;
			case "king":
			if(stg.castleTest){
					var leftCastle = true,
						rightCastle = true;
					if(piece.numOfMoves > 0 || CHESSAPP.GamePlay.kingInCheck == piece.color){
						leftCastle = false;
						rightCastle = false;
					}
					else{
						if(this.castlingInfo[piece.color].left){
							leftCastle = false;
						}
						else{
							var leftP;
							for(var i = 1; i <= 4; i++){
								leftP = CHESSAPP.Analyzer.pieceExists({pieces: pieces, x: (curx - i), y : cury});
								if(i < 4 && leftP != null){
									leftCastle = false;
								}
							}
							if(leftP != null && leftP.pieceType == "rook" && leftP.color == piece.color && leftP.numOfMoves == 0){
							}
							else{
								leftCastle = false;
							}
						}
						if(this.castlingInfo[piece.color].right){
							rightCastle = false;
						}
						else{
							var rightP;
							for(var i = 1; i <= 3; i++){
								rightP = CHESSAPP.Analyzer.pieceExists({pieces: pieces, x: (curx + i), y : cury});
								if(i < 3 && rightP != null){
									rightCastle = false;
								}
							}
							if(rightP != null && rightP.pieceType == "rook" && rightP.color == piece.color && rightP.numOfMoves == 0){
							}
							else{
								rightCastle = false;
							}
						}
					}
					if(leftCastle){
						var special = {
							type:"castle",
							side: "left",
							rookx : curx - 4,
							rooky : cury,
							rooktox : curx - 1,
							rooktoy : cury
						};
						mk(curx - 2, cury, true, false, special);
					}
					if(rightCastle){
						var special = {
							type:"castle",
							side: "right",
							rookx : curx + 3,
							rooky : cury,
							rooktox : curx + 1,
							rooktoy : cury
						};
						mk(curx + 2, cury, true, false, special);
					}
					if(leftCastle && !stg.checkTest){
							console.log(leftCastle + " for castling color " + piece.color + " left");
					}
					else if(!leftCastle && !stg.checkTest){
							console.log(leftCastle + " for castling color " + piece.color + " left"); 
					}

					if(rightCastle && !stg.checkTest){
							console.log(rightCastle + " for castling color " + piece.color + " right");
					}
					else if(!rightCastle && !stg.checkTest){
							console.log(rightCastle + " for castling color " + piece.color + " right"); 
					}
				}
				else{
					mk(curx - 1, cury + 1, true, true);
					mk(curx - 1, cury, true, true);
					mk(curx - 1, cury - 1, true, true);
					mk(curx + 1, cury + 1, true, true);
					mk(curx + 1, cury, true, true);
					mk(curx + 1, cury - 1, true, true);
					mk(curx, cury + 1, true, true);
					mk(curx, cury - 1, true, true);
				}
				break;
			case "knight":
				mk(curx - 1, cury + 2, true, true);
				mk(curx - 1, cury - 2, true, true);
				mk(curx + 1, cury + 2, true, true);
				mk(curx + 1, cury - 2, true, true);
				mk(curx - 2, cury + 1, true, true);
				mk(curx - 2, cury - 1, true, true);
				mk(curx + 2, cury + 1, true, true);
				mk(curx + 2, cury - 1, true, true);
				break;
			case "bishop":
			case "rook":
			case "queen":
				if(type != "bishop"){
					for(var i = curx - 1; i >= 0; i--){
						if(!mk(i,cury, true, true)){
							break;}              
					}
					for(var j = curx + 1; j <= 7; j++){
						if(!mk(j,cury,true, true)){
							break;
						}          
					}
					for(var k = cury - 1; k >= 0; k--){
						if(!mk(curx,k,true, true)){
							break;
						}               
					}
					for(var l = cury + 1; l <= 7; l++){
						if(!mk(curx,l,true, true)){
							break;
						}              
					}
				}
				if(type != "rook"){
					for(var i = 1; i <= Math.min(curx, cury); i++){
						if(!mk(curx - i,cury - i, true, true)){
							break;}
					}
					for(var i = 1; i <= 7 - Math.max(curx, cury); i++){
						if(!mk(curx + i,cury + i, true, true)){
							break;}
					}
					for(var i = 1; i <= Math.min(7 - curx, cury); i++){
						if(!mk(curx + i,cury - i, true, true)){
							break;}
					}
					for(var i = 1; i <= Math.min(curx, 7 - cury); i++){
						if(!mk(curx - i,cury + i, true, true)){
							break;}
					}
				}
				break;
		}
		if(stg.checkTest){
			return resp;
		}
		resp.pieceOptions = pieceOptions;
		return resp;
	},
	withinBounds : function(x,y){
		return ((x >= 0 && x <= 7) && (y >= 0 && y <= 7));
	},
	makeOption : function(settings){
		var stg = {
			pieces: null,
			piece: null,
			canAttack: true,
			canMove: true,
			checkTest: false,
			x: -1,
			y: -1,
			special: null
		};
		CHESSAPP.utils.extend(stg, settings);
		var x = stg.x, y = stg.y, piece = stg.piece, pieces = stg.pieces, special = stg.special;
		var resp = {
			x: x,
			y: y,
			valid : true,
			attackable : false,
			movable: false,
			canMovePast : true,
			checkDetected : false,
			special: special
		};
		if(!this.withinBounds(x,y)){
			resp.valid = false;
			return resp;
		}
		var pieceExists = null;
		if(special == null){
	       		pieceExists = this.pieceExists({pieces: pieces, x : x, y : y, checkTest: stg.checkTest});
		}
		else if(special.type == "en"){			
			pieceExists = this.pieceExists({pieces: pieces, x : special.enx, y : special.eny, checkTest: stg.checkTest});
			if(!stg.checkTest){
				console.log("Checking en passant piece");
				console.log(pieceExists);
			}
		}
		else if(special.type == "castle"){
			resp.movable = true;
			return resp;
		}
		if(pieceExists){
			if(stg.piece.color == pieceExists.color){
				resp.valid = false;
				resp.canMovePast = false; 
			}
			else{
				if(stg.canAttack){
					resp.attackable = true;
					if(pieceExists.pieceType == "king")
					{
						if((stg.checkTest && stg.checkTest == pieceExists.color) || !stg.checkTest){
							resp.checkDetected = pieceExists.color;
							return resp; 
						}
						else{
							resp.checkDetected = pieceExists.color;
						}              
					}
					resp.canMovePast = false;
				}
				else{
					resp.valid = false;
					resp.canMovePast = false; 
				}
			}
		}
		if(stg.canMove && resp.valid){
			resp.movable = true;
		}

		resp.valid = resp.attackable || resp.movable;

		if(!stg.checkTest && resp.valid){

			var pieceObj = {
				pieceType: piece.pieceType,
				color: piece.color,
				x: x,
				y: y
			};
			var pieceOverrides = 
				[
				{
					pieceIndex: pieces.indexOf(piece), 
					val: pieceObj
				}
			];      
			if(resp.attackable){
				pieceOverrides.push({
					pieceIndex: pieces.indexOf(pieceExists),
					val: null
				});
			}
			var newPieces = this.copyAndReplace({pieces: pieces, overrides: pieceOverrides});

			if(this.checkTest({pieces: newPieces, color: piece.color})){
				resp.valid = false;
			}
		}
		return resp;
	},
	pieceExists : function(settings){
		var stg = {
			checkTest: false,
			pieces: null,
			x: -1,
			y: -1
		};
		CHESSAPP.utils.extend(stg, settings);
		var pieces = stg.pieces,
		    x = stg.x,
		    y = stg.y;
		if(!this.withinBounds(x,y)){
			return null;
		}
		for(var i = 0; i < pieces.length; i++){
			if(pieces[i]){
				if(pieces[i].x == x && pieces[i].y == y){
					return pieces[i];
				}
			}
		}
		return null;
	},
	copyAndReplace : function(settings){
		var stg = {
			pieces: null,
			overrides: null
		},
		newArray,
		max,
		max_o;
		CHESSAPP.utils.extend(stg, settings);

		max = stg.pieces.length;
		max_o = stg.overrides.length;
		newArray = new Array(max);
		for(var i = 0; i < max; i++){        
			newArray[i] = CHESSAPP.utils.shallowCopy(stg.pieces[i]);
		}
		for(var j = 0; j < max_o; j++){
			var index = stg.overrides[j].pieceIndex;
			newArray[index] = null;
			newArray[index] = stg.overrides[j].val;
		}
		return newArray;
	}
};