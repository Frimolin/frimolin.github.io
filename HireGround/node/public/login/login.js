import { postData, fetchData } from "../dataService.js";
async function signupUser(){
    const Userform = {
        Firstname: document.getElementById('Firstname').value,
        Lastname: document.getElementById('Lastname').value, 
        email: document.getElementById('emailuser').value, 
        motdepasse: document.getElementById('mdpuser').value
    };
    try{
        const reponse = await postData('/insertUser', Userform);
        console.log('user inserted');
    } catch (error){
        console.error('error :', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnsu').addEventListener('click', signupUser);
});  

document.getElementById('btn-login-user').addEventListener('click', async (event) => { 
    event.preventDefault();  // Empêche le comportement par défaut du bouton
    const Userform = {
        email: document.getElementById('emailuserlogin').value, 
        motdepasse: document.getElementById('mdpuserlogin').value
    };
    try{
        const response = await postData('/loginuser', Userform);
        document.cookie = `token=${response.token}; path=/; max-age=3600; samesite=strict;`;

    } catch (error){
        console.error('error :', error);
    }
    const cook = await fetchData('/dashboard');
    if(cook[0].Administrateur == 1){
        console.log ("Pas admin cookie ok")
        window.location.assign('../admin/admin-index.html');
    } else {
        console.log ("admin cookie ok")
        window.location.assign('../candidat/profil-user/profil-user.html');
    }
});

document.getElementById('btn-login-company').addEventListener('click', async (event) => { 
    event.preventDefault();  // Empêche le comportement par défaut du bouton
    const Userform = {
        email: document.getElementById('emailcompanylogin').value, 
        motdepasse: document.getElementById('mdpcompanylogin').value
    };
    try{
        const response = await postData('/logincompany', Userform);
        document.cookie = `token=${response.token}; path=/; max-age=3600; samesite=strict;`;
        window.location.assign('../company/companyprofil.html');
    } catch (error){
        console.error('error :', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnsu').addEventListener('click', signupUser);
});  

// Gestion de la soumission du formulaire de création d'entreprise
document.getElementById('btn-signup-company').addEventListener('click', async (event) => { 
    event.preventDefault(); 

    const newCompany = {
        NomEntrepriseID: document.getElementById('name-company').value,
        Localisation: document.getElementById('localisation-company').value,
        Contact: document.getElementById('email-company').value,
        Descriptif: document.getElementById('description-company').value,
        MDPEntreprise: document.getElementById('password-company').value // Mot de passe ajouté
    };
    try {
        const response = await fetch('/addCompany', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCompany),
        });

        if (response.ok) {
            alert('Entreprise créée avec succès !');
            document.getElementById('create-form').reset(); // Réinitialiser le formulaire
        } else {
            const errorText = await response.text();
            alert('Erreur lors de la création de l\'entreprise: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Une erreur s\'est produite lors de la tentative de création de l\'entreprise : ' + error.message);
    }
});


