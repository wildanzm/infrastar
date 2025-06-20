<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $reports = Report::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->with('user:id,name')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}
