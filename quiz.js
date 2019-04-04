
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

function parseAnswers(questions){
	for (let i=0; i<questions.length; i++){
		correctAnswers.push(questions[i].correct_answer);
	}
}

function showResults(){

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
	}
}

//-----------------LOAD SELECTSCREEN----------------------------------
//--------------------------------------------------------------------

function loadSelectScreen(){
	mainDiv.innerHTML = "";
	createCategorySelect(mainDiv);
	createDifficultySelect(mainDiv);
	createAmountSelect(mainDiv);
	createSubmitButton(mainDiv);
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

function createCategorySelect(htmlElement){

	let div = document.createElement("div");
	div.setAttribute("class", "selects");

	var labelCategory = document.createElement("label");
	labelCategory.innerHTML = "Category";
	div.appendChild(labelCategory);

	var selectCategory = document.createElement("select");
	selectCategory.setAttribute("name", "category");


	var option0 = document.createElement("option");
	option0.setAttribute("value", "10");
	option0.innerHTML = "Books"
	selectCategory.appendChild(option0);

	var option1 = document	.createElement("option");
	option1.setAttribute("value", "11");
	option1.innerHTML = "Film";
	selectCategory.appendChild(option1);

	div.appendChild(selectCategory);

	htmlElement.appendChild(div);
}

function createDifficultySelect(htmlElement){

	let div = document.createElement("div");
	div.setAttribute("class", "selects");

	var labelDifficulty = document.createElement("label");
	labelDifficulty.innerHTML = "Difficulty";
	div.appendChild(labelDifficulty);
	
	var selectDifficulty = document.createElement("select");
	selectDifficulty.setAttribute("name", "difficulty");

	var option0 = document.createElement("option");
	option0.setAttribute("value", "easy");
	option0.innerHTML = "Easy";
	selectDifficulty.appendChild(option0);
	
	var option1 = document.createElement("option");
	option1.setAttribute("value", "medium");
	option1.innerHTML = "Medium";
	selectDifficulty.appendChild(option1);

	var option2 = document.createElement("option");
	option2.setAttribute("value", "hard");
	option2.innerHTML = "Hard";
	selectDifficulty.appendChild(option2);

	div.appendChild(selectDifficulty);

	htmlElement.appendChild(div);
}

function createAmountSelect(htmlElement){
	let div = document.createElement("div");
	div.setAttribute("class", "selects");

	var labelAmount = document.createElement("label");
	labelAmount.innerHTML = "Number of Questions";
	div.appendChild(labelAmount);
	
	var selectAmount = document.createElement("select");
	selectAmount.setAttribute("name", "amount")


	var option0 = document.createElement("option");
	option0.setAttribute("value", "5");
	option0.innerHTML = "5";
	selectAmount.appendChild(option0);

	var option1 = document.createElement("option");
	option1.setAttribute("value", "10");
	option1.innerHTML = "10";
	selectAmount.appendChild(option1);

	div.appendChild(selectAmount);

	htmlElement.appendChild(div);
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