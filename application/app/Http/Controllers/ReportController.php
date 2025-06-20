<?php

namespace App\Http\Controllers;

<<<<<<< HEAD
=======
use App\Models\User;
>>>>>>> c64694edc4af174e8dd30f03fb2a80668e57de81
use Inertia\Inertia;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
<<<<<<< HEAD
use Illuminate\Support\Facades\Http;

class ReportController extends Controller
{
    public function create()
    {
        return Inertia::render('form');
    }

    public function reportCount(Request $request)
    {
        $lat = $request->query('latitude');
        $lng = $request->query('longitude');

        $count = Report::where('latitude', $lat)
            ->where('longitude', $lng)
            ->count();

        return response()->json(['count' => $count]);
    }
=======
use App\Notifications\ReportSubmitted;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Mail; // <-- 1. Import fasad Mail
use App\Mail\ReportMail;               // <-- 2. Import Mailable baru Anda

class ReportController extends Controller
{
    // ... metode create() dan reportCount() tidak berubah ...
>>>>>>> c64694edc4af174e8dd30f03fb2a80668e57de81

    public function store(Request $request)
    {
        // Validasi untuk form manual atau jika frontend yang mengirim data prediksi
        $request->validate([
            'image' => 'nullable|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'damage_type' => 'required|string',
            'severity_score' => 'required|integer|min:0|max:100',
            'urgency_score' => 'required|integer|min:1|max:100',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reports', 'public');
        }

<<<<<<< HEAD
        Report::create([
            'user_id' => Auth::id(),
=======
        $user = Auth::user();

        $report = Report::create([
            'user_id' => $user->id,
>>>>>>> c64694edc4af174e8dd30f03fb2a80668e57de81
            'image' => $imagePath,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'damage_type' => $request->damage_type,
            'severity_score' => $request->severity_score,
            'urgency_score' => $request->urgency_score,
            'status' => 'pending',
        ]);

        // --- MENGIRIM NOTIFIKASI ---

        // Mengirim email konfirmasi ke pengguna secara eksplisit ke alamat emailnya
        try {
            Mail::to($user->email)->send(new ReportMail($report));
        } catch (\Exception $e) {
            Log::error('Gagal kirim email: ' . $e->getMessage());
        }



        return redirect()->route('home')->with('success', 'Report submitted successfully. A confirmation email has been sent.');

    }

    /**
     * Store a new report by getting a prediction from the ML service first.
     * This is an alternative approach where the backend communicates with the ML service.
     */
    public function storeWithPrediction(Request $request)
    {
        $request->validate([
            'image' => 'required|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $imagePath = $request->file('image')->store('reports', 'public');
        $base64Image = base64_encode(file_get_contents($request->file('image')->getRealPath()));

        // Get report count for the location
        $reportCountResponse = $this->reportCount($request);
        $reportCount = json_decode($reportCountResponse->getContent(), true)['count'];

        // Call the prediction service
        $predictionResponse = Http::post('http://localhost:5000/predict', [
            'image_base64' => $base64Image,
            'num_similar_reports' => $reportCount,
        ]);

        if ($predictionResponse->failed() || !$predictionResponse->json('success')) {
            return back()->withErrors(['prediction' => 'Failed to get prediction from AI model.']);
        }

        $prediction = $predictionResponse->json('prediction_results');

        Report::create([
            'user_id' => Auth::id(),
            'image' => $imagePath,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'damage_type' => $prediction['classification_result'],
            'severity_score' => $prediction['Keparahan_Numerik'],
            'urgency_score' => $prediction['urgency_prediction'],
            'status' => 'pending',
        ]);

        return redirect()->route('dashboard')->with('success', 'Report submitted successfully.');
    }
}