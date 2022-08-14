const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = 600;
const height = 800;
const padding = 20;

let state = {
	invalid: [],
	word: "",
	guess: "",
	guesses: [],
	buttons: [],
	lives: 5,
	chars: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
	end: false
};

canvas.onclick = handleClick;
setup();

function handleClick(e){
	let x = e.clientX;
	let y = e.clientY;
	
	if(state.end){
		return;
	};
	
	for(let i = 0; i < state.buttons.length; i++){
		let btn = state.buttons[i];
		if((x >= btn.left && x <= (btn.left+btn.width)) && (y >= btn.top && y <= (btn.top+btn.height))){
			if(btn.action === "add"){
				//console.log(btn.char);
				addCharToGuess(btn.char);
			}else if(btn.action === "submit"){
				submitGuess();
			}else if(btn.action === "back"){
				state.guess = state.guess.substr(0, state.guess.length-1)
				drawGuess();
			};
			return;
		};
	};	
};

function submitGuess(){
	if(state.guess.length == state.word.length){
		let newGuess = [];
		for(let i = 0; i < state.guess.length; i++){
			if(state.guess[i] == state.word[i]){
				newGuess.push({char: state.guess[i], status: true});
			}else{
				if(state.word.indexOf(state.guess[i]) < 0){
					if(state.invalid.indexOf(state.guess[i]) < 0){
						state.invalid.push(state.guess[i]);
					};
				}
				newGuess.push({char: state.guess[i], status: false});
			};
		};
		state.guesses.push(newGuess); 
	};
	
	if(state.word == state.guess){
		console.log("WIN");
		state.end = true;
	}
	
	if(state.guesses.length >= state.lives && !state.end){
		console.log("LOSE");
		state.end = true;
	}
	
	state.guess = "";
	drawGuess();
	drawKeyboard();
}

function addCharToGuess(char){
	if(state.guess.length < state.word.length){
		state.guess += char;
		drawGuess();
	};
}

function setup(){
	canvas.width = width;
	canvas.height = height;
	context.fillStyle="lightgray";
	context.fillRect(0, 0, width, height);
	context.fontAlign = "middle";
	
	state.word = words[Math.ceil(Math.random()*words.length)];
	
	drawKeyboard();
	drawGuess();
	drawButtons();
}	

function drawGuess(){
	let length = state.word.length;
	let box_size = ((width - (padding*2)) - (5*length)) / length;
	let offset = padding;
	let topOffset = padding;
	context.font = box_size-10+"px sans-serif"
	let currentGuess = false;
	for(let o = 0; o < state.lives; o++){
		let guess = false;
		if(state.guesses[o]){
			guess = state.guesses[o];
		};
		for(let i = 0; i < length; i++){
			context.fillStyle = "grey";
			if(guess){
				if(guess[i].status){
					context.fillStyle = "green";
				}else{
					if(state.word.indexOf(guess[i].char) >= 0){
						context.fillStyle = "orange";
					}else{
						context.fillStyle = "red";
					};
				};
			}
			context.fillRect(offset, topOffset, box_size, box_size);
			context.fillStyle = "black";
			if(guess){
				context.fillText(guess[i].char, offset+10, box_size+topOffset-10);
			}else{
				if(!currentGuess && state.guess[i]){
					context.fillText(state.guess[i], offset+10, box_size+topOffset-10);
				}
			};
			offset += (box_size + 5);
		};
		if(!state.guesses[o]){
			currentGuess = true;
		};
		topOffset += box_size+5;
		offset = padding;
	};
}

function drawKeyboard(){
	let min_key_size = 50;
	let availableSpace = (width - (padding*2)) - (5*8);
	let keysize = availableSpace / 9;
	context.font = keysize-10+"px sans-serif"
	let topOffset = (height - padding) - ((keysize * 3) + (5 * 3)) - 70;
	let leftOffset = padding;
	let lineKeyCount = 0;
	for(let i = 0; i < state.chars.length; i++){
		if(state.invalid.indexOf(state.chars[i]) >= 0){
			context.fillStyle = "grey";
		}else{	
			context.fillStyle = "white";
		};
		context.fillRect(leftOffset, topOffset, keysize, keysize);
		let newButton = {left: leftOffset, top: topOffset, width: keysize, height: keysize, char: state.chars[i], action: "add"};
		state.buttons.push(newButton);
		context.fillStyle = "black";
		context.fillText(state.chars[i], leftOffset+10, keysize+topOffset-10);
		leftOffset += keysize +5;
		lineKeyCount++;
		if(lineKeyCount == 9){
			topOffset += (keysize + 5);
			leftOffset = padding;
			lineKeyCount = 0;
		}
	}
}

function drawButtons(){
	let topOffset = (height - padding) - 60;
	context.font = "40px sans-serif";
	let btnwidth = ((width - (padding*2))-5)/2;
	context.fillStyle = "red";
	context.fillRect(padding, topOffset, btnwidth, 60);
	state.buttons.push({left: padding, top: topOffset, width: btnwidth, height: 60, action: "back"});
	context.fillStyle = "black";
	context.fillText("backspace", (btnwidth / 2 - (9*9)), topOffset+45);
	context.fillStyle = "blue";
	context.fillRect((padding + btnwidth + 5), topOffset, btnwidth, 60);
	state.buttons.push({left: (padding + btnwidth +5), top: topOffset, width: btnwidth, height: 60, action: "submit"});
	context.fillStyle = "black";
	context.fillText("submit", (btnwidth + 5)+(btnwidth / 2 - (9*6)), topOffset+45);
}
