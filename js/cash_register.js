var cashRegister = function() {
  var _calculator = calculatorModule();
  var _balance = 0;
  var _currentOperation = '';
  var _symbols = ['+', '-', 'x', '%'];
  var _operators = /^[+-x%]{1}$/;

  var setTotal = function(x) {
    return _calculator.load(parseFloat(x));
  }

  var getTotal = function() {
    return _calculator.getTotal();
  }

  var calculate = function(x) {
    x = parseFloat(x);
    var currentTotal = 0;
    switch(_currentOperation) {
      case '+':
        currentTotal = _calculator.add(x);
        break;
      case '-':
        currentTotal = _calculator.subtract(x);
        break;
      case 'x':
        currentTotal = _calculator.multiply(x);
        break;
      case '%':
        currentTotal = _calculator.divide(x);
        break;
      default:
        break;
    }
    return parseFloat(currentTotal).toFixed(2);
  }

  var getCurrentOperation = function() {
    return _currentOperation;
  }

  var setCurrentOperation = function(op) {
    _currentOperation = '';
    if(_operators.test(op)) {
      _currentOperation = op;
    }
  }

  var getBalance = function() {
    return _balance;
  }

  var depositCash = function(x) {
    if(x > 0) {
      return _balance += parseFloat(x);
    }
  }

  var withdrawCash = function(x) {
    return _balance -= parseFloat(x);
  }

  return {
    getTotal : getTotal,
    setTotal : setTotal,
    getCurrentOperation : getCurrentOperation,
    setCurrentOperation : setCurrentOperation,
    calculate : calculate,
    getBalance : getBalance,
    depositCash : depositCash,
    withdrawCash : withdrawCash
  };
}

var register = cashRegister();

// Flag if display should be overwritten or appended
var overwriteFlag = true;
// The previous button pressed or '' start
var previousKey = '';
// Allowed number keys
var reg = /^[0-9\.]{1}$/;

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
    var input = '';
    if(previousKey === '.') {
      register.setTotal(0);
    }
    if(display.innerHTML === '.') {
      input = 0;
    } else {
      input = display.innerHTML;
    }

    // If first time pressing an operator button and no keys where pressed yet.
    if(register.getCurrentOperation === '' && previousKey === '') {
      overwriteFlag = true;
    // If first time pressing an operator button and number key was pressed.
    } else if(register.getCurrentOperation() === '' && reg.test(previousKey)) {
      register.setTotal(input);
      overwriteFlag = true;
    // If not the first time pressing an operator button and number key was pressed.
    } else if(register.getCurrentOperation() !== '' && reg.test(previousKey)){
      var memory = register.setTotal(register.calculate(input));
      display.innerHTML = memory.toFixed(2);
      overwriteFlag = true;
    }
    register.setCurrentOperation(this.innerHTML);
    previousKey = this.innerHTML;
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
  previousKey = '.'
})

// Equals event listener
document.getElementById('equals').addEventListener('click', function() {
  var input = '';
  if(display.innerHTML === '.') {
    input = 0;
  } else {
    input = display.innerHTML;
  }
  if(register.getCurrentOperation() !== '') {
    var memory = register.setTotal(register.calculate(input));
    display.innerHTML = memory.toFixed(2);
    register.setCurrentOperation('');
    overwriteFlag = true;
  }
})

document.getElementById('clear').addEventListener('click', function() {
  display.innerHTML = "0.00";
  register.setCurrentOperation('');
  overwriteFlag = true;
})

document.getElementById('balance').addEventListener('click', function() {
  display.innerHTML = register.getBalance().toFixed(2);
  overwriteFlag = true;
})

document.getElementById('deposit').addEventListener('click', function() {
  register.depositCash(display.innerHTML);
  display.innerHTML = "0.00"
  overwriteFlag = true;
})

document.getElementById('withdraw').addEventListener('click', function() {
  register.withdrawCash(display.innerHTML);
  display.innerHTML = "0.00"
  overwriteFlag = true;
})