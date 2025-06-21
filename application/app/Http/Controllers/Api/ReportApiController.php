<?php

namespace App\Http\Controllers\Api;

use App\Models\Report;
use App\Models\Comments;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReportApiController extends Controller
{
    public function index()
    {
        return response()->json([
            'reports' => Report::with('user')
                ->orderByDesc('urgency_score')
                ->orderByDesc('created_at')
                ->get(),

            'comments' => Comments::with(['user', 'report'])->get(),
        ]);
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
