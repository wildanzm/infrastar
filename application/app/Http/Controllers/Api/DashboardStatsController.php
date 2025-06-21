<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardStatsController extends Controller
{
    public function __invoke()
    {
        // Semua logika query tetap sama persis
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $newReportsThisWeek = Report::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
        $resolvedReportsThisWeek = Report::where('status', 'resolved')
            ->whereBetween('updated_at', [$startOfWeek, $endOfWeek])
            ->count();
        $inProgressReportsThisWeek = Report::where('status', 'in-progress')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->count();

        $topLocations = Report::select('location', DB::raw('count(*) as total'))
            ->groupBy('location')
            ->orderByDesc('total')
            ->limit(3)
            ->get();

        $averageResponseTime = Report::where('status', 'resolved')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_hours')
            ->value('avg_hours');

        $reportsPerMonth = Report::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(fn($item) => [
                'name' => Carbon::createFromFormat('Y-m', $item->month)->format('M'),
                'total' => $item->total,
            ]);

        $recentReports = Report::with('user:id,name')
            ->latest()
            ->limit(5)
            ->get();

        // **PERUBAHAN UTAMA DI SINI**
        // Alih-alih `Inertia::render`, kita gunakan `response()->json()`
        // Strukturnya kita buat sama persis agar mudah di-handle di frontend
        return response()->json([
            'stats' => [
                'newThisWeek' => $newReportsThisWeek,
                'resolvedThisWeek' => $resolvedReportsThisWeek,
                'inProgress' => $inProgressReportsThisWeek,
                'avgResponseTime' => round($averageResponseTime, 1) ?? 0,
            ],
            'topLocations' => $topLocations,
            'chartData' => $reportsPerMonth,
            'recentReports' => $recentReports,
        ]);
    }
}
