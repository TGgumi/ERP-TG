// src/ui.jsx — componentes UI compartidos entre todos los módulos
import { TC } from "./datos";

export const ck = (k) => ({
  background: `var(--color-background-${k})`,
  color:      `var(--color-text-${k})`,
  border:     `0.5px solid var(--color-border-${k})`,
});

export function Dot({ top, sz = 9 }) {
  return (
    <span style={{
      display:"inline-block", width:sz, height:sz, borderRadius:"50%",
      background:TC[top]||"#888", marginRight:4, verticalAlign:"middle", flexShrink:0,
    }}/>
  );
}

export function Bdg({ t }) {
  if (!t) return <span style={{ ...ck("secondary"), display:"inline-flex", padding:"2px 7px", borderRadius:4, fontSize:10.5, fontWeight:500 }}>—</span>;
  const l = t.toLowerCase();
  let k = "secondary";
  if (/activa|operativa|completada|cerrada|ok|pass/.test(l))              k = "success";
  else if (/urgente|mayor|nok|fail|abierto|vence hoy|stock bajo/.test(l)) k = "danger";
  else if (/mantenimiento|pendiente|8d|próximo|proceso|inhabilitada/.test(l)) k = "warning";
  else if (/en curso|expedición|control final|enviada/.test(l))           k = "info";
  return (
    <span style={{ ...ck(k), display:"inline-flex", padding:"2px 7px", borderRadius:4, fontSize:10.5, fontWeight:500, whiteSpace:"nowrap" }}>
      {t}
    </span>
  );
}

export function Al({ type = "b", children }) {
  const m = { b:"info", g:"success", w:"warning", r:"danger" };
  const k = m[type] || "info";
  return (
    <div style={{ ...ck(k), padding:"9px 13px", borderRadius:7, fontSize:11.5, borderLeft:`3px solid var(--color-border-${k})` }}>
      {children}
    </div>
  );
}

export function Kpi({ l, v, s, c }) {
  return (
    <div style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, padding:"11px 14px" }}>
      <div style={{ fontSize:10, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:".05em", fontWeight:500, marginBottom:4 }}>{l}</div>
      <div style={{ fontSize:22, fontWeight:500, color:c||"var(--color-text-primary)" }}>{v}</div>
      {s && <div style={{ fontSize:10, color:"var(--color-text-secondary)", marginTop:3 }}>{s}</div>}
    </div>
  );
}

export function KRow({ items }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(108px,1fr))", gap:10 }}>
      {items.map(p => <Kpi key={p.l} {...p} />)}
    </div>
  );
}

export function Card({ title, right, children }) {
  return (
    <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:10, overflow:"hidden" }}>
      {title && (
        <div style={{ padding:"9px 14px", borderBottom:"0.5px solid var(--color-border-tertiary)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, fontWeight:500 }}>{title}</span>
          {right}
        </div>
      )}
      <div style={{ overflowX:"auto" }}>{children}</div>
    </div>
  );
}

export function Tbl({ cols, rows }) {
  return (
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11.5 }}>
      <thead>
        <tr>
          {cols.map((c,i) => (
            <th key={i} style={{ textAlign:"left", padding:"6px 10px", fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:".04em", color:"var(--color-text-secondary)", borderBottom:"0.5px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)", whiteSpace:"nowrap" }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r,i) => (
          <tr key={i}>
            {r.map((cell,j) => (
              <td key={j} style={{ padding:"7px 10px", borderBottom:"0.5px solid var(--color-border-tertiary)", verticalAlign:"middle" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Tabs({ items, cur, onChange }) {
  return (
    <div style={{ display:"flex", gap:3, background:"var(--color-background-secondary)", borderRadius:8, padding:3, flexWrap:"wrap" }}>
      {items.map(([k,l]) => (
        <div key={k} onClick={() => onChange(k)} style={{
          padding:"5px 13px", cursor:"pointer", fontSize:11.5, borderRadius:6, whiteSpace:"nowrap",
          fontWeight: cur===k ? 500 : 400,
          background: cur===k ? "var(--color-background-primary)" : "transparent",
          color:      cur===k ? "var(--color-text-primary)"       : "var(--color-text-secondary)",
          border:     cur===k ? "0.5px solid var(--color-border-tertiary)" : "0.5px solid transparent",
        }}>
          {l}
        </div>
      ))}
    </div>
  );
}

export function PBox({ l, v, u }) {
  return (
    <div style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:7, padding:"8px 10px", textAlign:"center" }}>
      <div style={{ fontSize:20, fontWeight:500, fontFamily:"monospace", color:"var(--color-text-info)", lineHeight:1 }}>{v}</div>
      <div style={{ fontSize:9.5, color:"var(--color-text-secondary)", marginTop:3, textTransform:"uppercase", letterSpacing:".04em" }}>
        {l}{u ? ` (${u})` : ""}
      </div>
    </div>
  );
}
