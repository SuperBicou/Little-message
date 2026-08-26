const button = document.getElementById("myButton");
const image = document.getElementById("image");

// ============================================
// RÉGLAGES
// ============================================

const zoneFuite = 220;

// Espace minimum entre le bouton et l'image
const distanceImage = 25;

// Vitesse
const vitesse = 1400;

let sourisX = -1000;
let sourisY = -1000;

let enFuite = false;

let cpt=0;


// ============================================
// POSITION INITIALE
// ============================================

window.addEventListener("load", () => {

    placerBoutonAleatoirement();

});


// ============================================
// SOURIS
// ============================================

document.addEventListener("mousemove", (event) => {

    sourisX = event.clientX;
    sourisY = event.clientY;

    verifierFuite();

});


// ============================================
// TÉLÉPHONE
// ============================================

document.addEventListener("touchstart", (event) => {

    const doigt = event.touches[0];

    sourisX = doigt.clientX;
    sourisY = doigt.clientY;

    verifierFuite();

}, { passive: true });


// ============================================
// POSITION ALÉATOIRE AUTOUR DE L'IMAGE
// ============================================

function placerBoutonAleatoirement() {

    const img =
        image.getBoundingClientRect();

    const largeur =
        button.offsetWidth;

    const hauteur =
        button.offsetHeight;


    const cote =
        Math.floor(Math.random() * 4);


    let x;
    let y;


    // DROITE

    if (cote === 0) {

        x =
            img.right +
            distanceImage;

        y =
            img.top +
            Math.random() * img.height -
            hauteur / 2;
    }


    // GAUCHE

    else if (cote === 1) {

        x =
            img.left -
            largeur -
            distanceImage;

        y =
            img.top +
            Math.random() * img.height -
            hauteur / 2;
    }


    // HAUT

    else if (cote === 2) {

        x =
            img.left +
            Math.random() * img.width -
            largeur / 2;

        y =
            img.top -
            hauteur -
            distanceImage;
    }


    // BAS

    else {

        x =
            img.left +
            Math.random() * img.width -
            largeur / 2;

        y =
            img.bottom +
            distanceImage;
    }


    button.style.position = "fixed";

    button.style.left =
        x + "px";

    button.style.top =
        y + "px";

    button.style.zIndex = "20";
}


// ============================================
// DÉTECTION
// ============================================

function verifierFuite() {

    if (enFuite) return;


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


    if (distance < zoneFuite) {

        lancerFuite();

    }
}


// ============================================
// LANCER LA FUITE
// ============================================

function lancerFuite() {

    enFuite = true;


    const img =
        image.getBoundingClientRect();


    const bouton =
        button.getBoundingClientRect();


    const departX =
        bouton.left;

    const departY =
        bouton.top;


    // ========================================
    // Trouver le côté d'entrée le plus proche
    // ========================================

    const centreX =
        bouton.left +
        bouton.width / 2;

    const centreY =
        bouton.top +
        bouton.height / 2;


    const distances = {

        gauche:
            Math.abs(
                centreX - img.left
            ),

        droite:
            Math.abs(
                centreX - img.right
            ),

        haut:
            Math.abs(
                centreY - img.top
            ),

        bas:
            Math.abs(
                centreY - img.bottom
            )
    };


    let entree =
        Object.keys(distances)
            .reduce((a, b) =>
                distances[a] < distances[b]
                    ? a
                    : b
            );


    // ========================================
    // Choisir une sortie différente
    // ========================================

    const sorties = [
        "gauche",
        "droite",
        "haut",
        "bas"
    ];


    const sortiesPossibles =
        sorties.filter(
            cote => cote !== entree
        );


    const sortie =
        sortiesPossibles[
            Math.floor(
                Math.random() *
                sortiesPossibles.length
            )
        ];


    // ========================================
    // Point d'entrée
    // ========================================

    const entreePoint =
        obtenirPointSurBord(
            entree,
            img
        );


    // ========================================
    // Point de sortie
    // ========================================

    const sortiePoint =
        obtenirPointSurBord(
            sortie,
            img
        );


    // ========================================
    // Position juste avant l'image
    // ========================================

    const avant =
        positionExterieure(
            entreePoint,
            entree
        );


    // ========================================
    // Position juste après l'image
    // ========================================

    const apres =
        positionExterieure(
            sortiePoint,
            sortie
        );


    // ========================================
    // TRAJET CONTINU
    // ========================================

    const trajet = [

        {
            x: departX,
            y: departY
        },

        {
            x: avant.x,
            y: avant.y
        },

        {
            x: sortiePoint.x,
            y: sortiePoint.y
        },

        {
            x: apres.x,
            y: apres.y
        }

    ];


    // ========================================
    // LONGUEUR TOTALE
    // ========================================

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


    // ========================================
    // ANIMATION
    // ========================================

    const debut =
        performance.now();


    function animation(temps) {

        const ecoule =
            temps - debut;


        const distance =
            Math.min(
                ecoule *
                vitesse /
                1000,

                longueurTotale
            );


        let reste =
            distance;


        let x =
            trajet[0].x;

        let y =
            trajet[0].y;


        for (
            let i = 1;
            i < trajet.length;
            i++
        ) {

            const dx =
                trajet[i].x -
                trajet[i - 1].x;

            const dy =
                trajet[i].y -
                trajet[i - 1].y;


            const longueur =
                Math.hypot(dx, dy);


            if (reste <= longueur) {

                const ratio =
                    reste / longueur;


                x =
                    trajet[i - 1].x +
                    dx * ratio;


                y =
                    trajet[i - 1].y +
                    dy * ratio;


                break;
            }


            reste -= longueur;

            x = trajet[i].x;
            y = trajet[i].y;
        }


        button.style.left =
            x + "px";

        button.style.top =
            y + "px";


        // ====================================
        // Vérifier si le bouton est dans image
        // ====================================

        const rect =
            button.getBoundingClientRect();


        const collision =
            rect.right > img.left &&
            rect.left < img.right &&
            rect.bottom > img.top &&
            rect.top < img.bottom;


        if (collision) {

            // Derrière l'image

            button.style.zIndex = "1";

        }

        else {

            // Devant mais sans toucher l'image

            button.style.zIndex = "20";

        }


        if (
            distance <
            longueurTotale
        ) {

            requestAnimationFrame(
                animation
            );

        }

        else {

            // =================================
            // IMPORTANT :
            // position finale parfaitement
            // séparée de l'image
            // =================================

            const positionFinale =
                corrigerPositionFinale(
                    x,
                    y,
                    sortie,
                    img
                );


            button.style.left =
                positionFinale.x + "px";

            button.style.top =
                positionFinale.y + "px";


            button.style.zIndex = "20";

            enFuite = false;
        }
    }


    requestAnimationFrame(
        animation
    );
}


// ============================================
// POINT ALÉATOIRE SUR LE BORD
// ============================================

function obtenirPointSurBord(cote, img) {

    const largeur =
        button.offsetWidth;

    const hauteur =
        button.offsetHeight;


    let x;
    let y;


    // GAUCHE

    if (cote === "gauche") {

        x =
            img.left -
            largeur;

        y =
            img.top +
            Math.random() *
            (img.height - hauteur);

    }


    // DROITE

    else if (cote === "droite") {

        x =
            img.right;

        y =
            img.top +
            Math.random() *
            (img.height - hauteur);

    }


    // HAUT

    else if (cote === "haut") {

        x =
            img.left +
            Math.random() *
            (img.width - largeur);

        y =
            img.top -
            hauteur;

    }


    // BAS

    else {

        x =
            img.left +
            Math.random() *
            (img.width - largeur);

        y =
            img.bottom;

    }


    return {
        x: x,
        y: y
    };
}


// ============================================
// POSITION AVANT L'IMAGE
// ============================================

function positionExterieure(point, cote) {

    let x =
        point.x;

    let y =
        point.y;


    if (cote === "gauche") {

        x -= distanceImage;

    }

    else if (cote === "droite") {

        x += distanceImage;

    }

    else if (cote === "haut") {

        y -= distanceImage;

    }

    else {

        y += distanceImage;

    }


    return {
        x: x,
        y: y
    };
}


// ============================================
// CORRECTION FINALE
// ============================================

function corrigerPositionFinale(
    x,
    y,
    cote,
    img
) {

    const largeur =
        button.offsetWidth;

    const hauteur =
        button.offsetHeight;


    // GAUCHE

    if (cote === "gauche") {

        x =
            img.left -
            largeur -
            distanceImage;

        y =
            Math.max(
                img.top,
                Math.min(
                    y,
                    img.bottom -
                    hauteur
                )
            );
    }


    // DROITE

    else if (cote === "droite") {

        x =
            img.right +
            distanceImage;

        y =
            Math.max(
                img.top,
                Math.min(
                    y,
                    img.bottom -
                    hauteur
                )
            );
    }


    // HAUT

    else if (cote === "haut") {

        y =
            img.top -
            hauteur -
            distanceImage;

        x =
            Math.max(
                img.left,
                Math.min(
                    x,
                    img.right -
                    largeur
                )
            );
    }


    // BAS

    else {

        y =
            img.bottom +
            distanceImage;

        x =
            Math.max(
                img.left,
                Math.min(
                    x,
                    img.right -
                    largeur
                )
            );
    }


    return {
        x: x,
        y: y
    };
}

button.addEventListener("click", () => {
    cpt++;
    button.textContent = "bravo "+cpt;
});
