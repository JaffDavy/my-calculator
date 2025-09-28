// Get all the elements we will need to interact with
const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.btn')

// State variables for the calculator's logic
let currentInput = '0'
let previousInput = null
let currentOperator = null
let awaitingNextInput = false

// Function to handle number and decimal button presses
function handleNumber (value) {
  if (awaitingNextInput) {
    currentInput = value
    awaitingNextInput = false
  } else {
    currentInput = currentInput === '0' ? value : currentInput + value
  }
}

// Function to handle operator button presses
function handleOperator (nextOperator) {
  const inputValue = parseFloat(currentInput)

  if (currentOperator && awaitingNextInput) {
    currentOperator = nextOperator
    return
  }

  if (previousInput === null) {
    previousInput = inputValue
  } else if (currentOperator) {
    const result = calculate(previousInput, inputValue, currentOperator)
    currentInput = String(result)
    previousInput = result
  }

  awaitingNextInput = true
  currentOperator = nextOperator
}

// Function to perform the calculation
function calculate (a, b, operator) {
  switch (operator) {
    case '+':
      return a + b
    case '-':
      return a - b
    case 'x': // Changed from '*' to 'x' to match your HTML
      return a * b
    case '/':
      if (b === 0) return 'Error'
      return a / b
    default:
      return b
  }
}

// Function to handle the equals button press
function handleEquals () {
  if (!previousInput || !currentOperator) {
    return
  }

  const inputValue = parseFloat(currentInput)
  currentInput = String(calculate(previousInput, inputValue, currentOperator))
  previousInput = null
  currentOperator = null
  awaitingNextInput = true
}

// Function to handle the special buttons
function handleSpecial (action) {
  switch (action) {
    case 'AC':
      currentInput = '0'
      previousInput = null
      currentOperator = null
      awaitingNextInput = false
      break
    case '+/-':
      if (awaitingNextInput) {
        currentInput = '-0'
        awaitingNextInput = false
      } else {
        currentInput = String(parseFloat(currentInput) * -1)
      }
      break

    case '%':
      currentInput = String(parseFloat(currentInput) / 100)
      break
    case '.':
      if (awaitingNextInput) {
        currentInput = '0.'
        awaitingNextInput = false
      } else if (!currentInput.includes('.')) {
        currentInput += '.'
      }
      break
  }
}

// Function to handle backspace
function handleBackspace () {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1)
  } else {
    currentInput = '0'
  }
}

// Function to update the display
function updateDisplay () {
  if (currentInput.length > 9) {
    display.textContent = parseFloat(currentInput).toExponential(5)
  } else {
    display.textContent = currentInput
  }
}

// Add event listeners to all buttons
buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const { textContent: value, classList, dataset } = e.currentTarget

    if (classList.contains('number')) {
      handleNumber(value)
    } else if (classList.contains('operator')) {
      if (value === '=') {
        handleEquals()
      } else {
        handleOperator(value)
      }
    } else if (classList.contains('function')) {
      if (dataset.action === 'backspace') {
        handleBackspace()
      } else {
        handleSpecial(value)
      }
    }
    updateDisplay()
  })
})

updateDisplay()