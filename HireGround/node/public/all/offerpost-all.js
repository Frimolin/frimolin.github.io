import { fetchData } from '../../dataService.js';

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
        //NomEntreprise: document.getElementById('create-nomEntreprise').value,
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