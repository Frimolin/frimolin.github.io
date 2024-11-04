import { fetchData } from '../../dataService.js';

// Fonction pour afficher les Identifiants dans le tableau
async function displayUsers() {
    try {
        const Users = await fetchData('/dataIdentifiants'); // Récupère les données des Identifiants
        const tbody = document.querySelector('#user-list tbody');

        // Vide le tableau avant de l'afficher
        tbody.innerHTML = '';

        Users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.EmailIdentifiant || 'Inconnu'}</td>
            <td>${user.FirstNameIdentifiant || 'Inconnu'}</td>
            <td>${user.LastNameIdentifiant || 'Inconnu'}</td>
            <td>${user.Administrateur ? '1' : '0' || 'Inconnu'}</td>
            <td>${user.MDPIdentifiant || 'Inconnu'}</td>
            <td>
                <button class="delete-btn" data-id="${user.EmailIdentifiant}">Supprimer</button>
                <button class="edit-btn" data-id="${user.EmailIdentifiant}">Modifier</button>
            </td>
            `;
        
            tbody.appendChild(row);
        });

        // Gestion des boutons de suppression
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const email = event.target.getAttribute('data-id');
                const response = await fetch(`/deleteIdentifiant/${email}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showMessage('Identifiant supprimée avec succès !');
                    displayUsers();  // Recharge la liste des Identifiants après suppression
                } else {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    showMessage("Erreur lors de la suppression de l'Identifiant: " + errorText);
                }
            });
        });

        // Gestion des boutons d'édition
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const email = event.target.getAttribute('data-id');
                const user = Users.find(c => c.EmailIdentifiant == email);
                populateEditForm(user);
            });
        });

    } catch (error) {
        console.error('Error:', error);
        showMessage('Échec du chargement des Identifiants.');
    }
}

// Appel initial de la fonction d'affichage des Identifiants
document.addEventListener('DOMContentLoaded', displayUsers);

function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';

    // Cache le message après 10 secondes
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 10000);
}

// Fonction pour remplir le formulaire de modification avec les données de l'Identifiant
function populateEditForm(user) {
    document.getElementById('edit-EmailIdentifiant').value = user.EmailIdentifiant;
    document.getElementById('edit-FirstNameIdentifiant').value = user.FirstNameIdentifiant;
    document.getElementById('edit-LastNameIdentifiant').value = user.LastNameIdentifiant;
    document.getElementById('edit-Admin').checked = user.Administrateur;
    document.getElementById('edit-MDPIdentifiant').value = user.MDPIdentifiant;

    // Affiche le modal de modification
    document.getElementById('edit-modal').style.display = 'block';
}
// Gestion du formulaire de modification
document.getElementById('edit-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const email = document.getElementById('edit-EmailIdentifiant').value;
    const updateduser = {
        Firstname: document.getElementById('edit-FirstNameIdentifiant').value,
        Lastname: document.getElementById('edit-LastNameIdentifiant').value,
    };

    const response = await fetch(`/updateIdentifiant/${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateduser),
    });

    if (response.ok) {
        showMessage('Identifiant modifiée avec succès !');
        await displayUsers(); // Recharge la liste des Identifiants après modification
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        showMessage('Erreur lors de la modification de l\'Identifiant: ' + errorText);
    }

    // Ferme le modal après la soumission
    document.getElementById('edit-modal').style.display = 'none';
});

// Gestion du modal de création d'une nouvelle Identifiant
document.getElementById('create-user-btn').addEventListener('click', () => {
    document.getElementById('create-modal').style.display = 'block';
});

// Gestion du formulaire de création d'une Identifiant
document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const newuser = {
        email: document.getElementById('create-EmailIdentifiant').value,
        Firstname: document.getElementById('create-FirstNameIdentifiant').value,
        Lastname: document.getElementById('create-LastNameIdentifiant').value,
        admin: document.getElementById('create-Admin').checked,
        motdepasse: document.getElementById('create-MDPIdentifiant').value
    };

    const response = await fetch('/addAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newuser),
    });

    if (response.ok) {
        showMessage('Identifiant créée avec succès !');
        await displayUsers(); // Recharge la liste des Identifiants après création
    } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        showMessage('Erreur lors de la création de l\'Identifiant: ' + errorText);
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
