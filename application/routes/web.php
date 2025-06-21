<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReportMail;
use App\Http\Controllers\UserReportController;



Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports');
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/report-form', function () {
        return Inertia::render('form');
    })->name('reports.create');
    Route::post('/report-form', [ReportController::class, 'storeWithPrediction'])->name('reports.store');
    Route::get('/report-count', [ReportController::class, 'reportCount'])->name('report.count');
});

Route::get('/laporan', [UserReportController::class, 'index'])
    ->middleware(['auth', 'verified']) 
    ->name('laporan.index'); 


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
