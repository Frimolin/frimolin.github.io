// Pour se balader entre section
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Obtiens la section à afficher depuis l'attribut data-section
        const sectionId = this.getAttribute('data-section');
        
        // Masque toutes les sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Affiche la section correspondante
        document.getElementById(sectionId).classList.add('active');
    });
});

import { postData, fetchData } from '../../dataService.js';

async function Dropdowns(){
    const entreprises = await fetchData('/dataEntreprises');
    const entreprisesdropdown = document.getElementById('entreprisedropdown');
    const localisationdropdown = document.getElementById('localisationdropdown');

    entreprises.forEach(entreprise => {
        const optionentreprise = document.createElement('option');
        const optionlocalisation = document.createElement('option');
        optionentreprise.value = entreprise.NomEntrepriseID;
        optionentreprise.text = entreprise.NomEntrepriseID;
        entreprisesdropdown.appendChild(optionentreprise);
        optionlocalisation.value = entreprise.Localisation;
        optionlocalisation.text = entreprise.Localisation;
        localisationdropdown.appendChild(optionlocalisation);
    })
}

document.addEventListener('DOMContentLoaded', Dropdowns);

document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const newPoste = {
        NomPoste: document.getElementById('create-nomPoste').value,
        NomEntrepriseID: document.getElementById('entreprisedropdown').value,
        Localisation: document.getElementById('localisationdropdown').value,
        Secteur: document.getElementById('create-secteur').value,
        Salaire: document.getElementById('create-salaire').value,
        Mission: document.getElementById('create-mission').value,
        Profil: document.getElementById('create-profil').value,
        Contrat: document.getElementById('create-contrat').value,
    };
    const response = await fetch('/addPoste', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPoste),
    });

    if (response.ok) {
        alert('Poste créé avec succès !');
     // Recharge la liste des postes après création
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Erreur lors de la création du poste: ' + errorText);
    }
});



async function displayApplicants() {
    try {
        const cook = await fetchData('/dashboardcompany');
        console.log('Cook Data:', cook[0]);
        
        const applicants = await postData('/data-post-postulants', cook[0]); // Récupère les données des postulants
        const tbody = document.querySelector('#company-list tbody');
        tbody.innerHTML = ''; // Réinitialise le tableau
        console.log('Applicants:', applicants);
        
        const notifContainer = document.getElementById('notif-container');
        if (notifContainer) {
            notifContainer.innerHTML = ''; // Réinitialise les notifications
        } else {
            console.error('Notif container not found!');
        }

        const applicantsContainer = document.getElementById('applicants-container');
        if (applicantsContainer) {
            applicantsContainer.innerHTML = ''; // Réinitialise le conteneur des postulants
        } else {
            console.error('Applicants container not found!');
        }

        const uniquePostes = new Set(); // Pour stocker les postes uniques

        applicants.forEach(applicant => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${applicant.NomPoste || 'Inconnu'}</td>
            <td>${applicant.LastNamePostulant || 'Inconnu'}</td>
            <td>${applicant.FirstNamePostulant || 'Inconnu'}</td>
            <td>${applicant.EmailPostulant || 'Inconnu'}</td>
            <td>${applicant.Lettre || 'Inconnu'}</td>
            `;

            tbody.appendChild(row); // Ajoute la ligne au tableau
            uniquePostes.add(applicant.NomPoste || 'Inconnu'); // Ajoute le poste unique

            // Crée une notification
            const notifBox = document.createElement('div');
            notifBox.classList.add('box-notif');
            notifBox.innerHTML = `
                ${applicant.FirstNamePostulant || 'First Name Unknown'} 
                ${applicant.LastNamePostulant || 'Last Name Unknown'} 
                applies to your post.
            `;
            if (notifContainer) {
                notifContainer.appendChild(notifBox); // Ajoute la notification
            }

            // Crée une div pour chaque postulant
            const applicantDiv = document.createElement('div');
            applicantDiv.className = 'applicant'; // Classe pour le style
            applicantDiv.innerHTML = `
                <h4>${applicant.FirstNamePostulant} ${applicant.LastNamePostulant}</h4>
                <p>Email: ${applicant.EmailPostulant || 'Inconnu'}</p>
            `;
            
            if (applicantsContainer) {
                applicantsContainer.appendChild(applicantDiv); // Ajoute la div dans le conteneur
            }
        });

        displayPostes(Array.from(uniquePostes)); // Appelle la fonction pour afficher les postes uniques
    } catch (error) {
        console.error('Erreur lors de l\'affichage des postulants :', error);
    }
}

function displayPostes(uniquePostes) {
    const postesList = document.getElementById('list-poste');
    console.log('Postes List:', postesList); // Vérifiez cet élément
    if (postesList) {
        postesList.innerHTML = ''; // Réinitialise le conteneur des postes

        if (uniquePostes.length > 0) {
            uniquePostes.forEach(nomPoste => {
                const posteDiv = document.createElement('div');
                posteDiv.className = 'poste'; // Classe pour le style
                posteDiv.innerHTML = `
                    <h3>${nomPoste}</h3>
                `;
                postesList.appendChild(posteDiv); // Ajoute la div du poste
            });
        } else {
            postesList.innerHTML = '<p>Aucun poste disponible.</p>';
        }
    } else {
        console.error('Postes list container not found!');
    }
}

document.addEventListener('DOMContentLoaded', displayApplicants);
