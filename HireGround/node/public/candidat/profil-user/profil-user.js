import { fetchData } from '../../dataService.js';
import { postData } from '../../dataService.js';

async function fetchUserData() {
    try {
        const cook = await fetchData('/dashboard');
        console.log('Cook Data:', cook[0]); // Vérifiez les données ici

        // Remplir les éléments avec les données
        if (cook[0]) {
            document.getElementById('prenom-display').textContent = cook[0].FirstNameIdentifiant || 'Inconnu';
            document.getElementById('nom-display').textContent = cook[0].LastNameIdentifiant || 'Inconnu';
            document.getElementById('email-display').textContent = cook[0].EmailIdentifiant || 'Inconnu';
            document.getElementById('password-display').textContent = '*****';
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
    }
}

function toggleEditMode() {
    const isEditing = document.getElementById('prenom-edit').classList.contains('hidden');

    document.querySelectorAll('.info-row span').forEach(span => {
        span.classList.toggle('hidden', !isEditing); 
    });
    document.querySelectorAll('.info-row input').forEach(input => {
        input.classList.toggle('hidden', isEditing); 
    });
    
    document.getElementById('save-btn').classList.toggle('hidden', isEditing);
    document.getElementById('edit-btn').classList.toggle('hidden', !isEditing);

    if (isEditing) {
        document.getElementById('prenom-edit').value = document.getElementById('prenom-display').textContent;
        document.getElementById('nom-edit').value = document.getElementById('nom-display').textContent;
        document.getElementById('email-edit').value = document.getElementById('email-display').textContent;
    }
}

async function saveUserData() {
    const updatedUserData = {
        firstName: document.getElementById('prenom-edit').value,
        lastName: document.getElementById('nom-edit').value,
        email: document.getElementById('email-edit').value,
    };

    try {
        const response = await postData('/update-user', updatedUserData); 
        console.log('Données mises à jour:', response);

        fetchUserData(); 
    } catch (error) {
        console.error('Erreur lors de la mise à jour des données utilisateur:', error);
    }
}

// Ajoutez l'événement DOMContentLoaded ici
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('edit-btn').addEventListener('click', toggleEditMode);
    document.getElementById('save-btn').addEventListener('click', saveUserData);
    
    fetchUserData(); // Appel après que le DOM est chargé
});
