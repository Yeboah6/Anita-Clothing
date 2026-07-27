<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body { margin:0; padding:0; background-color:#faf7f2; font-family:Arial, sans-serif; color:#2b2b2b; }
  .wrapper { max-width:560px; margin:0 auto; padding:40px 24px; }
  .card { background-color:#ffffff; border-radius:12px; overflow:hidden; text-align:center; }
  .card img { width:100%; height:auto; display:block; }
  .content { padding:32px; }
  h1 { font-family: Georgia, serif; font-size:26px; font-weight:600; margin:0 0 8px; }
  .price { font-size:16px; color:#ff6bb3; font-weight:600; margin:0 0 16px; }
  p { font-size:15px; line-height:1.6; color:#555555; margin:0 0 24px; }
  .btn { display:inline-block; background-color:#ff6bb3; color:#ffffff; text-decoration:none;
         padding:14px 32px; border-radius:30px; font-size:14px; font-weight:600; }
  .footer { text-align:center; font-size:12px; color:#999999; margin-top:32px; }
  .footer a { color:#999999; }
</style></head>
<body>
  <div class="wrapper">
    <div class="card">
      @if($image)
        <img src="{{ $image }}" alt="{{ $product->name }}">
      @endif
      <div class="content">
        <h1>{{ $product->name }}</h1>
        <p class="price">₵{{ number_format($product->price, 2) }}</p>
        <p>{{ \Illuminate\Support\Str::limit($product->description, 140) }}</p>
        <a href="{{ url('/product/' . $product->slug) }}" class="btn">Shop Now</a>
      </div>
    </div>
    <p class="footer">
      &copy; {{ date('Y') }} CuteBloom. All rights reserved.<br>
      <a href="{{ $unsubscribeUrl }}">Unsubscribe</a> at any time.
    </p>
  </div>
</body>
</html>