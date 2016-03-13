var cashRegister = function() {
  var calculator = calculatorModule();


  return {

  };
}

// Total in calculator
var memory = 0;
// The last operator;
var lastOperator = -1;
// Flag if display should be overwritten or appended
overwriteFlag = true;
// The previous button pressed or '' start
previousKey = '';

var operatorsMap = {
  '+' : 0,
  '-' : 1,
  'x' : 2,
  '%' : 3
}

var operatorFunc = {
  '+' : function(x, y) {return x+y;},
  '-' : function(x, y) {return x-y;},
  'x' : function(x, y) {return x*y;},
  '%' : function(x, y) {return x/y;}
}

var numPad = ['0', '1','2','3','4','5','6','7','8','9', '.'];
var operatorPad = ['+', '-', 'x', '%'];


// Input display
var display = document.getElementById("display");

// Number event listeners
var numbers = document.getElementsByClassName("number");
for(var i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener('click', function() {
    if(overwriteFlag) {
      display.innerHTML = this.innerHTML;
      overwriteFlag = false;
    } else {
      display.innerHTML +=  this.innerHTML;
    }
    previousKey = this.innerHTML;
  })
}

// Operator event listeners
var operators = document.getElementsByClassName("operator");
for(var i = 0; i < operators.length; i++) {
  operators[i].addEventListener('click', function() {
    console.log("memory " + memory + ", lastOperator = " + lastOperator);
    var input = 0;
    if(memory === '.') {
      memory = 0;
    }
    if(display.innerHTML !== '.') {
      input = display.innerHTML;
    }

    // If first time pressing an operator button and no keys where pressed yet.
    if(lastOperator === -1 && previousKey === '') {
      console.log("set last operator", operatorsMap[this.innerHTML]);
      overwriteFlag = true;
    // If first time pressing an operator button and number key was pressed.
    } else if(lastOperator === -1 && previousKey in numPad) {
      memory = parseFloat(input);
      overwriteFlag = true;
    // If not the first time pressing an operator button and number key was pressed.
    } else if(lastOperator !== -1 && previousKey in numPad){
      memory = operatorFunc[operatorPad[lastOperator]](parseFloat(memory), parseFloat(input)).toFixed(2);
      display.innerHTML = memory;
      overwriteFlag = true;
    }
    lastOperator = operatorsMap[this.innerHTML];
    previousKey = this.innerHTML;
    console.log("memory " + memory + ", lastOperator = " + lastOperator);

  })
}

// Dot event listener
document.getElementById("dot").addEventListener('click', function() {
  if(overwriteFlag) {
    display.innerHTML = '.';
    overwriteFlag = false;
  } else if(!/\./.test(display.innerHTML)){
    display.innerHTML += '.';
  }
})

// Equals event listener
document.getElementById('equals').addEventListener('click', function() {
  var input = 0;
  if(display.innerHTML !== '.') {
    input = display.innerHTML;
  }
  if(lastOperator !== -1) {
    memory = operatorFunc[operatorPad[lastOperator]](parseFloat(memory), parseFloat(input)).toFixed(2);
    display.innerHTML = memory;
    lastOperator = -1;
    overwriteFlag = true;
  }
})

document.getElementById('clear').addEventListener('click', function() {
  display.innerHTML = "0.00";
  lastOperator = -1;
  overwriteFlag = true;
})


/*var operatorClicked = false;

var cashRegisterModule = function() {
  var _balance = 0;
  var calculatorMode = true;
  var currentOperation = '';
  var calculator = calculatorModule();

  var loadNum = function(x, operator) {
    console.log("Entering loadNum function: x = " + x + " operator = " + operator);
    setCalculatorMode(false);
    if(validOperator(operator) && !validOperator(x) && !validOperator(currentOperation)) {
      console.log('Exiting loadNum after first operation');
      currentOperation = operator;
      return calculator.load(parseFloat(x));
    } else if(validOperator(operator) && !validOperator(x) && validOperator(currentOperation)) {
      console.log("Exiting loadNum after second operation");

      currentOperation = operator;
      return calculator.load(performOperation(x));
    }
  }

  var performOperation = function(x) {
    x = parseFloat(x);
    if(currentOperation === '') {
      return x;
    }
    var currentTotal = 0;
    switch(currentOperation) {
      case '+':
        currentTotal = add(x);
        break;
      case '-':
        currentTotal = subtract(x);
        break;
      case 'x':
        currentTotal = multiply(x);
        console.log(currentTotal);
        break;
      case '%':
        currentTotal = divide(x);
        break;
      default:
        break;
    }
    //clearCalculator();
    //currentOperation = '';
    return parseFloat(currentTotal);
  }

  var getCurrentOperation = function() {
    return currentOperation;
  }

  var getBalance = function() {
    calculatorMode = false;
    return _balance;
  }

  var deposit = function(x) {
    _balance += x;
  }

  var withdraw = function(x) {
    _balance -=x;
  }

  var getCalculatorMode = function() {
    return calculatorMode;
  }

  var setCalculatorMode = function(mode) {
    if(typeof mode !== 'boolean') {
      throw new Error("Not a number");
    }
    calculatorMode = mode;
  }

  // PRIVATE
  var clearCalculator = function() {
    calculator.load(0);
  }

  var add = function(x) {
    calculator.add(x);
    return round(calculator.getTotal());
  }

  var subtract = function(x) {
    calculator.subtract(x);
    return round(calculator.getTotal());
  }

  var divide = function(x) {
    calculator.divide(x);
    return round(calculator.getTotal());
  }

  var multiply = function(x) {
    calculator.multiply(x);
    return round(calculator.getTotal());
  }

  var round = function(x) {
    return ((Math.floor(x*100))/100).toFixed(2);
  }

  var validOperator = function(operator) {
    if(operator === '+' || operator === '-' || operator === '%' || operator === 'x') {
      return true;
    }
    return false;
  }

  return {
    loadNum : loadNum,
    performOperation : performOperation,
    getBalance : getBalance,
    deposit : deposit,
    withdraw : withdraw,
    getCurrentOperation : getCurrentOperation,
    getCalculatorMode : getCalculatorMode,
    setCalculatorMode : setCalculatorMode,
    clearCalculator : clearCalculator
  }
}

var cashRegister = cashRegisterModule();

var display = document.getElementById("display");

// Number event listeners
var numbers = document.getElementsByClassName("number");
for(var i = 0; i < numbers.length; i++) {
  numbers[i].onclick = function() {
    console.log(cashRegister.getCurrentOperation());
    if(cashRegister.getCalculatorMode() === false) {
      display.innerHTML = this.innerHTML;
      cashRegister.setCalculatorMode(true);
    }else {
      display.innerHTML += this.innerHTML;
    }
    operatorClicked = false;
  }
}

// Operator event listeners
var operators = document.getElementsByClassName("operator");
for(var i = 0; i < operators.length; i++) {
  operators[i].onclick = function() {
      display.innerHTML = cashRegister.loadNum(display.innerHTML, this.innerHTML);
  }
  operatorClicked = true;
}

document.getElementById("dot").onclick = function() {
  if(display.innerHTML + '.') {
    display.innerHTML += '.';
  }
}

// Equals event listeners
document.getElementById('equals').onclick = function() {
  var total = cashRegister.performOperation(display.innerHTML);
  console.log(total);
  display.innerHTML = total;
  cashRegister.setCalculatorMode(false);
  //cashRegister.clearCalculator()
}
*/

