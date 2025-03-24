document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    function updateDisplay() {
        const display = document.getElementById('calculator-output');
        display.textContent = calculator.displayValue;
    }

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);

            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        if (operator === 'add') {
            return firstOperand + secondOperand;
        } else if (operator === 'subtract') {
            return firstOperand - secondOperand;
        } else if (operator === 'multiply') {
            return firstOperand * secondOperand;
        } else if (operator === 'divide') {
            return firstOperand / secondOperand;
        }

        return secondOperand;
    }

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    function handleSignChange() {
        const { displayValue } = calculator;
        const currentValue = parseFloat(displayValue);
        
        if (!isNaN(currentValue)) {
            calculator.displayValue = (currentValue * -1).toString();
        }
    }

    function handlePercentage() {
        const { displayValue } = calculator;
        const currentValue = parseFloat(displayValue);
        
        if (!isNaN(currentValue)) {
            calculator.displayValue = (currentValue / 100).toString();
        }
    }

    // Add event listeners to calculator buttons
    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('key-operator')) {
            handleOperator(target.dataset.action);
            updateDisplay();
            return;
        }

        if (target.classList.contains('key-equals')) {
            handleOperator(calculator.operator);
            updateDisplay();
            return;
        }

        if (target.classList.contains('key-clear')) {
            resetCalculator();
            updateDisplay();
            return;
        }

        if (target.classList.contains('key-sign')) {
            handleSignChange();
            updateDisplay();
            return;
        }

        if (target.classList.contains('key-percent')) {
            handlePercentage();
            updateDisplay();
            return;
        }

        if (target.classList.contains('key-decimal')) {
            inputDecimal('.');
            updateDisplay();
            return;
        }

        // If we reach here, it must be a number key
        inputDigit(target.textContent);
        updateDisplay();
    });

    // Initialize the calculator display
    updateDisplay();
}); 