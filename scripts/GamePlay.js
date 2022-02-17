CHESSAPP.GamePlay = (function(){
	var that = {}, 
	pieceGettingPromoted = null;
that.pieces = []; 
that.cells;
var _settings;

var options = [],
	overrides = {},
	selectedPieceIndex = -1;
var toFile = function(num){
	console.log(65+num);
	return String.fromCharCode(96+parseInt(num));
};
var toAbbr = function(pieceType){
	switch(pieceType){
		case "pawn":
			return "";
			break;
		case "queen":
			return "Q";
			break;
		case "king":
			return "K";
			break;
		case "bishop":
			return "B";
			break;
		case "rook":
			return "R";
			break;
		case "knight":
			return "N";
			break;
	}
};
that.getTurn = function(){
	return _settings.turn;
}
that.statusUpdate = function(stg){
	CHESSAPP.ui.statusUpdate(stg);
}
that.setOnlineColor = function(color){
	if(color == 'W' || color == 'B'){
		_settings.onlineColor = color;
	}
};
that.sendMove = function(move){
	if(_settings.online && move){
		CHESSAPP.onlinePlay.sendMove(move);
	}
};
that.switchTurn = function(){
	if(_settings.turn == "W"){
		_settings.turn = "B";
	}else{
		_settings.turn = "W";
	}
};
that.pieceClicked = function(piece){ 
	var color = piece.color;
	if(color != _settings.turn){return;}
	if(_settings.online && (_settings.onlineColor != _settings.turn)){return;}
	that.clearAllOptionStyles();
	selectedPieceIndex = that.pieces.indexOf(piece);

	var pieceOptions = options[selectedPieceIndex];

	for(var i = 0; i < pieceOptions.length; i++){
		var opt = pieceOptions[i];
		CHESSAPP.ui.addOptionStyles(that.cells[opt.x][opt.y], opt);
	}
};
that.cellClicked = function(x,y){
	var cell = that.cells[x][y];
	if(selectedPieceIndex != -1){
		var piece = that.pieces[selectedPieceIndex];
		var opt = that.isOption(piece, cell);
		if(opt){
			var moveOptions = {
				piece: piece,
				x: x,
				y: y,
				local: true,
				special: opt.special
			}
			that.movePieceTo(moveOptions);
		}       
	}
};
that.isOption = function(piece, cell){
	var index = that.pieces.indexOf(piece);
	var pieceOptions = options[index],
	    cellX = cell.x,
	    cellY = cell.y;

	for(var i =0; i < pieceOptions.length; i++){
		if(pieceOptions[i].x == cellX && pieceOptions[i].y == cellY){
			return pieceOptions[i];
		}
	}
	return false;
};
that.inCheck = function(overrides){
	var inCheck = false;
	for(var i = 0; i < that.pieces.length; i++){
		that.getOptions(that.pieces[i], null);
	}
	return inCheck;
};
that.init = function(userSettings){
	_settings = {
		containerID : "chessboard",
		online: false,
		preferredColor: false,
		turn : "W",
		onlineColor : false,
		locked: false,
	};
	CHESSAPP.utils.extend(_settings, userSettings);
	var container = document.getElementById(_settings['containerID']);
	if(container == null){
		console.log("container element not found with id: " + _settings['containerID']);
		return false;
	}
	var p = {
		container: container,
		online: _settings.online
	};
	that.cells = CHESSAPP.ui.init(p);
	that.lock();
	CHESSAPP.ui.onInitialChoice(function(pref){
		console.log(pref);
		if(pref.hasOwnProperty("color")){
			_settings.preferredColor = pref.color;
		}
		if(pref.hasOwnProperty("online")){
			_settings.online = pref.online;
		}
		console.log(_settings);
		if(_settings.online){
			console.log("connecting...");
			CHESSAPP.onlinePlay.connect(_settings, function(){
				that.setUpBoard.apply(that);
			});
		} 
		else{
			that.setUpBoard();
		}
	});
};
that.lock = function(stg){
};
that.setUpBoard = function(){
	if(that.pieces){
		delete that.pieces;
	}
	that.pieces = [
	{
			x: 0,
			y: 0,
			color: 'B',
			pieceType: "rook"
	},
	{
		x: 0,
		y: 7,
		color: 'W',
		pieceType: "rook"
	},
	{
		x: 7,
		y: 0,
		color: 'B',
		pieceType: "rook"
	},
	{
		x: 7,
		y: 7,
		color: 'W',
		pieceType: "rook"
	},
	{
		x: 4,
		y: 7,
		color: 'W',
		pieceType: "king"
	},
	{
		x: 4,
		y: 0,
		color: 'B',
		pieceType: "king"
	},
	{
		x: 6,
		y: 0,
		color: 'B',
		pieceType: "knight"
	},
	{
		x: 1,
		y: 0,
		color: 'B',
		pieceType: "knight"
	},
	{
		x: 6,
		y: 7,
		color: 'W',
		pieceType: "knight"
	},
	{
		x: 1,
		y: 7,
		color: 'W',
		pieceType: "knight"
	},
	{
		x: 5,
		y: 0,
		color: 'B',
		pieceType: "bishop"
	},
	{
		x: 2,
		y: 0,
		color: 'B',
		pieceType: "bishop"
	},
	{
		x: 5,
		y: 7,
		color: 'W',
		pieceType: "bishop"
	},
	{
		x: 2,
		y: 7,
		color: 'W',
		pieceType: "bishop"
	},
	{
		x: 3,
		y: 0,
		color: 'B',
		pieceType: "queen"
	},	
	{
		x: 3,
		y: 7,
		color: 'W',
		pieceType: "queen"
	}
	];
	for(var p = 0; p < 8; p++)
	{
		that.pieces.push({
			x : p,
			y: 1,
			color: 'B',
			pieceType: "pawn"
		});
	}
	for(var p = 0; p < 8; p++)
	{
		that.pieces.push({
			x : p,
			y: 6,
			color: 'W',
			pieceType: "pawn"
		});
	}
	for(var i = 0; i < that.pieces.length; i++){
		that.pieces[i].numOfMoves = 0;

	}
	CHESSAPP.ui.drawPieces(that.pieces,that.cells);
	that.updateOptions();
};
that.clearAllOptionStyles = function(){
	for(var y = 0; y < 8; y++){     
		for(var x = 0; x < 8; x++){
			CHESSAPP.ui.clearOptionStyles(that.cells[x][y]);
		}
	}
};
that.updateOptions = function(){
	var response = CHESSAPP.Analyzer.makeAllOptions({pieces: that.pieces}),
	    currentColor = _settings.turn, 
	    stalemate = currentColor, 
	    check = false,
	    checkmate = false; 
	options = response.allOptions;
	for(var i = 0; i < options.length; i++){
		if(!that.pieces[i]){
			continue;
		}
		if(that.pieces[i].color == currentColor){
			if(options[i].length == 0){
				continue;
			}
			else{
				stalemate = false;
			}
		}
	}
	if(response.kingInCheck){
		check = response.kingInCheck;
	}
	if(stalemate && check){
		checkmate = check;
	}
	var local = (currentColor == _settings.onlineColor),
	    msg = "",
	    type = "fb";
	if(checkmate){
		if(local){
			type = "e";
		}
		else{
		}
	}
	else if(stalemate){
		type = "f";
	}
	else if(check){
		if(local){
			type = "e";
		}
		else{
		}
	}
	if(check || checkmate || stalemate){
		that.statusUpdate({msg : msg, type : type});
	}
}
that.movePieceTo = function(stg){
	var piece = stg.piece,
	    x = stg.x,
	    y = stg.y,
	    cell = that.cells[x][y],
	    pieceAtLocation = (stg.special == null) ? CHESSAPP.Analyzer.pieceExists({pieces: that.pieces, x:x, y:y}) : null,//wait if special
	    callback = stg.callback,
	    moveData =  {
		    pieceType: piece.pieceType,
		    fromX: piece.x,
		    toX: x,
		    toY: y
	    };

	if(_settings.locked == true){
		return false;
	}
	if(!that.isOption(piece, cell)){
		return false;
	}


	if(stg.local){
		if(piece.pieceType == "pawn" && (y == 0 || y == 7)){
			var cb = function(){
				stg.promotion = true;
				that.movePieceTo(stg);
			};
			that.showPromotion({piece: piece, callback : cb});
			return;
		}
	}
	if(stg.special != null){
		console.log("Special move!", stg.special);
		if(stg.special.type=="en"){
			pieceAtLocation = CHESSAPP.Analyzer.pieceExists({pieces:that.pieces, x:stg.special.enx, y:stg.special.eny});
		}
		else if(stg.special.type=="castle"){
			console.log("Castling");
			var rook = CHESSAPP.Analyzer.pieceExists({pieces:that.pieces, x:stg.special.rookx, y:stg.special.rooky});
			rook.y =  stg.special.rooktoy;
			rook.x = stg.special.rooktox;
			rook.numOfMoves++;
			rook.justMoved = true;
			CHESSAPP.ui.addPiece(rook, that.cells[rook.x][rook.y]);
		}
	}
	if(pieceAtLocation != null){           
		if(pieceAtLocation.color != piece.color)
		{
			moveData.killed = true;
			that.killPiece(pieceAtLocation);         
		}
		else{
			console.log("Invalid move cannot move on another piece of same color");
			return;
		}
	}

	if(stg.local){
		var params = {pieceX: piece.x, pieceY: piece.y, newX: x, newY: y, special: stg.special};
		if(stg.promotion){
			params.promotion = piece.pieceType;
		}
		that.sendMove(params);
	}
	if(stg.promotion){
		moveData.promotion = stg.promotion;
	}
	piece.y = y;
	piece.x = x;
	piece.numOfMoves++;
	piece.justMoved = true;
	that.switchTurn(); 
	// that.addToMoveList(moveData);
	that.clearAllOptionStyles();
	selectedPieceIndex = -1;
	CHESSAPP.ui.addPiece(piece, cell);
	that.updateOptions();
}; 
that.killPiece = function(piece){
	that.removePieceFromDom(piece);
	that.removePieceFromList(piece);
}
that.removePieceFromDom = function(piece){
	var parent = piece.reference.parentNode;
	if(parent != null){
		parent.removeChild(piece.reference);
	}
};
that.removePieceFromList = function(piece){
	that.pieces[that.pieces.indexOf(piece)] = null;
};
that.showPromotion = function(stg){
	_settings.locked = true;
	stg.val = true;
	CHESSAPP.ui.setSelectionVisible(stg);
},
	that.promote = function(stg){
		var type = stg.pieceType,
		pieceGettingPromoted = stg.piece;
		if(pieceGettingPromoted){
			var local = pieceGettingPromoted.color == _settings.onlineColor;
			if(local || !_settings.online){
			}
			else{
			}
			pieceGettingPromoted.pieceType = type;
			CHESSAPP.ui.updatePiece(pieceGettingPromoted); 
			CHESSAPP.ui.setSelectionVisible({val: false});
			_settings.locked = false;
			if(stg.callback){
				stg.callback();
			}       
		}
	};
that.onlineMove = function(data){
	console.log(data);
	var pieceMoved = CHESSAPP.Analyzer.pieceExists({pieces: that.pieces, x: data.pieceX, y: data.pieceY});
	if(pieceMoved){
		if(data.promotion){
			that.promote({piece: pieceMoved, pieceType: data.promotion});
		}
		that.movePieceTo({piece: pieceMoved, x: data.newX, y: data.newY, promotion: data.promotion, special: data.special});
	}
}

that.chatMessage = function(stg){
	if(!stg.msg){
		return;
	}          
	if(stg.local){
		stg.color = _settings.onlineColor;
		CHESSAPP.onlinePlay.sendChat(stg);
	}
	CHESSAPP.ui.addChatMessage(stg);
}
return that;
})();
var statusScroller = function(stg){
	if(this == window){
		return new statusScroller(stg);
	}
	var lineHeight = 0,
	    offset = 0,
	    maxLines = stg.maxLines,
	    totalLines = 0,
	    containerElem = stg.elem,
	    windowElem = document.createElement("div");

	windowElem.style.position = "relative";
	containerElem.appendChild(windowElem);
	this.updateClasses = function(){
		return;
		CHESSAPP.utils.removeClass(containerElem, "upDisabled");
		CHESSAPP.utils.removeClass(containerElem, "downDisabled");
		if(totalLines < maxLines){
			CHESSAPP.utils.addClass(containerElem, "upDisabled");
			CHESSAPP.utils.addClass(containerElem, "downDisabled");
		}
		else if(offset == (maxLines - totalLines) - 1){
			CHESSAPP.utils.addClass(containerElem, "downDisabled");
		}
		else if(offset == 0){
			CHESSAPP.utils.addClass(containerElem, "upDisabled");
		}
	}
	this.move = function(up){
		if(stg.scroll){return;}
		if(totalLines <= maxLines){
			return;
		}
		if(up){
			if(offset >= 0){
				return;
			}
			else{
				offset++;
			}             
		}
		else{
			if(offset <= (maxLines - totalLines) - 1){
				return;
			}
			else{
				offset--;
			}
		}
		windowElem.style.top = (offset * lineHeight) + "px";
		this.updateClasses();
	};
	this.goToBottom = function(){
		if(stg.scroll){
			containerElem.scrollTop = containerElem.scrollHeight;
		}
		else{
			if(totalLines > maxLines){
				offset = (maxLines - totalLines);
				windowElem.style.top = (offset * lineHeight) + "px";
			}
		}
		this.updateClasses();
	};
	this.add = function(stg){
		var def = {
			msg : "",
			showTime: false
		},
		    textNode,
		    textNode2,
		    p = document.createElement("p"),       
		    timeEl = document.createElement("time");
		CHESSAPP.utils.extend(def, stg);
		if(def.msg == null){
			return false;
		}
		timeEl.appendChild(textNode);

		textNode2 = document.createTextNode(stg.msg);      
		p.appendChild(textNode2);
		p.setAttribute("class", def.type);
		windowElem.appendChild(p);
		totalLines++;
		lineHeight = p.offsetHeight;
		this.goToBottom();
	}
};