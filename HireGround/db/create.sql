CREATE DATABASE IF NOT EXISTS HGdb;
USE HGdb;

CREATE TABLE IF NOT EXISTS Entreprises (
    NomEntrepriseID varchar(255) NOT NULL,
    Localisation varchar(255) NOT NULL,
    Contact varchar(255) NOT NULL,
    Descriptif varchar(255) NOT NULL,
    MDPEntreprise varchar (255) NOT NULL,
    PRIMARY KEY (NomEntrepriseID, Localisation)
);

CREATE TABLE IF NOT EXISTS Postes (
    PosteID int NOT NULL AUTO_INCREMENT,
    NomPoste varchar(255) NOT NULL,
    Profil varchar(255) NOT NULL,
    Mission varchar(255) NOT NULL,
    Salaire varchar(255) NOT NULL,
    Secteur varchar(255) NOT NULL,
    Contrat varchar(255) NOT NULL,
    NomEntrepriseID varchar(255),
    Localisation varchar(255),
    PRIMARY KEY (PosteID),
    FOREIGN KEY (NomEntrepriseID, Localisation) REFERENCES Entreprises(NomEntrepriseID, Localisation) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Postulants (
    FirstNamePostulant varchar(255) NOT NULL,
    LastNamePostulant varchar(255) NOT NULL,
    EmailPostulant varchar(255) NOT NULL,
    Lettre varchar(255) NOT NULL,
    PosteID int,
    FOREIGN KEY (PosteID) REFERENCES Postes(PosteID) ON DELETE CASCADE,
    PRIMARY KEY (PosteID, EmailPostulant)
);

CREATE TABLE IF NOT EXISTS Identifiants (
    FirstNameIdentifiant varchar(255) NOT NULL,
    LastNameIdentifiant varchar(255) NOT NULL,
    MDPIdentifiant varchar (255) NOT NULL,
    EmailIdentifiant varchar (255) NOT NULL,
    Administrateur boolean NOT NULL DEFAULT false,
    PRIMARY KEY (EmailIdentifiant)
)