<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body { margin:0; padding:0; background-color:#faf7f2; font-family:Arial, sans-serif; color:#2b2b2b; }
  .wrapper { max-width:600px; margin:0 auto; padding:40px 24px; }
  .card { background-color:#ffffff; border-radius:12px; overflow:hidden; }
  .header { padding:32px; text-align:center; border-bottom:1px solid #e6e6e6; }
  h1 { font-family: Georgia, serif; font-size:26px; font-weight:600; margin:0 0 8px; }
  .order-number { font-size:13px; color:#999999; margin:0; }
  .content { padding:32px; }
  p { font-size:14px; line-height:1.6; color:#555555; margin:0 0 16px; }
  table { width:100%; border-collapse:collapse; }
  td { padding:12px 0; border-bottom:1px solid #f0f0f0; font-size:14px; vertical-align:top; }
  .item-name { color:#141414; font-weight:500; }
  .item-meta { color:#999999; font-size:12px; margin-top:2px; }
  .item-total { text-align:right; color:#141414; white-space:nowrap; }
  .summary-row td { border-bottom:none; padding:6px 0; font-size:13px; color:#555555; }
  .summary-total td { border-top:1px solid #e6e6e6; padding-top:12px; font-size:16px; font-weight:600; color:#141414; }
  .address { font-size:13px; color:#555555; line-height:1.6; }
  .btn { display:inline-block; background-color:#ff6bb3; color:#ffffff; text-decoration:none;
         padding:14px 32px; border-radius:30px; font-size:14px; font-weight:600; }
  .footer { text-align:center; font-size:12px; color:#999999; margin-top:32px; }
</style></head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>Thank you for your order</h1>
        <p class="order-number">Order {{ $order->order_number }} · {{ $order->created_at->format('M j, Y') }}</p>
      </div>

      <div class="content">
        <p>Hi {{ $order->customer_name ?? optional($order->user)->name ?? 'there' }}, we've received your order and it's being processed. Here's a summary:</p>

        <table>
          @foreach ($order->items as $item)
            <tr>
              <td>
                <div class="item-name">{{ $item->product_name }}</div>
                <div class="item-meta">
                  {{ collect([$item->size, $item->color])->filter()->implode(' / ') ?: '—' }} · Qty {{ $item->quantity }}
                </div>
              </td>
              <td class="item-total">₵{{ number_format($item->price * $item->quantity, 2) }}</td>
            </tr>
          @endforeach
        </table>

        <table style="margin-top:16px;">
          <tr class="summary-row">
            <td>Subtotal</td>
            <td class="item-total">₵{{ number_format($order->subtotal, 2) }}</td>
          </tr>
          @if ($order->discount_amount > 0)
            <tr class="summary-row">
              <td>Discount</td>
              <td class="item-total">-₵{{ number_format($order->discount_amount, 2) }}</td>
            </tr>
          @endif
          <tr class="summary-row">
            <td>Delivery</td>
            <td class="item-total">{{ $order->shipping_fee > 0 ? '₵' . number_format($order->shipping_fee, 2) : 'Free' }}</td>
          </tr>
          <tr class="summary-total">
            <td>Total</td>
            <td class="item-total">₵{{ number_format($order->total, 2) }}</td>
          </tr>
        </table>

        @if ($order->shippingAddress)
          <p style="margin-top:24px; margin-bottom:8px; font-weight:600; color:#141414;">Delivery Address</p>
          <p class="address">
            {{ $order->shippingAddress->line1 }}<br>
            @if ($order->shippingAddress->line2){{ $order->shippingAddress->line2 }}<br>@endif
            {{ collect([$order->shippingAddress->city, $order->shippingAddress->region, $order->shippingAddress->postal_code])->filter()->implode(', ') }}<br>
            {{ $order->shippingAddress->country }}
          </p>
        @endif

        <div style="text-align:center; margin-top:32px;">
          <a href="{{ url('/account/orders/' . $order->order_number) }}" class="btn">View Order</a>
        </div>
      </div>
    </div>
    <p class="footer">&copy; {{ date('Y') }} CuteBloom. All rights reserved.</p>
  </div>
</body>
</html>