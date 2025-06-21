<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserReportController extends Controller
{
   public function index()
   {
      $userId = Auth::id();

      $reports = Report::where('user_id', $userId)
         ->latest()
         ->paginate(10);

      $reports->getCollection()->transform(function ($report) {
         $statusMap = [
            'pending' => 'Tertunda',
            'in-progress' => 'Dalam Proses',
            'resolved' => 'Selesai',
         ];

         return [
            'id' => $report->id,
            'title' => $report->damage_type ?? 'Laporan Kerusakan',
            'location' => $report->latitude . ', ' . $report->longitude,
            'status' => $statusMap[$report->status] ?? 'Tertunda',
            'created_at' => $report->created_at->toIso8601String(),
         ];
      });

      return Inertia::render('Laporan/Index', [
         'reports' => $reports,
      ]);
   }
}
