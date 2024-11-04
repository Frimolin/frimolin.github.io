import { fetchData } from '../../dataService.js';

// Fonction pour afficher les postes dans le tableau
async function displayPostes() {
    try {
        const postes = await fetchData('/dataPostes'); // Récupère les données des postes avec Contact
        const tbody = document.querySelector('#post-list tbody');

        // Vide le tableau avant de l'afficher
        tbody.innerHTML = '';

        postes.forEach(poste => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${poste.PosteID || 'Inconnu'}</td>
            <td>${poste.NomEntrepriseID || 'Inconnu'}</td>
            <td>${poste.NomPoste || 'Inconnu'}</td>
            <td>${poste.Contrat || 'Inconnu'}</td> <!-- Contrat -->
            <td>${poste.Localisation || 'Inconnu'}</td> <!-- Localisation de l'entreprise -->
            <td>${poste.Contact || 'Inconnu'}</td> <!-- Contact de l'entreprise -->
            <td>${poste.Secteur || 'Inconnu'}</td>
            <td>${poste.Salaire || 'Inconnu'}</td>
            <td>${poste.Mission || 'Inconnu'}</td>
            <td>${poste.Profil || 'Inconnu'}</td>
            <td><button class="delete-btn" data-id="${poste.PosteID}">Supprimer</button>
                <button class="edit-btn" data-id="${poste.PosteID}">Modifier</button></td>
            `;

            tbody.appendChild(row);
        });

        // Gestion des boutons de suppression
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const posteID = event.target.getAttribute('data-id');
                const response = await fetch(`/deletePoste/${posteID}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showMessage('Poste supprimé avec succès !');
                    displayPostes();  // Recharge la liste des postes après suppression
                } else {
                    showMessage('Erreur lors de la suppression du poste.');
                }
            });
        });

        // Gestion des boutons d'édition
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const posteID = event.target.getAttribute('data-id');
        
                // Récupérer les détails du poste actuel à partir du tableau ou d'une requête serveur
                const poste = postes.find(p => p.PosteID == posteID);
        
                // Remplir le formulaire de modification avec les informations existantes
                populateEditForm(poste);
            });
        });

    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to load postes.');
    }
}

// Appel initial de la fonction d'affichage des postes
document.addEventListener('DOMContentLoaded', displayPostes);

function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';

    // Cache le message après 10 secondes
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 10000);
}

// Fonction pour remplir le formulaire de modification avec les données du poste
function populateEditForm(poste) {
    document.getElementById('edit-posteID').value = poste.PosteID;
    document.getElementById('edit-nomPoste').value = poste.NomPoste;
    document.getElementById('edit-secteur').value = poste.Secteur;
    document.getElementById('edit-salaire').value = poste.Salaire;
    document.getElementById('edit-contrat').value = poste.Contrat;
    document.getElementById('edit-mission').value = poste.Mission;
    document.getElementById('edit-profil').value = poste.Profil;

    // Affiche le modal
    document.getElementById('edit-modal').style.display = 'block';
}

// Événement pour gérer la soumission du formulaire de modification
document.getElementById('edit-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const posteID = document.getElementById('edit-posteID').value;
    const updatedPoste = {
        NomPoste: document.getElementById('edit-nomPoste').value,
        Secteur: document.getElementById('edit-secteur').value,
        Salaire: document.getElementById('edit-salaire').value,
        Mission: document.getElementById('edit-mission').value,
        Profil: document.getElementById('edit-profil').value,
        Contrat: document.getElementById('edit-contrat').value,
    };

    const response = await fetch(`/updatePoste/${posteID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPoste),
    });

    if (response.ok) {
        showMessage('Poste modifié avec succès !');
        displayPostes(); // Recharge la liste des postes après modification
    } else {
        const errorText = await response.text(); // Obtenir le texte de l'erreur
        console.error('Error response:', errorText); // Affichez l'erreur dans la console
        showMessage('Erreur lors de la modification du poste: ' + errorText);
    }

    // Ferme le modal après la soumission
    document.getElementById('edit-modal').style.display = 'none';
});

// Gestion du modal pour la création d'un nouveau poste
document.getElementById('create-post-btn').addEventListener('click', () => {
    document.getElementById('create-modal').style.display = 'block';
});

// Événement pour gérer la soumission du formulaire de création de poste
document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const newPoste = {
        //NomEntreprise: document.getElementById('create-nomEntreprise').value,
        NomPoste: document.getElementById('create-nomPoste').value,
        NomEntrepriseID: document.getElementById('create-nomEntreprise').value,
        Localisation: document.getElementById('create-localisation').value,
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
        showMessage('Poste créé avec succès !');
        displayPostes(); // Recharge la liste des postes après création
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        showMessage('Erreur lors de la création du poste: ' + errorText);
    }

    // Ferme le modal après la soumission
    document.getElementById('create-modal').style.display = 'none';
});

// Fermeture du modal de création
document.getElementById('create-close-btn').addEventListener('click', () => {
    document.getElementById('create-modal').style.display = 'none';
});
document.getElementById('edit-close-btn').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});
