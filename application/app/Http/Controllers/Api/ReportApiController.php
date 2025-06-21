<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportApiController extends Controller
{
    public function index()
    {
        return response()->json(
            Report::with('user')
                ->orderByDesc('urgency_score')
                ->orderByDesc('created_at')
                ->get()
        );
    }


    public function updateStatus($id, Request $request)
    {
        try {
            $report = Report::findOrFail($id);
            $request->validate([
                'status' => 'required|in:Menunggu,Dalam Proses,Selesai',
            ]);
            $report->status = $request->status;
            $report->save();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
