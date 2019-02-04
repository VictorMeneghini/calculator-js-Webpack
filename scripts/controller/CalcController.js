class CalcController {
  constructor() {
    this._operation = [];
    this._locale = 'pt-BR';
    this._displayCalcEl = document.querySelector('#display');
    this._dateEl = document.querySelector('#data');
    this._timeEl = document.querySelector('#hora');
    this._currentDate;
    this.initialize(); 
    this.initButtonsEvents();
  }

  initialize() {
    this.setDisplayDateTime();
  }

  clearAll() {
    this._operation = [];
  }
  
  clearEntry() {
    this._operation.pop();
  }

  addOperation(value) {
    this._operation.push(value);
    console.log(this._operation, 'here');
    
  }

  setError() {
    this.displayCalc = "Error";
  }

  execBtn(value) {
    switch (value) {
      case 'ac':
        this.clearAll();
        break;

        case 'ce': 
        this.clearEntry();
        break;

        case 'soma':

        break;
        case 'subtracao':

        break;

        case 'divisao':

        break;

        case 'multiplicacao':

        break;

        case 'porcento':

        break;

        case 'igual':

        break;

        case 'soma':

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
      this.addEventListenerAll(btn, 'click drag', e => {
      let btnValue = btn.className.baseVal.replace("btn-", "");
        this.execBtn(btnValue);
        
      });
      
      this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
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

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    this._displayCalcEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }
}