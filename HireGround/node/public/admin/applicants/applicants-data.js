import { fetchData } from '../../dataService.js';

// Fonction pour afficher les postulants dans le tableau
async function displayApplicants() {
    try {
        const Applicants = await fetchData('/datapostulants'); // Récupère les données des postulants
        const tbody = document.querySelector('#applicant-list tbody');

        // Vide le tableau avant de l'afficher
        tbody.innerHTML = '';

        Applicants.forEach(applicant => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${applicant.PosteID || 'Inconnu'}</td>
            <td>${applicant.EmailPostulant || 'Inconnu'}</td>
            <td>${applicant.FirstNamePostulant || 'Inconnu'}</td>
            <td>${applicant.LastNamePostulant || 'Inconnu'}</td>
            <td>${applicant.Lettre || 'Inconnu'}</td>
            <td>
                <button class="delete-btn" data-id1="${applicant.PosteID}" data-id2="${applicant.EmailPostulant}">Supprimer</button>
                <button class="edit-btn" data-id1="${applicant.PosteID}" data-id2="${applicant.EmailPostulant}">Modifier</button>
            </td>
            `;
        
            tbody.appendChild(row);
        });

        // Gestion des boutons de suppression
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const posteID = event.target.getAttribute('data-id1');
                const email = event.target.getAttribute('data-id2');
                const response = await fetch(`/deletepostulant/${posteID}/${email}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showMessage('postulant supprimée avec succès !');
                    displayApplicants();  // Recharge la liste des postulants après suppression
                } else {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    showMessage("Erreur lors de la suppression de l'postulant: " + errorText);
                }
            });
        });

        // Gestion des boutons d'édition
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const poste = event.target.getAttribute('data-id1');
                const email = event.target.getAttribute('data-id2');
                const applicant = Applicants.find(c => c.PosteID == poste && c.EmailPostulant == email);
                populateEditForm(applicant);
            });
        });

    } catch (error) {
        console.error('Error:', error);
        showMessage('Échec du chargement des postulants.');
    }
}

// Appel initial de la fonction d'affichage des postulants
document.addEventListener('DOMContentLoaded', displayApplicants);

function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';

    // Cache le message après 10 secondes
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 10000);
}

// Fonction pour remplir le formulaire de modification avec les données de l'postulant
function populateEditForm(applicant) {
    document.getElementById('edit-PosteID').value = applicant.PosteID;
    document.getElementById('edit-EmailPostulant').value = applicant.EmailPostulant;
    document.getElementById('edit-FirstNamePostulant').value = applicant.FirstNamePostulant;
    document.getElementById('edit-LastNamePostulant').value = applicant.LastNamePostulant;
    document.getElementById('edit-Lettre').value = applicant.Lettre;

    // Affiche le modal de modification
    document.getElementById('edit-modal').style.display = 'block';
}

// Événements pour fermer les modals lorsqu'on clique sur le bouton de fermeture

// Gestion du formulaire de modification
document.getElementById('edit-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const posteID = document.getElementById('edit-PosteID').value;
    const email = document.getElementById('edit-EmailPostulant').value;
    const updatedapplicant = {
        Firstname: document.getElementById('edit-FirstNamePostulant').value,
        Lastname: document.getElementById('edit-LastNamePostulant').value,
        lettre: document.getElementById('edit-Lettre').value // Récupère le mot de passe dynamique
    };

    const response = await fetch(`/updatepostulant/${posteID}/${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedapplicant),
    });

    if (response.ok) {
        showMessage('postulant modifiée avec succès !');
        await displayApplicants(); // Recharge la liste des postulants après modification
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        showMessage('Erreur lors de la modification de l\'postulant: ' + errorText);
    }

    // Ferme le modal après la soumission
    document.getElementById('edit-modal').style.display = 'none';
});

// Gestion du modal de création d'une nouvelle postulant
document.getElementById('create-applicant-btn').addEventListener('click', () => {
    document.getElementById('create-modal').style.display = 'block';
});

// Gestion du formulaire de création d'une postulant
document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const newapplicant = {
        PosteID: document.getElementById('create-PosteID').value,
        email: document.getElementById('create-EmailPostulant').value,
        Firstname: document.getElementById('create-FirstNamePostulant').value,
        Lastname: document.getElementById('create-LastNamePostulant').value,
        lettre: document.getElementById('create-Lettre').value
    };

    const response = await fetch('/apply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newapplicant),
    });

    if (response.ok) {
        showMessage('postulant créée avec succès !');
        await displayApplicants(); // Recharge la liste des postulants après création
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        showMessage('Erreur lors de la création de l\'postulant: ' + errorText);
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
