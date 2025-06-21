<?php

namespace App\Http\Controllers;

use App\Models\Report; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserReportController extends Controller
{
   public function index() {
    return Inertia::render('Laporan/Index');
   }
}