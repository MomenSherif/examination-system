/**
 ********************  FORM   ********************
 */

/**
 * Input Fields animation class Toggle
 */
let inputFields = document.querySelectorAll('.input__field');

inputFields.forEach(field => {
    field.addEventListener('focus', e => {
        field.parentNode.classList.add('input--focused');
    });

    field.addEventListener('blur', e => {
        if (field.value.trim() === '') {
            field.parentNode.classList.remove('input--focused');
        }
    });
});

/**
 * Username Validation
 *  ** not empty
 *  ** between 3 & 10 chars
 *  ** Not numbers only
*/
function isValidName(name) {
    return (name !== '' && isNaN(name) && name.length >= 3 && name.length <= 10);
}

/** 
 * Email Validaition
*/
function isValidEmail(email) {
    let regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(String(email).toLowerCase());
}

/** 
 * Phone Number Validation
 *  ** Must be Egyptian mobile number
 *  ** Pattern ^01[0125][0-9]{8}$ EX: 01060737723
*/
function isValidPhone(phoneNumber) {
    let regExp = /^01[0125][0-9]{8}$/;
    return regExp.test(phoneNumber);
}

/**
 * Submit form button handle
 */
let form = document.querySelector('.login-form__container');
let formMessage = document.querySelector('.login-form__msg');

form.addEventListener('submit', e => {
    e.preventDefault(); // Prevent default behaviour [Refresh Page]
    let username = form.username.value.trim();
    let email = form.email.value.trim();
    let phone = form.phone.value.trim();

    // Validate before submitting
    if (isValidName(username) && isValidEmail(email) && isValidPhone(phone)) {
        formMessage.textContent = `Welcome ${username}`;
        form.parentElement.classList.add('login-form--closed');
        localStorage.setItem('username', username);

        /* START THE QUI */
        setTimeout(() => {
            app.init(10, 2);
        }, 3000);

    } else {
        formMessage.textContent = 'Enter valid data !@#&$';
        setTimeout(() => {
            formMessage.innerHTML = '&nbsp;';
        }, 3000);
    }
});

/**
 ********************  TIMER  ********************
 */
const timer = {
    minutes: 1,
    seconds: 0,
};
const counter = document.querySelector('.counter');
const minutesUI = counter.querySelector('.counter__minutes');
const secondsUI = counter.querySelector('.counter__seconds');

const updateCounter = function () {
    if (timer.seconds > 0) {
        timer.seconds -= 1;
    } else {
        timer.seconds = 59;
        timer.minutes -= 1;
    }

};

const updateCounterUI = function ({ minutes, seconds }) {
    minutesUI.textContent = String(minutes).padStart(2, '0');
    secondsUI.textContent = String(seconds).padStart(2, '0');

    if (timer.seconds === 0 && timer.minutes === 0) {
        counter.textContent = 'Finished';
        counter.classList.add('counter--finished');
    }
};

/**
 ********************  QUESTION  ********************
 */
const UIController = (function () {
    // Private

    // All HTML Elements
    const UI = {
        questionForm: document.querySelector('.question'),
        questionIndicators: document.querySelector('.question__indicators'),
        questionNumber: document.querySelector('.question__number'),
        questionArchieve: document.querySelector('.question__archieve'),
        questionSubmitBtn: document.querySelector('.question__btn--submit'),
        questionText: document.querySelector('.question__text'),
        questionAnswers: document.querySelectorAll('.answer__text'),
        questionIndex: document.querySelector('.question__index'),
        questionRadioButtons: document.querySelector('.question').answer,
        skippedQuestions: document.querySelector('.skipped-questions__content'),
        result: document.querySelector('.result'),
    }

    // render buttone type:: next | prev, questionIndex:: number
    const renderButton = function (type, questionIndex) {
        const html =
            `<button class="question__btn question__btn--${type}" data-question="${questionIndex}" type="button">
                <span class="question__btn-text">
                    ${type === 'next' ? 'Next' : 'Prev'}
                </span>
            </button>`;

        UI.questionIndicators.insertAdjacentHTML('beforeend', html);
    }

    // Rendering NEXT & PREV buttons for question navigation dependent on current index
    const renderNavigationButtons = function (currentQuestionIndex, noOfQuestions) {
        UI.questionIndicators.innerHTML = '';

        if (currentQuestionIndex === 0) {
            renderButton('next', 1);
        } else if (currentQuestionIndex < noOfQuestions - 1) {
            renderButton('prev', currentQuestionIndex - 1);
            renderButton('next', currentQuestionIndex + 1);
        } else {
            renderButton('prev', currentQuestionIndex - 1);
        }
    }

    // updating question indexer
    const updateQuestionIndex = function (currentQuestionIndex, noOfQuestions) {
        UI.questionIndex.textContent = `${currentQuestionIndex} / ${noOfQuestions}`
    }

    // Public
    return {
        elements: UI,

        // Updating Question UI information ::Question ::ID of it's answer :: total number of questions
        renderQuestion: function ({ ID, text, answers }, answerID, noOfQuestions) {
            UI.questionNumber.textContent = `Question ${ID + 1} 🤓`;
            UI.questionText.textContent = text;
            UI.questionAnswers.forEach((answer, i) => answer.textContent = answers[i]);

            // check if current question has an answer
            if (answerID !== '') {
                UI.questionRadioButtons[answerID].checked = true;
            } else {
                UI.questionRadioButtons.forEach(btn => btn.checked = false);
            }

            // Rendering NEXT & PREV Navigation Buttons
            renderNavigationButtons(ID, noOfQuestions);

            updateQuestionIndex(ID + 1, noOfQuestions);
        },
        // Return the selected answer
        getAnswer: function () {
            return UI.questionRadioButtons.value;
        },

        updateSkippedQuestions: function (questions) {
            UI.skippedQuestions.innerHTML = '';

            questions.forEach(question => {
                const html = `<div class="skipped-questions__index" data-question="${question}">${question + 1}</div>`;
                UI.skippedQuestions.insertAdjacentHTML('beforeend', html);
            });
        },

        showSubmit: function () {
            UI.questionSubmitBtn.style.display = 'block';
        },

        showResult: function (name, score, totalScore) {
            const html = `<div class="result__text">${name} your score ${score} / ${totalScore}</div>`;
            UI.result.innerHTML = html;
            UI.result.classList.add('result--show');
        }

    };

})();


const dataController = (function () {
    // Private
    const Question = function (ID, text, answers, correctAnswer) {
        this.ID = ID;
        this.text = text;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    Question.prototype.render = function () {
        UIController.renderQuestion(this, data.answers[this.ID], data.noOfQuestions);
    }

    const data = {
        currentQuestionIndex: 0,
        poolOfQuestion: [
            new Question(0, 'Inside which HTML element do we put the JavaScript?',
                [
                    '<js>',
                    '<script>',
                    '<javascript>',
                    '<scripting>'
                ], 1),

            new Question(1, `What is the correct JavaScript syntax to change the content of the HTML element below?
                        <p id="demo">This is a demonstration.</p>`,
                [
                    'document.getElementById("demo").innerHTML = "Hello World!";',
                    'document.getElement("p").innerHTML = "Hello World!";',
                    'document.getElementByName("p").innerHTML = "Hello World!";',
                    '#demo.innerHTML = "Hello World!";'
                ], 0),

            new Question(2, 'Which of the following is the correct syntax to display “GeeksforGeeks” in an alert box using JavaScript?',
                [
                    'alertbox(“GeeksforGeeks”);',
                    'msg(“GeeksforGeeks”);',
                    'msgbox(“GeeksforGeeks”);',
                    'alert(“GeeksforGeeks”);'
                ], 3),
            new Question(3, 'How to write an IF statement in JavaScript?',
                [
                    'if i == 5 then',
                    'if (i == 5)',
                    'if i = 5 then',
                    'if i = 5'
                ], 1),
            new Question(4, 'How to write an IF statement for executing some code if "i" is NOT equal to 5?',
                [
                    'if (i <> 5)',
                    'if i <> 5',
                    'if (i != 5)',
                    'if i =! 5 then'
                ], 2),
            new Question(5, 'Choose the correct HTML element for the largest heading:',
                [
                    '<head>',
                    '<h1>',
                    '<heading>',
                    '<h6>'
                ], 1),
            new Question(6, 'Which character is used to indicate an end tag?',
                [
                    '<',
                    '^',
                    '*',
                    '/'
                ], 3),
            new Question(7, 'How can you make a numbered list?',
                [
                    '<ol>',
                    '<list>',
                    '<dl>',
                    '<ul>'
                ], 0),
            new Question(8, 'What is the correct HTML for making a checkbox?',
                [
                    '<checkbox>',
                    '<input type="check">',
                    '<input type="checkbox">',
                    '<check>'
                ], 2),
            new Question(9, 'Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?',
                [
                    'title',
                    'alt',
                    'desc',
                    'src'
                ], 1),

        ],
        questions: [],
        noOfQuestions: 0,
        answers: [],
        skippedQuestions: [],
    }


    // Public
    return {
        getQuestionIndex: function () {
            return data.currentQuestionIndex;
        },

        updateQuestionIndex: function (index) {
            data.currentQuestionIndex = index;
        },

        getQuestion: function (index) {
            return data.questions[index];
        },

        addAnswer: function (index, answer) {
            data.answers[index] = answer;
        },

        hasAnswer: function (index) {
            return data.answers[index] !== '';
        },

        getRandomQuestions: function (number) {
            for (let i = 0; i < number; i++) {
                data.questions.push(...data.poolOfQuestion.splice(Math.floor(Math.random() * data.poolOfQuestion.length), 1));
            }

            data.questions.forEach((question, i) => question.ID = i);

            data.noOfQuestions = data.questions.length;
            data.answers = new Array(data.noOfQuestions).fill('');
        },

        addSkippedQuestion: function (questionIndex) {
            if (data.skippedQuestions.indexOf(questionIndex) === -1) {
                data.skippedQuestions.push(+questionIndex);
            }
        },

        removeSkippedQuestion: function (questionIndex) {
            data.skippedQuestions.splice(data.skippedQuestions.indexOf(questionIndex), 1);
        },

        getSkippedQuestions: () => data.skippedQuestions,

        isAllAnswered: () => data.answers.every(answer => answer !== ''),

        getScore: function () {
            return x = data.answers.reduce((acc, answer, index) => {
                acc = +answer === data.questions[index].correctAnswer ? acc + 1 : acc;
                return acc;
            }, 0);
        },

        getTotalScore: () => data.noOfQuestions
    };

})();


const app = (function (UIctrl, dataCtrl) {
    // Private
    let countDown;

    // Skip Question Handeling data & UI
    const skipQuestion = function (questionIndex) {
        dataCtrl.addSkippedQuestion(questionIndex);
        UIctrl.updateSkippedQuestions(dataCtrl.getSkippedQuestions());
    }

    // Show exam result
    const showResult = function () {
        const username = localStorage.getItem('username');
        const score = dataCtrl.getScore();
        const totalScore = dataCtrl.getTotalScore();
        UIctrl.showResult(username, score, totalScore);
    }

    // Handle Next & prev click
    let questionIndicatorsClickable = true;
    UIctrl.elements.questionIndicators.addEventListener('click', e => {
        const el = e.target;
        if (el.matches('.question__btn, .question__btn *') && questionIndicatorsClickable) {

            // Add question to skipped section if there's no answer
            const questionIndex = dataCtrl.getQuestionIndex();
            if (!dataCtrl.hasAnswer(questionIndex)) {
                skipQuestion(questionIndex);
            }


            // get new index from buttons and update in data controller
            const newQuestionIndex = +el.closest('.question__btn').dataset.question;
            dataCtrl.updateQuestionIndex(newQuestionIndex);

            // get data of new Question and update UI
            const question = dataCtrl.getQuestion(newQuestionIndex);
            question.render();

            // disable click for 2 seconds
            questionIndicatorsClickable = false;
            document.querySelectorAll('.question__btn').forEach(btn => btn.disabled = true);
            setTimeout(() => {
                document.querySelectorAll('.question__btn').forEach(btn => btn.disabled = false);
                questionIndicatorsClickable = true;
            }, 100);
        }
    });

    // if answer selected
    UIctrl.elements.questionRadioButtons.forEach(btn => {
        btn.addEventListener('change', e => {
            // Get selected answer and add it to data
            const answer = UIctrl.getAnswer();
            dataCtrl.addAnswer(dataCtrl.getQuestionIndex(), answer);

            if (dataCtrl.isAllAnswered()) {
                UIctrl.showSubmit();
            }
        });
    });

    // Handle Skipped questions
    UIctrl.elements.skippedQuestions.addEventListener('click', e => {
        const el = e.target;

        if (el.matches('.skipped-questions__index')) {

            // Render target skipped question
            const questionIndex = +el.dataset.question;
            const question = dataCtrl.getQuestion(questionIndex);
            dataCtrl.removeSkippedQuestion(questionIndex);
            question.render();

            // if current question has no answer add to skipped
            const currentQuestionIndex = dataCtrl.getQuestion(dataCtrl.getQuestionIndex()).ID;
            if (!dataCtrl.hasAnswer(currentQuestionIndex) && questionIndex !== currentQuestionIndex) {
                dataCtrl.addSkippedQuestion(currentQuestionIndex);
            }

            // remove from data and UI
            dataCtrl.updateQuestionIndex(questionIndex);
            UIctrl.updateSkippedQuestions(dataCtrl.getSkippedQuestions());
        }
    });

    // Handle Archieved Question
    UIctrl.elements.questionArchieve.addEventListener('click', e => {
        const questionIndex = dataCtrl.getQuestionIndex();
        skipQuestion(questionIndex);

        const nextQuestionBtn = document.querySelector('.question__btn--next');
        if (nextQuestionBtn !== null) {
            nextQuestionBtn.click();
        }
    });

    // Handle Answers submission
    UIctrl.elements.questionForm.addEventListener('submit', e => {
        e.preventDefault();
        showResult();
        clearInterval(countDown);

    });

    // Public
    return {
        init: function (numberOfQuestions = 5, minutes = 1, seconds = 0) {
            dataCtrl.getRandomQuestions(numberOfQuestions);
            const question = dataCtrl.getQuestion(0);
            question.render();


            timer.minutes = minutes;
            timer.seconds = seconds;
            countDown = setInterval(() => {
                updateCounter();
                updateCounterUI(timer);
                if (timer.seconds === 0 && timer.minutes === 0) {
                    showResult();
                    clearInterval(countDown);
                }
            }, 1000);
        }
    };

})(UIController, dataController);
