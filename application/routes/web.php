<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReportMail;



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
    // routes/web.php
    Route::get('/report-count', [ReportController::class, 'reportCount']);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
