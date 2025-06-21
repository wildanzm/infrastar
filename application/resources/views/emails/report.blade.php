<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Terima Kasih atas Laporan Anda</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f2f5;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
            overflow: hidden;
        }

        .header {
            background-color: #0d6efd;
            color: #ffffff;
            padding: 24px;
            text-align: center;
        }

        .content {
            padding: 32px;
            text-align: start;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
        }

        .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 16px;
            font-size: 13px;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>Terima Kasih atas Laporan Anda</h2>
        </div>
        <div class="content">
            <p>Halo <strong>{{ $report->user->name }}</strong>,</p>
            <p>Laporan Anda telah berhasil kami terima.</p>
            <p>Kontribusi Anda sangat berarti dalam membantu menjaga dan memperbaiki infrastruktur yang kita gunakan
                bersama.</p>
            <p>Bersama, kita membangun lingkungan yang lebih baik.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Sistem Pelaporan Infrastruktur <br>
            <em>Dibuat oleh rakyat, untuk rakyat.</em>
        </div>
    </div>
</body>

</html>
