
const xhttp = new XMLHttpRequest();
let playerAnswers = [];
let mainDiv = document.querySelector("#mainDiv");

window.onload = loadSelectScreen;


function prepGame(questions){
	questions.count = 0;
	playerAnswers = [];
	questions.getQuestion = function(){
		let question = questions[this.count];
		this.count++;
		randomizeAlternatives(question);
		return question;
	};
	loadQuestion(questions);
}


function loadQuestion(questions){
	if (questions.count < questions.length){
		createQuestionScreen(questions);
		createCancelButton(mainDiv, "Cancel");
	}
	else{
		displayResult(questions);
	}
}


xhttp.onreadystatechange = function() {
	console.log(xhttp.readyState);
	if (xhttp.readyState === 4){
		if (xhttp.status === 200){
			console.log("200");
			let questions = JSON.parse(this.responseText).results;
			prepGame(questions);
			console.log(questions);
		}
		if (xhttp.status === 404){
			console.log("not found");
		}
	}
};


//--------------------------Load Resultscreen---------------------------
//----------------------------------------------------------------------
function displayResult(questions){
	mainDiv.innerHTML = "";
	let tableDiv = createElement("div", "tableDiv");
	let p = createElement("p", "resultHeader");
	p.innerHTML = "Result"
	tableDiv.appendChild(p);
	let table = createElement("table","resultTable");
	let result = [];
	let columnData = [];
	let question = {};

	let headerRow = createRow(["Question", "Correct Answer", "Your Answer"], true, "tableHeader");
	table.appendChild(headerRow);
	for (let i=0; i<questions.length; i++){
		question = questions[i];
		columnData = parseColumnData(question, i);
		row = createRow(columnData, false, "tableRow");
		result.push(compareAnswer(question, i));
		console.log("result: " + result );
		table.appendChild(row);
	}
	tableDiv.appendChild(table);
	mainDiv.appendChild(tableDiv);

	//---------Progress Bar--------------------

	//let progressBar = createElement("progress", "progressBar");
	let sum = arraySum(result);
	let resultP = createElement("p", "resultP");
	resultP.innerHTML = "You answered " + sum + " out of " + questions.length + " correctly.";
	mainDiv.appendChild(resultP);
	let progressBar = createElement("progress", "progressBar");
	progressBar.setAttribute("max", questions.length);
	progressBar.setAttribute("value", sum);
	console.log("result: " + arraySum(result));
	mainDiv.appendChild(progressBar);
	//-----------------------------------------
	createCancelButton(mainDiv, "Back");
}


//-----------------LOAD SELECTSCREEN----------------------------------
//--------------------------------------------------------------------

function loadSelectScreen(){
	mainDiv.innerHTML = "";
	createDropDownSelect("Category", "category", categoryAlt);
	createDropDownSelect("Difficulty", "difficulty", difficultyAlternatives);
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

	let questionText = document.createElement("p");
	questionText.innerHTML = newQuestion.question;
	div.appendChild(questionText);
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

	let answerButtons = document.getElementsByClassName("answerButton");

	for (let i=0; i<answerButtons.length; i++){
		
		answerButtons[i].addEventListener("click", function(){
			console.log(this.value);
			playerAnswers.push(this.value);
			//nextQuestion(questions);
			loadQuestion(questions);
		});
	}
}


//------------------Helper Functions------------------------------
//----------------------------------------------------------------


function arraySum(array){
	let sum = 0;
	for(let i=0; i<array.length; i++){
		sum += array[i];
	}
	return sum;
}

function createRow(columns, isFirstRow, cssClass){
	let row = document.createElement("tr");
	let column;
	for (let i=0; i<columns.length; i++){
		if(isFirstRow === true){
			column = document.createElement("th");
		}
		else{
			column = document.createElement("td");
		}
		column.setAttribute("class", cssClass);
		column.innerHTML = columns[i];
		row.appendChild(column);
	}
	return row;
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




function compareAnswer(question, index){
	if(question.correct_answer.localeCompare(playerAnswers[index]) === 0)
		return 1;
	else
		return 0;
}


function parseColumnData(question, index){
	let temp = [];
	temp.push(question.question);
	temp.push(question.correct_answer);
	temp.push(playerAnswers[index]);

	return temp;
}


function createCancelButton(parentElement, text){
	let cancelButton = document.createElement("button");
	cancelButton.innerHTML = text;
	parentElement.appendChild(cancelButton);

	cancelButton.addEventListener("click", function(){
		loadSelectScreen();
	});
}


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


function createTable(id){
	let table = document.createElement("table");
	table.setAttribute("id", id);

	return table;
}

function createElement(type, id){
	let element = document.createElement(type);
	element.setAttribute("id", id);

	return element;
}


//---------------------API Info for Creating Menus---------------
//---------------------------------------------------------------

let difficultyAlternatives = ["Easy", "Medium", "Hard"];
let amountAlt = ["5", "10", "15"];
let categoryAlt = [{"name": "Any", "value": 0}, 
				   {"name": "Film", "value": 11},
				   {"name": "Books", "value": 10},
				   {"name": "Video Games", "value" : 15},
				   {"name": "Art", "value": 25},
				   {"name": "Sports", "value": 21},
				   {"name": "Books", "value": 10},
				   {"name": "Computers", "value": 18},
				   {"name": "Math", "value": 19}
			      ];