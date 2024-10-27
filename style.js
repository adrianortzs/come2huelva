function toggleLanguageMenu() {
    document.querySelector('.language-options').classList.toggle('show');
}

window.onclick = function(event) {
    if (!event.target.matches('.selected-language')) {
        const dropdowns = document.querySelectorAll('.language-options');
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
};

function changeLanguage(lang) {
    const languageButton = document.querySelector('.selected-language');
    if (lang === 'es') {
        languageButton.innerHTML = 'Español &#9662;';
    } else if (lang === 'en') {
        languageButton.innerHTML = 'English &#9662;';
    } else if (lang === 'fr') {
        languageButton.innerHTML = 'Français &#9662;';
    }
    document.querySelector('.language-options').classList.remove('show');

    document.querySelector('.place-container h1').textContent = translations[lang].header;
    document.querySelector('.place-container h3').textContent = translations[lang].subtitle;

    document.querySelector('.activities-container h1').textContent = translations[lang].activitiesTitle;
    const activityCards = document.querySelectorAll('.activity-card');
    translations[lang].activities.forEach((activity, index) => {
        if (activityCards[index]) {
            activityCards[index].querySelector('h3').textContent = activity.title;
            activityCards[index].querySelector('p').textContent = activity.description;
        }
    });

    document.querySelector('.plans-container h1').textContent = translations[lang].planHeader;
    document.querySelector('.plans-container h3').textContent = translations[lang].planDescription;
    const planCards = document.querySelectorAll('.plan_card');
    translations[lang].plans.forEach((plan, index) => {
        if (planCards[index]) {
            planCards[index].querySelector('.card_header span').textContent = plan.title;
            planCards[index].querySelector('h4:nth-of-type(1)').textContent = translations[lang].planLabels.destinations;
            planCards[index].querySelector('ul').textContent = plan.destinations;
            planCards[index].querySelector('h4:nth-of-type(2)').textContent = translations[lang].planLabels.experience;
            planCards[index].querySelector('.card_content p').textContent = plan.experience;
        }
    });

    document.querySelector('.opinions h1').textContent = translations[lang].opinionsTitle;
    
    document.querySelector('.form-container h1').textContent = translations[lang].contactTitle;
    document.querySelector('.form-container span').textContent = translations[lang].contactDescription;
    document.querySelector('label[for="name"]').textContent = translations[lang].formLabels.name;
    document.querySelector('label[for="email"]').textContent = translations[lang].formLabels.email;
    document.querySelector('label[for="telf"]').textContent = translations[lang].formLabels.phone;
    document.querySelector('label[for="people"]').textContent = translations[lang].formLabels.people;
    document.querySelector('label[for="message"]').textContent = translations[lang].formLabels.message;
    document.querySelector('.form_option button').textContent = translations[lang].submitButton;
    document.querySelector('.form-container span:last-of-type').textContent = translations[lang].requiredFields;

    document.querySelector('.floating-btn').textContent = translations[lang].floatingButton;
}

/* Actividades */
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = Array.from(document.querySelectorAll('.activity-card'));
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

const slidesToShow = 4;
let slideWidth = carouselSlides[0].clientWidth;
let currentIndex = 0;

window.addEventListener("load", () => {
    slideWidth = carouselSlides[0].clientWidth;
    carouselTrack.style.width = `${slideWidth * carouselSlides.length}px`;
});

function updateCarouselPosition() {
    const scrollDistance = currentIndex * slideWidth;
    carouselTrack.style.transform = `translateX(-${scrollDistance}px)`;
}

function automaticScroll() {
    currentIndex++;
    if (currentIndex >= carouselSlides.length - slidesToShow + 1) { // Rebobina al inicio si llega al final
        currentIndex = 0;
    }
    updateCarouselPosition();
}

let autoScrollInterval = setInterval(automaticScroll, 5000);

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(automaticScroll, 5000);
}

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = carouselSlides.length - slidesToShow;
    }
    updateCarouselPosition();
    stopAutoScroll();
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < carouselSlides.length - slidesToShow) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarouselPosition();
    stopAutoScroll();
});

/* Opiniones */
let currentSlide = 0;
const slides = document.querySelectorAll('.opinion-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        slide.style.display = 'none';
        if (i === index) {
            slide.classList.add('active');
            slide.style.display = 'block';
        }
    });
}

document.querySelector('.opinion-next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
});

document.querySelector('.opinion-prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
});

showSlide(currentSlide);


document.querySelector('.form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('telf').value,
        people: document.getElementById('people').value,
        message: document.getElementById('messsage').value
    };

    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(result => {
        alert('Correo enviado exitosamente!');
        document.querySelector('.form').reset();
    })
    .catch(error => {
        alert('Hubo un error al enviar el correo: ' + error);
    });
});

function scrollToForm() {
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", function() {
    changeLanguage('es'); // Español por defecto
});

const translations = {
    es: {
        header: "Maravillosos rincones de Huelva que debes visitar",
        subtitle: "Huelva, con su riqueza natural, histórica y cultural, te invita a descubrir una variedad de destinos encantadores. Desde playas vírgenes y paisajes naturales impresionantes hasta pueblos con encanto y vestigios históricos únicos, esta provincia andaluza tiene mucho que ofrecer.",
        activitiesTitle: "Descubre las mejores actividades para disfrutar en Huelva",
        activities: [
            {
                title: "Playa y pesca",
                description: "Disfruta de un día perfecto bajo el sol mientras practicas pesca en las cristalinas aguas de la costa onubense. Una combinación única de relajación y aventura."
            },
            {
                title: "Observaciones astronómicas",
                description: "Maravíllate con la inmensidad del universo bajo los cielos despejados de Huelva, un lugar ideal para admirar estrellas, planetas y constelaciones."
            },
            {
                title: "Paseo en barco",
                description: "Relájate mientras disfrutas de un paseo en barco por la ría. Navega entre paisajes naturales únicos y respira la tranquilidad del entorno."
            },
            {
                title: "Vuelo en parapente",
                description: "Vuela sobre los impresionantes paisajes de Huelva en parapente. Siente la adrenalina mientras disfrutas de vistas panorámicas incomparables desde las alturas."
            },
            {
                title: "Marisco",
                description: "Saborea lo mejor del mar con una degustación de mariscos frescos. Descubre los sabores auténticos que han hecho famosa la gastronomía de Huelva."
            },
            {
                title: "Fotografía",
                description: "Captura la belleza de Huelva a través de tu cámara. Desde paisajes naturales hasta la fauna del Parque de Doñana, las oportunidades son infinitas."
            },
            {
                title: "Ibéricos",
                description: "Disfruta de una degustación de productos ibéricos de la más alta calidad. Jamones, embutidos y más te esperan en una experiencia gastronómica única."
            },
            {
                title: "Enoturismo",
                description: "Descubre los secretos del vino con un recorrido por bodegas locales. Degusta vinos exquisitos y conoce el proceso de elaboración del vino onubense."
            }
        ],
        contactTitle: "Déjanos tus datos y nos pondremos en contacto contigo",
        contactDescription: "Por favor, completa el siguiente formulario con tus datos de contacto. Nos comprometemos a responderte lo antes posible para atender tus consultas o proporcionarte más información. Tu privacidad es importante para nosotros; tus datos estarán protegidos y solo se utilizarán para este propósito.",
        opinionsTitle: "Opiniones de nuestros visitantes",
        planHeader: "Elige tu aventura perfecta en Huelva",
        planDescription: "Estos son algunos de nuestros mejores paquetes, todos completamente personalizables según sus necesidades y deseos de viaje:",
        plans: [
            {
                title: "Fin de semana",
                destinations: "Doñana, Playa de Matalascañas",
                experience: "Sumérgete en la belleza de Doñana, una joya natural con paisajes impresionantes y una biodiversidad única. Disfruta de un entorno virgen mientras exploras su flora y fauna en un recorrido que te conectará con la naturaleza. A solo unos pasos, relájate en la Playa de Matalascañas, un paraíso de arenas doradas y aguas cristalinas, perfecto para desconectar y disfrutar del sol. ¡Vive una aventura inolvidable en Huelva, donde la naturaleza se encuentra con el mar!"
            },
            {
                title: "Semana",
                destinations: "El Rocío, Doñana, Aracena, Playa de Matalascañas, Palos de la Frontera",
                experience: "Descubre la esencia de Huelva con una experiencia que combina naturaleza, cultura e historia. Explora el Parque Nacional de Doñana, un santuario de vida silvestre único en Europa, seguido de la relajante Playa de Matalascañas. Sumérgete en la historia en Palos de la Frontera, cuna de la exploración americana, y maravíllate con la espiritualidad de El Rocío. Completa tu aventura en Aracena con su gastronomía y la famosa Gruta de las Maravillas."
            },
            {
                title: "Personalizado",
                destinations: "A tu elección",
                experience: "Crea un plan a medida según tus preferencias para vivir Huelva de la forma que más te guste."
            }
        ],
        formLabels: {
            name: "Nombre(*):",
            email: "Email(*):",
            phone: "Teléfono(*):",
            people: "Número de personas(*):",
            message: "Mensaje:"
        },
        submitButton: "Enviar",
        requiredFields: "Todos los campos marcados con (*) son obligatorios.",
        floatingButton: "Contacto",
        planLabels: {
            destinations: "Destinos:",
            experience: "La experiencia:"
        }
    },
    en: {
        header: "Wonderful corners of Huelva you must visit",
        subtitle: "Huelva, with its natural, historical, and cultural wealth, invites you to discover a variety of charming destinations. From pristine beaches and stunning natural landscapes to quaint villages and unique historical sites, this Andalusian province has much to offer.",
        activitiesTitle: "Discover the best activities to enjoy in Huelva",
        activities: [
            {
                title: "Beach and fishing",
                description: "Enjoy a perfect day under the sun while fishing in the crystal-clear waters of the Huelva coast. A unique combination of relaxation and adventure."
            },
            {
                title: "Astronomical observations",
                description: "Marvel at the immensity of the universe under the clear skies of Huelva, an ideal place to admire stars, planets, and constellations."
            },
            {
                title: "Boat ride",
                description: "Relax while enjoying a boat ride along the river. Sail between unique natural landscapes and breathe in the tranquility of the surroundings."
            },
            {
                title: "Paragliding",
                description: "Fly over the stunning landscapes of Huelva while paragliding. Feel the adrenaline as you enjoy unparalleled panoramic views from above."
            },
            {
                title: "Seafood",
                description: "Savor the best of the sea with a tasting of fresh seafood. Discover the authentic flavors that have made Huelva's cuisine famous."
            },
            {
                title: "Photography",
                description: "Capture the beauty of Huelva through your camera. From natural landscapes to the fauna of Doñana Park, the opportunities are endless."
            },
            {
                title: "Iberian products",
                description: "Enjoy a tasting of the highest quality Iberian products. Hams, sausages, and more await you in a unique gastronomic experience."
            },
            {
                title: "Wine tourism",
                description: "Discover the secrets of wine with a tour of local wineries. Taste exquisite wines and learn about the winemaking process in Huelva."
            }
        ],
        contactTitle: "Leave us your details and we will contact you",
        contactDescription: "Please fill out the form below with your contact details. We are committed to responding as soon as possible to address your inquiries or provide you with more information. Your privacy is important to us; your data will be protected and used only for this purpose.",
        opinionsTitle: "Visitor Reviews",
        planHeader: "Choose your perfect adventure in Huelva",
        planDescription: "Here are some of our best packages, all fully customizable to suit your travel needs and preferences:",
        plans: [
            {
                title: "Weekend",
                destinations: "Doñana, Matalascañas Beach",
                experience: "Immerse yourself in the beauty of Doñana, a natural gem with stunning landscapes and unique biodiversity. Enjoy a pristine environment while exploring its flora and fauna on a journey that will connect you with nature. Just steps away, relax at Matalascañas Beach, a paradise of golden sands and crystal-clear waters, perfect for unwinding and soaking up the sun. Experience an unforgettable adventure in Huelva, where nature meets the sea!"
            },
            {
                title: "Week",
                destinations: "El Rocío, Doñana, Aracena, Matalascañas Beach, Palos de la Frontera",
                experience: "Discover the essence of Huelva with an experience that combines nature, culture, and history. Explore Doñana National Park, a unique wildlife sanctuary in Europe, followed by the relaxing Matalascañas Beach. Dive into history at Palos de la Frontera, birthplace of American exploration, and be amazed by the spirituality of El Rocío. Complete your adventure in Aracena with its cuisine and the famous Gruta de las Maravillas."
            },
            {
                title: "Customized",
                destinations: "Your choice",
                experience: "Create a tailor-made plan according to your preferences to experience Huelva the way you like it best."
            }
        ],
        formLabels: {
            name: "Name(*):",
            email: "Email(*):",
            phone: "Phone(*):",
            people: "Number of people(*):",
            message: "Message:"
        },
        submitButton: "Submit",
        requiredFields: "All fields marked with (*) are mandatory.",
        floatingButton: "Contact",
        planLabels: {
            destinations: "Destinations:",
            experience: "The Experience:"
        }
    },

    fr: {
        header: "Merveilleux coins de Huelva à visiter absolument",
        subtitle: "Huelva, avec sa richesse naturelle, historique et culturelle, vous invite à découvrir une variété de destinations charmantes. Des plages vierges et des paysages naturels impressionnants aux villages pittoresques et aux sites historiques uniques, cette province andalouse a beaucoup à offrir.",
        activitiesTitle: "Découvrez les meilleures activités à faire à Huelva",
        activities: [
            {
                title: "Plage et pêche",
                description: "Profitez d'une journée parfaite sous le soleil en pêchant dans les eaux cristallines de la côte de Huelva. Une combinaison unique de détente et d'aventure."
            },
            {
                title: "Observations astronomiques",
                description: "Émerveillez-vous devant l'immensité de l'univers sous les ciels clairs de Huelva, un lieu idéal pour admirer les étoiles, les planètes et les constellations."
            },
            {
                title: "Balade en bateau",
                description: "Détendez-vous en profitant d'une balade en bateau le long de la rivière. Naviguez entre des paysages naturels uniques et respirez la tranquillité de l'environnement."
            },
            {
                title: "Parapente",
                description: "Survolez les paysages époustouflants de Huelva en parapente. Ressentez l'adrénaline en profitant de vues panoramiques inégalées depuis les hauteurs."
            },
            {
                title: "Fruits de mer",
                description: "Savourez le meilleur de la mer avec une dégustation de fruits de mer frais. Découvrez les saveurs authentiques qui ont rendu célèbre la cuisine de Huelva."
            },
            {
                title: "Photographie",
                description: "Capturez la beauté de Huelva à travers votre appareil photo. Des paysages naturels à la faune du parc de Doñana, les opportunités sont infinies."
            },
            {
                title: "Produits ibériques",
                description: "Profitez d'une dégustation de produits ibériques de la plus haute qualité. Jambons, saucisses et plus encore vous attendent dans une expérience gastronomique unique."
            },
            {
                title: "Œnotourisme",
                description: "Découvrez les secrets du vin avec une visite des caves locales. Dégustez des vins exquis et apprenez le processus de vinification à Huelva."
            }
        ],
        contactTitle: "Laissez-nous vos coordonnées et nous vous contacterons",
        contactDescription: "Veuillez remplir le formulaire ci-dessous avec vos coordonnées. Nous nous engageons à vous répondre dans les plus brefs délais pour répondre à vos questions ou vous fournir plus d'informations. Votre confidentialité est importante pour nous; vos données seront protégées et utilisées uniquement à cette fin.",
        opinionsTitle: "Avis des visiteurs",
        planHeader: "Choisissez votre aventure parfaite à Huelva",
        planDescription: "Voici quelques-uns de nos meilleurs forfaits, tous entièrement personnalisables selon vos besoins et préférences de voyage:",
        plans: [
            {
                title: "Week-end",
                destinations: "Doñana, Plage de Matalascañas",
                experience: "Plongez dans la beauté de Doñana, un joyau naturel avec des paysages impressionnants et une biodiversité unique. Profitez d'un environnement vierge tout en explorant sa flore et sa faune. À quelques pas, détendez-vous sur la plage de Matalascañas, un paradis de sable doré et d'eaux cristallines, parfait pour se détendre et profiter du soleil. Vivez une aventure inoubliable à Huelva, où la nature rencontre la mer !"
            },
            {
                title: "Semaine",
                destinations: "El Rocío, Doñana, Aracena, Plage de Matalascañas, Palos de la Frontera",
                experience: "Découvrez l'essence de Huelva avec une expérience qui combine nature, culture et histoire. Explorez le parc national de Doñana, un sanctuaire unique de la faune en Europe, suivi de la plage relaxante de Matalascañas. Plongez dans l'histoire à Palos de la Frontera, berceau de l'exploration américaine, et émerveillez-vous devant la spiritualité d'El Rocío. Complétez votre aventure à Aracena avec sa gastronomie et la célèbre Gruta de las Maravillas."
            },
            {
                title: "Personnalisé",
                destinations: "Votre choix",
                experience: "Créez un plan sur mesure selon vos préférences pour vivre Huelva comme vous le souhaitez."
            }
        ],
        formLabels: {
            name: "Nom(*):",
            email: "Email(*):",
            phone: "Téléphone(*):",
            people: "Nombre de personnes(*):",
            message: "Message:"
        },
        submitButton: "Envoyer",
        requiredFields: "Tous les champs marqués d'un (*) sont obligatoires.",
        floatingButton: "Contact",
        planLabels: {
            destinations: "Destinations :",
            experience: "L'expérience :"
        }
    }
};





