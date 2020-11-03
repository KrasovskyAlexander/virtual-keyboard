const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    lang: "En",
    shift: false,
    counter: 0,
    sound: true,
    micro: false,
    microCreate:false,
    recognition: null
  },
  keyLayout: {
    keyLayoutEn : [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=","backspace",
      "micro","q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[","]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",";","'","enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
      "sound","en/ru","shift","space","←","→"
    ],
    keyLayoutRu : [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","=", "backspace",
      "micro","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "enter",
      "done", "я", "ч", "с", "м", "и", "т", "ь","б","ю",".",
      "sound","en/ru","shift","space","←","→"
    ],
    keyLayoutEnShift : [
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")","_","+", "backspace",
      "micro",'q', 'w', 'e','r', 't','y','u','i','o', 'p',"{","}",
      "caps", 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',":",'"',"enter",
      "done", 'z', 'x', 'c', 'v', 'b', 'n', 'm',"<",">", "?",
      "sound","en/ru","shift","space","←","→"
    ],
    keyLayoutRuShift : [
      "!", '"', "№", ";", "%", ":", "?", "*", "(", ")","_","+","backspace",
      "micro","й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д","ж","э", "enter",
      "done", "я", "ч", "с", "м", "и", "т", "ь","б","ю",",",
      "sound","en/ru","shift","space","←","→"
    ],
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    
    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutEn));

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys(layout) {
    const fragment = document.createDocumentFragment();
    const textArea = document.querySelector(".use-keyboard-input");
    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    layout.forEach((key,i,arr) => {
      const keyElement = document.createElement("button");
      const insertLineBreak = !this.properties.shift ? ["backspace", "]", "enter", "/"].indexOf(key) !== -1 : ["backspace", "}", "enter", "?"].indexOf(key) !== -1;
      const insertLineBreakRu  = !this.properties.shift ? ["backspace", "ъ", "enter", "."].indexOf(key) !== -1 : ["backspace", "ъ", "enter", ","].indexOf(key) !== -1;
      

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");
      switch (key) {
        
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            const audio = document.querySelector(`.audio5`);
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            textArea.focus();
            let a = this.properties.value.slice(this.properties.counter);
            this.properties.value = this.properties.value.slice(0,this.properties.counter);
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this.properties.value += a;
            if(this.properties.counter!==0) this.properties.counter--;
            this._triggerEvent("oninput");
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable","caps");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          if(this.properties.capsLock) keyElement.classList.add("keyboard__key--active", this.properties.capsLock);
          keyElement.addEventListener("click", () => {
            const audio = document.querySelector(`.audio4`);
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            textArea.focus();
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            const audio = document.querySelector(`.audio6`);
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            textArea.focus();
            this.properties.counter++;
            let a = this.properties.value.slice(this.properties.counter-1);
            this.properties.value = this.properties.value.slice(0,this.properties.counter-1);
            this.properties.value += "\n";
            this.properties.value += a;
            this._triggerEvent("oninput");
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            const audio = (this.properties.lang=='En' ? document.querySelector(`.audio1`) : document.querySelector(`.audio2`))
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            textArea.focus();
            this.properties.counter++;
            let a = this.properties.value.slice(this.properties.counter-1);
            this.properties.value = this.properties.value.slice(0,this.properties.counter-1);
            this.properties.value += ' ';
            this.properties.value += a;
            this._triggerEvent("oninput");
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;
        case "en/ru":
          keyElement.classList.add("keyboard__key",'light');
          keyElement.textContent = key.toLowerCase();
          if(this.properties.lang === "En"){
            keyElement.textContent = 'en';
          }else if(this.properties.lang === "Ru"){
            keyElement.textContent = 'ru';
          }
          keyElement.addEventListener("click", () => {
            textArea.focus();
            this._toggleLang();
          });
  
          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide","keyboard__key--activatable");
          keyElement.textContent = key.toLowerCase();
          
          if(this.properties.shift) keyElement.classList.toggle("keyboard__key--active");
          keyElement.addEventListener("click", () => {

            const audio = document.querySelector(`.audio3`);
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            textArea.focus();
            this._toggleShift();
          });
  
          break;

        case "←":
          keyElement.classList.add("keyboard__key",'light');
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            const audio = (this.properties.lang=='En' ? document.querySelector(`.audio1`) : document.querySelector(`.audio2`))
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            if(this.properties.counter!==0) this.properties.counter--;
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
            textArea.focus();
          });
    
          break;
        case "→":
          keyElement.classList.add("keyboard__key",'light');
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            const audio = (this.properties.lang=='En' ? document.querySelector(`.audio1`) : document.querySelector(`.audio2`))
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            if(this.properties.counter!==this.properties.value.length) this.properties.counter++;
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd =this.properties.counter;
            textArea.focus();
          });
    
          break;
        
        case "sound":
          keyElement.classList.add("keyboard__key--wide","keyboard__key--wideS","keyboard__key--activatable");
          keyElement.textContent = key.toLowerCase();
          if(this.properties.sound){
            keyElement.classList.add("keyboard__key--active");
          }
          keyElement.addEventListener("click", () => {
            this.properties.sound = !this.properties.sound;
            keyElement.classList.toggle("keyboard__key--active");
          });
    
          break;
        case "micro":
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.innerHTML = createIconHTML("keyboard_voice");
            if(this.properties.micro){
              console.log('why')
              keyElement.classList.add("keyboard__key--active");
            }
            keyElement.addEventListener("click", () => {
              this._micro();
              keyElement.classList.toggle("keyboard__key--active");
            });
  
            break;
  
  
        default:
          keyElement.dataset.id = `${i}`
          keyElement.textContent = key.toLowerCase();
          
          
          keyElement.addEventListener("click", () => {
            const audio = (this.properties.lang=='En' ? document.querySelector(`.audio1`) : document.querySelector(`.audio2`))
            if (!audio) return;
            audio.currentTime = 0;
            if(this.properties.sound) audio.play();
            textArea.focus();
            this.properties.counter++;
            let a = this.properties.value.slice(this.properties.counter-1);
            this.properties.value = this.properties.value.slice(0,this.properties.counter-1);
            if(this.properties.capsLock && this.properties.shift){
              this.properties.value += key.toLowerCase();
            }else if(this.properties.capsLock||this.properties.shift){
              this.properties.value += key.toUpperCase();
            }else{
              this.properties.value += key.toLowerCase();
            }
            this.properties.value += a;
            this._triggerEvent("oninput");
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak && ((arr === this.keyLayout.keyLayoutEn) ||(arr === this.keyLayout.keyLayoutEnShift))) {
        fragment.appendChild(document.createElement("br"));
      }
      if(insertLineBreakRu &&((arr === this.keyLayout.keyLayoutRu)||(arr === this.keyLayout.keyLayoutRuShift))){
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },
 
  _micro(){
    this.properties.micro = !this.properties.micro;
    const handler = ()=>{
      if (this.properties.micro) this.properties.recognition.start();
    }
    const handler2 = e => {
      const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
      
      if (e.results[0].isFinal) {
        const textArea = document.querySelector('.use-keyboard-input');
        this.properties.value += transcript;
        this.properties.value += ' ';
        this.properties.counter = this.properties.value.length;
        console.log(this.properties.counter);
        this._triggerEvent("oninput");
        textArea.selectionStart = this.properties.counter ;
        textArea.selectionEnd = this.properties.counter;
        textArea.focus();
      }
    }

    
    if(!this.properties.micro){
      this.properties.recognition.abort();
      this.properties.recognition.removeEventListener("end", handler);
      this.properties.recognition.removeEventListener('result', handler2);
    }else{
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
      this.properties.recognition = new SpeechRecognition();
      this.properties.recognition.interimResults = true;
      this.properties.recognition.lang = this.properties.lang === "En"? 'en-US' : 'ru-RU';
      this.properties.recognition.addEventListener('result', handler2);
      this.properties.recognition.addEventListener("end", handler);
      this.properties.recognition.start();
    }
    
    
  },

  _useRealKeyboard(){
    //console.log(this.properties.value);
    const textArea = document.querySelector(".use-keyboard-input");
    textArea.addEventListener('keydown', e => {
      const keyEl = document.querySelectorAll(`.keyboard__key`);
      switch (e.key) {
        case "Backspace":
          keyEl[12].classList.add('keyboard__key_active');
          // if(this.properties.counter!==0) this.properties.counter--;
          // this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
          e.preventDefault();
          let a = this.properties.value.slice(this.properties.counter);
          this.properties.value = this.properties.value.slice(0,this.properties.counter);
          this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
          this.properties.value += a;
          if(this.properties.counter!==0) this.properties.counter--;
          this._triggerEvent("oninput");
          textArea.selectionStart = this.properties.counter;
          textArea.selectionEnd = this.properties.counter;
          break;

        case "CapsLock":
            keyEl[26].classList.add('keyboard__key_active');
            this._toggleCapsLock();
            document.querySelector('.caps').classList.toggle("keyboard__key--active", this.properties.capsLock);
          break;

        case "Enter":
            e.preventDefault()
            keyEl[38].classList.add('keyboard__key_active');
            this.properties.counter++;
            let b = this.properties.value.slice(this.properties.counter-1);
            this.properties.value = this.properties.value.slice(0,this.properties.counter-1);
            this.properties.value += "\n";
            this.properties.value += b;
            this._triggerEvent("oninput");
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
          break;

        case " ":
          keyEl[53].classList.add('keyboard__key_active');
            e.preventDefault();
            this.properties.counter++;
            let c = this.properties.value.slice(this.properties.counter-1);
            this.properties.value = this.properties.value.slice(0,this.properties.counter-1);
            this.properties.value += ' ';
            this.properties.value += c;
            this._triggerEvent("oninput");
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
          break;

        case "done":
            this.close();
            this._triggerEvent("onclose");
          break;

        case "Shift":
            this._toggleShift();
            const newKeyEl = this.elements.keys;
            newKeyEl[52].classList.add('keyboard__key_active');
          break;

        case "ArrowLeft":
          if(this.properties.counter!==0) this.properties.counter--;
          keyEl[54].classList.add('keyboard__key_active');
          break;
        case "ArrowRight":
          if(this.properties.counter!==this.properties.value.length) this.properties.counter++;
          keyEl[55].classList.add('keyboard__key_active');
          break;

        default:
          if (e.key.length===1){
            e.preventDefault();
            let ind = 666;
            if(this.properties.lang === 'En'){
              this.keyLayout.keyLayoutEn.forEach((item,i)=>{
                let low = item.toLowerCase();
                let lowToo = e.key.toLowerCase();
                if(lowToo==low){
                  ind=i;
                }
              });
            }else{
              this.keyLayout.keyLayoutRu.forEach((item,i)=>{
                let low = item.toLowerCase();
                let lowToo = e.key.toLowerCase();
                if(lowToo==low){
                  ind=i;
                }
              });
            }
            if(ind!==666){
              keyEl[ind].classList.add('keyboard__key_active');
            }
            textArea.focus();

            let d = this.properties.value.slice(this.properties.counter);
            let key = e.key;
            this.properties.value = this.properties.value.slice(0,this.properties.counter);
            if(this.properties.capsLock && this.properties.shift){
              this.properties.value += key.toLowerCase();
            }else if(this.properties.capsLock||this.properties.shift){
              this.properties.value += key.toUpperCase();
            }else{
              this.properties.value += key.toLowerCase();
            }
            this.properties.value += d;
            this._triggerEvent("oninput");
            this.properties.counter++;
            textArea.selectionStart = this.properties.counter;
            textArea.selectionEnd = this.properties.counter;
            
           }
          break;
      }
    });
    textArea.addEventListener('keyup',(e)=>{
      const keyEl = document.querySelectorAll(`.keyboard__key`);
        switch (e.key) {
          case "Backspace":
            keyEl[12].classList.remove('keyboard__key_active');
            break;
  
          case "CapsLock":
              keyEl[26].classList.remove('keyboard__key_active');
            break;
  
          case "Enter":
              keyEl[38].classList.remove('keyboard__key_active');
            break;
  
          case " ":
            keyEl[53].classList.remove('keyboard__key_active');
            break;
          case "Shift":
              const newKeyEl = this.elements.keys;
              newKeyEl[52].classList.remove('keyboard__key_active');
            break;
  
          case "ArrowLeft":
            keyEl[54].classList.remove('keyboard__key_active');
            break;
          case "ArrowRight":
            keyEl[55].classList.remove('keyboard__key_active');
            break;
          default: 
            if(e.key.length === 1){
              e.preventDefault();
              let ind = 666;
              if(this.properties.lang === 'En'){
                this.keyLayout.keyLayoutEn.forEach((item,i)=>{
                  let low = item.toLowerCase();
                  let lowToo = e.key.toLowerCase();
                  if(lowToo==low){
                    ind=i;
                  }
                });
              }else{
                this.keyLayout.keyLayoutRu.forEach((item,i)=>{
                  let low = item.toLowerCase();
                  let lowToo = e.key.toLowerCase();
                  if(lowToo==low){
                    ind=i;
                  }
                });
              }
              if(ind!==666){
                keyEl[ind].classList.remove('keyboard__key_active');
              }
            }
      }
    });
  },
  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },
  _updateDis(){
    document.querySelector(".use-keyboard-input").textContent = this.properties.value;
  },

  _toggleCapsLock(change = true) {
    if(change) this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && this.properties.shift) {
        if(key.textContent === 'en' || key.textContent === 'ru' ||key.textContent === 'shift'|| key.textContent === 'sound' ) continue;
        key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase() ;
      }else if(key.childElementCount === 0 && !this.properties.shift){
        if(key.textContent === 'en'|| key.textContent === 'ru' || key.textContent === 'shift'|| key.textContent === 'sound' ) continue;
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },
  

  _toggleLang() {
    this.properties.lang = this.properties.lang==="En" ? "Ru":"En";
    if(this.properties.lang === "En" && this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutEnShift));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }else if(this.properties.lang === "Ru" && this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutRuShift));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }else if(this.properties.lang === "En" && !this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutEn));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }else if(this.properties.lang === "Ru" && !this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutRu));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }
    if(this.properties.capsLock) document.querySelector('.caps').classList.add('keyboard__key--active');
    this._toggleCapsLock(false)
  },
  

  _toggleShift(){
    this.properties.shift = !this.properties.shift;
    if(this.properties.lang === "En" && this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutEnShift));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }else if(this.properties.lang === "Ru" && this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutRuShift));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }else if(this.properties.lang === "En" && !this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutEn));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }else if(this.properties.lang === "Ru" && !this.properties.shift){
      this.elements.keysContainer.innerHTML = "";
      this.elements.keysContainer.appendChild(this._createKeys(this.keyLayout.keyLayoutRu));
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    }
    if(this.properties.capsLock) document.querySelector('.caps').classList.add('keyboard__key--active');
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && this.properties.shift) {
        if(key.textContent === 'en' ||key.textContent === 'ru' || key.textContent === 'shift'|| key.textContent === 'sound' ) continue;
        key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase() ;
      }else if(key.childElementCount === 0 && !this.properties.shift){
        if(key.textContent === 'en' ||key.textContent === 'ru' || key.textContent === 'shift'|| key.textContent === 'sound' ) continue;
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  Keyboard._useRealKeyboard();
});