/**
 * Come2Huelva - Main Application Script
 * Refactored and optimized for production
 * @version 2.0.0
 * @date October 2025
 */

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  const CONFIG = {
    API: {
      EMAIL_ENDPOINT: 'http://localhost:3000/send-email',
      TIMEOUT: 10000
    },
    CAROUSEL: {
      DEFAULT_INTERVAL: 3500,
      PAUSE_DURATION: 4000,
      RESIZE_DEBOUNCE: 150
    },
    BREAKPOINTS: {
      MOBILE: 768,
      TABLET: 1024
    },
    STORAGE_KEY: 'lang',
    DEFAULT_LANGUAGE: 'es',
    INTERSECTION_THRESHOLD: 0.15
  };

  // ==================== UTILITIES ====================
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const debounce = (fn, wait) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  const setExpanded = (el, expanded) => {
    if (el) el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage.getItem failed:', e);
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn('localStorage.setItem failed:', e);
        return false;
      }
    }
  };

  const updateText = (el, text) => {
    if (el && text !== undefined) el.textContent = text;
  };

  const updateHTML = (el, html) => {
    if (el && html !== undefined) el.innerHTML = html;
  };

  const updateMultiple = (elements, texts) => {
    if (!elements || !texts) return;
    texts.forEach((text, i) => {
      if (elements[i]) updateText(elements[i], text);
    });
  };

  // ==================== TOAST NOTIFICATIONS ====================
  const Toast = {
    container: null,
    
    init() {
      this.container = $('#toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },
    
    show(message, type = 'info', title = '', duration = 5000) {
      this.init();
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      const titles = {
        success: title || '¡Éxito!',
        error: title || 'Error',
        warning: title || 'Atención',
        info: title || 'Información'
      };
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
          <div class="toast-title">${titles[type]}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Cerrar">×</button>
      `;
      
      this.container.appendChild(toast);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toast.classList.add('show');
        });
      });
      
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.hide(toast));
      
      if (duration > 0) {
        setTimeout(() => this.hide(toast), duration);
      }
      
      return toast;
    },
    
    hide(toast) {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    },
    
    success(message, title) {
      return this.show(message, 'success', title);
    },
    
    error(message, title) {
      return this.show(message, 'error', title);
    },
    
    warning(message, title) {
      return this.show(message, 'warning', title);
    },
    
    info(message, title) {
      return this.show(message, 'info', title);
    }
  };

  // ==================== LOADING OVERLAY ====================
  const Loading = {
    overlay: null,
    
    init() {
      this.overlay = $('#loading-overlay');
      if (!this.overlay) {
        this.overlay = document.createElement('div');
        this.overlay.id = 'loading-overlay';
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(this.overlay);
      }
    },
    
    show() {
      this.init();
      requestAnimationFrame(() => {
        this.overlay.classList.add('show');
      });
    },
    
    hide() {
      if (this.overlay) {
        this.overlay.classList.remove('show');
      }
    }
  };

  // ==================== SCROLL TO FORM ====================
  window.scrollToForm = function() {
    const formContainer = $('.form-container');
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ==================== TOGGLE LANGUAGE MENU ====================
  window.toggleLanguageMenu = function() {
    const menu = $('.language-options');
    const btn = $('.selected-language');
    if (!menu || !btn) return;
    const willShow = !menu.classList.contains('show');
    menu.classList.toggle('show');
    setExpanded(btn, willShow);
  };

  // Close language menu on outside click
  document.addEventListener('click', (e) => {
    const menu = $('.language-options');
    const btn = $('.selected-language');
    if (!menu || !btn) return;
    if (!e.target.closest('.language-selector') && menu.classList.contains('show')) {
      menu.classList.remove('show');
      setExpanded(btn, false);
    }
  });

  // Close language menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = $('.language-options');
      const btn = $('.selected-language');
      if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
        if (btn) setExpanded(btn, false);
      }
    }
  });

  // ==================== TRANSLATIONS ====================
  const translations = {
    es: {
      navLinks: [
        "Visitas",
        "Travesías",
        "Actividades",
        "Gastronomía",
        "Sobre nosotros"
      ],
      introductionSpans: [
        "Imagina un lugar donde cada rincón cuenta una historia, cada sabor te conecta con la tierra y cada momento queda grabado en el corazón.",
        "Queremos que vivas Huelva como nosotros la vivimos. Te invitamos a descubrir una Huelva auténtica con quienes la conocen y la aman profundamente. Esto no es un viaje; es una  vivencia inolvidable que queremos que recuerdes para siempre.",
        "NO SEAS UN TURISTA.",
        "“Ven a vivir nuestras cultura y nuestras tradiciones”"
      ],
      placeHeader: "Sumérgete en nuestra tierra",
      placeSpans: [
        "Huelva no es solo un destino, es un lugar para sentir con el alma y el corazón.",
        "Queremos que descubras el encanto de Doñana, el fervor Rociero, la calma de las playas infinitas y las profundidades de la tierra en la Gruta de las Maravillas. Juntos te mostraremos cada lugar como solo nosotros lo conocemos, sintiendo su esencia y conectando con su historia.",
        "“Cada rincón te hablará de nuestra tierra, de su gente y de su historia.”"
      ],
      placesOverlays: [
        {
          title: "Parque Nacional de Doñana",
          span: "Vive los 4 ecosistemas de Doñana; playas, bosques, dunas y marismas. Hábitat de ciervos, jabalís, linces, zorros, águilas imperiales, garzas, paso de ballenas, delfines, tiburones ballenas, tortugas y miles y miles de pinos piñoneros, enebros, tomillo y romero; un paraje natural único en el planeta."
        },
        {
          title: "El Rocío",
          span: "Conoce la aldea donde se celebra la mayor romería de España y la segunda mayor de Europa en honor a la Virgen de El Rocío. Admira la majestuosidad de “El Abuelo” (Monumento Natural), siéntate a la sombra de este acebuche de más de 600 años e imagina todo lo que ha podido “ver”."
        },
        {
          title: "Almonte",
          span: "Recorre el Camino de la Pastora, un itinerario que revive la venida de la Virgen de El Rocío al pueblo de Almonte cada siete años. Catedrales efímeras y pasillos de flores de papel hechas a mano engalanan las calles del pueblo para su señora, mientras los Almonteños la reciben con salves de escopetas."
        },
        {
          title: "Costa de la Luz",
          span: "Caminemos juntos por la playa mas larga de Europa. Playa de arena dorada con dunas móviles y acantilados fósiles únicos en Europa (Monumento Natural). Más de 60 km de litoral de playa virgen que conforman mas del 30% de las playas vírgenes de toda España."
        },
        {
          title: "Sierra de Aracena y picos de Aroche",
          span: "Recorre senderos entre encinas y castaños hasta llegar a las entrañas de la tierra y descubrir la mágica Gruta de las Maravillas (Monumento Natural). Después, deleita tus sentidos con los sabores de la sierra: embutidos ibéricos y el inconfundible jamón de Jabugo D.O.P."
        },
        {
          title: "Cuenca minera y Rio Tinto",
          span: "Adentrémonos en un paisaje que parece de otro planeta. Déjate sorprender por las minas a cielo abierto más grandes del mundo con más de 5.000 años de actividad. Subamos a un tren minero junto a un río tan rojo como el color del vino tinto, en el que la NASA estudia la vida en Marte."
        },
        {
          title: "Lugares Colombinos",
          span: "Embarquemos en las réplicas a tamaño real en las que Colón zarpó desde Palos de la Frontera para cruzar el océano Atlántico y descubrir el “Nuevo Mundo”. Una vez en cubierta, entenderás perfectamente lo INCREIBLE de aquella hazaña."
        },
        {
          title: "Castillos y fortalezas",
          span: "Viajemos en el tiempo visitando el castillo medieval de Niebla, primer lugar en Europa en el que se usó la pólvora, o los castillos de Cortegana, Aracena, Cumbres Mayores, Aroche, Encinasola o de Santa Olalla de Cala donde cada piedra cuenta una batalla, una leyenda y sueños de antaño."
        },
        {
          title: "Moguer literario",
          span: "Sumérgete en la cuna del Nobel Juan Ramón Jiménez y pasea por las calles que le inspiraron para escribir Platero y yo. Descubre su casa natal, sus rincones blancos y el ambiente literario de un pueblo donde poesía, mar y tradición conviven de forma natural."
        }
      ],
      activitiesHeader: "Momentos que dejan huella",
      activitiesSpans: [
        "No vengas solo a ver, trae el corazón abierto para sentir cada emoción y deja que Huelva cale en ti.",
        "Queremos que cada experiencia te sorprenda, que aprendas algo nuevo y lo integres como propio. Nuestro objetivo es que se te escape una sonrisa cuando recuerdes la experiencia vivida, porque no fuiste un turista, fuiste parte de la historia.",
        "“Porque hay lugares que se visitan, y otros …que se gravan en el corazón.”"
      ],
      activitiesCards: [
        { title: "Las huellas del tiempo", description: "Siente como tu pies desnudos se hunden en la fina arena dorada dejando una huella tras otra con cada paso que das. Siente el frescor de las olas entre tus dedos, las mismas que borran las huellas que fuiste dejando para que todo quede como si nunca nadie la hubiese pisado allí." },
        { title: "Tierra de pescadores", description: "Relájate y practica la paciencia, tan ausente en estos tiempos. Aprende a pescar en un entorno natural único mientras cierras los ojos e inspiras profundamente la brisa del océano que golpea tu rostro; escucha el romper de las olas justo delante de ti." },
        { title: "Huelva marinera", description: "Naveguemos por la costa como lo hacían nuestros antepasados y como lo hacen hoy en día nuestros marineros. Disfruta de diferentes vistas de la costa y de un refrescante baño." },
        { title: "Orientación celeste", description: "Aprende a orientarte de noche y descubre los secretos del cielo mientras aprendes a usar un telescopio con tus propias manos. Podrás ver los cráteres de la luna y hacer tu primera foto astronómica con tu móvil a través del telescopio." },
        { title: "El poder del viento", description: "Aprende a volar una cometa de tracción y siente el poder del viento en tus propias manos. Descansa y comprende la importancia de usar bien los vientos para la navegación a vela que llevó a Colón al descubrimiento del “Nuevo Mundo”." },
        { title: "Fervor rociero", description: "El Rocío está asociado a una parte muy espiritual. El Rocío es fe pero también amistad, compartir, recordar a los que ya no están, cantar y bailar sevillanas entre amigos. Como dice la sevillana, “Almonte me ha enseñado que El Rocío es todo el año, no solo la romería.”" },
        { title: "Paseo en carreta", description: "Disfruta de una afición local: salir con amigos a dar un paseo en carreta. Aunque en muchas ciudades es una atracción turística, aquí en Huelva, es una afición tradicional ligada a un estilo de vida asociado al caballo." },
        { title: "Paseo a caballo", description: "Súbete a un caballo y siente lo que es controlar un animal de 500kg. Imagina ir acompañado de miles de caballos como se hace en el camino de El Rocío. Ahora, mira hacia abajo para imaginar cómo nos veían los nativos americanos cuando un español llegaba a caballo." },
        { title: "Senderismo", description: "Perdámonos caminando por un sendero entre pinares, elige un buen bastón de apoyo y analicemos la flora y fauna local. Escucha el canto de los pájaros y tratemos de distinguirlos e identificarlos." },
        { title: "Cocinar con Huelva", description: "Aprende a preparar un arroz con productos locales. Disfrutemos preparando un arroz con mariscos o un arroz ibérico y luego deleitemos nuestro paladar con el exquisito sabor de Huelva, cocinado por nosotros mismos." },
        { title: "Caza fotográfica", description: "Los locales conocen Doñana como “El Coto” debido a su origen como reserva de caza, una afición y tradición que perdura en la zona. Vamos a coger una cámara con zoom e ir a “cazar” las mejores fotos de animales. Mantente escondido, localiza la presa, apunta y dispara." }
      ],
      gastronomyHeader: "Bocados de Huelva",
      gastronomySpans: [
        "En Huelva, la comida es encuentro, es amistad, es emoción.",
        "Comer en Huelva es como hacer el amor. Cada cucharada, una caricia; cada plato, una historia de amor que estremecerá tus sentidos. Con nosotros, no solo probarás la comida: la vivirás.",
        "Te llevaremos a los rincones donde nosotros mismos disfrutamos de la mejor gastronomía, rodeados de amigos y de historias; el verdadero espíritu de nuestra tierra.",
        "“Para nosotros, comer es celebrar, y contigo … queremos celebrarlo todo.”"
      ],
      gastronomyCards: [
        { title: "Ibéricos y chacinas", description: "Presa paleta, secreto, lagartito, abanico, jamón, caña de lomo, presita embuchada, morcón y muchas otras delicias ibéricas que nunca antes habrás probado." },
        { title: "Mariscos y pescados", description: "Gambas blancas, coquinas, chocos , corvinatas, anchovas, lubinas y doradas salvajes, todo fresco y de nuestras costas." },
        { title: "Come Doñana", description: "Calderetas de carnes de caza de jabalí y ciervo de Doñana. No te querrás quedar sin probar la Vaca Mostrenca, raza exclusiva de Doñana." },
        { title: "La sangre del Condado", description: "Vinos de las bodegas del Condado de Huelva donde se produjo en primer Vermut en España. Destacar el Vino de Naranja y el exclusivo brandy Luis Felipe." },
        { title: "Berries y piñones", description: "Fresas, arándanos, frambuesas y moras. El 50% de la fresa mundial proviene de Huelva. El piñón mediterráneo es un producto gourmet y muy exclusivo siendo Huelva su mayor motor productivo a nivel mundial." },
        { title: "Aceite y miel", description: "Aceite virgen extra extraído exclusivamente mediante procesos mecánicos y la miel más pura obtenida por apicultores locales de la zona de Doñana." }
      ],
      plansHeader: "Nuestras travesías",
      plansSpans: [
        "Viajar es mucho más que ir a un destino. Es conectar con un lugar y con su gente, con su historia y sus sabores.",
        "Nuestras travesías han sido diseñados para que solo tengas que preocuparte de una cosa: DISFRUTAR. Nosotros nos encargamos de TODO para que sea inolvidable: transporte, alojamiento, comidas, actividades, experiencias, y lo más importante, acompañarte como guías locales que conocen cada rincón y cada secreto de esta tierra.",
        "Hemos reunido lo mejor de nuestra tierra mezclando naturaleza, cultura, gastronomía y tradición, para que tú seas parte de Huelva y Huelva sea parte de ti.",
        "“Todo empieza con una decisión... elige vivirla y déjate llevar.”"
      ],
      plansCards: [
        { title: "🌊 Brisa de Huelva – (Finde: 2 noches)", description: "Una escapada perfecta para quienes quieren conocer la esencia de Huelva en pocos días." },
        { title: "🌊 Disfruta Huelva - 4 - 5 días", description: "Escapada de puente o finde largo en la que conocer la esencia de Huelva y hacer algunas actividades/experiencias adicionales." },
        { title: "🌿 Huelva sin prisa – 7 días o más", description: "Un viaje completo para descubrir Huelva con los cinco sentidos. Para aquellos que quieren vivir varias experiencias en el mismo viaje. Ideal para quienes quieren conocer lo que esta tierra ofrece de forma cercana  y profunda." }
      ],
      personalizedPlan: "Experiencia Personalizada",
      personalizedPlanSpans: [
        "Si tienes otros tiempos o necesidades, creamos tu experiencia a medida.",
        "Nos adaptamos a ti: Tú nos lo cuentas qué buscas y nosotros lo organizamos todo para que sea una experiencia inolvidable."
      ],
      opinionsHeader: "Opiniones de nuestros visitantes",
      formHeader: "CONTACTO",
      formSpans: [
        "Estás a punto de comenzar un viaje de descubrimiento como antaño lo hicieron nuestros antepasados para llegar al “Nuevo Mundo”.",
        "Embárcate en una de nuestras travesías y disfruta descubriendo una tierra de descubridores."
      ],
      formLabels: {
        name: "Nombre",
        email: "Email:",
        phone: "Teléfono:",
        people: "Número de personas:",
        message: "Mensaje:"
      },
      submitButton: "Enviar",
      headerCta: "Reservar tu tour",
      footerCtaIndex: "Conócenos",
      footerCtaAbout: "Ver planes",
      aboutUsHeader: "Sobre nosotros",
      aboutUsSpans: [
        "Somos Javier y Laura, dos hermanos Almonteños orgullosos de nuestras raíces y profundamente enamorados de nuestra tierra.",
        "Tras estudiar fuera, vivir en varios países y viajar por medio mundo, siempre hemos estado orgullosos de haber nacido en una tierra con una identidad única.",
        "A lo largo de los años hemos traído a decenas de grupos de amigos de toda España, de Portugal, de Irlanda, Reino Unido, Bélgica, Holanda, Francia, Italia, Perú, Ecuador, Venezuela, Brasil, EEUU, Australia y muchas otras partes del mundo para que conocieran lo que nosotros llamamos “casa”.",
        "Tras tantas experiencias, hemos aprendido que un viaje inolvidable es aquel en el que te permites dedicar a cada momento el tiempo que se merece. Sentir cada instante con calma, con los cinco sentidos y con el corazón. Disfrutar de cada paisaje, cada atardecer, cada persona que se conoce, cada sorbo de vino o cada nuevo sabor que se prueba. Eso es lo que realmente convierte un viaje en una experiencia de vida.",
        "Promovemos un turismo en que aprender a disfrutar de cada momento.",
        "“Para nosotros, viajar es detenerse, respirar, saborear, mirar y sentir.”",
        "Así nace Come2Huelva."
      ],
      ourSecretHeader: "Nuestro secreto",
      ourSecretSpans: [
        "Ponerle mucho cariño a lo que hacemos y respetar 3 claves:",
        "1. Grupos reducidos. Buscamos un entorno familiar/amigable en el que compartir vivencias y momentos. Máximo 8 personas.",
        "2. Los tiempos. No buscamos ver todo corriendo. Queremos que te relajes y disfrutes de cada lugar y de cada momento con las personas que te rodean.",
        "3. Guías locales: Los guías serán personas locales enamoradas de Huelva. Imprescindible para vivir Huelva con su cultura, su historia y sus tradiciones.",
        "Nota: Si buscas recorrer Huelva solo para hacer fotos de los lugares, podemos recomendarte otras agencias o incluso ayudarte a organizar una ruta para hacerlo por tu cuenta. Nuestra propuesta es diferente."
      ]
    },
    en: {
      navLinks: [
        "Visits",
        "Journeys",
        "Activities",
        "Gastronomy",
        "About us"
      ],
      introductionSpans: [
        "Imagine a place where every corner tells a story, every flavor connects you to the land, and every moment is etched in your heart.",
        "We want you to experience Huelva as we do. We invite you to discover an authentic Huelva with those who know and deeply love it. This is not a trip; it is an unforgettable experience that we want you to remember forever.",
        "DON'T BE A TOURIST.",
        "“Come live our culture and traditions”"
      ],
      placeHeader: "Immerse yourself in our land",
      placeSpans: [
        "Huelva is not just a destination, it's a place to feel with your soul and heart.",
        "We want you to discover the charm of Doñana, the fervor of El Rocío, the calm of endless beaches, and the depths of the earth in the Gruta de las Maravillas. Together we will show you each place as only we know it, feeling its essence and connecting with its history.",
        "“Every corner will speak to you of our land, its people, and its history.”"
      ],
      placesOverlays: [
        {
          title: "Doñana National Park",
          span: "Experience the 4 ecosystems of Doñana: beaches, forests, dunes, and marshes. Home to deer, wild boar, lynx, foxes, imperial eagles, herons, whales, dolphins, whale sharks, turtles, and thousands and thousands of stone pines, junipers, thyme, and rosemary; a <span class=\"u-info\">unique natural site on the planet.</span>"
        },
        {
          title: "El Rocío",
          span: "Discover the village where <u>the largest pilgrimage in Spain</u> and <u>the second largest in Europe</u> is held in honor of the Virgin of El Rocío. Admire the majesty of “El Abuelo” (<u>Natural Monument</u>), sit in the shade of this over 600-year-old wild olive tree and imagine all it has 'seen.'"
        },
        {
          title: "Almonte",
          span: "Walk the <strong>Camino de la Pastora</strong>, a route that recreates the journey of the Virgin of El Rocío to the town of Almonte every seven years. Ephemeral cathedrals and corridors of handmade paper flowers adorn the streets for their lady, while the people of Almonte welcome her with gun salutes."
        },
        {
          title: "Costa de la Luz",
          span: "Let's walk together along <u>the longest beach in Europe</u>. Golden sand beach with moving dunes and unique fossil cliffs in Europe (<u>Natural Monument</u>). Over 60 km of virgin coastline, making up more than 30% of all virgin beaches in Spain."
        },
        {
          title: "Sierra de Aracena and Picos de Aroche",
          span: "Walk trails among holm oaks and chestnut trees until you reach the depths of the earth and discover the magical <strong>Gruta de las Maravillas</strong> (<u>Natural Monument</u>). Then, delight your senses with the flavors of the mountains: Iberian sausages and the unmistakable <strong>Jabugo D.O.P</strong> ham."
        },
        {
          title: "Mining Basin and Rio Tinto",
          span: "Let's enter a landscape that seems from another planet. Be amazed by the world's <u>largest open-pit mines</u> with over 5,000 years of activity. Let's ride a mining train alongside a river as red as red wine, where NASA studies life on Mars."
        },
        {
          title: "Columbian Sites",
          span: "Board life-size replicas of the ships Columbus sailed from Palos de la Frontera to cross the Atlantic Ocean and discover the 'New World.' Once on deck, you'll truly understand the INCREDIBLE nature of that feat."
        },
        {
          title: "Castles and Fortresses",
          span: "Travel back in time visiting <strong>the medieval castle of Niebla</strong>, <u>the first place in Europe</u> where gunpowder was used, or the castles of Cortegana, Aracena, Cumbres Mayores, Aroche, Encinasola, or Santa Olalla de Cala, where every stone tells a battle, a legend, and dreams of yesteryear."
        },
        {
          title: "Literary Moguer",
          span: "Immerse yourself in the birthplace of Nobel laureate <strong>Juan Ramón Jiménez</strong> and stroll through the streets that inspired him to write <em>Platero y yo</em>. Discover his birthplace, its white corners, and the literary atmosphere of a town where poetry, sea, and tradition coexist naturally."
        }
      ],
      activitiesHeader: "Moments that leave a mark",
      activitiesSpans: [
        "Don't just come to see, come with an open heart to feel every emotion and let Huelva soak into you.",
        "We want every experience to surprise you, to teach you something new and make it your own. Our goal is for you to smile when you remember the experience, because you weren't a tourist, you were part of the story.",
        "“Because there are places you visit, and others ...that are engraved in your heart.”"
      ],
      activitiesCards: [
        { title: "The footprints of time", description: "Feel your bare feet sink into the fine golden sand, leaving one footprint after another with each step you take. Feel the coolness of the waves between your toes, the same waves that erase the footprints you left so that everything looks as if no one had ever walked there." },
        { title: "Land of fishermen", description: "Relax and practice patience, so absent in these times. Learn to fish in a unique natural setting while you close your eyes and deeply inhale the ocean breeze hitting your face; listen to the waves breaking right in front of you." },
        { title: "Seafaring Huelva", description: "Let's sail along the coast as our ancestors did and as our sailors still do today. Enjoy different views of the coast and a refreshing swim." },
        { title: "Celestial orientation", description: "Learn to orient yourself at night and discover the secrets of the sky while you learn to use a telescope with your own hands. You can see the craters of the moon and take your first astronomical photo with your mobile phone through the telescope." },
        { title: "The power of the wind", description: "Learn to fly a traction kite and feel the power of the wind in your own hands. Rest and understand the importance of properly using the winds for sailing, which led Columbus to discover the 'New World'." },
        { title: "Rocío fervor", description: "El Rocío is associated with a very spiritual part. El Rocío is faith but also friendship, sharing, remembering those who are no longer here, singing and dancing sevillanas among friends. As the sevillana says, 'Almonte has taught me that El Rocío is all year round, not just the pilgrimage.'" },
        { title: "Carriage ride", description: "Enjoy a local hobby: going out with friends for a horse-drawn carriage ride. Although in many cities it's a tourist attraction, here in Huelva, it's a traditional hobby linked to a lifestyle associated with horses." },
        { title: "Horseback riding", description: "Get on a horse and feel what it's like to control a 500kg animal. Imagine being accompanied by thousands of horses as is done on the way to El Rocío. Now, look down to imagine how the American natives saw us when a Spaniard arrived on horseback." },
        { title: "Hiking", description: "Let's get lost walking along a path among pine forests, choose a good stick for support and analyze the local flora and fauna. Hear the birds singing and let's try to distinguish and identify them." },
        { title: "Cooking with Huelva", description: "Learn to prepare rice with local ingredients. Let's enjoy cooking seafood rice or Iberian rice and then delight our palate with the exquisite flavor of Huelva, cooked by ourselves." },
        { title: "Photo 'hunting'", description: "Locals know Doñana as 'El Coto' due to its origin as a hunting reserve, a hobby and tradition that endures in the area. Let's grab a zoom camera and go 'hunt' the best animal photos. Stay hidden, locate the prey, aim and shoot." }
      ],
      gastronomyHeader: "Flavors of Huelva",
      gastronomySpans: [
        "In Huelva, food is gathering, friendship, and emotion.",
        "Eating in Huelva is like making love. Every spoonful, a caress; every dish, a love story that will thrill your senses. With us, you won't just taste the food: you'll live it.",
        "We'll take you to the places where we ourselves enjoy the best gastronomy, surrounded by friends and stories; the true spirit of our land.",
        "“For us, eating is celebrating, and with you ... we want to celebrate everything.”"
      ],
      gastronomyCards: [
        { title: "Iberian meats and sausages", description: "Presa paleta, secreto, lagartito, abanico, ham, caña de lomo, presita embuchada, morcón and many other Iberian delicacies you may have never tried before." },
        { title: "Seafood and fish", description: "White prawns, coquinas, cuttlefish, corvinatas, anchovies, wild sea bass and gilthead bream, all fresh from our coasts." },
        { title: "Taste Doñana", description: "Stews of wild boar and deer from Doñana. Don't miss the Mostrenca Cow, an exclusive breed from Doñana." },
        { title: "The blood of the Condado", description: "Wines from the wineries of Condado de Huelva, where the first Vermouth in Spain was produced. Highlighting Orange Wine and the exclusive Luis Felipe brandy." },
        { title: "Berries and pine nuts", description: "Strawberries, blueberries, raspberries, and blackberries. 50% of the world's strawberries come from Huelva. Mediterranean pine nuts are a gourmet and exclusive product, with Huelva as the world's largest producer." },
        { title: "Oil and honey", description: "Extra virgin olive oil extracted exclusively by mechanical processes and the purest honey obtained by local beekeepers from the Doñana area." }
      ],
      plansHeader: "Our journeys",
      plansSpans: [
        "Traveling is much more than going to a destination. It's connecting with a place and its people, with its history and flavors.",
        "Our journeys are designed so you only have to worry about one thing: ENJOYING. We take care of EVERYTHING to make it unforgettable: transport, accommodation, meals, activities, experiences, and most importantly, accompanying you as local guides who know every corner and secret of this land.",
        "We have brought together the best of our land, mixing nature, culture, gastronomy, and tradition, so that you become part of Huelva and Huelva becomes part of you.",
        "“Everything starts with a decision... choose to live it and let yourself go.”"
      ],
      plansCards: [
        { title: "🌊 Huelva Breeze – (Weekend: 2 nights)", description: "A perfect getaway for those who want to know the essence of Huelva in a few days." },
        { title: "🌊 Enjoy Huelva - 4 - 5 days", description: "A long weekend or bridge getaway to discover the essence of Huelva and do some additional activities/experiences." },
        { title: "🌿 Unhurried Huelva – 7 days or more", description: "A complete trip to discover Huelva with all five senses. For those who want to live several experiences in the same trip. Ideal for those who want to know what this land offers in a close and deep way." }
      ],
      personalizedPlan: "Personalized Experience",
      personalizedPlanSpans: [
        "If you have other times or needs, we create your tailor-made experience.",
        "We adapt to you: You tell us what you are looking for and we organize everything so that it is an unforgettable experience."
      ],
      opinionsHeader: "Visitor Reviews",
      formHeader: "CONTACT",
      formSpans: [
        "You are about to start a journey of discovery just as our ancestors did to reach the 'New World.'",
        "Embark on one of our journeys and enjoy discovering a land of discoverers."
      ],
      formLabels: {
        name: "Name",
        email: "Email:",
        phone: "Phone:",
        people: "Number of people:",
        message: "Message:"
      },
      submitButton: "Send",
      headerCta: "Book your tour",
      footerCtaIndex: "Get to know us",
      footerCtaAbout: "View plans",
      aboutUsHeader: "About us",
      aboutUsSpans: [
        "We are Javier and Laura, two siblings from Almonte, proud of our roots and deeply in love with our land.",
        "After studying abroad, living in several countries, and traveling around half the world, we have always been proud to have been born in a land with a unique identity.",
        "Over the years, we have brought dozens of groups of friends from all over Spain, Portugal, Ireland, the UK, Belgium, the Netherlands, France, Italy, Peru, Ecuador, Venezuela, Brazil, the USA, Australia, and many other parts of the world to discover what we call 'home.'",
        "After so many experiences, we have learned that an unforgettable trip is one in which you allow yourself to dedicate the time each moment deserves. To feel each instant calmly, with all five senses and with your heart. To enjoy every landscape, every sunset, every person you meet, every sip of wine, or every new flavor you try. That is what truly makes a trip a life experience.",
        "We promote tourism where you learn to enjoy every moment.",
        "“For us, traveling is to stop, breathe, taste, look, and feel.”",
        "This is how Come2Huelva was born."
      ],
      ourSecretHeader: "Our secret",
      ourSecretSpans: [
        "Putting a lot of love into what we do and respecting 3 keys:",
        "1. Small groups. We seek a family/friendly environment in which to share experiences and moments. Maximum 8 people.",
        "2. The timing. We don't seek to see everything in a rush. We want you to relax and enjoy each place and each moment with the people around you.",
        "3. Local guides: The guides will be local people in love with Huelva. Essential to experience Huelva with its culture, history, and traditions.",
        "Note: If you are looking to tour Huelva just to take photos of the places, we can recommend other agencies or even help you organize a route to do it on your own. Our proposal is different."
      ]  
    },
    fr: {
      navLinks: [
        "Visites",
        "Voyages",
        "Activités",
        "Gastronomie",
        "À propos de nous"
      ],
      introductionSpans: [
        "Imaginez un endroit où chaque recoin raconte une histoire, chaque saveur vous relie à la terre et chaque moment reste gravé dans le cœur.",
        "Nous voulons que vous viviez Huelva comme nous la vivons. Nous vous invitons à découvrir une Huelva authentique avec ceux qui la connaissent et l'aiment profondément. Ce n'est pas un voyage ; c'est une expérience inoubliable que nous voulons que vous vous rappeliez pour toujours.",
        "NE SOYEZ PAS UN TOURISTE.",
        "« Venez vivre notre culture et nos traditions »"
      ],
      placeHeader: "Immergez-vous dans notre terre",
      placeSpans: [
        "Huelva n'est pas seulement une destination, c'est un lieu à ressentir avec l'âme et le cœur.",
        "Nous voulons que vous découvriez le charme de Doñana, la ferveur du Rocío, le calme des plages infinies et les profondeurs de la terre dans la Grotte des Merveilles. Ensemble, nous vous montrerons chaque endroit comme nous seuls le connaissons, en ressentant son essence et en nous connectant à son histoire.",
        "« Chaque recoin vous parlera de notre terre, de ses habitants et de son histoire. »"
      ],
      placesOverlays: [
        {
          title: "Parc National de Doñana",
          span: "Vivez les 4 écosystèmes de Doñana : plages, forêts, dunes et marais. Habitat de cerfs, sangliers, lynx, renards, aigles impériaux, hérons, baleines, dauphins, requins-baleines, tortues et des milliers et des milliers de pins parasols, genévriers, thym et romarin ; un <span class=\"u-info\">site naturel unique sur la planète.</span>"
        },
        {
          title: "El Rocío",
          span: "Découvrez le village où se déroule <u>le plus grand pèlerinage d'Espagne</u> et <u>le deuxième plus grand d'Europe</u> en l'honneur de la Vierge d'El Rocío. Admirez la majesté de « El Abuelo » (<u>Monument Naturel</u>), asseyez-vous à l'ombre de cet olivier sauvage de plus de 600 ans et imaginez tout ce qu'il a pu « voir »."
        },
        {
          title: "Almonte",
          span: "Parcourez le <strong>Camino de la Pastora</strong>, un itinéraire qui recrée la venue de la Vierge d'El Rocío au village d'Almonte tous les sept ans. Des cathédrales éphémères et des couloirs de fleurs en papier faites à la main décorent les rues du village pour leur dame, tandis que les habitants d'Almonte l'accueillent avec des salves de fusils."
        },
        {
          title: "Costa de la Luz",
          span: "Marchons ensemble sur <u>la plus longue plage d'Europe</u>. Plage de sable doré avec des dunes mobiles et des falaises fossiles uniques en Europe (<u>Monument Naturel</u>). Plus de 60 km de littoral vierge, représentant plus de 30 % des plages vierges de toute l'Espagne."
        },
        {
          title: "Sierra de Aracena et Picos de Aroche",
          span: "Parcourez des sentiers parmi les chênes verts et les châtaigniers jusqu'à atteindre les entrailles de la terre et découvrir la magique <strong>Grotte des Merveilles</strong> (<u>Monument Naturel</u>). Ensuite, régalez vos sens avec les saveurs de la montagne : charcuteries ibériques et le jambon inimitable <strong>Jabugo D.O.P</strong>."
        },
        {
          title: "Bassin minier et Rio Tinto",
          span: "Entrons dans un paysage qui semble d'une autre planète. Laissez-vous surprendre par les <u>plus grandes mines à ciel ouvert du monde</u> avec plus de 5 000 ans d'activité. Prenons un train minier le long d'une rivière aussi rouge que le vin rouge, où la NASA étudie la vie sur Mars."
        },
        {
          title: "Lieux Colombiens",
          span: "Embarquez sur des répliques grandeur nature des navires avec lesquels Colomb partit de Palos de la Frontera pour traverser l'océan Atlantique et découvrir le « Nouveau Monde ». Une fois à bord, vous comprendrez vraiment l'INCROYABLE exploit que cela représentait."
        },
        {
          title: "Châteaux et forteresses",
          span: "Voyageons dans le temps en visitant <strong>le château médiéval de Niebla</strong>, <u>premier lieu en Europe</u> où la poudre à canon a été utilisée, ou les châteaux de Cortegana, Aracena, Cumbres Mayores, Aroche, Encinasola ou Santa Olalla de Cala, où chaque pierre raconte une bataille, une légende et des rêves d'antan."
        },
        {
          title: "Moguer littéraire",
          span: "Plongez dans la ville natale du lauréat Nobel <strong>Juan Ramón Jiménez</strong> et promenez-vous dans les rues qui l'ont inspiré pour écrire <em>Platero y yo</em>. Découvrez sa maison natale, ses coins blancs et l'ambiance littéraire d'une ville où poésie, mer et tradition coexistent naturellement."
        }
      ],
      activitiesHeader: "Des moments qui laissent une empreinte",
      activitiesSpans: [
        "Ne venez pas seulement voir, venez avec le cœur ouvert pour ressentir chaque émotion et laissez Huelva s'imprégner en vous.",
        "Nous voulons que chaque expérience vous surprenne, que vous appreniez quelque chose de nouveau et que vous l'intégriez comme la vôtre. Notre objectif est que vous souriiez en vous souvenant de l'expérience vécue, car vous n'étiez pas un touriste, vous faisiez partie de l'histoire.",
        "« Parce qu'il y a des endroits que l'on visite, et d'autres ...qui restent gravés dans le cœur. »"
      ],
      activitiesCards: [
        { title: "Les empreintes du temps", description: "Sentez vos pieds nus s'enfoncer dans le sable doré, laissant une empreinte après l'autre à chaque pas. Sentez la fraîcheur des vagues entre vos orteils, les mêmes vagues qui effacent les empreintes que vous avez laissées pour que tout reste comme si personne n'y avait jamais marché." },
        { title: "Terre de pêcheurs", description: "Détendez-vous et exercez votre patience, si absente à notre époque. Apprenez à pêcher dans un cadre naturel unique tout en fermant les yeux et en inspirant profondément la brise de l'océan qui frappe votre visage ; écoutez le bruit des vagues juste devant vous." },
        { title: "Huelva maritime", description: "Naviguons le long de la côte comme le faisaient nos ancêtres et comme le font encore aujourd'hui nos marins. Profitez de vues différentes sur la côte et d'une baignade rafraîchissante." },
        { title: "Orientation céleste", description: "Apprenez à vous orienter la nuit et découvrez les secrets du ciel tout en apprenant à utiliser un télescope de vos propres mains. Vous pourrez voir les cratères de la lune et prendre votre première photo astronomique avec votre téléphone portable à travers le télescope." },
        { title: "La force du vent", description: "Apprenez à diriger un cerf-volant de traction et sentez la force du vent dans vos propres mains. Reposez-vous et comprenez l'importance de bien utiliser les vents pour la navigation à voile qui a conduit Colomb à la découverte du « Nouveau Monde »." },
        { title: "Ferveur du Rocío", description: "El Rocío est associé à une partie très spirituelle. El Rocío, c'est la foi mais aussi l'amitié, le partage, se souvenir de ceux qui ne sont plus là, chanter et danser les sevillanas entre amis. Comme le dit la sevillana, « Almonte m'a appris que le Rocío, c'est toute l'année, pas seulement le pèlerinage »." },
        { title: "Balade en calèche", description: "Profitez d'une passion locale : sortir entre amis pour une balade en calèche. Bien que dans de nombreuses villes ce soit une attraction touristique, ici, à Huelva, c'est une passion traditionnelle liée à un mode de vie associé au cheval." },
        { title: "Balade à cheval", description: "Montez à cheval et ressentez ce que c'est que de contrôler un animal de 500 kg. Imaginez être accompagné de milliers de chevaux comme lors du chemin d'El Rocío. Maintenant, regardez en bas pour imaginer comment les indigènes américains nous voyaient lorsqu'un Espagnol arrivait à cheval." },
        { title: "Randonnée", description: "Perdons-nous en marchant sur un sentier parmi les pins, choisissez un bon bâton comme appui et analysons la flore et la faune locales. Écoutez le chant des oiseaux et essayons de les distinguer et de les identifier." },
        { title: "Cuisiner avec Huelva", description: "Apprenez à préparer un riz avec des produits locaux. Profitons de la préparation d'un riz aux fruits de mer ou d'un riz ibérique, puis régalons notre palais avec la saveur exquise de Huelva, cuisinée par nous-mêmes." },
        { title: "Chasse photographique", description: "Les locaux connaissent Doñana sous le nom de « El Coto » en raison de son origine comme réserve de chasse, une passion et une tradition qui perdurent dans la région. Prenons un appareil photo avec zoom et allons « chasser » les meilleures photos d'animaux. Restez caché, localisez la proie, visez et tirez." }
      ],
      gastronomyHeader: "Saveurs de Huelva",
      gastronomySpans: [
        "À Huelva, la nourriture est synonyme de rencontre, d'amitié et d'émotion.",
        "Manger à Huelva, c'est comme faire l'amour. Chaque bouchée, une caresse ; chaque plat, une histoire d'amour qui ravira vos sens. Avec nous, vous ne goûterez pas seulement la nourriture : vous la vivrez.",
        "Nous vous emmènerons dans les endroits où nous-mêmes profitons de la meilleure gastronomie, entourés d'amis et d'histoires ; le véritable esprit de notre terre.",
        "« Pour nous, manger, c'est célébrer, et avec vous ... nous voulons tout célébrer. »"
      ],
      gastronomyCards: [
        { title: "Charcuteries ibériques", description: "Presa paleta, secreto, lagartito, abanico, jambon, caña de lomo, presita embuchada, morcón et bien d'autres délices ibériques que vous n'avez peut-être jamais goûtés." },
        { title: "Fruits de mer et poissons", description: "Crevettes blanches, coquinas, seiches, corvinatas, anchois, bars et dorades sauvages, tous frais de nos côtes." },
        { title: "Goûtez Doñana", description: "Ragoûts de sanglier et de cerf de Doñana. Ne manquez pas la Vaca Mostrenca, une race exclusive de Doñana." },
        { title: "Le sang du Condado", description: "Vins des caves du Condado de Huelva, où le premier vermouth d'Espagne a été produit. À noter le vin d'orange et l'exclusif brandy Luis Felipe." },
        { title: "Baies et pignons", description: "Fraises, myrtilles, framboises et mûres. 50% des fraises mondiales proviennent de Huelva. Le pignon méditerranéen est un produit gourmet et exclusif, Huelva étant le plus grand producteur mondial." },
        { title: "Huile et miel", description: "Huile d'olive extra vierge extraite exclusivement par des procédés mécaniques et le miel le plus pur obtenu par des apiculteurs locaux de la région de Doñana." }
      ],
      plansHeader: "Nos voyages",
      plansSpans: [
        "Voyager, c'est bien plus qu'aller dans une destination. C'est se connecter à un lieu et à ses habitants, à son histoire et à ses saveurs.",
        "Nos voyages sont conçus pour que vous n'ayez à vous soucier que d'une chose : PROFITER. Nous nous occupons de TOUT pour que ce soit inoubliable : transport, hébergement, repas, activités, expériences, et surtout, vous accompagner en tant que guides locaux qui connaissent chaque recoin et chaque secret de cette terre.",
        "Nous avons réuni le meilleur de notre terre en mêlant nature, culture, gastronomie et tradition, pour que vous fassiez partie de Huelva et que Huelva fasse partie de vous.",
        "« Tout commence par une décision... choisissez de la vivre et laissez-vous porter. »"
      ],
      plansCards: [
        { title: "🌊 Brise de Huelva – (Week-end : 2 nuits)", description: "Une escapade parfaite pour ceux qui veulent connaître l'essence de Huelva en quelques jours." },
        { title: "🌊 Profitez de Huelva - 4 - 5 jours", description: "Escapade de pont ou long week-end pour découvrir l'essence de Huelva et faire quelques activités/expériences supplémentaires." },
        { title: "🌿 Huelva sans hâte – 7 jours ou plus", description: "Un voyage complet pour découvrir Huelva avec les cinq sens. Pour ceux qui veulent vivre plusieurs expériences lors du même voyage. Idéal pour ceux qui veulent connaître ce que cette terre offre de manière proche et profonde." }
      ],
      personalizedPlan: "Expérience personnalisée",
      personalizedPlanSpans: [
        "Si vous avez d'autres besoins ou disponibilités, nous créons votre expérience sur mesure.",
        "Nous nous adaptons à vous : Dites-nous ce que vous recherchez et nous organisons tout pour que ce soit une expérience inoubliable."
      ],
      opinionsHeader: "Avis des visiteurs",
      formHeader: "CONTACT",
      formSpans: [
        "Vous êtes sur le point de commencer un voyage de découverte comme l'ont fait nos ancêtres pour atteindre le « Nouveau Monde ».",
        "Embarquez dans l'un de nos voyages et profitez de la découverte d'une terre de découvreurs."
      ],
      formLabels: {
        name: "Nom",
        email: "Email :",
        phone: "Téléphone :",
        people: "Nombre de personnes :",
        message: "Message :"
      },
      submitButton: "Envoyer",
      headerCta: "Réserver votre tour",
      footerCtaIndex: "Faites-nous connaissance",
      footerCtaAbout: "Voir les plans",
      aboutUsHeader: "À propos de nous",
      aboutUsSpans: [
        "Nous sommes Javier et Laura, deux frères et sœurs d'Almonte, fiers de nos racines et profondément amoureux de notre terre.",
        "Après avoir étudié à l'étranger, vécu dans plusieurs pays et voyagé à travers le monde, nous avons toujours été fiers d'être nés dans une terre à l'identité unique.",
        "Au fil des ans, nous avons amené des dizaines de groupes d'amis de toute l'Espagne, du Portugal, d'Irlande, du Royaume-Uni, de Belgique, des Pays-Bas, de France, d'Italie, du Pérou, d'Équateur, du Venezuela, du Brésil, des États-Unis, d'Australie et de bien d'autres endroits pour découvrir ce que nous appelons « maison ».",
        "Après tant d'expériences, nous avons appris qu'un voyage inoubliable est celui où l'on se permet de consacrer à chaque moment le temps qu'il mérite. Ressentir chaque instant avec calme, avec les cinq sens et avec le cœur. Profiter de chaque paysage, de chaque coucher de soleil, de chaque personne rencontrée, de chaque gorgée de vin ou de chaque nouvelle saveur goûtée. C'est ce qui fait vraiment d'un voyage une expérience de vie.",
        "Nous promouvons un tourisme où l'on apprend à profiter de chaque moment.",
        "« Pour nous, voyager, c'est s'arrêter, respirer, savourer, regarder et ressentir. »",
        "C'est ainsi qu'est né Come2Huelva."
      ],
      ourSecretHeader: "Notre secret",
      ourSecretSpans: [
        "Mettre beaucoup d'amour dans ce que nous faisons et respecter 3 clés :",
        "1. Groupes réduits. Nous recherchons un environnement familial/amical où partager des expériences et des moments. Maximum 8 personnes.",
        "2. Le temps. Nous ne cherchons pas à tout voir en courant. Nous voulons que vous vous détendiez et profitiez de chaque lieu et de chaque moment avec les personnes qui vous entourent.",
        "3. Guides locaux : Les guides seront des personnes locales amoureuses de Huelva. Essentiel pour vivre Huelva avec sa culture, son histoire et ses traditions.",
        "Note : Si vous souhaitez parcourir Huelva uniquement pour prendre des photos des lieux, nous pouvons vous recommander d'autres agences ou même vous aider à organiser un itinéraire pour le faire par vous-même. Notre proposition est différente."
      ]
    }
  };

  // ==================== LANGUAGE MANAGEMENT ====================
  window.changeLanguage = function(lang) {
    if (!translations[lang]) {
      console.warn(`Language '${lang}' not found, using default`);
      lang = CONFIG.DEFAULT_LANGUAGE;
    }

    storage.set(CONFIG.STORAGE_KEY, lang);
    const t = translations[lang];

    // Update navigation
    const navLinks = $$('nav ul li a');
    if (t.navLinks) {
      t.navLinks.forEach((text, i) => {
        if (navLinks[i]) updateText(navLinks[i], text);
      });
    }

    // Update language button
    const button = $('.selected-language');
    if (button) {
      const labels = {
        es: 'Español &#9662;',
        en: 'English &#9662;',
        fr: 'Français &#9662;'
      };
      updateHTML(button, labels[lang] || labels.es);
    }

    // Close language menu
    const langMenu = $('.language-options');
    if (langMenu) langMenu.classList.remove('show');

    // Update page content
    updateMultiple($$('.introduction-container span'), t.introductionSpans);
    
    updateText($('.place-container h1'), t.placeHeader);
    updateMultiple($$('.place-container > span'), t.placeSpans);

    // Places overlays
    const placeOverlays = $$('.places-container .place .overlay');
    if (t.placesOverlays) {
      t.placesOverlays.forEach((overlay, i) => {
        if (!placeOverlays[i]) return;
        const h3 = $('h3', placeOverlays[i]);
        const span = $('span', placeOverlays[i]);
        if (h3) updateText(h3, overlay.title);
        if (span) updateHTML(span, overlay.span);
      });
    }

    updateText($('.activities-container h1'), t.activitiesHeader);
    updateMultiple($$('.activities-container > span'), t.activitiesSpans);

    // Activity cards
    const activityCards = $$('.activity-card');
    if (t.activitiesCards) {
      t.activitiesCards.forEach((card, i) => {
        if (!activityCards[i]) return;
        updateText($('h3', activityCards[i]), card.title);
        updateText($('span', activityCards[i]), card.description);
      });
    }

    updateText($('.gastronomy-container h1'), t.gastronomyHeader);
    updateMultiple($$('.gastronomy-container > span'), t.gastronomySpans);

    // Gastronomy cards
    const gastronomyCards = $$('.gastronomy-card');
    if (t.gastronomyCards) {
      t.gastronomyCards.forEach((card, i) => {
        if (!gastronomyCards[i]) return;
        updateText($('h3', gastronomyCards[i]), card.title);
        updateText($('span', gastronomyCards[i]), card.description);
      });
    }

    updateText($('.plans-container h1'), t.plansHeader);
    updateMultiple($$('.plans-container > span:not(.personalized-plan)'), t.plansSpans);

    // Plan cards
    const planCards = $$('.plan_card');
    if (t.plansCards) {
      t.plansCards.forEach((card, i) => {
        if (!planCards[i]) return;
        updateText($('.card_header span', planCards[i]), card.title);
        updateText($('.card_content span', planCards[i]), card.description);
      });
    }

    updateText($('.plans-container .personalized-plan'), t.personalizedPlan);
    updateMultiple($$('.plans-container .personalized-plan ~ span'), t.personalizedPlanSpans);

    updateText($('.opinions h1'), t.opinionsHeader);
    updateText($('.form-container h1'), t.formHeader);
    updateMultiple($$('.form-container span'), t.formSpans);

    // Form labels
    if (t.formLabels) {
      updateText($('label[for="name"]'), t.formLabels.name);
      updateText($('label[for="email"]'), t.formLabels.email);
      updateText($('label[for="telf"]'), t.formLabels.phone);
      updateText($('label[for="people"]'), t.formLabels.people);
      updateText($('label[for="message"]'), t.formLabels.message);
    }
    updateText($('.form_option button'), t.submitButton);

    // CTA buttons
    updateText($('.header-cta'), t.headerCta);
    const footerCta = $('.footer-cta .btn-outline');
    if (footerCta) {
      const isAboutPage = footerCta.getAttribute('href')?.includes('index.html');
      updateText(footerCta, isAboutPage ? t.footerCtaAbout : t.footerCtaIndex);
    }

    updateText($('.about-us-container h1'), t.aboutUsHeader);
    updateMultiple($$('.about-us-container span'), t.aboutUsSpans);

    updateText($('#secret-title'), t.ourSecretHeader);
    updateMultiple($$('.our-secret-container span'), t.ourSecretSpans);
  };

  // ==================== CAROUSEL ====================
  class Carousel {
    constructor({
      trackSelector,
      prevBtnSelector,
      nextBtnSelector,
      slidesPerView = { mobile: 1, tablet: 2, desktop: 4 },
      auto = true,
      interval = CONFIG.CAROUSEL.DEFAULT_INTERVAL
    }) {
      this.track = $(trackSelector);
      this.prevBtn = $(prevBtnSelector);
      this.nextBtn = $(nextBtnSelector);
      
      if (!this.track || !this.prevBtn || !this.nextBtn) return;
      
      this.slides = Array.from(this.track.querySelectorAll('.carousel-slide'));
      if (!this.slides.length) return;
      
      this.slidesPerView = slidesPerView;
      this.auto = auto;
      this.interval = interval;
      this.currentIndex = 0;
      this.autoScrollInterval = null;
      this.resumeTimer = null;
      
      this.init();
    }
    
    init() {
      this.setupEventListeners();
      this.updatePosition();
      if (this.auto) this.startAuto();
    }
    
    setupEventListeners() {
      this.prevBtn.addEventListener('click', () => {
        this.changeSlide(-1);
        this.pauseTemporarily();
      });
      
      this.nextBtn.addEventListener('click', () => {
        this.changeSlide(1);
        this.pauseTemporarily();
      });
      
      const onResize = debounce(() => {
        this.updatePosition();
        if (this.auto) this.startAuto();
      }, CONFIG.CAROUSEL.RESIZE_DEBOUNCE);
      window.addEventListener('resize', onResize);
      
      this.track.addEventListener('mouseenter', () => this.stopAuto());
      this.track.addEventListener('mouseleave', () => this.startAuto());
      
      ['pointerdown', 'touchstart'].forEach(evt => {
        this.track.addEventListener(evt, () => this.pauseTemporarily(), { passive: true });
      });
    }
    
    getStepSize() {
      const firstSlide = this.slides[0];
      if (!firstSlide) return 0;
      
      const slideWidth = firstSlide.getBoundingClientRect().width;
      const styles = window.getComputedStyle(this.track);
      const gapValue = parseFloat(styles.columnGap || styles.gap || '0');
      const gap = Number.isNaN(gapValue) ? 0 : gapValue;
      
      return slideWidth + gap;
    }
    
    updatePosition() {
      const step = this.getStepSize();
      this.track.style.transform = `translateX(-${this.currentIndex * step}px)`;
    }
    
    getSlidesToShow() {
      const width = window.innerWidth;
      if (width <= CONFIG.BREAKPOINTS.MOBILE) return this.slidesPerView.mobile ?? 1;
      if (width <= CONFIG.BREAKPOINTS.TABLET) return this.slidesPerView.tablet ?? this.slidesPerView.mobile ?? 1;
      return this.slidesPerView.desktop ?? 4;
    }
    
    changeSlide(direction) {
      const totalSlides = this.slides.length;
      const slidesToShow = this.getSlidesToShow();
      const maxIndex = Math.max(0, totalSlides - slidesToShow);
      
      this.currentIndex += direction;
      
      if (this.currentIndex > maxIndex) {
        this.currentIndex = 0;
      } else if (this.currentIndex < 0) {
        this.currentIndex = maxIndex;
      }
      
      this.updatePosition();
    }
    
    startAuto() {
      if (!this.auto) return;
      this.stopAuto();
      this.autoScrollInterval = setInterval(() => this.changeSlide(1), this.interval);
    }
    
    stopAuto() {
      if (this.autoScrollInterval) {
        clearInterval(this.autoScrollInterval);
        this.autoScrollInterval = null;
      }
    }
    
    pauseTemporarily(duration = CONFIG.CAROUSEL.PAUSE_DURATION) {
      this.stopAuto();
      if (this.resumeTimer) clearTimeout(this.resumeTimer);
      this.resumeTimer = setTimeout(() => this.startAuto(), duration);
    }
  }

  // ==================== NAVIGATION ====================
  function initNavigation() {
    const header = $('header');
    const menuToggle = $('.menu-toggle');
    
    if (!header || !menuToggle) return;
    
    const closeMenu = () => {
      header.classList.remove('nav-open');
      setExpanded(menuToggle, false);
    };
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      setExpanded(menuToggle, isOpen);
    });
    
    // Close on nav link click
    $$('nav a', header).forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      const isInsideHeader = e.target.closest('header');
      if (!isInsideHeader && header.classList.contains('nav-open')) {
        closeMenu();
      }
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        closeMenu();
      }
    });
    
    // Close on window resize (desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > CONFIG.BREAKPOINTS.MOBILE) {
        closeMenu();
      }
    });
    
    // Mark current page
    const currentPath = location.pathname.split('/').pop() || 'index.html';
    $$('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      const hrefFile = href.includes('#') ? href.split('#')[0] : href;
      const isCurrentPage = hrefFile === currentPath || 
                           (currentPath === 'index.html' && href.startsWith('#'));
      
      if (isCurrentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // ==================== CONTACT FORM ====================
  function initForm() {
    const form = $('.form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        name: $('#name')?.value || '',
        email: $('#email')?.value || '',
        phone: $('#telf')?.value || '',
        people: $('#people')?.value || '',
        message: $('#message')?.value || ''
      };
      
      if (!formData.name || !formData.email || !formData.message) {
        Toast.warning('Por favor, completa todos los campos requeridos.', 'Campos incompletos');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Toast.warning('Por favor, introduce un email válido.', 'Email inválido');
        return;
      }
      
      try {
        Loading.show();
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);
        
        const response = await fetch(CONFIG.API.EMAIL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        Loading.hide();
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        Toast.success('Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.', '¡Mensaje enviado!');
        form.reset();
      } catch (error) {
        Loading.hide();
        console.error('Form submission error:', error);
        
        if (error.name === 'AbortError') {
          Toast.error('La solicitud ha tardado demasiado. Por favor, inténtalo de nuevo.', 'Tiempo agotado');
        } else {
          Toast.error('No pudimos enviar tu mensaje. Por favor, inténtalo más tarde o contáctanos directamente.', 'Error de envío');
        }
      }
    });
  }

  // ==================== SCROLL REVEAL ====================
  function initScrollReveal() {
    const revealEls = $$('.reveal');
    if (!revealEls.length) return;
    
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      revealEls.forEach(el => el.classList.add('reveal-visible'));
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.INTERSECTION_THRESHOLD });
    
    revealEls.forEach(el => observer.observe(el));
  }

  // ==================== INITIALIZE ALL ====================
  document.addEventListener('DOMContentLoaded', () => {
    const savedLang = storage.get(CONFIG.STORAGE_KEY);
    const initialLang = savedLang && translations[savedLang] ? savedLang : CONFIG.DEFAULT_LANGUAGE;
    changeLanguage(initialLang);
    
    initNavigation();
    
    new Carousel({
      trackSelector: '.carousel-track.activities',
      prevBtnSelector: '.prev-btn-activities',
      nextBtnSelector: '.next-btn-activities'
    });
    
    new Carousel({
      trackSelector: '.carousel-track.gastronomy',
      prevBtnSelector: '.prev-btn-gastronomy',
      nextBtnSelector: '.next-btn-gastronomy'
    });
    
    new Carousel({
      trackSelector: '.carousel-track.plans',
      prevBtnSelector: '.prev-btn-plans',
      nextBtnSelector: '.next-btn-plans',
      slidesPerView: { mobile: 1, tablet: 1, desktop: 4 }
    });
    
    new Carousel({
      trackSelector: '.carousel-track.opinions',
      prevBtnSelector: '.prev-btn-opinions',
      nextBtnSelector: '.next-btn-opinions',
      slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
      auto: true,
      interval: 5000
    });
    
    initForm();
    
    initScrollReveal();
  });

})();