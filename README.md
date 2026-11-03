<div align="center">

# InfraStar

**Smart Infrastructure Reporting & AI-Driven Prioritization System**

<!-- Frontend -->
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

<!-- Backend -->
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Composer](https://img.shields.io/badge/Composer-2.x-885630?style=for-the-badge&logo=composer&logoColor=white)

<!-- Machine Learning -->
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Keras](https://img.shields.io/badge/Keras-D00000?style=for-the-badge&logo=keras&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)

<!-- Meta -->
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

InfraStar is a public infrastructure reporting and management platform. Citizens report damaged public facilities (such as potholes and broken bridges) with a photo and a map location. The system classifies the damage automatically with a computer-vision model and computes an **Urgency Score** (1–100) so that maintenance authorities can prioritize repairs.


---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Retraining the Models](#retraining-the-models)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

| Feature | Description |
|---|---|
| **AI visual classification** | A MobileNetV2-based CNN classifies uploaded photos into damage types (`jalan` = road, `jembatan` = bridge). |
| **Smart urgency score** | A regression model produces a priority score (1–100) from physical severity and the number of similar reports at the same location. |
| **Interactive geo-tagging** | Precise location selection with Leaflet and OpenStreetMap. |
| **Email notifications** | Confirmation and status-update emails sent to the reporter via Laravel Mail. |
| **Role-based access control** | Separate permissions for citizens (reporters) and officers/admins. |
| **Monitoring dashboard** | Admins review, verify, and update report status: *Pending*, *In Progress*, *Completed*. |

---

## Architecture

The system is split into two independently deployable services that communicate over HTTP.

```
 Citizen ──(photo + lat/long)──▶ Web Application
                                 Laravel 12 · React 19 · Inertia.js
                                          │
                       (Base64 image + similar-report count)
                                          ▼
                                 ML Microservice (Flask)
                                 ├─ Model 1: Damage classifier  (MobileNetV2, .h5)
                                 └─ Model 2: Urgency predictor  (scikit-learn, .joblib)
                                          │
                          (classification + urgency score)
                                          ▼
                                 Database + Email dispatch
```

### Components

| Service | Directory | Responsibility |
|---|---|---|
| Web application | `application/` | UI, authentication, authorization, report management, persistence, email |
| ML microservice | `machine-learning/` | Image classification and urgency scoring |

Separating inference from the web tier lets each service be scaled and versioned independently, and keeps heavy ML dependencies (TensorFlow) out of the PHP runtime.

### Data Flow: Submitting a Report

1. A citizen submits a photo and coordinates (latitude/longitude).
2. The web application counts existing reports near the same location (`num_similar_reports`).
3. It sends the Base64-encoded image and the count to `POST /predict`.
4. The ML service decodes the image, runs Model 1 for the damage class and confidence, derives a numeric severity, then runs Model 2 to produce the urgency score.
5. The web application stores the report with its predictions and sends a confirmation email.
6. Officers see reports ordered by urgency and update their status. Each change emails the reporter.

### Urgency Scoring

The score combines **physical severity** (inferred from the image) and **report density** (number of similar reports at the same location). Higher severity and more independent reports both raise the score, so widely reported hazards rise in the queue.

### Report Lifecycle

```
Pending ──▶ In Progress ──▶ Completed
(Menunggu)  (Dalam Proses)   (Selesai)
```

### Design Decisions

| Decision | Rationale | Trade-off |
|---|---|---|
| Inertia.js monolith | One codebase, no API versioning between UI and backend | UI is tightly coupled to Laravel |
| Separate Flask ML service | Isolates TensorFlow, independent scaling | Extra network hop and deployment unit |
| Transfer learning (MobileNetV2) | Good accuracy on small datasets, light inference | Limited to the trained classes |
| Base64 image transport | Simple JSON contract | ~33% payload overhead |

---

## Tech Stack

**Web application (`/application`)**

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 19, Inertia.js v2, TypeScript
- **Styling and UI:** Tailwind CSS v4, Radix UI, Lucide Icons
- **Maps:** Leaflet.js and React-Leaflet
- **Auth:** Laravel Sanctum, Spatie Permission
- **Email:** Laravel Mail (SMTP or `log` driver)

**Machine learning service (`/machine-learning`)**

- **API server:** Flask (Python 3.10+) with Flask-CORS
- **Image classification:** MobileNetV2 transfer learning (`model1.h5`)
- **Urgency regression:** scikit-learn model (`model2.joblib`)
- **Preprocessing:** Pillow, NumPy, Pandas

---

## Repository Structure

```
infrastar/
├── application/              # Laravel + React (Inertia) web application
│   ├── app/                  # Controllers, models, mailables, middleware
│   ├── config/               # Application and service configuration
│   ├── database/             # Migrations and seeders
│   ├── resources/            # React pages, components, styles
│   ├── routes/               # Web, API, auth, and settings routes
│   ├── composer.json         # PHP dependencies
│   └── package.json          # Node.js dependencies
└── machine-learning/         # Flask ML microservice
    ├── apiml.py              # REST API (POST /predict)
    ├── model1.h5             # Damage classification model (CNN)
    ├── model2.joblib         # Urgency prediction model
    ├── class_names.json      # Class labels ("jalan", "jembatan")
    ├── model_1.ipynb         # Training notebook, Model 1
    ├── model_2.ipynb         # Training notebook, Model 2
    └── dataset/              # Training and validation data
```

---

## Getting Started

### Prerequisites

| Tool | Minimum version |
|---|---|
| PHP | 8.2 |
| Composer | 2.x |
| Node.js and npm | 18.x |
| Python and pip | 3.10 |

Start the ML service **first**; the web application depends on it for report analysis.

### 1. Machine Learning Service

```bash
cd machine-learning

# (Recommended) create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install flask flask-cors numpy pandas joblib pillow keras tensorflow scikit-learn

python apiml.py                 # Serves on http://localhost:5000
```

### 2. Web Application

```bash
cd application

composer install
npm install

cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
```

Run the servers in two terminals:

```bash
# Terminal 1
php artisan serve               # http://localhost:8000

# Terminal 2
npm run dev                     # Vite dev server
```

---

## Configuration

### Web application (`application/.env`)

| Variable | Description | Example |
|---|---|---|
| `APP_NAME` | Application name | `InfraStar` |
| `APP_ENV` | Environment | `local` |
| `APP_KEY` | Generated by `php artisan key:generate` | |
| `APP_URL` | Base URL | `http://localhost:8000` |
| `DB_CONNECTION` | Database driver | `sqlite` / `mysql` |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Database credentials (non-SQLite) | |
| `MAIL_MAILER` | `smtp` or `log` | `log` |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP credentials | |
| `MAIL_FROM_ADDRESS` | Sender address | `no-reply@example.com` |

> **Note:** Confirm the exact variable or config key that stores the ML service URL (for example `ML_SERVICE_URL=http://localhost:5000`) in `application/config/` and `.env.example`, and list it here.

With `MAIL_MAILER=log`, emails are written to `storage/logs/laravel.log` instead of being sent.

### ML service

The service listens on port `5000`. These files must be present in `machine-learning/`: `model1.h5`, `model2.joblib`, `class_names.json`.

---

## Usage

1. Open `http://localhost:8000` and sign in or register.
2. **Citizen:** create a report, upload a photo, and pin the location on the map.
3. The application sends the image to the ML service and stores the predicted damage type and urgency score with the report.
4. **Officer/Admin:** open the dashboard, review reports sorted by urgency, and update their status. The reporter is notified by email on each change.

---

## API Reference

The ML service exposes one endpoint. It has no authentication by default, so do not expose it publicly.

**Base URL (local):** `http://localhost:5000`

### `POST /predict`

Classifies an infrastructure damage image and predicts its urgency score.

**Request** (`Content-Type: application/json`)

| Field | Type | Required | Description |
|---|---|---|---|
| `image_base64` | string | Yes | Base64-encoded image. A data-URI prefix (`data:image/jpeg;base64,`) is accepted. |
| `num_similar_reports` | integer | Yes | Number of existing reports at the same location. |

```json
{
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "num_similar_reports": 3
}
```

**Response: `200 OK`**

```json
{
  "success": true,
  "message": "Prediction successful",
  "prediction_results": {
    "classification_result": "jalan",
    "confidence": 98,
    "Keparahan_Numerik": 2,
    "urgency_prediction": 85
  }
}
```

| Field | Type | Description |
|---|---|---|
| `success` | boolean | `true` when the prediction succeeded. |
| `message` | string | Human-readable status. |
| `prediction_results.classification_result` | string | Predicted class: `jalan` (road) or `jembatan` (bridge). |
| `prediction_results.confidence` | number | Classifier confidence (percent). |
| `prediction_results.Keparahan_Numerik` | integer | Numeric severity level derived from the image. |
| `prediction_results.urgency_prediction` | number | Urgency score from 1 to 100. Higher means more urgent. |

**Errors** (recommended convention; verify against `apiml.py`)

| Status | Meaning |
|---|---|
| `400 Bad Request` | Missing or malformed field, or undecodable image |
| `500 Internal Server Error` | Model loading or inference failure |

```json
{ "success": false, "message": "Description of the error" }
```

**Examples**

<details>
<summary>cURL</summary>

```bash
IMG=$(base64 -w0 pothole.jpg)   # macOS: base64 -i pothole.jpg

curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d "{\"image_base64\": \"data:image/jpeg;base64,${IMG}\", \"num_similar_reports\": 3}"
```
</details>

<details>
<summary>Python</summary>

```python
import base64, requests

with open("pothole.jpg", "rb") as f:
    encoded = base64.b64encode(f.read()).decode()

resp = requests.post(
    "http://localhost:5000/predict",
    json={
        "image_base64": f"data:image/jpeg;base64,{encoded}",
        "num_similar_reports": 3,
    },
    timeout=30,
)
resp.raise_for_status()
print(resp.json()["prediction_results"])
```
</details>

<details>
<summary>PHP (Laravel HTTP client)</summary>

```php
use Illuminate\Support\Facades\Http;

$response = Http::timeout(30)->post(config('services.ml.url') . '/predict', [
    'image_base64'        => 'data:image/jpeg;base64,' . base64_encode($contents),
    'num_similar_reports' => $count,
]);

$results = $response->json('prediction_results');
```
</details>

---

## Testing

```bash
# Backend
cd application
php artisan test

# Frontend (if configured in package.json)
npm run types
npm run lint
```

Smoke-test the ML service on its own with the cURL example in the [API Reference](#api-reference).

---

## Retraining the Models

1. Prepare data under `machine-learning/dataset/`.
2. Open `model_1.ipynb` (classifier) or `model_2.ipynb` (urgency predictor).
3. Run all cells and export to `model1.h5` or `model2.joblib`.
4. Update `class_names.json` if the label set changes.
5. Restart the ML service and re-verify `/predict`.

Record the dataset version and evaluation metrics for each retrained model in the [Changelog](#changelog).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Report creation fails or hangs | ML service not running | Start `apiml.py` and check the configured URL |
| `ModuleNotFoundError: tensorflow` | Dependencies missing in the active venv | Re-activate the venv and re-run `pip install` |
| Uploaded images return 404 | Storage link missing | `php artisan storage:link` |
| Blank page or missing assets | Vite not running | `npm run dev` |
| No emails received | `MAIL_MAILER=log` | Read `storage/logs/laravel.log` or configure SMTP |
| CORS errors in the browser | Origin not allowed in Flask-CORS | Adjust the CORS configuration |
| TensorFlow fails to install | Unsupported Python version | Use Python 3.10–3.11 |

---

## License

Released under the [MIT License](LICENSE).
