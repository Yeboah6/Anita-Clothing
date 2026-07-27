<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #faf7f2;
    font-family: 'Inter', Arial, sans-serif;
    color: #2b2b2b;
  }
  .wrapper {
    max-width: 560px;
    margin: 0 auto;
    padding: 40px 24px;
  }
  .card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 40px 32px;
    text-align: center;
  }
  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 32px;
    font-weight: 600;
    color: #2b2b2b;
    margin: 0 0 8px;
  }
  p {
    font-size: 15px;
    line-height: 1.6;
    color: #555555;
    margin: 0 0 24px;
  }
  .btn {
    display: inline-block;
    background-color: #ff6bb3;
    color: #ffffff;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .footer {
    text-align: center;
    font-size: 12px;
    color: #999999;
    margin-top: 32px;
  }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <h1>Welcome, {{ $user->name }}</h1>
      <p>
        Thanks for creating an account with CuteBloom. Your account is
        ready — start browsing new arrivals and building your wishlist.
      </p>
      <a href="{{ url('/collections') }}" class="btn">Start Shopping</a>
    </div>
    <p class="footer">&copy; {{ date('Y') }} CuteBloom. All rights reserved.</p>
  </div>
</body>
</html>