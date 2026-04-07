import{r as d,a as D,R as O}from"./react-DPKOQimr.js";import{L as u}from"./leaflet-C_n3KX9d.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function l(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function c(r){if(r.ep)return;r.ep=!0;const i=l(r);fetch(r.href,i)}})();var C={exports:{}},g={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var N=d,_=Symbol.for("react.element"),P=Symbol.for("react.fragment"),U=Object.prototype.hasOwnProperty,M=N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,B={key:!0,ref:!0,__self:!0,__source:!0};function k(e,o,l){var c,r={},i=null,s=null;l!==void 0&&(i=""+l),o.key!==void 0&&(i=""+o.key),o.ref!==void 0&&(s=o.ref);for(c in o)U.call(o,c)&&!B.hasOwnProperty(c)&&(r[c]=o[c]);if(e&&e.defaultProps)for(c in o=e.defaultProps,o)r[c]===void 0&&(r[c]=o[c]);return{$$typeof:_,type:e,key:i,ref:s,props:r,_owner:M.current}}g.Fragment=P;g.jsx=k;g.jsxs=k;C.exports=g;var n=C.exports,$={},w=D;$.createRoot=w.createRoot,$.hydrateRoot=w.hydrateRoot;function R(e){if(!e.decayEpoch)return null;const o=new Date(e.decayEpoch).getTime()-Date.now();return Math.round(o/(24*3600*1e3))}function W(e){const o=e.goldstein??0;return o<=-5?"high":o<=-1?"medium":o>=3?"positive":"low"}function G(e){switch(e){case"high":return"#ff2244";case"medium":return"#ff8800";case"positive":return"#00ff88";default:return"#ffdd00"}}delete u.Icon.Default.prototype._getIconUrl;u.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});function E(e,o=!1){const c=`
    <div style="
      width:32px; height:32px;
      display:flex; align-items:center; justify-content:center;
      filter:${o?`drop-shadow(0 0 6px ${e}) drop-shadow(0 0 12px ${e})`:"none"};
    ">
      <i class="fa-solid fa-rocket"
        style="
          color:${e};
          font-size:22px;
          transform: rotate(-45deg);
          display:block;
        ">
      </i>
    </div>`;return u.divIcon({html:c,className:"",iconSize:[32,32],iconAnchor:[16,16],popupAnchor:[0,-18]})}function F(e){const o=`
    <div style="
      width:28px; height:28px;
      display:flex; align-items:center; justify-content:center;
      filter: drop-shadow(0 0 5px ${e});
    ">
      <i class="fa-solid fa-circle-radiation"
        style="color:${e}; font-size:20px;">
      </i>
    </div>`;return u.divIcon({html:o,className:"",iconSize:[28,28],iconAnchor:[14,14],popupAnchor:[0,-16]})}function H(){return u.divIcon({html:`
    <div style="
      width:28px; height:28px;
      display:flex; align-items:center; justify-content:center;
      filter: drop-shadow(0 0 5px #aa44ff);
    ">
      <i class="fa-solid fa-satellite"
        style="color:#aa44ff; font-size:18px;">
      </i>
    </div>`,className:"",iconSize:[28,28],iconAnchor:[14,14],popupAnchor:[0,-16]})}const v=`
  font-family:'Share Tech Mono',monospace;
  background:#0a0e1a;
  color:#e0e8f0;
  border:1px solid #00d4ff44;
  border-radius:4px;
  padding:12px;
  min-width:240px;
  max-width:320px;
  font-size:12px;
  line-height:1.5;
`;function L(e){if(!e)return"TBD";const o=new Date(e).getTime()-Date.now();if(o<0)return"LAUNCHED";const l=Math.floor(o/864e5),c=Math.floor(o%864e5/36e5),r=Math.floor(o%36e5/6e4),i=Math.floor(o%6e4/1e3);return l>0?`T-${l}d ${c}h ${r}m`:`T-${c}h ${r}m ${i}s`}function Y(e){const o=e.status.abbrev==="GO"?"#00d4ff":e.status.abbrev==="TBD"?"#ffdd00":e.status.abbrev==="HOLD"?"#ff8800":e.status.abbrev==="SUCCESS"?"#00ff88":e.status.abbrev==="FAILURE"?"#ff2244":"#aaa";return`<div style="${v}">
    <div style="color:#00d4ff;font-weight:bold;font-size:13px;margin-bottom:6px">
      ${e.name}
    </div>
    ${e.image?`<img src="${e.image}" style="width:100%;border-radius:3px;margin-bottom:8px;max-height:120px;object-fit:cover">`:""}
    <div style="margin-bottom:4px">
      <span style="color:#888">STATUS: </span>
      <span style="color:${o}">${e.status.abbrev||e.status.name||"UNKNOWN"}</span>
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">COUNTDOWN: </span>
      <span style="color:#ffdd00">${L(e.net)}</span>
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">NET: </span>
      ${e.net?new Date(e.net).toUTCString():"TBD"}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">ROCKET: </span>${e.rocket.name||"N/A"}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">AGENCY: </span>${e.agency.name||"N/A"} (${e.agency.country||"?"})
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">ORBIT: </span>${e.mission.orbit||"N/A"}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">TYPE: </span>${e.mission.type||"N/A"}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">PAD: </span>${e.pad.name||"N/A"}
    </div>
    ${e.mission.description?`<div style="margin-top:8px;color:#8ab;font-size:11px;border-top:1px solid #1a2a3a;padding-top:6px">${e.mission.description.substring(0,200)}${e.mission.description.length>200?"...":""}</div>`:""}
  </div>`}function K(e,o){const l=o.filter(c=>e.launches.includes(c.id));return`<div style="${v}">
    <div style="color:#2a8aaa;font-weight:bold;margin-bottom:6px">PAD: ${e.name||"Unknown"}</div>
    <div style="color:#888;margin-bottom:4px">${e.location||""}</div>
    <div style="margin-bottom:4px">
      <span style="color:#888">SCHEDULED: </span>${l.length} launch(es)
    </div>
    ${l.map(c=>`
      <div style="margin-top:6px;padding-top:6px;border-top:1px solid #1a2a3a">
        <div style="color:#00d4ff">${c.name}</div>
        <div style="color:#ffdd00">T- ${L(c.net)}</div>
      </div>
    `).join("")}
  </div>`}function T(e){const o=R(e),l=o!==null&&o<=7?"#ff2244":"#ff8800",c=e.sourceType||e.source||"DECAY",r=e.window,i=e.highInterest,s=e.objectType,t=e.rcs;function a(f,p,h="",x=""){return p==null||p==="N/A"?"":`<div style="margin-bottom:4px">
      <span style="color:#888">${f}: </span>
      <span${x?` style="color:${x}"`:""}>${p}${h}</span>
    </div>`}return`<div style="${v}">
    <div style="color:${l};font-weight:bold;margin-bottom:6px;font-size:13px">
      ${i?"⚠ HIGH INTEREST — ":""}${c} REENTRY
    </div>
    <div style="color:#e0e8f0;margin-bottom:8px">${e.name}</div>
    ${a("NORAD",e.norad)}
    ${a("COUNTRY",e.country)}
    ${s?a("TYPE",s):""}
    ${t?a("SIZE",t):""}
    <div style="margin-bottom:4px">
      <span style="color:#888">REENTRY EST.: </span>
      <span style="color:${l}">${e.decayEpoch?new Date(e.decayEpoch).toUTCString():"N/A"}</span>
    </div>
    ${o!==null?a("TIME REMAINING",o===0?"TODAY":`${o}d`,"",l):""}
    ${r!=null?a("WINDOW ±",`${r}h`):""}
    ${a("INCLINATION",e.inclination!=null?e.inclination.toFixed(1):null,"°")}
    ${a("APOGEE",e.apogee!=null?Math.round(e.apogee):null," km")}
    ${a("PERIGEE",e.perigee!=null?Math.round(e.perigee):null," km")}
    ${e.altitude!=null?a("ALTITUDE",Math.round(e.altitude)," km"):""}
  </div>`}function V(e){switch(e){case"launch":return"#00d4ff";case"satellite":return"#0088ff";case"reentry":case"debris":return"#ff8800";case"space_weather":return"#aa44ff";case"asat":case"military_space":return"#ff2244";case"gnss_interference":return"#ff6600";default:return"#44aa88"}}function Z(e){try{return new URL(e).hostname.replace(/^www\./,"")}catch{return"source"}}function X(e){return!e||e.length<8?e:`${e.slice(0,4)}-${e.slice(4,6)}-${e.slice(6,8)}`}function q(e){const o=(e.space_category||"context").toUpperCase().replace("_"," "),l=V(e.space_category),c=Z(e.source_url),r=X(e.date),i=e.title_en||e.title_fr||e.location||"Space event",s=(t,a)=>`<span style="background:${a}22;border:1px solid ${a}66;color:${a};border-radius:3px;padding:1px 6px;font-size:10px;white-space:nowrap">${t}</span>`;return`<div style="${v}padding:10px;min-width:220px;max-width:300px;">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;align-items:center">
      ${s(o,l)}
      ${s(c,"#6a8a9a")}
      ${s(r,"#445566")}
    </div>
    <a href="${e.source_url}" target="_blank" rel="noopener"
      style="color:#e8f4ff;font-size:13px;line-height:1.4;text-decoration:none;display:block;cursor:pointer"
      onmouseover="this.style.color='#00d4ff'" onmouseout="this.style.color='#e8f4ff'">
      ${i}
    </a>
  </div>`}function J(e){return e<=3?60:e<=5?25:e<=6?10:5}function Q({launches:e,decay:o,tip:l,events:c}){const r=d.useRef(null),i=d.useRef(null);return d.useEffect(()=>{if(r.current)return;const s=u.map("map",{center:[20,0],zoom:2,minZoom:2,maxZoom:12,zoomControl:!1});u.control.zoom({position:"bottomright"}).addTo(s),u.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a> | &copy; OSM contributors',subdomains:"abcd",maxZoom:19}).addTo(s);const t=u.layerGroup().addTo(s),a=u.layerGroup().addTo(s),f=u.layerGroup().addTo(s),p=u.markerClusterGroup({maxClusterRadius:J,showCoverageOnHover:!1,iconCreateFunction:h=>{const x=h.getChildCount();return u.divIcon({html:`<div style="background:#ff440033;border:1px solid #ff4400;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:#ff8800;font-family:'Share Tech Mono',monospace;font-size:12px">${x}</div>`,className:"",iconSize:[36,36]})}});return s.addLayer(p),u.control.layers({},{Launches:t,"DECAY Reentries":a,"TIP Objects":f,"GDELT Events":p},{position:"topright",collapsed:!0}).addTo(s),r.current=s,i.current={launches:t,decay:a,tip:f,events:p},()=>{s.remove(),r.current=null,i.current=null}},[]),d.useEffect(()=>{if(!i.current||!e)return;const s=i.current.launches;s.clearLayers();const t=new Set;for(const a of e.upcoming){if(!a.pad.lat||!a.pad.lon)continue;const f=`${a.pad.lat},${a.pad.lon}`;t.add(f);const p=u.marker([a.pad.lat,a.pad.lon],{icon:E("#00d4ff",a.status.abbrev==="GO"),zIndexOffset:1e3});p.bindPopup(Y(a),{maxWidth:340}),s.addLayer(p)}for(const a of e.pads){const f=`${a.lat},${a.lon}`;if(t.has(f))continue;const p=u.marker([a.lat,a.lon],{icon:E("#2a5a7a")});p.bindPopup(K(a,e.upcoming),{maxWidth:320}),s.addLayer(p)}},[e]),d.useEffect(()=>{if(!i.current)return;const s=i.current.decay;s.clearLayers();for(const t of o){if(!t.lat||!t.lon)continue;const a=R(t),f=a!==null&&a<=7?"#ff2244":"#ff8800",p=u.marker([t.lat,t.lon],{icon:F(f)});p.bindPopup(T(t),{maxWidth:300}),s.addLayer(p)}},[o]),d.useEffect(()=>{if(!i.current)return;const s=i.current.tip;s.clearLayers();for(const t of l){if(!t.lat||!t.lon)continue;const a=u.marker([t.lat,t.lon],{icon:H()});a.bindPopup(T(t),{maxWidth:300}),s.addLayer(a)}},[l]),d.useEffect(()=>{if(!i.current)return;const s=i.current.events;s.clearLayers();for(const t of c){if(!t.latitude||!t.longitude)continue;const a=W(t),f=G(a),p=Math.max(5,Math.min(12,5+t.num_mentions/50)),h=u.circleMarker([t.latitude,t.longitude],{radius:p,fillColor:f,fillOpacity:.75,color:f,weight:1.5});h.bindPopup(q(t),{maxWidth:340}),s.addLayer(h)}},[c]),n.jsx("div",{id:"map",style:{width:"100%",height:"100%",background:"#0a0e1a"}})}function ee({launchCount:e,decayCount:o,tipCount:l,eventCount:c,kp:r}){const[i,s]=d.useState(new Date);d.useEffect(()=>{const f=setInterval(()=>s(new Date),1e3);return()=>clearInterval(f)},[]);const t=i.toUTCString().replace("GMT","UTC");function a(f){return f===null?"#555":f>=8?"#ff2244":f>=6?"#ff8800":f>=4?"#ffdd00":"#00d4ff"}return n.jsxs("header",{style:{position:"fixed",top:0,left:0,right:0,zIndex:1e3,background:"rgba(5,8,16,0.95)",backdropFilter:"blur(8px)",borderBottom:"1px solid #00d4ff22",padding:"0 20px",height:"48px",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'Share Tech Mono', monospace",fontSize:"12px",color:"#8ab4c8"},children:[n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[n.jsx("div",{style:{color:"#00d4ff",fontSize:"16px",fontWeight:"bold",letterSpacing:"4px",textShadow:"0 0 12px #00d4ff88"},children:"◈ SPACE MONITOR"}),n.jsx("div",{style:{color:"#2a4a5a",fontSize:"11px"},children:"GLOBAL SPACE SURVEILLANCE SYSTEM"})]}),n.jsxs("div",{style:{display:"flex",gap:"24px",alignItems:"center"},children:[n.jsx(y,{label:"LAUNCHES",value:e,color:"#00d4ff"}),n.jsx(y,{label:"DECAY",value:o,color:"#ff8800"}),n.jsx(y,{label:"TIP",value:l,color:"#aa44ff"}),n.jsx(y,{label:"EVENTS",value:c,color:"#ffdd00"}),r!==null&&n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[n.jsx("span",{style:{color:"#555"},children:"Kp"}),n.jsx("span",{style:{color:a(r),fontWeight:"bold",fontSize:"14px",textShadow:`0 0 8px ${a(r)}88`},children:r.toFixed(1)})]})]}),n.jsxs("div",{style:{color:"#4a7a8a",fontSize:"11px",textAlign:"right"},children:[n.jsx("div",{style:{color:"#00d4ff55",marginBottom:"1px"},children:"UTC CLOCK"}),n.jsx("div",{style:{color:"#8ab4c8"},children:t})]})]})}function y({label:e,value:o,color:l}){return n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[n.jsx("span",{style:{color:"#3a5a6a",fontSize:"10px"},children:e}),n.jsx("span",{style:{color:l,fontWeight:"bold",fontSize:"13px"},children:o})]})}function j(e){if(!e)return"TBD";const o=new Date(e).getTime()-Date.now();if(o<0)return"LAUNCHED";const l=Math.floor(o/864e5),c=Math.floor(o%864e5/36e5),r=Math.floor(o%36e5/6e4),i=Math.floor(o%6e4/1e3);return l>0?`T-${l}d ${c}h ${r}m`:`T-${c}h ${r}m ${i}s`}function te(e){switch(e){case"GO":return"#00d4ff";case"TBD":return"#ffdd00";case"HOLD":return"#ff8800";case"SUCCESS":return"#00ff88";case"FAILURE":return"#ff2244";default:return"#aaa"}}function ne({launch:e,isUpcoming:o}){const[l,c]=d.useState(j(e.net));d.useEffect(()=>{if(!o)return;const i=setInterval(()=>c(j(e.net)),1e3);return()=>clearInterval(i)},[e.net,o]);const r=te(e.status.abbrev);return n.jsxs("div",{style:{borderLeft:`2px solid ${r}`,padding:"10px 10px 10px 12px",marginBottom:"8px",background:"rgba(0,20,40,0.5)",borderRadius:"2px"},children:[e.image&&n.jsx("img",{src:e.image,alt:e.name,style:{width:"100%",height:"80px",objectFit:"cover",borderRadius:"2px",marginBottom:"6px"},onError:i=>{i.target.style.display="none"}}),n.jsx("div",{style:{color:"#e0e8f0",fontSize:"11px",fontWeight:"bold",marginBottom:"4px",lineHeight:1.3},children:e.name}),n.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"3px"},children:[n.jsx("span",{style:{color:r,fontSize:"10px"},children:e.status.abbrev||e.status.name}),n.jsx("span",{style:{color:"#ffdd00",fontSize:"10px"},children:l})]}),n.jsxs("div",{style:{color:"#4a7a8a",fontSize:"10px",marginBottom:"2px"},children:[e.rocket.name," · ",e.agency.abbrev||e.agency.name]}),n.jsx("div",{style:{color:"#3a5a6a",fontSize:"10px"},children:e.pad.name}),e.mission.orbit&&n.jsxs("div",{style:{color:"#2a8aaa",fontSize:"10px",marginTop:"2px"},children:["↗ ",e.mission.orbit]})]})}function oe({data:e,loading:o}){const[l,c]=d.useState(!1),[r,i]=d.useState("upcoming"),s=d.useRef(null),t=(e==null?void 0:e.upcoming)??[],a=(e==null?void 0:e.previous)??[],f=r==="upcoming"?t:a;return n.jsxs(n.Fragment,{children:[n.jsx("button",{onClick:()=>c(!l),style:{position:"fixed",top:"58px",left:"10px",zIndex:1e3,background:l?"rgba(0,212,255,0.15)":"rgba(5,8,16,0.9)",border:`1px solid ${l?"#00d4ff":"#00d4ff44"}`,color:"#00d4ff",fontFamily:"'Share Tech Mono', monospace",fontSize:"12px",padding:"6px 14px",cursor:"pointer",borderRadius:"2px",letterSpacing:"2px",textShadow:l?"0 0 8px #00d4ff88":"none"},children:"◈ SPACE"}),n.jsxs("div",{ref:s,style:{position:"fixed",top:"48px",left:0,bottom:0,width:"300px",background:"rgba(4,8,18,0.97)",borderRight:"1px solid #00d4ff22",zIndex:999,transform:l?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s ease",display:"flex",flexDirection:"column",fontFamily:"'Share Tech Mono', monospace"},children:[n.jsxs("div",{style:{padding:"12px 16px",borderBottom:"1px solid #00d4ff22",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[n.jsx("span",{style:{color:"#00d4ff",fontSize:"13px",letterSpacing:"2px"},children:"LAUNCH TRACKER"}),n.jsx("button",{onClick:()=>c(!1),style:{background:"none",border:"none",color:"#4a7a8a",cursor:"pointer",fontSize:"16px"},children:"×"})]}),n.jsx("div",{style:{display:"flex",borderBottom:"1px solid #00d4ff11"},children:["upcoming","previous"].map(p=>n.jsx("button",{onClick:()=>i(p),style:{flex:1,background:"none",border:"none",borderBottom:r===p?"2px solid #00d4ff":"2px solid transparent",color:r===p?"#00d4ff":"#4a7a8a",fontFamily:"'Share Tech Mono', monospace",fontSize:"11px",padding:"8px",cursor:"pointer",letterSpacing:"1px",textTransform:"uppercase"},children:p==="upcoming"?`UPCOMING (${t.length})`:`PREVIOUS (${a.length})`},p))}),n.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"10px 12px"},children:[o&&n.jsx("div",{style:{color:"#4a7a8a",fontSize:"11px",textAlign:"center",padding:"20px"},children:"LOADING DATA..."}),!o&&f.length===0&&n.jsx("div",{style:{color:"#4a7a8a",fontSize:"11px",textAlign:"center",padding:"20px"},children:"NO DATA AVAILABLE"}),f.map(p=>n.jsx(ne,{launch:p,isUpcoming:r==="upcoming"},p.id))]}),e&&n.jsxs("div",{style:{padding:"8px 12px",borderTop:"1px solid #00d4ff11",color:"#2a4a5a",fontSize:"10px"},children:["Last sync: ",new Date(e.fetchedAt).toUTCString()]})]})]})}function I(e){return e>=8?"#ff2244":e>=6?"#ff8800":e>=4?"#ffdd00":"#00d4ff"}function re(e){return e>=8?"EXTREME":e>=6?"SEVERE":e>=5?"STRONG":e>=4?"MODERATE":e>=2?"MINOR":"QUIET"}function S({label:e,value:o}){const l=parseInt(o||"0",10),c=l>=4?"#ff2244":l>=3?"#ff8800":l>=2?"#ffdd00":l>=1?"#00d4ff":"#2a4a5a";return n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[n.jsx("span",{style:{color:"#3a5a6a",fontSize:"10px"},children:e}),n.jsx("span",{style:{color:c,fontWeight:"bold",fontSize:"12px",minWidth:"16px",textShadow:l>=1?`0 0 6px ${c}88`:"none"},children:l>0?`${e}${l}`:"--"})]})}function se({data:e,loading:o}){var s,t,a,f,p,h;const[l,c]=d.useState(!1),r=(e==null?void 0:e.kp)??null,i=I(r??0);return n.jsxs("div",{style:{position:"fixed",bottom:"20px",right:"20px",zIndex:1e3,background:"rgba(4,8,18,0.95)",border:`1px solid ${r!==null&&r>=5?i:"#00d4ff22"}`,borderRadius:"4px",fontFamily:"'Share Tech Mono', monospace",fontSize:"12px",minWidth:"200px",maxWidth:"320px",boxShadow:r!==null&&r>=5?`0 0 20px ${i}44`:"0 0 10px rgba(0,0,0,0.5)",transition:"all 0.3s"},children:[n.jsxs("div",{onClick:()=>c(!l),style:{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"},children:[n.jsx("div",{style:{color:"#00d4ff55",fontSize:"10px",letterSpacing:"2px"},children:"SPACE WEATHER"}),o?n.jsx("span",{style:{color:"#4a7a8a",fontSize:"11px"},children:"LOADING..."}):r!==null?n.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[n.jsx("span",{style:{color:"#4a7a8a",fontSize:"10px"},children:"Kp"}),n.jsx("span",{style:{color:i,fontSize:"20px",fontWeight:"bold",textShadow:`0 0 12px ${i}88`},children:r.toFixed(1)}),n.jsx("span",{style:{color:i,fontSize:"10px"},children:re(r)})]}):n.jsx("span",{style:{color:"#4a7a8a",fontSize:"11px"},children:"N/A"}),n.jsx("span",{style:{color:"#4a7a8a",fontSize:"14px"},children:l?"▼":"▲"})]}),l&&e&&n.jsxs("div",{style:{borderTop:"1px solid #00d4ff22",padding:"10px 14px"},children:[n.jsxs("div",{style:{display:"flex",gap:"16px",marginBottom:"10px"},children:[n.jsx(S,{label:"G",value:((t=(s=e.scales)==null?void 0:s.G)==null?void 0:t.current)??"0"}),n.jsx(S,{label:"S",value:((f=(a=e.scales)==null?void 0:a.S)==null?void 0:f.current)??"0"}),n.jsx(S,{label:"R",value:((h=(p=e.scales)==null?void 0:p.R)==null?void 0:h.current)??"0"})]}),e.kpForecast.length>0&&n.jsxs("div",{style:{marginBottom:"10px"},children:[n.jsx("div",{style:{color:"#3a5a6a",fontSize:"10px",marginBottom:"4px"},children:"Kp FORECAST"}),n.jsx("div",{style:{display:"flex",alignItems:"flex-end",gap:"2px",height:"32px"},children:e.kpForecast.slice(-24).map((x,b)=>{const m=Math.max(2,x.kp/9*32),z=I(x.kp);return n.jsx("div",{title:`${x.time}: Kp ${x.kp}`,style:{flex:1,height:`${m}px`,background:z,opacity:.7,borderRadius:"1px 1px 0 0"}},b)})})]}),e.alerts.length>0&&n.jsxs("div",{children:[n.jsxs("div",{style:{color:"#ff8800",fontSize:"10px",marginBottom:"4px",letterSpacing:"1px"},children:["⚠ NOAA ALERTS (",e.alerts.length,")"]}),n.jsx("div",{style:{maxHeight:"120px",overflowY:"auto"},children:e.alerts.slice(0,5).map((x,b)=>{var m;return n.jsxs("div",{style:{color:"#8ab4c8",fontSize:"10px",padding:"4px 0",borderBottom:"1px solid #1a2a3a",lineHeight:1.4},children:[n.jsx("span",{style:{color:"#ff8800"},children:(m=x.issued)==null?void 0:m.slice(0,10)})," ",x.message.slice(0,80),"..."]},b)})})]}),n.jsxs("div",{style:{color:"#1a3a4a",fontSize:"10px",marginTop:"8px"},children:["Updated: ",e.fetchedAt?new Date(e.fetchedAt).toUTCString().slice(0,25):"N/A"]})]})]})}const ae="https://space-monitoring-production.up.railway.app";function ie(){const[e,o]=d.useState(null),[l,c]=d.useState(!0),[r,i]=d.useState(null),s=d.useCallback(async()=>{try{const t=await fetch(`${ae}/launches`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const a=await t.json();o(a),i(null)}catch(t){i(t instanceof Error?t.message:"Unknown error")}finally{c(!1)}},[]);return d.useEffect(()=>{s();const t=setInterval(s,6*3600*1e3);return()=>clearInterval(t)},[s]),{data:e,loading:l,error:r,refresh:s}}const le="https://space-monitoring-production.up.railway.app";function ce(){const[e,o]=d.useState([]),[l,c]=d.useState(!0),[r,i]=d.useState(null),s=d.useCallback(async()=>{try{const t=await fetch(`${le}/decay`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const a=await t.json();o(a),i(null)}catch(t){i(t instanceof Error?t.message:"Unknown error")}finally{c(!1)}},[]);return d.useEffect(()=>{s();const t=setInterval(s,12*3600*1e3);return()=>clearInterval(t)},[s]),{data:e,loading:l,error:r}}const de="https://space-monitoring-production.up.railway.app";function pe(){const[e,o]=d.useState([]),[l,c]=d.useState(!0),[r,i]=d.useState(null),s=d.useCallback(async()=>{try{const t=await fetch(`${de}/tip`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const a=await t.json();o(a),i(null)}catch(t){i(t instanceof Error?t.message:"Unknown error")}finally{c(!1)}},[]);return d.useEffect(()=>{s();const t=setInterval(s,6*3600*1e3);return()=>clearInterval(t)},[s]),{data:e,loading:l,error:r}}const fe="https://space-monitoring-production.up.railway.app";function ue(){const[e,o]=d.useState(null),[l,c]=d.useState(!0),[r,i]=d.useState(null),s=d.useCallback(async()=>{try{const t=await fetch(`${fe}/spaceweather`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const a=await t.json();o(a),i(null)}catch(t){i(t instanceof Error?t.message:"Unknown error")}finally{c(!1)}},[]);return d.useEffect(()=>{s();const t=setInterval(s,15*60*1e3);return()=>clearInterval(t)},[s]),{data:e,loading:l,error:r}}const A="https://space-monitoring-production.up.railway.app";function xe(){const[e,o]=d.useState([]),[l,c]=d.useState(!0),[r,i]=d.useState(null),s=d.useCallback(async()=>{try{const a=await fetch(`${A}/events`);if(!a.ok)throw new Error(`HTTP ${a.status}`);const f=await a.json();o(f),i(null)}catch(a){i(a instanceof Error?a.message:"Unknown error")}finally{c(!1)}},[]),t=d.useCallback(async()=>{try{await fetch(`${A}/refresh`,{method:"POST"}),setTimeout(s,5e3)}catch{}},[s]);return d.useEffect(()=>{s();const a=setInterval(s,6*3600*1e3);return()=>clearInterval(a)},[s]),{data:e,loading:l,error:r,forceRefresh:t}}function he(){var t;const{data:e,loading:o}=ie(),{data:l}=ce(),{data:c}=pe(),{data:r,loading:i}=ue(),{data:s}=xe();return n.jsxs("div",{style:{width:"100vw",height:"100vh",background:"#0a0e1a",overflow:"hidden"},children:[n.jsx(ee,{launchCount:((t=e==null?void 0:e.upcoming)==null?void 0:t.length)??0,decayCount:l.length,tipCount:c.length,eventCount:s.length,kp:(r==null?void 0:r.kp)??null}),n.jsx(oe,{data:e,loading:o}),n.jsx("div",{style:{position:"absolute",top:"48px",left:0,right:0,bottom:0},children:n.jsx(Q,{launches:e,decay:l,tip:c,events:s})}),n.jsx(se,{data:r,loading:i})]})}$.createRoot(document.getElementById("root")).render(n.jsx(O.StrictMode,{children:n.jsx(he,{})}));
