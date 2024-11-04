const express = require('express');
const connection = require('./db_connection.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

connection.query("SELECT * FROM Postulants",(err,resultat)=>{
  console.log(resultat)
})

connection.query("SELECT * FROM Identifiants",(err,resultat)=>{
  console.log(resultat)
})

connection.query("SELECT * FROM Entreprises",(err,resultat)=>{
    console.log(resultat)
  })

//--------------------COMPANY

// Création
app.post('/addCompany', async (req, res) => {
  const { NomEntrepriseID, Localisation, Contact, Descriptif, MDPEntreprise } = req.body;

  const sql = "INSERT INTO Entreprises (NomEntrepriseID, Localisation, Contact, Descriptif, MDPEntreprise) VALUES (?, ?, ?, ?, ?)";
  const values = [NomEntrepriseID, Localisation, Contact, Descriptif, MDPEntreprise];

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json('Failed to insert company');
      }
      res.status(200).json('Company inserted successfully!');
  });
});

// Update
app.put('/updateCompany/:entrepriseID/:localisationID', async (req, res) => {
    const { entrepriseID, localisationID} = req.params;
    const {Contact, Descriptif, MDPEntreprise } = req.body;

    const sql = "UPDATE Entreprises SET Contact = ?, Descriptif = ?, MDPEntreprise = ? WHERE NomEntrepriseID = ? AND Localisation = ?";
    const values = [Contact, Descriptif, MDPEntreprise, entrepriseID, localisationID];

    try {
        const [results] = await connection.promise().query(sql, values);
        if (results.affectedRows === 0) {
            return res.status(404).send('Entreprise non trouvée.');
        }
        res.status(200).send('Entreprise mise à jour avec succès !');
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'entreprise :', err);
        res.status(500).send('Erreur lors de la mise à jour de l\'entreprise : ' + err.message);
    }
});


// Delete
app.delete('/deleteCompany/:entrepriseID/:localisationID', (req, res) => {
    const {entrepriseID, localisationID} = req.params;

    const sql = "DELETE FROM Entreprises WHERE NomEntrepriseID = ? AND Localisation = ?";
    connection.query(sql, [entrepriseID, localisationID], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'entreprise:', err);
            return res.status(500).send('Erreur lors de la suppression de l\'entreprise: ' + err.message);
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Aucune entreprise trouvée avec cet ID.');
        }

        res.status(200).send('Entreprise supprimée avec succès.');
    });
});

// Display
app.get('/dataEntreprises', (req, res) => {
    const sql = 'SELECT * FROM Entreprises';
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.stack);
            return res.status(500).send('Failed to fetch data');
        }
        res.json(results);
    });
});




//------------------POST OFFER

// Création
app.post('/addPoste', (req, res) => {
    const { NomEntrepriseID, Localisation, NomPoste, Secteur, Salaire, Mission, Profil, Contrat } = req.body;
    const insertPostQuery = `
      INSERT INTO Postes (NomPoste, Secteur, Salaire, Mission, Profil, Contrat, NomEntrepriseID, Localisation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
      connection.query(insertPostQuery, [NomPoste, Secteur, Salaire, Mission, Profil, Contrat, NomEntrepriseID, Localisation], (err, postResults) => {
          if (err) {
              console.error('Error inserting post:', err);
              return res.status(500).send('Error inserting post: ' + err.message);
          }
          res.status(201).send('Poste ajouté avec succès.');
      });
    }
);

// Update
app.put('/updatePoste/:id', (req, res) => {
    const posteID = req.params.id;
    const { NomPoste, Secteur, Salaire, Mission, Profil, Contrat } = req.body;

    const query = `
        UPDATE Postes
        SET NomPoste = ?, Secteur = ?, Salaire = ?, Mission = ?, Profil = ?, Contrat = ?
        WHERE PosteID = ?;
    `;

    connection.query(query, [NomPoste, Secteur, Salaire, Mission, Profil, Contrat, posteID], (err, results) => {
        if (err) {
            console.error('Error updating poste:', err.message);
            return res.status(500).send('Error updating poste: ' + err.message);
        }
        res.status(200).send('Poste updated successfully.');
    });
});

// Delete
app.delete('/deletePoste/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Postes WHERE PosteID = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            return res.status(500).json({ error: 'Failed to delete data' });
        }
        console.log('Data deleted successfully!');
        res.status(200).json({ message: 'Post deleted successfully!' });
    });
});

// Display
app.get('/dataPostes', (req, res) => {
    const query = `
        SELECT 
            Postes.*,  
            Entreprises.Contact,
            Entreprises.Descriptif
        FROM Postes
        JOIN Entreprises ON Postes.NomEntrepriseID = Entreprises.NomEntrepriseID AND Postes.Localisation=Entreprises.Localisation;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message); 
            return res.status(500).send('Error fetching data from database');
        }
        res.json(results);
    });
});

app.post('/apply', (req, res) => {
    const { Firstname, Lastname, email, lettre, PosteID} = req.body;
  
    const sql = "INSERT INTO Postulants (FirstNamePostulant, LastNamePostulant, EmailPostulant, Lettre, PosteID) VALUES (?, ?, ?, ?, ?)";
    const values = [Firstname, Lastname, email, lettre, PosteID];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json('Failed to insert data');
      }
      res.status(200).json('Data inserted successfully!');
    });
  });
// Update
app.put('/updatepostulant/:posteID/:email', async (req, res) => {
    const { posteID, email} = req.params;
    const {Firstname, Lastname, lettre } = req.body;
  
    const sql = "UPDATE Postulants SET FirstNamePostulant = ?, LastNamePostulant = ?, Lettre = ? WHERE PosteID = ? AND EmailPostulant = ?";
    const values = [Firstname, Lastname, lettre, posteID, email];
  
    try {
        const [results] = await connection.promise().query(sql, values);
        if (results.affectedRows === 0) {
              return res.status(404).send('Entreprise non trouvée.');
        }
        res.status(200).send('Entreprise mise à jour avec succès !');
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'entreprise :', err);
        res.status(500).send('Erreur lors de la mise à jour de l\'entreprise : ' + err.message);
    }
});
  
  
  // Delete
app.delete('/deletepostulant/:posteID/:email', (req, res) => {
    const {posteID, email} = req.params;
  
    const sql = "DELETE FROM Postulants WHERE PosteID = ? AND EmailPostulant = ?";
    connection.query(sql, [posteID, email], (err, results) => {
        if (err) {
            console.error("Erreur lors de la suppression du postulant:", err);
            return res.status(500).send("Erreur lors de la suppression du postulant: " + err.message);
        }
  
        if (results.affectedRows === 0) {
            return res.status(404).send('Aucun postulant trouvée avec cet ID.');
        }
  
        res.status(200).send('postulant supprimée avec succès.');
    });
});
  
  // Display
  app.get('/datapostulants', (req, res) => {
    const sql = 'SELECT * FROM Postulants';
      
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.stack);
            return res.status(500).send('Failed to fetch data');
        }
        res.json(results);
    });
});
//---------------CANDIDATE

// Route pour créer un utilisateur
app.post('/insertUser', (req, res) => {
    const { Firstname, Lastname, email, motdepasse } = req.body;

    const sql = "INSERT INTO Identifiants (FirstNameIdentifiant, LastNameIdentifiant, EmailIdentifiant, MDPIdentifiant) VALUES (?, ?, ?, ?)";
    const values = [Firstname, Lastname, email, motdepasse];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json('Failed to insert data');
        }
        res.status(200).json('Data inserted successfully!');
    });
});

app.post('/addAdmin', (req, res) => {
    const { Firstname, Lastname, email, motdepasse, admin } = req.body;

    const sql = "INSERT INTO Identifiants (FirstNameIdentifiant, LastNameIdentifiant, EmailIdentifiant, MDPIdentifiant, Administrateur) VALUES (?, ?, ?, ?, ?)";
    const values = [Firstname, Lastname, email, motdepasse, admin];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json('Failed to insert data');
        }
        res.status(200).json('Data inserted successfully!');
    });
});

app.put('/updateIdentifiant/:email', async (req, res) => {
    const {email} = req.params;
    const {Firstname, Lastname} = req.body;
  
    const sql = "UPDATE Identifiants SET FirstNameIdentifiant = ?, LastNameIdentifiant = ? WHERE EmailIdentifiant = ?";
    const values = [Firstname, Lastname, email];
  
    try {
        const [results] = await connection.promise().query(sql, values);
        if (results.affectedRows === 0) {
              return res.status(404).send('Entreprise non trouvée.');
        }
        res.status(200).send('Entreprise mise à jour avec succès !');
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'entreprise :', err);
        res.status(500).send('Erreur lors de la mise à jour de l\'entreprise : ' + err.message);
    }
});
  
  
  // Delete
app.delete('/deleteIdentifiant/:email', (req, res) => {
    const {email} = req.params;
  
    const sql = "DELETE FROM Identifiants WHERE EmailIdentifiant = ?";
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Erreur lors de la suppression du Identifiant:", err);
            return res.status(500).send("Erreur lors de la suppression du Identifiant: " + err.message);
        }
  
        if (results.affectedRows === 0) {
            return res.status(404).send('Aucun Identifiant trouvée avec cet ID.');
        }
  
        res.status(200).send('Identifiant supprimée avec succès.');
    });
});
  
  // Display
  app.get('/dataIdentifiants', (req, res) => {
    const sql = 'SELECT * FROM Identifiants';
      
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.stack);
            return res.status(500).send('Failed to fetch data');
        }
        res.json(results);
    });
});

const supersecretkey = "waousupersecretouquoila"

app.post('/loginuser', async (req, res) => {
    const { email, motdepasse } = req.body;
  
    const sql = "SELECT EmailIdentifiant, Administrateur FROM Identifiants WHERE EmailIdentifiant = ? AND MDPIdentifiant = ?";
    const values = [email, motdepasse];
  
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error creating token', err);
            return res.status(500);
        }
        const token = jwt.sign({ email: result[0].EmailIdentifiant, admin: result[0].Administrateur}, supersecretkey, {expiresIn: '1h',});
            res.status(200).json({token});
    });
  });

app.get('/dashboard', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Not authenticated');
  }
  const decoded = jwt.decode(token, supersecretkey);
  const email = decoded.email;
  console.log(email)
  connection.query("SELECT FirstNameIdentifiant, LastNameIdentifiant, EmailIdentifiant, Administrateur FROM Identifiants WHERE EmailIdentifiant = ?", [email], (err, result) => {
    if (err) {
        console.error('Error logging with token', err);
        return res.status(500);
    }
    console.log(result)
    res.json(result);
  })
});

app.post('/logincompany', async (req, res) => {
    const { email, motdepasse } = req.body;
  
    const sql = "SELECT NomEntrepriseID, Localisation FROM Entreprises WHERE Contact = ? AND MDPEntreprise = ?";
    const values = [email, motdepasse];
  
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error creating token', err);
            return res.status(500);
        }
        const token = jwt.sign({ nomentrepriseid: result[0].NomEntrepriseID, localisation: result[0].Localisation}, supersecretkey, {expiresIn: '1h',});
            res.status(200).json({token});
    });
  });

app.get('/dashboardcompany', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Not authenticated');
  }
  const decoded = jwt.decode(token, supersecretkey);
  const nom = decoded.nomentrepriseid;
  const loca = decoded.localisation
  connection.query("SELECT NomEntrepriseID, Localisation, Contact, Descriptif FROM Entreprises WHERE NomEntrepriseID = ? AND Localisation = ?", [nom, loca], (err, result) => {
    if (err) {
        console.error('Error logging with token', err);
        return res.status(500);
    }
    res.json(result);
  })
});

app.post('/data-post-postulants',(req, res) =>{
    const {NomEntrepriseID, Localisation} = req.body;
    const query = `
    SELECT 
        Postes.PosteID,  
        Postes.NomPoste,
        Postulants.*
    FROM Postes 
    JOIN Postulants ON Postes.PosteID = Postulants.PosteID
    WHERE NomEntrepriseID = ? AND Localisation = ?;
    `;
    connection.query(query, [NomEntrepriseID, Localisation], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message); 
            return res.status(500).send('Error fetching data from database');
        }
        console.log(results)
        res.json(results);
    });
})

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'index.html'));
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});