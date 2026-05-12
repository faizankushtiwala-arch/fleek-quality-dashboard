import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const BP_SIM = {"United Kingdom":{"1":23,"2":47,"3":86,"5":193,"7":312,"10":665,"15":1585,"20":3056,"25":4580,"30":6132},"EU":{"1":177,"2":379,"3":535,"5":912,"7":1434,"10":2258,"15":3322,"20":4316,"25":5391,"30":6488},"United States":{"1":65,"2":176,"3":292,"5":445,"7":609,"10":932,"15":1290,"20":1721,"25":2084,"30":2395},"ROW":{"1":0,"2":0,"3":3,"5":4,"7":5,"10":11,"15":20,"20":31,"25":53,"30":68}};
const SH_SIM  = {"United Kingdom":{"1":6,"2":20,"3":29,"5":40,"7":51,"10":108,"15":213,"20":447,"25":710,"30":1146},"EU":{"1":112,"2":226,"3":302,"5":610,"7":776,"10":1242,"15":2009,"20":2665,"25":3280,"30":3779},"United States":{"1":50,"2":100,"3":168,"5":329,"7":479,"10":631,"15":944,"20":1217,"25":1470,"30":1728},"ROW":{"1":0,"2":2,"3":2,"5":2,"7":4,"10":10,"15":14,"20":19,"25":28,"30":34}};
const SIM_TOTAL = {"United Kingdom":14488,"EU":12008,"United States":4575,"ROW":2298};
const SHIP_COHORT = {"United Kingdom|0-5 kg":{"1":5,"2":13,"3":20,"5":26,"7":31,"10":64,"15":121,"20":238,"25":381,"30":630},"United Kingdom|5-10 kg":{"1":1,"2":6,"3":8,"5":11,"7":14,"10":29,"15":55,"20":115,"25":178,"30":284},"United Kingdom|10-15 kg":{"1":0,"2":0,"3":0,"5":1,"7":2,"10":5,"15":14,"20":33,"25":57,"30":85},"United Kingdom|15-20 kg":{"1":0,"2":1,"3":1,"5":1,"7":2,"10":2,"15":6,"20":20,"25":32,"30":52},"United Kingdom|20-25 kg":{"1":0,"2":0,"3":0,"5":0,"7":0,"10":1,"15":4,"20":8,"25":13,"30":21},"United Kingdom|25-30 kg":{"1":0,"2":0,"3":0,"5":0,"7":1,"10":2,"15":4,"20":9,"25":14,"30":18},"United Kingdom|30+ kg":{"1":0,"2":0,"3":0,"5":1,"7":1,"10":5,"15":9,"20":22,"25":35,"30":56},"EU|0-5 kg":{"1":32,"2":67,"3":81,"5":183,"7":232,"10":385,"15":683,"20":967,"25":1215,"30":1432},"EU|5-10 kg":{"1":22,"2":79,"3":122,"5":277,"7":332,"10":576,"15":899,"20":1142,"25":1371,"30":1553},"EU|10-15 kg":{"1":29,"2":35,"3":41,"5":61,"7":85,"10":106,"15":153,"20":210,"25":260,"30":305},"EU|15-20 kg":{"1":12,"2":18,"3":20,"5":30,"7":47,"10":65,"15":104,"20":135,"25":182,"30":190},"EU|20-25 kg":{"1":4,"2":8,"3":9,"5":14,"7":16,"10":22,"15":49,"20":64,"25":81,"30":101},"EU|25-30 kg":{"1":0,"2":1,"3":2,"5":8,"7":10,"10":11,"15":18,"20":19,"25":21,"30":24},"EU|30+ kg":{"1":13,"2":18,"3":26,"5":37,"7":54,"10":77,"15":101,"20":128,"25":151,"30":174},"United States|0-5 kg":{"1":25,"2":54,"3":103,"5":209,"7":305,"10":397,"15":599,"20":755,"25":910,"30":1064},"United States|5-10 kg":{"1":10,"2":22,"3":34,"5":68,"7":99,"10":132,"15":194,"20":252,"25":305,"30":360},"United States|10-15 kg":{"1":5,"2":5,"3":7,"5":13,"7":21,"10":28,"15":38,"20":52,"25":65,"30":80},"United States|15-20 kg":{"1":3,"2":7,"3":8,"5":12,"7":18,"10":22,"15":33,"20":46,"25":52,"30":59},"United States|20-25 kg":{"1":2,"2":4,"3":5,"5":7,"7":9,"10":12,"15":20,"20":31,"25":38,"30":46},"United States|25-30 kg":{"1":2,"2":3,"3":4,"5":7,"7":9,"10":13,"15":20,"20":28,"25":34,"30":41},"United States|30+ kg":{"1":3,"2":5,"3":7,"5":13,"7":18,"10":27,"15":40,"20":53,"25":65,"30":78},"ROW|0-5 kg":{"1":0,"2":2,"3":2,"5":2,"7":3,"10":5,"15":6,"20":8,"25":12,"30":14},"ROW|5-10 kg":{"1":0,"2":0,"3":0,"5":0,"7":1,"10":3,"15":5,"20":7,"25":10,"30":13},"ROW|10-15 kg":{"1":0,"2":0,"3":0,"5":0,"7":0,"10":2,"15":3,"20":4,"25":6,"30":7}};
const REGIONS=[" United Kingdom","EU","United States","ROW"];
const DISC_STEPS=[1,2,3,5,7,10,15,20,25,30];
const COHORT_ORDER=["0-5 kg","5-10 kg","10-15 kg","15-20 kg","20-25 kg","25-30 kg","30+ kg"];
const SEGS=[{key:"quality",label:"Quality",color:"#F5A623"},{key:"price_relevance",label:"Price + relevance",color:"#4A9EFF"},{key:"rating_relevance",label:"Rating + relevance",color:"#A78BFA"},{key:"rating_price",label:"Rating + price",color:"#34D399"},{key:"price_only",label:"Price only",color:"#60A5FA"},{key:"relevance_only",label:"Relevance only",color:"#C084FC"},{key:"rating_only",label:"Rating only",color:"#6EE7B7"},{key:"none_segment",label:"None",color:"#6B7280"}];
const fmt=v=>Math.round(v).toLocaleString();
const pctStr=(a,b)=>b?(a/b*100).toFixed(1)+"%":"—";
const dodClr=v=>v>0?"#34D399":v<0?"#EF4444":"#6B7280";
const BLACK="#111111",OFF="#F5F4F0",GOLD="#F5A623",MUTED="#9CA3AF",BORDER="#E5E4E0",WHITE="#FFFFFF";

export default function App(){
  const [tab,setTab]=useState("cadence");
  const [region,setRegion]=useState("United Kingdom");
  const [view,setView]=useState("abs");
  const [cdata,setCdata]=useState(null);
  const [loading,setLoading]=useState(true);
  const [bpDisc,setBpDisc]=useState(10);
  const [shDisc,setShDisc]=useState(10);
  const [cohortReg,setCohortReg]=useState("United Kingdom");

  useEffect(()=>{
    fetch("/cadence.json").then(r=>r.json()).then(d=>{setCdata(d);setLoading(false);}).catch(()=>setLoading(false));
  },[]);

  if(loading) return <div style={{background:BLACK,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:GOLD,fontSize:14,fontWeight:700,letterSpacing:".1em"}}>LOADING…</div></div>;

  const regData=cdata?.[region]||[];
  const latest=regData[regData.length-1];
  const prev=regData[regData.length-2];
  const lastUpdated=latest?.date?latest.date.slice(5):"—";
  const simTotal=SIM_TOTAL[region]||0;
  const getBP=d=>BP_SIM[region]?.[String(d)]||0;
  const getSH=d=>SH_SIM[region]?.[String(d)]||0;
  const cohortRows=Object.entries(SHIP_COHORT).filter(([k])=>k.startsWith(cohortReg+"|")).map(([k,v])=>({cohort:k.split("|")[1],val:v[String(shDisc)]||0})).sort((a,b)=>COHORT_ORDER.indexOf(a.cohort)-COHORT_ORDER.indexOf(b.cohort));
  const chartData=regData.map(row=>{const e={date:row.date.slice(5)};SEGS.forEach(s=>{e[s.key]=view==="pct"?+(row[s.key]/row.active*100).toFixed(2):row[s.key];});return e;});
  const bpChart=DISC_STEPS.map(d=>({disc:d+"%",val:getBP(d)}));
  const shChart=DISC_STEPS.map(d=>({disc:d+"%",val:getSH(d)}));
  const selD={background:"#222",color:"#FFF",border:"1px solid #333",borderRadius:6,padding:"5px 10px",fontSize:12,fontWeight:600,cursor:"pointer"};
  const selL={background:OFF,border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",color:"#111"};
  const tabBtn=(t,l)=><button onClick={()=>setTab(t)} style={{background:"none",border:"none",padding:"14px 20px",cursor:"pointer",fontSize:13,fontWeight:600,color:tab===t?WHITE:MUTED,borderBottom:tab===t?`2px solid ${GOLD}`:"2px solid transparent"}}>{l}</button>;

  return(
    <div style={{background:OFF,minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{background:BLACK,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:52}}>
        <div style={{display:"flex",alignItems:"baseline"}}>
          <span style={{fontWeight:800,fontSize:17,color:WHITE}}>FLEEK</span>
          <span style={{fontWeight:800,fontSize:17,color:GOLD}}>QUALITY</span>
          <span style={{color:"#444",margin:"0 10px"}}>|</span>
          <span style={{color:WHITE,fontSize:13,fontWeight:500}}>May 2026 — Listing Quality Plan</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{color:"#34D399",fontSize:11,fontWeight:700,letterSpacing:".05em"}}>DATA THROUGH {lastUpdated}</span>
          <span style={{color:MUTED,fontSize:11,letterSpacing:".04em"}}>MAR 2026 MEDIANS · UPLOAD ≥ OCT 2024</span>
        </div>
      </div>
      <div style={{background:BLACK,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid #222"}}>
        <div style={{display:"flex"}}>{tabBtn("cadence","Quality Cadence")}{tabBtn("simulator","Discount Simulator")}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:MUTED,fontSize:11,letterSpacing:".05em"}}>REGION</span>
          <select value={region} onChange={e=>setRegion(e.target.value)} style={selD}>{REGIONS.map(r=><option key={r}>{r}</option>)}</select>
        </div>
      </div>
      <div style={{padding:24}}>

        {tab==="cadence"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",color:"#666"}}>DAILY SUMMARY</div>
              <div style={{display:"flex",background:"#E5E4E0",borderRadius:8,padding:2}}>
                {[["abs","Count"],["pct","% of Active"]].map(([v,l])=><button key={v} onClick={()=>setView(v)} style={{background:view===v?BLACK:"transparent",color:view===v?WHITE:"#666",border:"none",borderRadius:6,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              {SEGS.map(s=>{
                const val=latest?latest[s.key]:0;
                const pctV=latest?(val/latest.active*100).toFixed(1):"—";
                const dod=latest&&prev?val-prev[s.key]:null;
                const isQ=s.key==="quality";
                return(
                  <div key={s.key} style={{background:isQ?BLACK:WHITE,border:isQ?`2px solid ${GOLD}`:`1px solid ${BORDER}`,borderTop:`3px solid ${s.color}`,borderRadius:12,padding:"16px 18px"}}>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:isQ?MUTED:"#9CA3AF",marginBottom:8,textTransform:"uppercase"}}>{s.label}</div>
                    <div style={{fontSize:26,fontWeight:800,color:isQ?GOLD:"#111",letterSpacing:"-.02em",lineHeight:1}}>{view==="pct"?pctV+"%":fmt(val)}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                      <span style={{fontSize:11,color:isQ?"#555":MUTED}}>{view==="abs"?pctV+"% of active":fmt(val)+" listings"}</span>
                      {dod!==null&&dod!==0&&<span style={{fontSize:11,fontWeight:700,color:dodClr(dod)}}>{dod>0?"▲":"▼"}{fmt(Math.abs(dod))}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{background:WHITE,border:`1px solid ${BORDER}`,borderRadius:12,padding:"20px 24px"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",color:"#666",marginBottom:16}}>DAILY TREND — {region.toUpperCase()}</div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{fontSize:11,fill:MUTED}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:MUTED}} axisLine={false} tickLine={false} tickFormatter={v=>view==="pct"?v.toFixed(1)+"%":v.toLocaleString()}/>
                  <Tooltip contentStyle={{background:BLACK,border:"none",borderRadius:8,color:WHITE,fontSize:12}} formatter={(v,n)=>[view==="pct"?Number(v).toFixed(2)+"%":fmt(v),n]}/>
                  {SEGS.map(s=><Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} dot={false} name={s.label}/>)}
                </LineChart>
              </ResponsiveContainer>
              <div style={{display:"flex",flexWrap:"wrap",gap:16,marginTop:12}}>
                {SEGS.map(s=><span key={s.key} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#666",fontWeight:500}}><span style={{width:14,height:3,borderRadius:2,background:s.color,display:"inline-block"}}/>{s.label}</span>)}
              </div>
            </div>
          </div>
        )}

        {tab==="simulator"&&(
          <div>
            <div style={{background:BLACK,borderRadius:10,padding:"12px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:12,color:MUTED,lineHeight:1.6}}>
                <span style={{color:WHITE,fontWeight:600}}>Fixed snapshot</span> — March 2026 medians · May 11 active · Target pool: <span style={{color:GOLD,fontWeight:700}}>{fmt(simTotal)}</span> overpriced in {region}
              </div>
              <div style={{fontSize:11,color:"#555"}}>BP: base×(1−X%) + ship ≤ median · Ship: base + ship×(1−X%) ≤ median</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              {[{label:"TARGET POOL",val:fmt(simTotal),sub:"overpriced listings",color:WHITE,bg:BLACK,border:`2px solid ${GOLD}`},{label:`BP AT ${bpDisc}%`,val:fmt(getBP(bpDisc)),sub:pctStr(getBP(bpDisc),simTotal)+" of pool",color:"#EF4444",bg:WHITE,border:`1px solid ${BORDER}`},{label:`SHIP AT ${shDisc}%`,val:fmt(getSH(shDisc)),sub:pctStr(getSH(shDisc),simTotal)+" of pool",color:GOLD,bg:WHITE,border:`1px solid ${BORDER}`}].map(m=>(
                <div key={m.label} style={{background:m.bg,border:m.border,borderRadius:12,padding:"16px 20px"}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:".08em",color:MUTED,marginBottom:8}}>{m.label}</div>
                  <div style={{fontSize:28,fontWeight:800,color:m.color,letterSpacing:"-.02em"}}>{m.val}</div>
                  <div style={{fontSize:12,color:MUTED,marginTop:4}}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              {[{label:"A. VENDOR BASE PRICE",sub:"Reduce base price by X%",disc:bpDisc,setD:setBpDisc,getV:getBP,accent:"#EF4444",dim:"#FEE2E2",chart:bpChart},{label:"B. SHIPPING",sub:"Reduce shipping cost by X%",disc:shDisc,setD:setShDisc,getV:getSH,accent:GOLD,dim:"#FEF3C7",chart:shChart}].map(tr=>(
                <div key={tr.label} style={{background:WHITE,border:`1px solid ${BORDER}`,borderTop:`3px solid ${tr.accent}`,borderRadius:12,padding:20}}>
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",color:"#111",marginBottom:2}}>{tr.label}</div>
                    <div style={{fontSize:12,color:MUTED}}>{tr.sub}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                    <span style={{fontSize:11,fontWeight:700,letterSpacing:".05em",color:"#666"}}>DISCOUNT</span>
                    <select value={tr.disc} onChange={e=>tr.setD(Number(e.target.value))} style={selL}>{DISC_STEPS.map(d=><option key={d} value={d}>{d}%</option>)}</select>
                    <div style={{flex:1,background:BLACK,borderRadius:8,padding:"8px 14px"}}>
                      <div style={{fontSize:22,fontWeight:800,color:tr.accent,letterSpacing:"-.02em"}}>{fmt(tr.getV(tr.disc))}</div>
                      <div style={{fontSize:11,color:MUTED,marginTop:1}}>{pctStr(tr.getV(tr.disc),simTotal)} of pool</div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={tr.chart} barCategoryGap="25%">
                      <XAxis dataKey="disc" tick={{fontSize:10,fill:MUTED}} axisLine={false} tickLine={false}/>
                      <YAxis hide/>
                      <Tooltip contentStyle={{background:BLACK,border:"none",borderRadius:8,color:WHITE,fontSize:12}} formatter={v=>fmt(v)}/>
                      <Bar dataKey="val" radius={[3,3,0,0]}>{tr.chart.map((_,i)=><Cell key={i} fill={DISC_STEPS[i]===tr.disc?tr.accent:tr.dim}/>)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
            <div style={{background:WHITE,border:`1px solid ${BORDER}`,borderRadius:12,padding:20,marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",color:"#666",marginBottom:14}}>ALL DISCOUNT LEVELS — {region.toUpperCase()}</div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>{["DISCOUNT","A. BASE PRICE","% POOL","B. SHIPPING","% POOL"].map((h,i)=><th key={h} style={{fontSize:10,fontWeight:700,letterSpacing:".06em",color:MUTED,padding:"6px 10px",textAlign:i===0?"left":"right",paddingBottom:10}}>{h}</th>)}</tr></thead>
                <tbody>{DISC_STEPS.map((d,i)=>{const hi=d===bpDisc||d===shDisc;return(<tr key={d} style={{background:hi?"#FAFAF8":"transparent",borderBottom:i===DISC_STEPS.length-1?"none":`1px solid ${BORDER}`}}><td style={{padding:"8px 10px",fontSize:13,fontWeight:700,color:"#111"}}>{d}%</td><td style={{padding:"8px 10px",textAlign:"right",fontSize:13,fontWeight:d===bpDisc?800:500,color:"#EF4444"}}>{fmt(getBP(d))}</td><td style={{padding:"8px 10px",textAlign:"right",fontSize:11,color:MUTED}}>{pctStr(getBP(d),simTotal)}</td><td style={{padding:"8px 10px",textAlign:"right",fontSize:13,fontWeight:d===shDisc?800:500,color:"#B45309"}}>{fmt(getSH(d))}</td><td style={{padding:"8px 10px",textAlign:"right",fontSize:11,color:MUTED}}>{pctStr(getSH(d),simTotal)}</td></tr>);})}</tbody>
              </table>
            </div>
            <div style={{background:WHITE,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",color:"#666"}}>SHIPPING BY WEIGHT COHORT AT {shDisc}%</div>
                <select value={cohortReg} onChange={e=>setCohortReg(e.target.value)} style={selL}>{REGIONS.map(r=><option key={r}>{r}</option>)}</select>
              </div>
              {cohortRows.filter(r=>r.val>0).map(r=>{const mx=Math.max(...cohortRows.map(c=>c.val),1);return(<div key={r.cohort} style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}><div style={{width:76,fontSize:12,fontWeight:700,color:"#111",flexShrink:0}}>{r.cohort}</div><div style={{flex:1,height:10,background:"#F5F4F0",borderRadius:5,overflow:"hidden"}}><div style={{width:(r.val/mx*100)+"%",height:"100%",background:GOLD,borderRadius:5}}/></div><div style={{width:48,fontSize:12,fontWeight:700,color:"#111",textAlign:"right"}}>{fmt(r.val)}</div></div>);})}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
