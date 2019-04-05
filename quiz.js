
const xhttp = new XMLHttpRequest();
let playerAnswers = [];

window.onload = loadSelectScreen;


function startGame(questions){
	questions.correctAnswers = parseAnswers(questions);
	questions.count = 0;
	
	questions.getQuestion = function(){
		if(this.count < this.length){
			let question = questions[this.count];
			this.count++;
			randomizeAlternatives(question);
			return question;
		}
		return null;
	};

	nextQuestion(questions);
}


function nextQuestion(questions){
	if (questions.count < questions.length){
		createQuestionScreen(questions);
	}
	else{
		checkAnswer(questions);
		displayResults();
	}
}


function checkAnswer(questions){
	let sum = 0;
	for (let i=0; i<questions.length; i++){
		if(playerAnswers[i].localeCompare(questions[i].correct_answer) === 0){
			sum += 1;
		}
	}
	console.log("correct answers: " + sum);
	console.log("player: " + playerAnswers);
	console.log("correct: " + questions.correctAnswers);
	loadSelectScreen();
}


function displayResults(){


}

xhttp.onreadystatechange = function() {
	console.log(xhttp.readyState);
	if (xhttp.readyState === 4){
		if (xhttp.status === 200){
			console.log("200");
			let questions = JSON.parse(this.responseText).results;
			startGame(questions);
			console.log(questions);
		}
		if (xhttp.status === 404){
			console.log("not found");
		}
	}
};


//-----------------LOAD SELECTSCREEN----------------------------------
//--------------------------------------------------------------------

function loadSelectScreen(){
	let mainDiv = document.querySelector("#mainDiv");
	mainDiv.innerHTML = "";
	createDropDownSelect("Category", "category", categoryAlt);
	createDropDownSelect("Difficulty", "difficulty", difficultyAlternatives);
	createDropDownSelect("Number of Questions", "amount", amountAlt);
	createSubmitButton(mainDiv);
}


function createDropDownSelect(title, name, subjectList){
	let mainDiv = document.querySelector("#mainDiv");
	let div = document.createElement("div");
	div.setAttribute("class", "selects");
	
	let label = document.createElement("label");
	label.innerHTML = title;
	div.appendChild(label);
	let select = document.createElement("select");
	select.setAttribute("name", name);

	let currentItem;
	let option;
	
	for (let i=0; i<subjectList.length; i++){
		currentItem = subjectList[i];
		option = document.createElement("option");
		if(currentItem.name !== undefined){
			option.setAttribute("value", currentItem.value);
			option.innerHTML = currentItem.name;
		}
		else{
			option.setAttribute("value", currentItem.toLowerCase());
			option.innerHTML = currentItem.toLowerCase();
		}
		select.appendChild(option);
	}
	div.appendChild(select);
	mainDiv.appendChild(div);
}


function createSubmitButton(htmlElement){
	let button = document.createElement("button");
	button.innerHTML = "Start Quiz";
	button.setAttribute("id", "submit");
	htmlElement.appendChild(button);

	button.addEventListener("click", () => {
		let category = document.querySelector("select[name='category']");
		category = Number(category.options[category.selectedIndex].value);
		
		let amount = document.querySelector("select[name='amount']");
		amount = Number(amount.options[amount.selectedIndex].value);

		let difficulty = document.querySelector("select[name='difficulty']");
		difficulty = difficulty.options[difficulty.selectedIndex].value;

		let url = "https://opentdb.com/api.php?";
		url += "category=" + category + "&amount=" + amount + "&difficulty=" +difficulty;
		console.log(url);
		request(url);
		});
}


//---------------------------LOAD QUESTION-----------------------------------
//---------------------------------------------------------------------------

function createQuestionScreen(questions){
	let newQuestion = questions.getQuestion();

	let mainDiv = document.querySelector("#mainDiv");
	mainDiv.innerHTML = "";

	//------------------------
	let div = document.createElement("div");
	div.setAttribute("id", "questionDiv");
	//------------------------

	let questionHeader = document.createElement("p");
	questionHeader.setAttribute("id", "questionHeader");
	questionHeader.innerHTML = "Question nr " + questions.count + ":";
	div.appendChild(questionHeader);

	let questionP = document.createElement("p");
	questionP.innerHTML = newQuestion.question;
	div.appendChild(questionP);
	mainDiv.appendChild(div);

	let alternatives = document.createElement("div");
	alternatives.setAttribute("id", "alternatives");

	let button;
	let text;
	let i;
	for (i=0; i<newQuestion.randomizedAlternatives.length; i++){
		text = newQuestion.randomizedAlternatives[i];
		button = document.createElement("button");
		button.setAttribute("class", "answerButton");
		button.setAttribute("value", text);
		button.innerHTML = text;
		alternatives.appendChild(button);
	}
	
	mainDiv.appendChild(alternatives);
	let cancelButton = document.createElement("button");
	cancelButton.innerHTML = "Cancel";
	mainDiv.appendChild(cancelButton);
	
	cancelButton.addEventListener("click", function(){
		loadSelectScreen();
	});

	let answerButtons = document.getElementsByClassName("answerButton");

	for (let i=0; i<answerButtons.length; i++){
		
		answerButtons[i].addEventListener("click", function(){
			console.log(this.value);
			playerAnswers.push(this.value);
			nextQuestion(questions);
		});
	}
}


//------------------Helper Functions------------------------------
//----------------------------------------------------------------

function parseAnswers(questions){
	let tempArray = [];
	for (let i=0; i<questions.length; i++){
		tempArray.push(questions[i].correct_answer);
	}
	return tempArray;
}


function shuffle(array){
	array.sort(() => Math.random() - 0.5);
}


function randomizeAlternatives(question){
	let alternatives = [...question.incorrect_answers];
	alternatives.push(question.correct_answer);
	shuffle(alternatives);
	question.randomizedAlternatives = alternatives;
}


function request(url){
	xhttp.open("get", url, true);
	xhttp.send();
}


//---------------------API Info for Creating Menus---------------
//---------------------------------------------------------------

let difficultyAlternatives = ["Easy", "Medium", "Hard"];
let amountAlt = ["5", "10", "15"];
let categoryAlt = [{"name": "Any", "value": 0}, 
				   {"name": "Film", "value": 11},
				   {"name": "Books", "value": 10}
			      ];