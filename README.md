# Infrastar: Infrastructure Damage Reporting and Management Platform

A comprehensive platform for reporting and managing infrastructure damage, powered by a Laravel & React stack with an integrated Machine Learning model for damage assessment.

## About The Project

Infrastar is a comprehensive web application designed to facilitate the reporting and management of infrastructure damage. It empowers citizens to report issues like potholes and damaged bridges, while providing an administrative dashboard for authorities to efficiently track, manage, and analyze these reports. The platform leverages a Machine Learning model to automatically classify the type of damage and predict an urgency score, helping to prioritize repairs.

## Key Features

* **User Authentication**: Secure user registration and login system with role-based access control (Admin & User).
* **Damage Reporting System**: Users can easily submit reports including descriptions, photos, and precise geolocations via an interactive map.
* **Admin Dashboard**: A comprehensive dashboard for administrators to view, manage, and update the status of reports.
* **Interactive Map View**: All reports are visualized on a map, allowing for a geographical overview of infrastructure issues.
* **Machine Learning Powered Analysis**:
    * **Image Classification**: Automatically identifies the type of infrastructure (e.g., road, bridge) from the uploaded image.
    * **Urgency Prediction**: A regression model calculates an urgency score based on the severity of the damage and the number of similar reports in the area.
* **Email Notifications**: Users receive email confirmations upon successful report submission.

## Tech Stack

The project is divided into two main parts: the web application and the machine learning API.

**1. Web Application (Application Folder)**

* **Backend**:
    * PHP 8.2+
    * Laravel 12
    * Spatie Laravel Permission (for roles & permissions)
    * Inertia.js
* **Frontend**:
    * React 19
    * Vite
    * Tailwind CSS
    * shadcn/ui (for UI components)
    * Leaflet.js (for interactive maps)

**2. Machine Learning API (Machine-Learning Folder)**

* **Framework**: Flask
* **ML Libraries**:
    * TensorFlow (Keras) for image classification.
    * Scikit-learn & Joblib for the urgency prediction model.
* **Language**: Python

## Project Structure

The repository is organized into two main directories:

```
.
├── application/         # Contains the main Laravel + React web application
│   ├── app/             # Laravel core (Controllers, Models, etc.)
│   ├── config/          # Configuration files
│   ├── database/        # Migrations and seeders
│   ├── resources/
│   │   ├── js/          # React source code (Pages, Components, Layouts)
│   │   └── views/       # Blade templates
│   ├── routes/          # API and Web routes
│   └── ...
│
├── machine-learning/    # Contains the Python-based ML API and models
│   ├── dataset/         # Datasets for training
│   ├── model1.ipynb     # Jupyter Notebook for the image classification model
│   ├── model2.ipynb     # Jupyter Notebook for the urgency regression model
│   ├── model1.h5        # Saved Keras model for classification
│   ├── model2.joblib    # Saved Joblib model for urgency prediction
│   └── apiml.py         # Flask API to serve the models
└── ...
```

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

* PHP >= 8.2
* Composer
* Node.js & npm
* Python 3.x
* A database server (e.g., MySQL, PostgreSQL, or SQLite)

### 1. Web Application Setup

1.  **Navigate to the application directory:**
    ```sh
    cd application
    ```

2.  **Install PHP dependencies:**
    ```sh
    composer install
    ```

3.  **Create and configure your environment file:**
    ```sh
    cp .env.example .env
    ```
    *Update your database credentials and other settings in the `.env` file.*

4.  **Generate an application key:**
    ```sh
    php artisan key:generate
    ```

5.  **Run database migrations and seeders:**
    *This will create the necessary tables and populate the admin/user roles.*
    ```sh
    php artisan migrate --seed
    ```

6.  **Install and build frontend dependencies:**
    ```sh
    npm install && npm run build
    ```

7.  **Run the development server:**
    *This command will start the Vite server for the frontend and the PHP development server for the backend.*
    ```sh
    npm run dev
    ```

### 2. Machine Learning API Setup

The ML API runs on a separate Flask server.

1.  **Navigate to the machine-learning directory:**
    ```sh
    cd machine-learning
    ```

2.  **It is highly recommended to use a virtual environment:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install Python dependencies:**
    *(You may need to create a `requirements.txt` file from the imported libraries in `apiml.py` and `*.ipynb` files, such as Flask, TensorFlow, Scikit-learn, pandas, numpy, Pillow).*
    ```sh
    pip install Flask Flask-Cors tensorflow scikit-learn pandas numpy Pillow joblib
    ```

4.  **Run the Flask API server:**
    ```sh
    python apiml.py
    ```
    The API will be available at `http://localhost:5000`.

## API Endpoints

The core API endpoints are defined in `routes/api.php` and served by the Laravel application.

* `GET /api/dashboard-stats`: Retrieves statistics for the admin dashboard.
* `GET /api/reports`: Fetches all reports for the admin view.
* `PUT /api/reports/{id}/status`: Updates the status of a specific report.

The Machine Learning prediction endpoint is served by the Flask API:

* `POST /predict`: Receives an image and other data to return a classification and urgency score.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

This project uses GitHub Actions for continuous integration.
* **Linting**: Code style is enforced using `prettier` and `eslint` for the frontend. Please run `npm run format` and `npm run lint` before committing.
* **Testing**: Backend tests are run using Pest (PHPUnit). Please ensure all tests are passing.
