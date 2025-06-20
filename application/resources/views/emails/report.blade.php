<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Konfirmasi Laporan</title>
</head>

<body>
    <h2>Halo {{ $report->user->name }},</h2>
    <p>Laporan kamu sudah kami terima. Ini detailnya:</p>
    <ul>
        <li>Jenis kerusakan: {{ $report->damage_type }}</li>
        <li>Lokasi: {{ $report->latitude }}, {{ $report->longitude }}</li>
        <li>Severity: {{ $report->severity_score }}</li>
        <li>Urgency: {{ $report->urgency_score }}</li>
    </ul>
    <p>Terima kasih ya udah bantuin laporan ini! 💪</p>
</body>

</html>
