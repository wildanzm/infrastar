<?php

namespace App\Http\Controllers;


use Inertia\Inertia;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function create()
    {
        return Inertia::render('form');
    }

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

        Report::create([
            'user_id' => Auth::user()->id,
            'image' => $imagePath,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'damage_type' => $request->damage_type,
            'severity_score' => $request->severity_score,
            'urgency_score' => $request->urgency_score,
            'status' => 'pending',
        ]);


        return redirect()->route('dashboard')->with('success', 'Report submitted.');
    }
}
