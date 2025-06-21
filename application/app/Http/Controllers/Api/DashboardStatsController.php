<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardStatsController extends Controller
{
    public function __invoke()
    {
        try {
            $dbDriver = DB::connection()->getDriverName();
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();

            $newReportsThisWeek = Report::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
            $resolvedReportsThisWeek = Report::where('status', 'resolved')
                ->whereBetween('updated_at', [$startOfWeek, $endOfWeek])
                ->count();
            $inProgressReports = Report::where('status', 'in-progress')->count();

            $topLocations = Report::select(
                DB::raw("latitude || ', ' || longitude as location"),
                DB::raw('count(*) as total')
            )
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->groupBy('location')
                ->orderByDesc('total')
                ->limit(3)
                ->get();

            $resolvedReportsForTime = Report::where('status', 'resolved')->select('created_at', 'updated_at')->get();
            $totalHours = 0;
            if ($resolvedReportsForTime->isNotEmpty()) {
                foreach ($resolvedReportsForTime as $report) {
                    $createdAt = Carbon::parse($report->created_at);
                    $updatedAt = Carbon::parse($report->updated_at);
                    $totalHours += $createdAt->diffInHours($updatedAt);
                }
                $averageResponseTime = $resolvedReportsForTime->count() > 0 ? $totalHours / $resolvedReportsForTime->count() : 0;
            } else {
                $averageResponseTime = 0;
            }

            $monthFormat = $dbDriver === 'mysql' ? 'DATE_FORMAT(created_at, "%b")' : 'strftime("%b", created_at)';
            $reportsPerMonth = Report::select(
                DB::raw($monthFormat . ' as name'),
                DB::raw('count(*) as total')
            )
                ->where('created_at', '>=', Carbon::now()->subYear())
                ->groupBy('name')
                ->orderByRaw('MIN(created_at)')
                ->get();

            $recentReports = Report::with('user:id,name') 
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($report) {
                    $priority = 'Rendah';
                    if ($report->urgency_score > 75) {
                        $priority = 'Tinggi';
                    } elseif ($report->urgency_score > 40) {
                        $priority = 'Sedang';
                    }

                    return [
                        'id' => $report->id,
                        'title' => $report->damage_type ?? 'Laporan Tanpa Judul',
                        'location' => $report->latitude . ', ' . $report->longitude, // Lokasi daerahnya
                        'status' => $report->status, // Statusnya
                        'created_at' => $report->created_at->toIso8601String(),
                        'user' => $report->user, // Nama pelapor ada di dalam objek user
                        'priority' => $priority, // Prioritasnya
                    ];
                });

            return response()->json([
                'stats' => [
                    'newThisWeek' => $newReportsThisWeek,
                    'resolvedThisWeek' => $resolvedReportsThisWeek,
                    'inProgress' => $inProgressReports,
                    'avgResponseTime' => round($averageResponseTime, 1),
                ],
                'topLocations' => $topLocations,
                'chartData' => $reportsPerMonth,
                'recentReports' => $recentReports,
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard Stats Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal memuat statistik dashboard.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
