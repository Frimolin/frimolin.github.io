import { fetchData } from '../../dataService.js';

// Fonction pour afficher les entreprises dans le tableau
async function displayCompanies() {
    try {
        const companies = await fetchData('/dataEntreprises'); // Récupère les données des entreprises
        const tbody = document.querySelector('#company-list tbody');

        // Vide le tableau avant de l'afficher
        tbody.innerHTML = '';

        companies.forEach(company => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${company.NomEntrepriseID || 'Inconnu'}</td>
            <td>${company.Localisation || 'Inconnu'}</td>
            <td>${company.Contact || 'Inconnu'}</td>
            <td>${company.Descriptif || 'Inconnu'}</td>
            <td>${company.MDPEntreprise || 'Inconnu'}</td>
            <td>
                <button class="delete-btn" data-id1="${company.NomEntrepriseID}" data-id2="${company.Localisation}">Supprimer</button>
                <button class="edit-btn" data-id1="${company.NomEntrepriseID}" data-id2="${company.Localisation}">Modifier</button>
            </td>
            `;
        
            tbody.appendChild(row);
        });

        // Gestion des boutons de suppression
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const entrepriseID = event.target.getAttribute('data-id1');
                const localisationID = event.target.getAttribute('data-id2');
                const response = await fetch(`/deleteCompany/${entrepriseID}/${localisationID}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showMessage('Entreprise supprimée avec succès !');
                    displayCompanies();  // Recharge la liste des entreprises après suppression
                } else {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    showMessage("Erreur lors de la suppression de l'entreprise: " + errorText);
                }
            });
        });

        // Gestion des boutons d'édition
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const entrepriseID = event.target.getAttribute('data-id1');
                const localisationID = event.target.getAttribute('data-id2');
                const company = companies.find(c => c.NomEntrepriseID == entrepriseID && c.Localisation == localisationID);
                populateEditForm(company);
            });
        });

    } catch (error) {
        console.error('Error:', error);
        showMessage('Échec du chargement des entreprises.');
    }
}

// Appel initial de la fonction d'affichage des entreprises
document.addEventListener('DOMContentLoaded', displayCompanies);

function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';

    // Cache le message après 10 secondes
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 10000);
}

// Fonction pour remplir le formulaire de modification avec les données de l'entreprise
function populateEditForm(company) {
    document.getElementById('edit-nomEntrepriseID').value = company.NomEntrepriseID;
    document.getElementById('edit-localisation').value = company.Localisation;
    document.getElementById('edit-contact').value = company.Contact;
    document.getElementById('edit-descriptif').value = company.Descriptif;
    document.getElementById('edit-password').value = company.MDPEntreprise;

    // Affiche le modal de modification
    document.getElementById('edit-modal').style.display = 'block';
}


// Gestion du formulaire de modification
document.getElementById('edit-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const entrepriseID = document.getElementById('edit-nomEntrepriseID').value;
    const localisationID = document.getElementById('edit-localisation').value;
    const updatedCompany = {
        Contact: document.getElementById('edit-contact').value,
        Descriptif: document.getElementById('edit-descriptif').value,
        MDPEntreprise: document.getElementById('edit-password').value // Récupère le mot de passe dynamique
    };

    const response = await fetch(`/updateCompany/${entrepriseID}/${localisationID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompany),
    });

    if (response.ok) {
        showMessage('Entreprise modifiée avec succès !');
        await displayCompanies(); // Recharge la liste des entreprises après modification
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        showMessage('Erreur lors de la modification de l\'entreprise: ' + errorText);
    }

    // Ferme le modal après la soumission
    document.getElementById('edit-modal').style.display = 'none';
});

// Gestion du modal de création d'une nouvelle entreprise
document.getElementById('create-company-btn').addEventListener('click', () => {
    document.getElementById('create-modal').style.display = 'block';
});

// Gestion du formulaire de création d'une entreprise
document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const newCompany = {
        NomEntrepriseID: document.getElementById('create-nomEntreprise').value,
        Localisation: document.getElementById('create-localisation').value,
        Contact: document.getElementById('create-contact').value,
        Descriptif: document.getElementById('create-descriptif').value,
        MDPEntreprise: document.getElementById('create-password').value
    };

    const response = await fetch('/addCompany', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompany),
    });

    if (response.ok) {
        showMessage('Entreprise créée avec succès !');
        await displayCompanies(); // Recharge la liste des entreprises après création
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        showMessage('Erreur lors de la création de l\'entreprise: ' + errorText);
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