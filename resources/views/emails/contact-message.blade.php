<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; color: #141414; background-color: #faf7f2; margin: 0; padding: 0; }
        .wrapper { max-width: 560px; margin: 0 auto; padding: 2rem 1.5rem; }
        .card { background: #ffffff; border: 1px solid #e6e6e6; border-radius: 4px; padding: 1.5rem; }
        .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #737373; margin: 0 0 0.25rem; }
        .value { font-size: 0.9375rem; margin: 0 0 1.25rem; }
        .message { white-space: pre-wrap; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <p class="label">From</p>
            <p class="value">{{ $submission['name'] }} &lt;{{ $submission['email'] }}&gt;</p>

            <p class="label">Subject</p>
            <p class="value">{{ $submission['subject'] }}</p>

            <p class="label">Message</p>
            <p class="value message">{{ $submission['message'] }}</p>
        </div>
    </div>
</body>
</html>