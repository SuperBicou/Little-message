const bouton = document.getElementById("mon-bouton");
const reinit = document.getElementById("init");
const message = document.getElementById("message");

let cpt = 0

bouton.addEventListener("click", function() {
    cpt++
    message.textContent = "Le bouton a été cliqué ! cpt: " + cpt;
    if (cpt == 5) {
        message.textContent = "Tu as atteint 5 clics !";
	bouton.disabled = true;
    } else {
        message.textContent = "Nombre de clics : " + cpt;
    }
});

reinit.addEventListener("click", function() {
    cpt= 0
    bouton.disabled = false;
    message.textContent = "cpt remis a 0 cpt : " + cpt;
});

