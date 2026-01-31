

//Themes
const themeSwitcher = {
    //Configuracion inicial
    _scheme: "auto",
    menuTarget: "details.dropdown",
    buttonsTarget: "[data-theme-switcher]",
    buttonAttribute: "data-theme-switcher",
    rootAttribute: "data-theme",
    localStorageKey: "traceipPreferredColorScheme",
  
    //init -  Inicialización
    init() {
      this.scheme = this.schemeFromLocalStorage;
      this.initSwitchers();
    },
  
    //Obtener el esquema desde el almacenamiento local
    get schemeFromLocalStorage() {
      return window.localStorage?.getItem(this.localStorageKey) ?? this._scheme;
    },
  
    //Determinar el esquema preferido del usuario
    get preferredColorScheme() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    },
  
    //Inicializar los botones que cambian el esquema ( InitSwitchers )
    initSwitchers() {
      const buttons = document.querySelectorAll(this.buttonsTarget);
      buttons.forEach((button) => {
        button.addEventListener(
          'click',
          (event) => {
            event.preventDefault();
            //set scheme
            this.scheme = button.getAttribute(this.buttonAttribute);
            //close dropdown
            document.querySelector(this.menuTarget)?.removeAttribute("open");
          },
          false
        );
      });
    },
  
    // Set sheme
    set scheme(scheme) {
      if(scheme == "auto") {
        this._scheme = this.preferredColorScheme;
      } else if (scheme == "dark" || scheme == "light") {
        this._scheme = scheme;
      }
      this.applyScheme();
      this.schemeToLocalStorage();
    },
  
    //Get scheme
    get scheme() {
      return this._scheme;
    },
  
    //Apply scheme
    applyScheme() {
      document.documentElement?.setAttribute(this.rootAttribute, this.scheme);
    },
  
    // Store scheme to local storage
    schemeToLocalStorage() {
      window.localStorage?.setItem(this.localStorageKey, this.scheme);
    },
  };
  
  
  // Init
  themeSwitcher.init();
  