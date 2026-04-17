// src/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) { return { error }; }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary:${this.props.nombre}]`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:48, gap:14, minHeight:300,
          background:"var(--color-background-secondary)",
          border:"0.5px solid var(--color-border-danger)", borderRadius:12 }}>
          <div style={{ fontSize:36 }}>⚠</div>
          <div style={{ fontSize:15, fontWeight:600, color:"var(--color-text-danger)" }}>
            {this.props.nombre || "Módulo"} no disponible
          </div>
          <div style={{ fontSize:12, color:"var(--color-text-secondary)", maxWidth:360, textAlign:"center", lineHeight:1.5 }}>
            {this.state.error.message}<br/>
            El resto del ERP sigue funcionando con normalidad.
          </div>
          <button onClick={() => this.setState({ error: null })} style={{
            background:"var(--color-background-info)", color:"var(--color-text-info)",
            border:"0.5px solid var(--color-border-info)",
            padding:"7px 18px", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:600,
          }}>
            ↺ Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
