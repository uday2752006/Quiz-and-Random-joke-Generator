
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('previous');

const myQuestions = [
    {
        question: "What is the capital of France?",
        answers: 
        {
            a: "London",
            b: "Paris",
            c: "Berlin",
            d: "Madrid"
        },
        correctAnswer: "b"
    },
    {
        question: "Which language runs in a web browser?",
        answers: 
        {
            a: "Java",
            b: "C",
            c: "Python",
            d: "JavaScript"
        },
        correctAnswer: "d"
    },
    {
        question: "What does CSS stand for?",
        answers: 
        {
            a: "Central Style Sheets",
            b: "Cascading Style Sheets",
            c: "Cascading Simple Sheets",
            d: "Cars SUVs Sailboats"
        },
        correctAnswer: "b"
    }
];

let currentQuestion = 0;
let userAnswers = Array(myQuestions.length).fill(null);

function buildQuiz()
{
    const output = [];
    
    myQuestions.forEach((currentQuestionObj, questionNumber) => 
        {
        const answers = [];
        
        for(letter in currentQuestionObj.answers)
            {
            answers.push(
                `<label>
                    <input type="radio" name="question${questionNumber}" value="${letter}">
                    ${letter}: ${currentQuestionObj.answers[letter]}
                </label><br>`
            );
        }
        
        output.push(
            `<div class="question ${questionNumber === currentQuestion ? 'active' : 'hidden'}"> 
                <p>${currentQuestionObj.question}</p>
                <div class="answers"> ${answers.join('')} </div>
            </div>`
        );
    });
    
    quizContainer.innerHTML = output.join('');
    showQuestion(currentQuestion);
}

function showQuestion(n) 
{
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        question.classList.add('hidden');
    });
    
    questions[n].classList.remove('hidden');
    
    prevButton.disabled = n === 0;
    nextButton.disabled = n === myQuestions.length - 1;
    
    const selectedOption = document.querySelector(`input[name="question${n}"]:checked`);
    if (userAnswers[n] !== null) {
        const optionToSelect = document.querySelector(`input[name="question${n}"][value="${userAnswers[n]}"]`);
        if (optionToSelect) optionToSelect.checked = true;
    }
}

function showResults()
{
    let numCorrect = 0;
    
    myQuestions.forEach((currentQuestionObj, questionNumber) => 
        {
        if(userAnswers[questionNumber] === currentQuestionObj.correctAnswer){
            numCorrect++;
        }
    });
    
    resultsContainer.innerHTML = `You got ${numCorrect} out of ${myQuestions.length} correct!`;
}

function storeAnswer(questionNumber) {
    const selectedOption = document.querySelector(`input[name="question${questionNumber}"]:checked`);
    if (selectedOption) {
        userAnswers[questionNumber] = selectedOption.value;
    }
}

submitButton.addEventListener('click', showResults);
nextButton.addEventListener('click', () => {
    storeAnswer(currentQuestion);
    currentQuestion++;
    showQuestion(currentQuestion);
});
prevButton.addEventListener('click', () => {
    storeAnswer(currentQuestion);
    currentQuestion--;
    showQuestion(currentQuestion);
});

buildQuiz();
quizContainer.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
        const questionNumber = parseInt(e.target.name.replace('question', ''));
        userAnswers[questionNumber] = e.target.value;
    }
});


const jokeButton = document.getElementById('fetch-joke');
const jokeDisplay = document.getElementById('joke-display');

jokeButton.addEventListener('click', fetchJoke);

async function fetchJoke() {
    try {
        jokeDisplay.textContent = "Loading joke...";
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        jokeDisplay.innerHTML = `<strong>${data.setup}</strong><br>${data.punchline}`;
    } catch (error) {
        jokeDisplay.textContent = "Failed to fetch joke. Please try again later.";
        console.error('Error fetching joke:', error);
    }
}