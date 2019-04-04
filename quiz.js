
const xhttp = new XMLHttpRequest();
let questions = [];
let playerAnswers = [];
let correctAnswers = [];
let questionCount = 0;//use shift instead?
let mainDiv = document.querySelector("#mainDiv");

window.onload = loadSelectScreen;

xhttp.onreadystatechange = () =>{
	console.log(xhttp.readyState);
	if (xhttp.readyState === 4){
		if (xhttp.status === 200){
			console.log("200");
			questions = JSON.parse(xhttp.responseText).results;
			//let questions = JSON.parse(xhttp.responseText).results;
			parseAnswers(questions);
			startGame(questions);

			console.log(questions);
		}
		if (xhttp.status === 404){
			console.log("not found");
		}
	}
};

function request(url){
	xhttp.open("get", url, true);
	xhttp.send();
}

function checkAnswer(){
	let sum = 0;
	for (let i=0; i<correctAnswers.length; i++){
		if(playerAnswers[i].localeCompare(correctAnswers[i]) === 0){
			sum += 1;
		}
	}
	console.log("correct answers: " + sum);
	console.log("player: " + playerAnswers);
	console.log("correct: " + correctAnswers);
	loadSelectScreen();
}



function displayResults(){

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

function startGame(questions){
	playerAnswers = [];
	correctAnswers = [];
	questionCount = 0;
	parseAnswers(questions);
	loadQuestion(questions);
}

function loadQuestion(){
	if (questions.length > 0){
		let currentQuestion = questions.shift();
		questionCount += 1;
		randomizeAlternatives(currentQuestion);
		createQuestionScreen(currentQuestion);
	}
	else{
		checkAnswer();
		displayResults();
	}
}

//-----------------LOAD SELECTSCREEN----------------------------------
//--------------------------------------------------------------------

function loadSelectScreen(){
	mainDiv.innerHTML = "";
	createDropDownSelect("Category", "category", categoryAlt);
	createDropDownSelect("Difficulty", "difficulty", difficultyAlt);
	createDropDownSelect("Number of Questions", "amount", amountAlt);
	createSubmitButton(mainDiv);
}

function createDropDownSelect(title, name, subjectList){
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

//---------------------------LOADING QUESTION-----------------------------------
//------------------------------------------------------------------------------

function createQuestionScreen(question){
	mainDiv.innerHTML = "";

	let questionHeader = document.createElement("h1");
	questionHeader.innerHTML = "Question nr " + questionCount + ":";
	mainDiv.appendChild(questionHeader);

	let questionP = document.createElement("p");
	questionP.innerHTML = question.question;
	mainDiv.appendChild(questionP);

	let alternatives = document.createElement("div");
	alternatives.setAttribute("id", "alternatives");

	let button;
	let text;
	for (var i=0; i<question.randomizedAlternatives.length; i++){
		text = question.randomizedAlternatives[i];
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
			loadQuestion();
		});
	}
}

//------------------Helper Functions------------------------------
//----------------------------------------------------------------

function parseAnswers(questions){
	for (let i=0; i<questions.length; i++){
		correctAnswers.push(questions[i].correct_answer);
	}
}

//---------------------API Info----------------------------------
//---------------------------------------------------------------

let difficultyAlt = ["Easy", "Medium", "Hard"];
let amountAlt = ["5", "10", "15"];
let categoryAlt = [{"name": "Any", "value": 0}, 
				   {"name": "Film", "value": 11},
				   {"name": "Books", "value": 10}
			      ];