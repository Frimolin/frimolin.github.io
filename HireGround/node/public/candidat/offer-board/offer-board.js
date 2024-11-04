import { fetchData } from '../../dataService.js';
import { postData } from '../../dataService.js';

async function displayPostes() {
    try {
        const postes = await fetchData('/dataPostes'); 
        const container = document.getElementById('job-listings');
        const Entreprises = await fetchData('/dataEntreprises');

        postes.forEach(poste => {
            const div = document.createElement('div'); 
            div.classList.add('box', 'collapsed'); 
            div.innerHTML = `
            <div class="left">
                <h2 class="nomcompany">${poste.NomEntrepriseID}</h2>
                <h3 class="nomposte">${poste.NomPoste}</h3>
                <div class="info collapsed-info">
                    <div class="contrat">
                        <img src="/icon/contrat.png">
                        <p class="type-contrat">${poste.Contrat}</p>
                    </div>
                    <div class="endroit">
                        <img src="/icon/place.png">
                        <p class="place-work">${poste.Localisation}</p>
                    </div>
                    <div class="wage">
                        <img src="/icon/wage.png">
                        <p class="wage-contrat">${poste.Salaire}</p>
                    </div>
                </div>
                <div class="buttons">
                    <button class="see-more">See More</button>
                    
                    <dialog>
                        <form method="dialog" class="window" onsubmit="event.preventDefault();">
                            <h3>Postuler à cette offre</h3>
                            
                            <label for="firstNameapply${poste.PosteID}">First Name :</label>
                            <input type="text" id="firstNameapply${poste.PosteID}" name="firstName" required><br>
                
                            <label for="lastNameapply${poste.PosteID}">Last Name :</label>
                            <input type="text" id="lastNameapply${poste.PosteID}" name="lastName" required><br>
                
                            <label for="emailapply${poste.PosteID}">Email :</label>
                            <input type="email" id="emailapply${poste.PosteID}" name="email" required><br>
                
                            <label for="motivationapply${poste.PosteID}">Introduce Yourself to the Company</label><br>
                            <textarea id="motivationapply${poste.PosteID}" name="motivation" rows="5" cols="33" placeholder="Write here..." required></textarea><br>
                
                            <menu>
                                <button type="submit" id="Apply" onclick="applyForPoste(${poste.PosteID})">Submit</button>
                                <button type="button" id="close-dialog">Close</button>
                            </menu>
                        </form>
                    </dialog>
                
                    <button id="show-dialog" onclick="showpopup(${poste.PosteID})">Apply</button> 
                </div>
            </div>
            
            <div class="right hidden">
                <div class="entreprise">
                    <h4>The Company</h4>
                    <p class="company-descrp">${poste.Descriptif}</p>
                </div>
                <div class="mission">
                    <h4>Missions</h4>
                    <p class="mission-descrp">${poste.Mission}</p>
                </div>
                <div class="profil-required">
                    <h4>Profile required</h4>
                    <p class="profil-required">${poste.Profil}</p>
                </div>
            </div>
            `;

            container.appendChild(div); // Ajouter l'élément div créé

            // Ajout de l'événement "See More"
            const seeMoreButton = div.querySelector('.see-more');
            seeMoreButton.addEventListener('click', function() {
                var box = this.closest('.box');
                var rightSection = box.querySelector('.right'); 
                var applyButton = box.querySelector('.apply'); // Sélectionner le bouton "Apply"

                if (box.classList.contains('collapsed')) {
                    box.classList.remove('collapsed');
                    box.classList.add('expanded');
                    rightSection.classList.remove('hidden');
                    rightSection.classList.add('visible');
                    applyButton.classList.remove('hidden'); // Afficher le bouton "Apply"
                    this.textContent = 'See Less';
                } else {
                    box.classList.remove('expanded');
                    box.classList.add('collapsed');
                    rightSection.classList.remove('visible');
                    rightSection.classList.add('hidden');
                    applyButton.classList.add('hidden'); // Cacher le bouton "Apply"
                    this.textContent = 'See More';
                }
            });

            // Ajout de la gestion du dialog pour le bouton "Apply"
            const dialog = div.querySelector('dialog');
            const showDialogButton = div.querySelector('#show-dialog');
            const closeDialogButton = div.querySelector('#close-dialog');

            showDialogButton.addEventListener('click', () => {
                dialog.showModal();
            });

            closeDialogButton.addEventListener('click', () => {
                dialog.close();
            });

            // Gestion du bouton send pour envoyer la donnée
        });

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load postes.');
    }
}

async function showpopup(posteid){
    const cook = await fetchData('/dashboard');
    if (cook && cook[0].FirstNameIdentifiant) {
        document.getElementById('firstNameapply'+posteid).value = cook[0].FirstNameIdentifiant;
        document.getElementById('lastNameapply'+posteid).value = cook[0].LastNameIdentifiant;
        document.getElementById('emailapply'+posteid).value = cook[0].EmailIdentifiant;
    }
}

document.addEventListener('DOMContentLoaded', displayPostes)


async function applyForPoste(PosteID) {
    let postulantData;
    postulantData = {
        Firstname: document.getElementById('firstNameapply' + PosteID).value,
        Lastname: document.getElementById('lastNameapply' + PosteID).value,
        email: document.getElementById('emailapply' + PosteID).value,
        lettre: document.getElementById('motivationapply' + PosteID).value,
        PosteID: PosteID
    };
    // Envoi des données à la route /apply
    try {
        const response = await postData('/apply', postulantData);
        alert('Application submitted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit application.');
    }
}


window.applyForPoste = applyForPoste;
window.showpopup = showpopup;



// ----------- SEARCH
document.querySelector('.search-bar button').addEventListener('click', function() {
    const keyword = document.querySelector('.search-bar .key input').value.toLowerCase();
    const place = document.querySelector('.search-bar .place input').value.toLowerCase();
    const contractType = document.querySelector('#contract-type').value; // Obtenez le type de contrat sélectionné
    filterPostes(keyword, place, contractType);
});

function filterPostes(keyword, place, contractType) {
    const jobListings = document.getElementById('job-listings').children;
    
    Array.from(jobListings).forEach(posteDiv => {
        const companyDesc = posteDiv.querySelector('.company-descrp').textContent.toLowerCase();
        const missionDesc = posteDiv.querySelector('.mission-descrp').textContent.toLowerCase();
        const profilDesc = posteDiv.querySelector('.profil-required').textContent.toLowerCase();
        const placeWork = posteDiv.querySelector('.place-work').textContent.toLowerCase();
        const contratTypePoste = posteDiv.querySelector('.type-contrat').textContent.toLowerCase(); // Correction pour obtenir le type de contrat

        const matchesKeyword = (companyDesc.includes(keyword) || missionDesc.includes(keyword) || profilDesc.includes(keyword));
        const matchesPlace = placeWork.includes(place);
        const matchesContractType = contractType === '' || contratTypePoste.includes(contractType.toLowerCase()); // Vérifie si le type de contrat est sélectionné ou non

        if (matchesKeyword && matchesPlace && matchesContractType) {
            posteDiv.style.display = 'block';  // Affiche
        } else {
            posteDiv.style.display = 'none'; // CACHE
        } 
    });
}