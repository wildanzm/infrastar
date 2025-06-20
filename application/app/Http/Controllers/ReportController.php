<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ReportSubmitted;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Mail; // <-- 1. Import fasad Mail
use App\Mail\ReportMail;               // <-- 2. Import Mailable baru Anda

class ReportController extends Controller
{
    // ... metode create() dan reportCount() tidak berubah ...

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'damage_type' => 'required|string',
            'severity_score' => 'required|integer|min:1|max:10',
            'urgency_score' => 'required|integer|min:1|max:10',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reports', 'public');
        }

        $user = Auth::user();

        $report = Report::create([
            'user_id' => $user->id,
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
}
