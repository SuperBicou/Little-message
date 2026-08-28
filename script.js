const button =
    document.getElementById("myButton");

const fixedButton =
    document.getElementById("fixedButton");

const image =
    document.getElementById("image");


// ============================================
// RÉGLAGES
// ============================================

const zoneFuite = 90;

const distanceImage = 25;

const vitesse = 1800;

// Temps avant retour à la position initiale
const cooldownRetour = 2000;


// ============================================
// VARIABLES
// ============================================

let sourisX = -1000;
let sourisY = -1000;

let enFuite = false;

let cpt = 0;

let timerRetour = null;


// ============================================
// INITIALISATION
// ============================================

window.addEventListener("load", () => {

    adapterImagePourEcran();

    placerBoutonMobile();

    placerBoutonFixe();

});


// ============================================
// REDIMENSIONNEMENT
// ============================================

window.addEventListener("resize", () => {

    adapterImagePourEcran();

    if (!enFuite) {

        placerBoutonMobile();

    }

    placerBoutonFixe();

});


// ============================================
// ADAPTER L'IMAGE AUX PETITS ÉCRANS
// ============================================

function adapterImagePourEcran() {

    /*
       Sur PC, on garde exactement la taille
       prévue dans le CSS.
    */

    if (window.innerWidth > 600) {

        image.style.width = "";
        image.style.height = "";

        return;
    }


    /*
       On enlève d'abord une éventuelle largeur
       calculée précédemment afin de récupérer
       la largeur demandée par le CSS mobile.
    */

    image.style.width = "";
    image.style.height = "";

    const largeurCSS =
        image.getBoundingClientRect().width;


    /*
       L'image est centrée. Pour que les deux
       boutons puissent rester de chaque côté,
       on réserve assez de place à gauche ET
       à droite.

       YES reste à gauche.
       NO reste à droite.
    */

    const margeEcran = 10;

    const placeGauche =
        fixedButton.offsetWidth +
        distanceImage +
        margeEcran;

    const placeDroite =
        button.offsetWidth +
        distanceImage +
        margeEcran;

    const largeurMaxImage =
        window.innerWidth -
        2 * Math.max(
            placeGauche,
            placeDroite
        );


    /*
       On ne réduit l'image que si c'est
       nécessaire.
    */

    const largeurImage =
        Math.max(
            40,
            Math.min(
                largeurCSS,
                largeurMaxImage
            )
        );

    image.style.width =
        largeurImage + "px";

    image.style.height =
        "auto";
}


// ============================================
// SOURIS
// ============================================

document.addEventListener(
    "mousemove",
    (event) => {

        sourisX = event.clientX;
        sourisY = event.clientY;

        verifierFuite();

    }
);


// ============================================
// TÉLÉPHONE
// ============================================

document.addEventListener(
    "touchstart",
    (event) => {

        const doigt = event.touches[0];

        sourisX = doigt.clientX;
        sourisY = doigt.clientY;

        verifierFuite();

    },
    {
        passive: true
    }
);


// ============================================
// POSITION INITIALE DU BOUTON MOBILE
// ============================================

function placerBoutonMobile() {

    const img =
        image.getBoundingClientRect();

    const largeur =
        button.offsetWidth;

    const hauteur =
        button.offsetHeight;

    const x =
        img.right +
        distanceImage;

    const y =
        img.top +
        (img.height - hauteur) / 2;

    button.style.left =
        x + "px";

    button.style.top =
        y + "px";

    button.style.zIndex =
        "20";
}


// ============================================
// POSITION DU BOUTON FIXE
// ============================================

function placerBoutonFixe() {

    const img =
        image.getBoundingClientRect();

    const largeur =
        fixedButton.offsetWidth;

    const hauteur =
        fixedButton.offsetHeight;

    let x =
        img.left -
        largeur -
        distanceImage;

    let y =
        img.top +
        (img.height - hauteur) / 2;

    if (x < 0) {

        x =
            img.right +
            distanceImage;
    }

    y =
        Math.max(
            10,
            Math.min(
                y,
                window.innerHeight -
                hauteur -
                10
            )
        );

    fixedButton.style.left =
        x + "px";

    fixedButton.style.top =
        y + "px";

    fixedButton.style.zIndex =
        "30";
}


// ============================================
// DÉTECTION DE FUITE
// ============================================

function verifierFuite() {

    if (enFuite) {
        return;
    }

    const rect =
        button.getBoundingClientRect();

    const centreX =
        rect.left +
        rect.width / 2;

    const centreY =
        rect.top +
        rect.height / 2;

    const distance =
        Math.hypot(
            sourisX - centreX,
            sourisY - centreY
        );

    if (
        distance <
        zoneFuite
    ) {

        lancerFuite();
    }
}


// ============================================
// LANCER LA FUITE
// ============================================

function lancerFuite() {

    enFuite = true;

    clearTimeout(timerRetour);

    const img =
        image.getBoundingClientRect();

    const bouton =
        button.getBoundingClientRect();


    // ========================================
    // POSITION DE DÉPART
    // ========================================

    const depart = {

        x:
            bouton.left,

        y:
            bouton.top
    };


    // ========================================
    // CÔTÉS AUTORISÉS
    // ========================================

    const cotesAutorises = [
        "haut",
        "bas",
        "droite"
    ];


    // ========================================
    // TROUVER LE CÔTÉ D'ENTRÉE
    // ========================================

    const centreX =
        bouton.left +
        bouton.width / 2;

    const centreY =
        bouton.top +
        bouton.height / 2;

    const distances = {

        haut:
            Math.abs(
                centreY -
                img.top
            ),

        bas:
            Math.abs(
                centreY -
                img.bottom
            ),

        droite:
            Math.abs(
                centreX -
                img.right
            )
    };


    const entree =
        cotesAutorises.reduce(
            (a, b) =>
                distances[a] <
                distances[b]
                    ? a
                    : b
        );


    // ========================================
    // CHOISIR LA SORTIE
    // ========================================

    let sortiesPossibles =
        cotesAutorises.filter(
            cote =>
                cote !== entree
        );


    if (
        sortiesPossibles.length === 0
    ) {

        sortiesPossibles =
            cotesAutorises;
    }


    const sortie =
        sortiesPossibles[
            Math.floor(
                Math.random() *
                sortiesPossibles.length
            )
        ];


    // ========================================
    // POINT D'ENTRÉE
    // ========================================

    const entreePoint =
        obtenirPointSurBord(
            entree,
            img
        );


    // ========================================
    // POINT DE SORTIE
    // ========================================

    const sortiePoint =
        obtenirPointSurBord(
            sortie,
            img
        );


    // ========================================
    // POSITION AVANT L'IMAGE
    // ========================================

    const avant =
        positionExterieure(
            entreePoint,
            entree
        );


    // ========================================
    // POSITION APRÈS L'IMAGE
    // ========================================

    const apres =
        positionExterieure(
            sortiePoint,
            sortie
        );


    // ========================================
    // TRAJET
    // ========================================

    const trajet = [

        depart,

        avant,

        sortiePoint,

        apres

    ];


    animerTrajet(
        trajet,
        img
    );
}


// ============================================
// ANIMATION DE LA FUITE
// ============================================

function animerTrajet(
    trajet,
    img
) {

    let longueurTotale = 0;


    for (
        let i = 1;
        i < trajet.length;
        i++
    ) {

        longueurTotale +=
            Math.hypot(
                trajet[i].x -
                trajet[i - 1].x,

                trajet[i].y -
                trajet[i - 1].y
            );
    }


    const debut =
        performance.now();


    function animation(temps) {

        const ecoule =
            temps -
            debut;


        const distance =
            Math.min(
                ecoule *
                vitesse /
                1000,

                longueurTotale
            );


        const position =
            obtenirPositionSurTrajet(
                trajet,
                distance
            );


        button.style.left =
            position.x + "px";

        button.style.top =
            position.y + "px";


        mettreZIndexSelonImage(img);


        if (
            distance <
            longueurTotale
        ) {

            requestAnimationFrame(
                animation
            );

        }

        else {

            const finale =
                trajet[
                    trajet.length - 1
                ];


            button.style.left =
                finale.x + "px";

            button.style.top =
                finale.y + "px";

            button.style.zIndex =
                "20";


            enFuite = false;

            demarrerCooldownRetour();
        }
    }


    requestAnimationFrame(
        animation
    );
}


// ============================================
// GÉRER LE Z-INDEX
// ============================================

function mettreZIndexSelonImage(img) {

    const rect =
        button.getBoundingClientRect();


    const dansImage =

        rect.right >
            img.left &&

        rect.left <
            img.right &&

        rect.bottom >
            img.top &&

        rect.top <
            img.bottom;


    if (dansImage) {

        button.style.zIndex =
            "5";

    }

    else {

        button.style.zIndex =
            "20";
    }


    fixedButton.style.zIndex =
        "30";
}


// ============================================
// COOLDOWN AVANT RETOUR
// ============================================

function demarrerCooldownRetour() {

    clearTimeout(timerRetour);


    timerRetour =
        setTimeout(
            verifierRetour,
            cooldownRetour
        );
}


// ============================================
// VÉRIFIER SI LE BOUTON PEUT REVENIR
// ============================================

function verifierRetour() {

    const img =
        image.getBoundingClientRect();

    const largeur =
        button.offsetWidth;

    const hauteur =
        button.offsetHeight;


    const destinationX =
        img.right +
        distanceImage;

    const destinationY =
        img.top +
        (img.height - hauteur) / 2;


    const centreX =
        destinationX +
        largeur / 2;

    const centreY =
        destinationY +
        hauteur / 2;


    const distanceSouris =
        Math.hypot(
            sourisX - centreX,
            sourisY - centreY
        );


    if (
        distanceSouris <
        zoneFuite
    ) {

        timerRetour =
            setTimeout(
                verifierRetour,
                500
            );

        return;
    }


    retourPositionInitiale();
}


// ============================================
// RETOUR À LA POSITION INITIALE
// ============================================

function retourPositionInitiale() {

    const img =
        image.getBoundingClientRect();


    const largeur =
        button.offsetWidth;

    const hauteur =
        button.offsetHeight;


    const destination = {

        x:
            img.right +
            distanceImage,

        y:
            img.top +
            (img.height - hauteur) / 2
    };


    const depart =
        button.getBoundingClientRect();


    const departX =
        depart.left;

    const departY =
        depart.top;


    const distance =
        Math.hypot(
            destination.x -
            departX,

            destination.y -
            departY
        );


    const duree =
        Math.max(
            250,
            distance /
            vitesse *
            1000
        );


    const debut =
        performance.now();


    function animationRetour(temps) {

        const progression =
            Math.min(
                (temps - debut) /
                duree,
                1
            );


        const progressionFluide =
            1 -
            Math.pow(
                1 - progression,
                3
            );


        const x =
            departX +
            (
                destination.x -
                departX
            ) *
            progressionFluide;


        const y =
            departY +
            (
                destination.y -
                departY
            ) *
            progressionFluide;


        button.style.left =
            x + "px";

        button.style.top =
            y + "px";


        mettreZIndexSelonImage(img);


        if (
            progression < 1
        ) {

            requestAnimationFrame(
                animationRetour
            );

        }

        else {

            button.style.left =
                destination.x + "px";

            button.style.top =
                destination.y + "px";

            button.style.zIndex =
                "20";
        }
    }


    requestAnimationFrame(
        animationRetour
    );
}


// ============================================
// POSITION SUR LE TRAJET
// ============================================

function obtenirPositionSurTrajet(
    trajet,
    distance
) {

    let reste =
        distance;


    for (
        let i = 1;
        i < trajet.length;
        i++
    ) {

        const debut =
            trajet[i - 1];

        const fin =
            trajet[i];


        const dx =
            fin.x -
            debut.x;

        const dy =
            fin.y -
            debut.y;


        const longueur =
            Math.hypot(
                dx,
                dy
            );


        if (
            reste <=
            longueur
        ) {

            const ratio =
                longueur === 0
                    ? 0
                    : reste / longueur;


            return {

                x:
                    debut.x +
                    dx * ratio,

                y:
                    debut.y +
                    dy * ratio
            };
        }


        reste -=
            longueur;
    }


    return trajet[
        trajet.length - 1
    ];
}


// ============================================
// POINT SUR LE BORD DE L'IMAGE
// ============================================

function obtenirPointSurBord(
    cote,
    img
) {

    const largeur =
        button.offsetWidth;

    const hauteur =
        button.offsetHeight;

    let x;
    let y;


    if (
        cote === "haut"
    ) {

        x =
            img.left +
            Math.random() *
            Math.max(
                0,
                img.width -
                largeur
            );

        y =
            img.top -
            hauteur;
    }


    else if (
        cote === "bas"
    ) {

        x =
            img.left +
            Math.random() *
            Math.max(
                0,
                img.width -
                largeur
            );

        y =
            img.bottom;
    }


    else {

        x =
            img.right;

        y =
            img.top +
            Math.random() *
            Math.max(
                0,
                img.height -
                hauteur
            );
    }


    return {
        x,
        y
    };
}


// ============================================
// POSITION EXTÉRIEURE
// ============================================

function positionExterieure(
    point,
    cote
) {

    let x =
        point.x;

    let y =
        point.y;


    if (
        cote === "haut"
    ) {

        y -=
            distanceImage;

    }

    else if (
        cote === "bas"
    ) {

        y +=
            distanceImage;

    }

    else if (
        cote === "droite"
    ) {

        x +=
            distanceImage;
    }


    return {
        x,
        y
    };
}


// ============================================
// CLIC DU BOUTON MOBILE
// ============================================

button.addEventListener(
    "click",
    () => {

        cpt++;

        button.textContent =
            "bravo " + cpt;

    }
);

// ============================================
// CLIC SUR YES
// ============================================

fixedButton.addEventListener(
    "click",
    () => {

        // Cache les boutons
        button.style.display = "none";
        fixedButton.style.display = "none";

        // Cache l'image
        image.style.display = "none";

        // Crée le message
        const message =
            document.createElement("div");

        message.className =
            "love-message";

        message.textContent =
            "ฉันก็รู้สึกแบบเดียวกัน\nฉันรักคุณมากนะ😘";

        // Ajoute le message dans la page
        document.body.appendChild(message);
    }
);