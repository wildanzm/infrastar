<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Report;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReportMail;
use App\Notifications\ReportSubmitted;
use Illuminate\Support\Facades\Notification;

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

        // Ambil jumlah laporan di lokasi yang sama
        $reportCount = Report::where('latitude', $request->latitude)
            ->where('longitude', $request->longitude)
            ->count();

        // Panggil service prediksi AI
        $predictionResponse = Http::post('http://localhost:5000/predict', [
            'image_base64' => $base64Image,
            'num_similar_reports' => $reportCount,
        ]);

        if ($predictionResponse->failed() || !$predictionResponse->json('success')) {
            return back()->withErrors(['prediction' => 'Failed to get prediction from AI model.']);
        }

        $prediction = $predictionResponse->json('prediction_results');

        $report = Report::create([
            'user_id' => Auth::id(),
            'image' => $imagePath,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'damage_type' => $prediction['classification_result'],
            'severity_score' => $prediction['Keparahan_Numerik'],
            'urgency_score' => $prediction['urgency_prediction'],
            'status' => 'pending',
        ]);

        // Optional: Kirim email notifikasi
        try {
            $user = Auth::user();
            Mail::to($user->email)->send(new ReportMail($report));
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email: ' . $e->getMessage());
        }

        return redirect()->route('dashboard')->with('success', 'Report submitted successfully.');
    }
}
