// Target path: resources/js/Pages/Admin/PaymentReport.jsx

import { useEffect, useState, useRef } from "react";
import { router, Link } from "@inertiajs/react";

const tokens = {
  cream: "#faf7f2",
  white: "#ffffff",
  ink: "#2b2320",
  inkSoft: "#6f6560",
  border: "#e8e1d8",
  pink: "#ff6bb3",
  pinkSoft: "#ffe3f0",
  green: "#3fa66b",
  greenSoft: "#e7f6ed",
  red: "#e2543d",
  redSoft: "#fbe6e2",
  amber: "#d99a2b",
  amberSoft: "#faf0dd",
  displayFont: "'Cormorant Garamond', serif",
  bodyFont: "'Inter', sans-serif",
};

const STATUS_STYLES = {
  completed: { bg: tokens.greenSoft, fg: tokens.green },
  pending: { bg: tokens.amberSoft, fg: tokens.amber },
  failed: { bg: tokens.redSoft, fg: tokens.red },
  refunded: { bg: "#eee7fb", fg: "#7a5cc4" },
};

function currency(n) {
  const value = Number(n || 0);
  return "₵" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { bg: "#eee", fg: "#555" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
        textTransform: "capitalize",
        background: style.bg,
        color: style.fg,
        fontFamily: tokens.bodyFont,
      }}
    >
      {status}
    </span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: tokens.white,
        border: `1px solid ${tokens.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        flex: "1 1 180px",
        minWidth: 180,
      }}
    >
      <div
        style={{
          fontFamily: tokens.bodyFont,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: tokens.inkSoft,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: tokens.displayFont,
          fontSize: 30,
          fontWeight: 600,
          color: accent || tokens.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function RevenueChart({ data }) {
  const width = 720;
  const height = 220;
  const padding = 36;

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tokens.inkSoft,
          fontFamily: tokens.bodyFont,
          fontSize: 14,
        }}
      >
        No revenue in this range yet.
      </div>
    );
  }

  const totals = data.map((d) => Number(d.total));
  const maxVal = Math.max(...totals, 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (Number(d.total) / maxVal) * (height - padding * 2);
    return [x, y];
  });

  const linePath = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${height - padding} L${points[0][0]},${
    height - padding
  } Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tokens.pink} stopOpacity="0.28" />
          <stop offset="100%" stopColor={tokens.pink} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke={tokens.border}
        strokeWidth="1"
      />
      <path d={areaPath} fill="url(#revenueFill)" />
      <path d={linePath} fill="none" stroke={tokens.pink} strokeWidth="2.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={tokens.pink} />
      ))}
      {data.map((d, i) => {
        if (data.length > 10 && i % Math.ceil(data.length / 8) !== 0) return null;
        const x = padding + i * stepX;
        return (
          <text
            key={d.date}
            x={x}
            y={height - padding + 18}
            fontSize="10"
            fill={tokens.inkSoft}
            fontFamily={tokens.bodyFont}
            textAnchor="middle"
          >
            {d.date.slice(5)}
          </text>
        );
      })}
    </svg>
  );
}

function MethodBreakdown({ data }) {
  const maxTotal = Math.max(...data.map((d) => Number(d.total)), 1);

  if (!data || data.length === 0) {
    return (
      <div style={{ color: tokens.inkSoft, fontFamily: tokens.bodyFont, fontSize: 14 }}>
        No transactions in this range.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((row) => (
        <div key={row.method}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: tokens.bodyFont,
              fontSize: 13,
              color: tokens.ink,
              marginBottom: 4,
              textTransform: "capitalize",
            }}
          >
            <span>{row.method}</span>
            <span style={{ color: tokens.inkSoft }}>
              {row.count} · {currency(row.total)}
            </span>
          </div>
          <div style={{ background: tokens.pinkSoft, borderRadius: 999, height: 8, overflow: "hidden" }}>
            <div
              style={{
                width: `${(Number(row.total) / maxTotal) * 100}%`,
                background: tokens.pink,
                height: "100%",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: "relative", fontFamily: tokens.bodyFont }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 14px",
          borderRadius: 10,
          border: `1px solid ${tokens.border}`,
          background: tokens.white,
          fontSize: 13,
          color: tokens.ink,
          cursor: "pointer",
        }}
      >
        <span style={{ color: tokens.inkSoft }}>{label}:</span>
        <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{current?.label}</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: tokens.white,
            border: `1px solid ${tokens.border}`,
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
            zIndex: 20,
            minWidth: 160,
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                padding: "9px 14px",
                fontSize: 13,
                cursor: "pointer",
                textTransform: "capitalize",
                background: opt.value === value ? tokens.pinkSoft : "transparent",
                color: opt.value === value ? tokens.pink : tokens.ink,
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = "#f5f1ea";
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = "transparent";
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PaymentReport({ transactions, summary, revenueOverTime, methodBreakdown, statusBreakdown, filters }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [localFilters, setLocalFilters] = useState(filters);

  const applyFilters = (next) => {
    const merged = { ...localFilters, ...next };
    setLocalFilters(merged);
    router.get(route("admin.payments.index"), merged, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const exportUrl = route("admin.payments.export", localFilters);

  const methodOptions = [
    { value: "all", label: "All methods" },
    ...(methodBreakdown || []).map((m) => ({ value: m.method, label: m.method })),
  ];

  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  return (
    <div style={{ background: tokens.cream, minHeight: "100vh", padding: "36px 40px", fontFamily: tokens.bodyFont }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: tokens.displayFont, fontSize: 34, fontWeight: 700, color: tokens.ink, margin: 0 }}>
            Payment Reports
          </h1>
          <p style={{ color: tokens.inkSoft, fontSize: 14, marginTop: 6 }}>
            Track revenue, transactions, and payment health across your store.
          </p>
        </div>
        <a
          href={exportUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 20px",
            borderRadius: 10,
            background: tokens.pink,
            color: tokens.white,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Export CSV
        </a>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          background: tokens.white,
          border: `1px solid ${tokens.border}`,
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: tokens.inkSoft }}>From</label>
          <input
            type="date"
            value={localFilters.date_from}
            onChange={(e) => applyFilters({ date_from: e.target.value })}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${tokens.border}`,
              fontSize: 13,
              fontFamily: tokens.bodyFont,
              color: tokens.ink,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: tokens.inkSoft }}>To</label>
          <input
            type="date"
            value={localFilters.date_to}
            onChange={(e) => applyFilters({ date_to: e.target.value })}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${tokens.border}`,
              fontSize: 13,
              fontFamily: tokens.bodyFont,
              color: tokens.ink,
            }}
          />
        </div>
        <Dropdown
          label="Status"
          value={localFilters.status}
          options={statusOptions}
          onChange={(value) => applyFilters({ status: value })}
        />
        <Dropdown
          label="Method"
          value={localFilters.method}
          options={methodOptions}
          onChange={(value) => applyFilters({ method: value })}
        />
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={currency(summary.total_revenue)} accent={tokens.pink} />
        <StatCard label="Transactions" value={summary.total_transactions} />
        <StatCard label="Avg. Transaction" value={currency(summary.avg_transaction)} />
        <StatCard label="Refunded" value={currency(summary.refunded_amount)} accent={tokens.red} />
        <StatCard label="Failed" value={summary.failed_count} accent={tokens.amber} />
      </div>

      {/* Chart + breakdown */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
        <div
          style={{
            flex: "2 1 420px",
            background: tokens.white,
            border: `1px solid ${tokens.border}`,
            borderRadius: 14,
            padding: 22,
          }}
        >
          <h3 style={{ fontFamily: tokens.displayFont, fontSize: 20, margin: "0 0 14px", color: tokens.ink }}>
            Revenue Over Time
          </h3>
          <RevenueChart data={revenueOverTime} />
        </div>
        <div
          style={{
            flex: "1 1 260px",
            background: tokens.white,
            border: `1px solid ${tokens.border}`,
            borderRadius: 14,
            padding: 22,
          }}
        >
          <h3 style={{ fontFamily: tokens.displayFont, fontSize: 20, margin: "0 0 14px", color: tokens.ink }}>
            By Payment Method
          </h3>
          <MethodBreakdown data={methodBreakdown} />
        </div>
      </div>

      {/* Transactions table */}
      <div
        style={{
          background: tokens.white,
          border: `1px solid ${tokens.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${tokens.border}` }}>
          <h3 style={{ fontFamily: tokens.displayFont, fontSize: 20, margin: 0, color: tokens.ink }}>Transactions</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: tokens.cream }}>
              {["Transaction", "Customer", "Amount", "Method", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 22px",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    color: tokens.inkSoft,
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "28px 22px", textAlign: "center", color: tokens.inkSoft, fontSize: 14 }}>
                  No transactions match these filters.
                </td>
              </tr>
            )}
            {transactions.data.map((tx) => (
              <tr key={tx.id} style={{ borderTop: `1px solid ${tokens.border}` }}>
                <td style={{ padding: "14px 22px", fontSize: 13, color: tokens.ink }}>{tx.transaction_id}</td>
                <td style={{ padding: "14px 22px", fontSize: 13, color: tokens.ink }}>
                  {tx.user ? `${tx.user.first_name} ${tx.user.last_name}` : "Guest"}
                </td>
                <td style={{ padding: "14px 22px", fontSize: 13, color: tokens.ink, fontWeight: 600 }}>
                  {currency(tx.amount)}
                </td>
                <td style={{ padding: "14px 22px", fontSize: 13, color: tokens.ink, textTransform: "capitalize" }}>
                  {tx.method}
                </td>
                <td style={{ padding: "14px 22px" }}>
                  <StatusBadge status={tx.status} />
                </td>
                <td style={{ padding: "14px 22px", fontSize: 13, color: tokens.inkSoft }}>
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {transactions.links && transactions.links.length > 3 && (
          <div style={{ display: "flex", gap: 6, padding: "16px 22px", flexWrap: "wrap" }}>
            {transactions.links.map((link, i) => (
              <Link
                key={i}
                href={link.url || "#"}
                preserveScroll
                preserveState
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  textDecoration: "none",
                  background: link.active ? tokens.pink : "transparent",
                  color: link.active ? tokens.white : link.url ? tokens.ink : tokens.inkSoft,
                  border: `1px solid ${link.active ? tokens.pink : tokens.border}`,
                  pointerEvents: link.url ? "auto" : "none",
                  opacity: link.url ? 1 : 0.5,
                }}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}