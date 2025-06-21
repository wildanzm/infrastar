<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReportApiController;
use App\Http\Controllers\Api\DashboardStatsController;

Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/dashboard-stats', DashboardStatsController::class);


Route::get('/reports', [ReportApiController::class, 'index']);
Route::put('/reports/{id}/status', [ReportApiController::class, 'updateStatus']);
