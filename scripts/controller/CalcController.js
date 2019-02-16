class CalcController {
  constructor() {
    this._audio = new Audio('click.mp3');
    this._audioOnOff = false;
    this._lastOperator = '';
    this._lastNumber = '';
    this._operation = [];
    this._locale = 'pt-BR';
    this._displayCalcEl = document.querySelector('#display');
    this._dateEl = document.querySelector('#data');
    this._timeEl = document.querySelector('#hora');
    this._currentDate;
    this.initialize(); 
    this.initButtonsEvents();
    this.initKeyboard();
    this.pasteFromClipboard();
  }
  copyToClipboard() {
    let input = document.createElement('input');
    input.value = this.displayCalc;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    input.remove();
  }

  initialize() {
    this.setDisplayDateTime();
    this.setLastNumberToDisplay();
    this.toggleAudio();
  }

  toggleAudio() {
    this._audioOnOff = !this._audioOnOff;
  }

  playAudio() {
    if(this._audioOnOff) {
      this._audio.currentTime = 0;    
      this._audio.play();
    } 
  } 

  pasteFromClipboard() {
    document.addEventListener('paste', e => {
      let text = e.clipboardData.getData('Text');
      this.displayCalc = parseFloat(text);
      
    })
  }

  initKeyboard() {
    document.addEventListener('keyup', e => {
      this.playAudio();
      switch (e.key) {
        case 'Escape':
          this.clearAll();
          break;
  
          case 'Backspace': 
          this.clearEntry();
          break;
  
          case '+':
            this.addOperation('+');
          break;
  
          case '-':
           this.addOperation('-');
          break;
  
          case '/':
            this.addOperation('/');
          break;
  
          case '*':
            this.addOperation('*');
          break;
  
          case '%':
            this.addOperation('%');
          break;

          case '=':
            this.calc();
          break;

          case 'Enter':
            this.calc();
          break;
  
          case '.':
            this.addDot();
          break;
  
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            this.addOperation(parseInt(e.key));
          break;
          
          case 'c':
            if (e.ctrlKey) this.copyToClipboard();
          break;
      }
    });
  }

  clearAll() {
    this._lastNumber = [0];
    this._operation = [];
    this._lastOperator = '';
    this.setLastNumberToDisplay();
  }
  
  clearEntry() {
    this._operation.pop();
    this.setLastNumberToDisplay(this._operation.length -1 );
  }

  getLastOperation() {
    return this._operation[this._operation.length-1];

  }

  isOperator(value){
    return (['+','-','*','%','/'].indexOf(value)> -1)
  }

  setLastOperation(value) {
    this._operation[this._operation.length -1 ] = value;
  }

  pushOperation(value) {
    this._operation.push(value);
    if (this._operation.length > 3) {
      this.calc();
    }
  }

  getResult() {
    try {
      return eval(this._operation.join(""));
    } catch (error) {
      setTimeout(()=> {
        this.setError()
      },1);
    }
  }

  calc() {
    let last = '';
    let result;

    this._lastOperator = this.getLastItem();
    if (this._operation.length < 3 ) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();
      this._lastNumber =  this.getResult();  
    }else if (this._operation.length == 3 ) {
      this._lastNumber =  this.getLastItem(false); 
    }

    result = this.getResult();
    
    if(last == '%') {
      result /= 100;
      this._operation = [result] 
    }else {

      this._operation = [result];
      if (last) this._operation.push(last);
    }
    
    this.setLastNumberToDisplay();
  }

  getLastItem(isOperator = true) {
    let lastItem;
    for(let i = this._operation.length -1; i>=0; i--) {
      if(this.isOperator(this._operation[i])== isOperator) {
        lastItem = this._operation[i];
        break
      }
    }
    if (!lastItem) {
      lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
    }
    return lastItem; 
  }

  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false);
    
    if (!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    if (isNaN(this.getLastOperation())) {

      if(this.isOperator(value)) {

        this.setLastOperation(value);
        
      } else {

        this.pushOperation(value)
        this.setLastNumberToDisplay();
      }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);

      } else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);
        this.setLastNumberToDisplay();
      }
      
    }    
  }

  setError() {
    this.displayCalc = "Error";
  }

  addDot() {
    let lastOperation = this.getLastOperation();
    if (typeof lastOperation === 'string'  && lastOperation.split('').indexOf('.') > 1 ) return;
    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation('0.');

    }else {
      this.setLastOperation(lastOperation.toString()+ '.');
    }
    this.setLastNumberToDisplay();
  }

  execBtn(value) {
    this.playAudio();
    switch (value) {
      case 'ac':
        this.clearAll();
        break;

        case 'ce': 
        this.clearEntry();
        break;

        case 'soma':
          this.addOperation('+');
        break;

        case 'subtracao':
         this.addOperation('-');
        break;

        case 'divisao':
          this.addOperation('/');
        break;

        case 'multiplicacao':
          this.addOperation('*');
        break;

        case 'porcento':
          this.addOperation('%');
        break;

        case 'igual':
          this.calc();
        break;

        case 'ponto':
          this.addDot();
        break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(value));
          break;
      default:
        this.setError();
        break;
    }
  }

  setDisplayDateTime() {
    setInterval(() => {
      this.displayDate = this.currentDate.toLocaleDateString(this._locale);
      this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }, 1000 )
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn);
    });
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    buttons.forEach((btn) => {
      this.addEventListenerAll(btn, 'click drag', () => {
      let btnValue = btn.className.baseVal.replace("btn-", "");
        this.execBtn(btnValue);
        
      });
      
      this.addEventListenerAll(btn, "mouseover mouseup mousedown", () => {
        btn.style.cursor = "pointer";
      });
    });
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayTime(value) {
    return this._timeEl.innerHTML = value;
  }

  get displayDate() {
    return this._dateEl.innerHTML;
  }

  set displayDate(value) {
    return this._dateEl.innerHTML = value;
  }

  get displayCalc() {2019
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    if (value.toString().length > 10 ) {
      this.setError();
      return false;
    }
    this._displayCalcEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }
}

window.calculator = new CalcController();