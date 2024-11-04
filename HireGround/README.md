# HireGround - Job Board Platform

## Project Owners

- **Bellinna Uong**
- **Guillaume Parisel**

## Description

**HireGround** is a job board platform that allows users to browse and apply for job offers, while recruiters can create and manage their listings. This project aims to simplify job hunting with a search engine based on keywords and locations. Administrators have access to a dedicated dashboard for managing users and offers.

## Features

- **Homepage**: Introduction to the site and features.
- **Job Listings Page**: Displays all available job offers with a search bar for keywords and location filtering.
- **Application Form**: Allows users to apply directly for job offers.
- **Authentication**: Users can log in or create an account.
- **Admin Interface**: Administrators can manage job offers and users.
- **Job Posting Form**: Companies can create new job offers.
- **Contact Form**: Allows users to contact the site creators.
- **Profile Page**: Accessible to both users and companies to manage their information.
- **FAQ Page**: A section for frequently asked questions.
- **About Page**: Provides details about the site, the creators, and the project goals.
- **Legal Pages**: Compliance with legal requirements and usage policies.

## Technologies

- **HTML**: Structure of the site.
- **JavaScript**: Dynamic site functionality.
- **CSS**: Design and layout.
- **Node.js**: Backend server and request handling.
- **SQL**: Database to store.
- **Docker**: Containerization for easy deployment and environment management.

## Setup and Workflow
Each team member created their own branch to develop their respective features. Once the feature was complete, we pushed it to GitHub and merged it into the main branch. After each merge, we would pull the latest changes and create new branches to avoid conflicts and ensure smooth collaboration.

### Steps to Clone and Run the Project
1. Clone this repository:  
   `git clone https://github.com/yourusername/hireground-jobboard.git`
   
2. Navigate into the project directory:  
   `cd hireground-jobboard`
   
3. Run the Docker setup to launch the application (ensure Docker is installed):
   ```bash
   docker-compose up
