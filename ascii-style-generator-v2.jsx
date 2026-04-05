import { useState, useCallback } from "react";

const repeat = (ch, n) => (n > 0 ? ch.repeat(n) : "");

const CHAR_SETS = {
  "╔ Double": { tl:"╔",tr:"╗",bl:"╚",br:"╝",h:"═",v:"║",x:"╬",td:"╦",tu:"╩",tr2:"╠",tl2:"╣",fill:"░",dot:"▀",sq:"▄" },
  "┌ Single": { tl:"┌",tr:"┐",bl:"└",br:"┘",h:"─",v:"│",x:"┼",td:"┬",tu:"┴",tr2:"├",tl2:"┤",fill:"·",dot:"▪",sq:"▫" },
  "┏ Heavy":  { tl:"┏",tr:"┓",bl:"┗",br:"┛",h:"━",v:"┃",x:"╋",td:"┳",tu:"┻",tr2:"┣",tl2:"┫",fill:"▒",dot:"◆",sq:"◇" },
  "╭ Round":  { tl:"╭",tr:"╮",bl:"╰",br:"╯",h:"─",v:"│",x:"┼",td:"┬",tu:"┴",tr2:"├",tl2:"┤",fill:"∘",dot:"●",sq:"○" },
  "▛ Block":  { tl:"▛",tr:"▜",bl:"▙",br:"▟",h:"▀",v:"█",x:"█",td:"▄",tu:"▀",tr2:"▌",tl2:"▐",fill:"▓",dot:"■",sq:"□" },
  "+ Retro":  { tl:"+",tr:"+",bl:"+",br:"+",h:"=",v:"|",x:"+",td:"+",tu:"+",tr2:"+",tl2:"+",fill:"-",dot:"*",sq:"~" },
};

const DESIGNS = [
  {
    id:"shadow_box", name:"Shadow Box", cat:"Banner",
    render:(t,s)=>{
      const w=t.length+4;
      return [s.tl+repeat(s.h,w)+s.tr, s.v+"  "+t+"  "+s.v, s.bl+repeat(s.h,w)+s.br, " "+repeat(s.h,w+2)].join("\n");
    }
  },
  {
    id:"filled_box", name:"Filled Box", cat:"Banner",
    render:(t,s)=>{
      const w=t.length+4;
      return [s.tl+repeat(s.h,w)+s.tr, s.v+repeat(s.fill,w)+s.v, s.v+"  "+t+"  "+s.v, s.v+repeat(s.fill,w)+s.v, s.bl+repeat(s.h,w)+s.br].join("\n");
    }
  },
  {
    id:"neon_sign", name:"Neon Sign", cat:"Banner",
    render:(t,s)=>{
      const inner=" "+s.dot+" "+t+" "+s.dot+" ";
      const w=inner.length;
      return [s.tl+repeat(s.h,w)+s.tr, s.tr2+inner+s.tl2, s.bl+repeat(s.h,w)+s.br].join("\n");
    }
  },
  {
    id:"terminal", name:"Terminal Prompt", cat:"Banner",
    render:(t,s)=>{
      const cmd=t.toLowerCase().replace(/ /g,"_");
      const w=Math.max(t.length+12, cmd.length+12);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+"  "+s.dot+" "+s.dot+" "+s.dot+"  "+t.padEnd(w-9)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+("  $ run "+cmd).padEnd(w)+ s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"version_tag", name:"Version Badge", cat:"Banner",
    render:(t,s)=>{
      const w=t.length+4;
      return [
        s.tl+repeat(s.h,w)+s.td+repeat(s.h,6)+s.tr,
        s.v+"  "+t+"  "+s.v+" v2.0 "+s.v,
        s.tr2+repeat(s.h,w)+s.x+repeat(s.h,6)+s.tl2,
        s.v+repeat(s.fill,w)+s.v+repeat(s.fill,6)+s.v,
        s.bl+repeat(s.h,w)+s.tu+repeat(s.h,6)+s.br,
      ].join("\n");
    }
  },
  {
    id:"cyber_panel", name:"Cyber Panel", cat:"Banner",
    render:(t,s)=>{
      const w=t.length+8;
      return [
        s.tl+repeat(s.h,3)+" "+t+" "+repeat(s.h,3)+s.tr,
        s.v+repeat(s.fill,w)+s.v,
        s.tr2+repeat(s.h,3)+" STATUS: ACTIVE "+repeat(s.h,Math.max(1,w-17))+s.tl2,
        s.v+("  "+s.dot+" Online  "+s.dot+" Deployed").padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"marquee", name:"Marquee Frame", cat:"Banner",
    render:(t,s)=>{
      const label="  ★  "+t+"  ★  ";
      const w=label.length;
      return [
        repeat(s.dot,w+2),
        s.v+label+s.v,
        repeat(s.sq,w+2),
        s.v+label+s.v,
        repeat(s.dot,w+2),
      ].join("\n");
    }
  },
  {
    id:"split_title", name:"Split Title", cat:"Banner",
    render:(t,s)=>{
      const half=Math.floor(t.length/2);
      const a=t.slice(0,half), b=t.slice(half);
      const w=Math.max(a.length,b.length)+6;
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+" "+s.fill+" "+a.padEnd(w-3)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+" "+s.fill+" "+b.padEnd(w-3)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"file_header", name:"File Header", cat:"Code",
    render:(t,s)=>{
      const w=Math.max(t.length+4,36);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(" "+t).padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+" Author  : Moe Kyaw Aung".padEnd(w)+s.v,
        s.v+" GitHub  : @Moekyawaung-mk".padEnd(w)+s.v,
        s.v+" Lang    : Kotlin / Compose".padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"section_block", name:"Section Label", cat:"Code",
    render:(t,s)=>{
      const label=" "+t.toUpperCase()+" ";
      const side=6;
      const w=label.length+side*2;
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+repeat(s.fill,side)+label+repeat(s.fill,side)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"todo_block", name:"TODO Notes", cat:"Code",
    render:(t,s)=>{
      const w=Math.max(t.length+4,34);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(" "+s.dot+" "+t).padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+" TODO  "+repeat(s.fill,2)+" Fix null check".padEnd(w-8)+s.v,
        s.v+" NOTE  "+repeat(s.fill,2)+" Refactor later".padEnd(w-8)+s.v,
        s.v+" HACK  "+repeat(s.fill,2)+" Temp workaround".padEnd(w-8)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"arch_diagram", name:"Architecture", cat:"Code",
    render:(t,s)=>{
      const w=44;
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(" "+t+" Architecture").padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+"  UI Layer (Jetpack Compose)".padEnd(w)+s.v,
        s.v+("     "+s.v).padEnd(w)+s.v,
        s.v+"  ViewModel (MVVM)".padEnd(w)+s.v,
        s.v+("     "+s.v).padEnd(w)+s.v,
        s.v+"  Repository / Domain".padEnd(w)+s.v,
        s.v+("     "+s.v).padEnd(w)+s.v,
        s.v+"  Data (Firebase / REST API)".padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"readme_hero", name:"README Hero", cat:"README",
    render:(t,s)=>{
      const w=Math.max(t.length+6,48);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+repeat(s.fill,w)+s.v,
        s.v+("   "+s.dot+" "+t+" "+s.dot).padEnd(w)+s.v,
        s.v+repeat(s.fill,w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+("  Kotlin "+s.dot+" Jetpack Compose "+s.dot+" Firebase").padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+"  မြန်မာ Android Developer".padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"badge_row", name:"Badge Row", cat:"README",
    render:(t,s)=>{
      const badge=(label,val)=>
        s.tl+repeat(s.h,label.length+2)+s.td+repeat(s.h,val.length+2)+s.tr+"\n"+
        s.v+" "+label+" "+s.v+" "+val+" "+s.v+"\n"+
        s.bl+repeat(s.h,label.length+2)+s.tu+repeat(s.h,val.length+2)+s.br;
      return ["// "+t+" — Badges", badge("LANG","Kotlin"), badge("UI","Compose"), badge("ARCH","MVVM"), badge("API","Claude")].join("\n");
    }
  },
  {
    id:"changelog", name:"Changelog", cat:"README",
    render:(t,s)=>{
      const w=Math.max(t.length+4,40);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(" CHANGELOG — "+t).padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+(" v2.0  "+s.dot+" Feature: dark mode").padEnd(w)+s.v,
        s.v+(" v1.5  "+s.dot+" Fix: memory leak").padEnd(w)+s.v,
        s.v+(" v1.0  "+s.dot+" Initial release").padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"feature_list", name:"Feature List", cat:"README",
    render:(t,s)=>{
      const w=Math.max(t.length+4,38);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(" FEATURES — "+t).padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+(" "+s.dot+" Dark / Light theme").padEnd(w)+s.v,
        s.v+(" "+s.dot+" Offline support").padEnd(w)+s.v,
        s.v+(" "+s.dot+" 8 language support").padEnd(w)+s.v,
        s.v+(" "+s.dot+" Claude AI powered").padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"divider_labeled", name:"Labeled Divider", cat:"Divider",
    render:(t,s)=>{
      const label=" "+t+" ";
      const side=10;
      return [
        s.tr2+repeat(s.h,side)+label+repeat(s.h,side)+s.tl2,
        repeat(s.h,side*2+label.length+2),
        s.tr2+repeat(s.fill,side*2+label.length)+s.tl2,
      ].join("\n");
    }
  },
  {
    id:"divider_bold", name:"Bold Divider", cat:"Divider",
    render:(t,s)=>{
      const w=t.length+20;
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(repeat(s.fill,4)+" "+t.toUpperCase()+" "+repeat(s.fill,w-t.length-7))+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"divider_dots", name:"Dot Divider", cat:"Divider",
    render:(t,s)=>{
      const n=6;
      return [
        repeat(s.dot,n)+" "+t+" "+repeat(s.dot,n),
        repeat(s.fill,n*2+t.length+2),
        repeat(s.sq,n)+" "+t.toLowerCase()+" "+repeat(s.sq,n),
      ].join("\n");
    }
  },
  {
    id:"pipeline", name:"Pipeline Steps", cat:"Divider",
    render:(t,s)=>{
      const steps=["BUILD","TEST","LINT","DEPLOY"];
      return steps.map((step,i)=>
        s.tl+repeat(s.h,8)+s.tr+(i<steps.length-1?" →":"") + "\n" +
        s.v+" "+step.padEnd(6)+" "+s.v + "\n" +
        s.bl+repeat(s.h,8)+s.br
      ).join("\n");
    }
  },
  {
    id:"kyaw_signature", name:"မိုး Signature", cat:"Special",
    render:(t,s)=>{
      const w=Math.max(t.length+4,42);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+" မိုးကျော်အောင် "+s.dot+" Moe Kyaw Aung".padEnd(w-16)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+(" "+t).padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+" Senior Android Dev "+s.dot+" Microsoft".padEnd(w-21)+s.v,
        s.v+(" Tachileik, Myanmar "+repeat(s.fill,w-21)).slice(0,w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"matrix_rain", name:"Matrix Rain", cat:"Special",
    render:(t,s)=>{
      const w=t.length+8;
      const rain=("01မြန်မာ10မိုး01").padEnd(w,"01").slice(0,w);
      return [
        rain,
        s.tl+repeat(s.h,w)+s.tr,
        s.v+"  "+t+"  "+s.v,
        s.bl+repeat(s.h,w)+s.br,
        rain.split("").reverse().join(""),
      ].join("\n");
    }
  },
  {
    id:"hacker_box", name:"Hacker Terminal", cat:"Special",
    render:(t,s)=>{
      const w=Math.max(t.length+6,38);
      return [
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(" [SYS] "+t).padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+" > Initializing...".padEnd(w)+s.v,
        s.v+(" > Loading modules "+repeat(s.dot,3)).padEnd(w)+s.v,
        s.v+(" > Status: "+repeat(s.fill,4)+" ONLINE "+repeat(s.fill,4)).padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"bagan_temple", name:"Bagan တိုက်", cat:"Special",
    render:(t,s)=>{
      const w=Math.max(t.length+4,38);
      return [
        "          "+s.dot,
        "        "+s.dot+s.dot+s.dot,
        "      "+s.dot+s.dot+s.dot+s.dot+s.dot,
        s.tl+repeat(s.h,w)+s.tr,
        s.v+(" "+s.dot+" "+t+" "+s.dot).padEnd(w)+s.v,
        s.tr2+repeat(s.h,w)+s.tl2,
        s.v+" Myanmar "+s.fill+" Android "+s.fill+" 2024".padEnd(w)+s.v,
        s.bl+repeat(s.h,w)+s.br,
      ].join("\n");
    }
  },
  {
    id:"cyberpunk_id", name:"Cyberpunk ID", cat:"Special",
    render:(t,s)=>{
      const w=Math.max(t.length+6,42);
      return [
        s.tl+repeat(s.h,3)+" ID:CARD "+repeat(s.h,w-12)+s.tr,
        s.v+repeat(s.fill,w)+s.v,
        s.v+("  NAME  : "+t).padEnd(w)+s.v,
        s.v+("  ROLE  : Android Developer").padEnd(w)+s.v,
        s.v+("  CORP  : Microsoft").padEnd(w)+s.v,
        s.v+("  LOC   : Tachileik, MMR").padEnd(w)+s.v,
        s.v+repeat(s.fill,w)+s.v,
        s.bl+repeat(s.h,3)+" VERIFIED "+repeat(s.h,w-13)+s.br,
      ].join("\n");
    }
  },
];

const CATEGORIES = ["All","Banner","Code","README","Divider","Special"];
const CAT_COLORS = { Banner:"#4455ee", Code:"#22aa66", README:"#cc7733", Divider:"#9944cc", Special:"#cc2255" };

export default function AsciiV2() {
  const [text, setText]       = useState("MoekyawAung");
  const [charSet, setCharSet] = useState("╔ Double");
  const [category, setCat]    = useState("All");
  const [copied, setCopied]   = useState(null);

  const s = CHAR_SETS[charSet];

  const copy = useCallback((content, id) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  }, []);

  const filtered = category === "All" ? DESIGNS : DESIGNS.filter(d => d.cat === category);

  return (
    <div style={{ minHeight:"100vh", background:"#07070f", color:"#c0c0e0", fontFamily:"'Courier New',Consolas,monospace" }}>

      {/* ── HEADER ── */}
      <div style={{ background:"linear-gradient(90deg,#0c0c20,#121230)", borderBottom:"1px solid #1e1e40", padding:"18px 24px" }}>
        <div style={{ fontSize:10, color:"#33336a", letterSpacing:4, marginBottom:4 }}>▓▓ ASCII ART STUDIO v2 ▓▓</div>
        <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ fontSize:20, color:"#6666ff", fontWeight:"bold" }}>╬ {DESIGNS.length} Designs</div>

          <input
            value={text}
            onChange={e => setText(e.target.value || " ")}
            maxLength={28}
            placeholder="Project name..."
            style={{ flex:1, minWidth:160, background:"#0f0f22", border:"1px solid #2a2a50", borderRadius:4, color:"#a0a0ff", padding:"8px 12px", fontSize:14, fontFamily:"inherit", outline:"none" }}
          />

          {/* Char Set */}
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {Object.keys(CHAR_SETS).map(name => (
              <button key={name} onClick={() => setCharSet(name)} style={{
                background: charSet===name ? "#1c1c44" : "transparent",
                border: `1px solid ${charSet===name ? "#5555cc" : "#1e1e40"}`,
                borderRadius:4, color: charSet===name ? "#9999ff" : "#3a3a6a",
                padding:"5px 10px", fontSize:12, cursor:"pointer", fontFamily:"inherit",
              }}>{name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div style={{ background:"#0a0a18", borderBottom:"1px solid #181838", padding:"10px 24px", display:"flex", gap:6, flexWrap:"wrap" }}>
        {CATEGORIES.map(cat => {
          const c = CAT_COLORS[cat] || "#5555cc";
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCat(cat)} style={{
              background: active ? c+"22" : "transparent",
              border: `1px solid ${active ? c : "#181838"}`,
              borderRadius:20, color: active ? c : "#303055",
              padding:"4px 14px", fontSize:11, letterSpacing:1, cursor:"pointer", fontFamily:"inherit",
            }}>
              {cat}
              {cat!=="All" && <span style={{ marginLeft:5, opacity:.45 }}>{DESIGNS.filter(d=>d.cat===cat).length}</span>}
            </button>
          );
        })}
        <span style={{ marginLeft:"auto", fontSize:11, color:"#252545", alignSelf:"center" }}>
          {filtered.length} designs shown
        </span>
      </div>

      {/* ── GRID ── */}
      <div style={{ padding:"18px 24px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:12, maxWidth:1200, margin:"0 auto" }}>
        {filtered.map(design => {
          const content = design.render(text, s);
          const c = CAT_COLORS[design.cat] || "#6666cc";
          const isCopied = copied === design.id;
          return (
            <div key={design.id} style={{
              background:"#0b0b1c", border:`1px solid ${isCopied ? c : "#181838"}`,
              borderRadius:6, overflow:"hidden", transition:"border-color .2s, box-shadow .2s",
              boxShadow: isCopied ? `0 0 14px ${c}44` : "none",
            }}>
              <div style={{ background:"#0f0f22", borderBottom:"1px solid #181838", padding:"7px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ background:c+"1a", border:`1px solid ${c}44`, borderRadius:3, color:c, fontSize:9, letterSpacing:1, padding:"2px 7px" }}>
                    {design.cat.toUpperCase()}
                  </span>
                  <span style={{ color:"#5050aa", fontSize:12 }}>{design.name}</span>
                </div>
                <button onClick={() => copy(content, design.id)} style={{
                  background: isCopied ? c+"33" : "transparent",
                  border:`1px solid ${isCopied ? c : "#222244"}`,
                  borderRadius:3, color: isCopied ? c : "#383870",
                  padding:"3px 10px", fontSize:10, cursor:"pointer", fontFamily:"inherit", letterSpacing:1, transition:"all .15s",
                }}>{isCopied ? "✓ COPIED" : "COPY"}</button>
              </div>

              <pre style={{ margin:0, padding:"14px 16px", fontSize:12, lineHeight:1.65, color:"#5858aa", overflowX:"auto", whiteSpace:"pre", minHeight:70 }}>
                {content}
              </pre>
            </div>
          );
        })}
      </div>

      {/* ── CHAR PALETTE ── */}
      <div style={{ margin:"4px 24px 32px", maxWidth:1152, marginLeft:"auto", marginRight:"auto", background:"#0a0a1a", border:"1px solid #181838", borderRadius:6, padding:"14px 20px" }}>
        <div style={{ fontSize:10, color:"#282848", letterSpacing:3, marginBottom:10 }}>╠══ CHARACTER PALETTE</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 28px" }}>
          {[
            ["Double Box","╔╗╚╝║═╬╠╣╦╩"],
            ["Single Box","┌┐└┘│─┼├┤┬┴"],
            ["Heavy Box","┏┓┗┛┃━╋┣┫┳┻"],
            ["Round Box","╭╮╰╯│─"],
            ["Blocks","░▒▓█▀▄▌▐▙▜▛▟"],
            ["Shapes","■□●○◆◇★☆♦♠"],
            ["Arrows","→←↑↓↗↘↙↖↔↕"],
            ["Special","✦✧◈◉⊕⊗∞≡≈⬡"],
            ["Myanmar","မြန်မာ မိုး ████"],
          ].map(([label,chars]) => (
            <div key={label}>
              <div style={{ fontSize:9, color:"#252548", letterSpacing:2, marginBottom:2 }}>{label}</div>
              <span style={{ fontSize:15, color:"#404088", letterSpacing:3, cursor:"pointer", userSelect:"all" }} title="Click to select">{chars}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
