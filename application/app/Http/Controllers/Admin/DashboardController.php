<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $newReportsThisWeek = Report::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
        $resolvedReportsThisWeek = Report::where('status', 'resolved')
            ->whereBetween('updated_at', [$startOfWeek, $endOfWeek])
            ->count();
        $inProgressReportsThisWeek = Report::where('status', 'in-progress')->count();

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

        return Inertia::render('admin.dashboard', [
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
