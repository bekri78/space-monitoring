import{r as d,a as D,R as P}from"./react-DPKOQimr.js";import{L as u}from"./leaflet-C_n3KX9d.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function i(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(r){if(r.ep)return;r.ep=!0;const a=i(r);fetch(r.href,a)}})();var I={exports:{}},g={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var U=d,_=Symbol.for("react.element"),M=Symbol.for("react.fragment"),B=Object.prototype.hasOwnProperty,W=U.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,G={key:!0,ref:!0,__self:!0,__source:!0};function L(e,o,i){var l,r={},a=null,s=null;i!==void 0&&(a=""+i),o.key!==void 0&&(a=""+o.key),o.ref!==void 0&&(s=o.ref);for(l in o)B.call(o,l)&&!G.hasOwnProperty(l)&&(r[l]=o[l]);if(e&&e.defaultProps)for(l in o=e.defaultProps,o)r[l]===void 0&&(r[l]=o[l]);return{$$typeof:_,type:e,key:a,ref:s,props:r,_owner:W.current}}g.Fragment=M;g.jsx=L;g.jsxs=L;I.exports=g;var t=I.exports,E={},$=D;E.createRoot=$.createRoot,E.hydrateRoot=$.hydrateRoot;function k(e){if(!e.decayEpoch)return null;const o=new Date(e.decayEpoch).getTime()-Date.now();return Math.round(o/(24*3600*1e3))}function R(e){const o=e.goldstein??0;return o<=-5?"high":o<=-1?"medium":o>=3?"positive":"low"}function N(e){switch(e){case"high":return"#ff2244";case"medium":return"#ff8800";case"positive":return"#00ff88";default:return"#ffdd00"}}delete u.Icon.Default.prototype._getIconUrl;u.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});function j(e,o=!1){const l=`
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
    </div>`;return u.divIcon({html:l,className:"",iconSize:[32,32],iconAnchor:[16,16],popupAnchor:[0,-18]})}function F(e){const o=`
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
`;function O(e){if(!e)return"TBD";const o=new Date(e).getTime()-Date.now();if(o<0)return"LAUNCHED";const i=Math.floor(o/864e5),l=Math.floor(o%864e5/36e5),r=Math.floor(o%36e5/6e4),a=Math.floor(o%6e4/1e3);return i>0?`T-${i}d ${l}h ${r}m`:`T-${l}h ${r}m ${a}s`}function Y(e){const o=e.status.abbrev==="GO"?"#00d4ff":e.status.abbrev==="TBD"?"#ffdd00":e.status.abbrev==="HOLD"?"#ff8800":e.status.abbrev==="SUCCESS"?"#00ff88":e.status.abbrev==="FAILURE"?"#ff2244":"#aaa";return`<div style="${v}">
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
      <span style="color:#ffdd00">${O(e.net)}</span>
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
  </div>`}function K(e,o){const i=o.filter(l=>e.launches.includes(l.id));return`<div style="${v}">
    <div style="color:#2a8aaa;font-weight:bold;margin-bottom:6px">PAD: ${e.name||"Unknown"}</div>
    <div style="color:#888;margin-bottom:4px">${e.location||""}</div>
    <div style="margin-bottom:4px">
      <span style="color:#888">SCHEDULED: </span>${i.length} launch(es)
    </div>
    ${i.map(l=>`
      <div style="margin-top:6px;padding-top:6px;border-top:1px solid #1a2a3a">
        <div style="color:#00d4ff">${l.name}</div>
        <div style="color:#ffdd00">T- ${O(l.net)}</div>
      </div>
    `).join("")}
  </div>`}function w(e){const o=k(e),i=o!==null&&o<=7?"#ff2244":"#ff8800";return`<div style="${v}">
    <div style="color:${i};font-weight:bold;margin-bottom:6px">
      ${e.source} — ${e.name}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">NORAD: </span>${e.norad}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">COUNTRY: </span>${e.country||"N/A"}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">DECAY EPOCH: </span>
      <span style="color:${i}">${e.decayEpoch?new Date(e.decayEpoch).toUTCString():"N/A"}</span>
    </div>
    ${o!==null?`<div style="margin-bottom:4px">
      <span style="color:#888">DAYS REMAINING: </span>
      <span style="color:${i}">${o}d</span>
    </div>`:""}
    <div style="margin-bottom:4px">
      <span style="color:#888">INCLINATION: </span>${e.inclination??"N/A"}°
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">APOGEE: </span>${e.apogee??"N/A"} km
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">PERIGEE: </span>${e.perigee??"N/A"} km
    </div>
    ${e.altitude!=null?`<div style="margin-bottom:4px">
      <span style="color:#888">ALTITUDE: </span>${e.altitude} km
    </div>`:""}
  </div>`}function V(e){const o=R(e),i=N(o);return`<div style="${v}">
    <div style="color:${i};font-weight:bold;margin-bottom:6px;font-size:13px">
      ${e.title_en||e.location}
    </div>
    <div style="color:#8ab;margin-bottom:6px;font-size:11px">${e.title_fr}</div>
    <div style="margin-bottom:4px">
      <span style="color:#888">LOCATION: </span>${e.location_display||e.inferred_location||e.location}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">DATE: </span>${e.date}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">ACTORS: </span>${[e.actor1,e.actor2].filter(Boolean).join(" / ")||"N/A"}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">GOLDSTEIN: </span>
      <span style="color:${i}">${e.goldstein??"N/A"}</span>
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">MENTIONS: </span>${e.num_mentions}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">RELEVANCE: </span>${e.relevance}/100
    </div>
    <div style="margin-top:8px">
      <a href="${e.source_url}" target="_blank" rel="noopener"
        style="color:#00d4ff;text-decoration:none;font-size:11px">
        [SOURCE LINK]
      </a>
    </div>
  </div>`}function X(e){return e<=3?60:e<=5?25:e<=6?10:5}function Z({launches:e,decay:o,tip:i,events:l}){const r=d.useRef(null),a=d.useRef(null);return d.useEffect(()=>{if(r.current)return;const s=u.map("map",{center:[20,0],zoom:2,minZoom:2,maxZoom:12,zoomControl:!1});u.control.zoom({position:"bottomright"}).addTo(s),u.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://carto.com/">CARTO</a> | &copy; OSM contributors',subdomains:"abcd",maxZoom:19}).addTo(s);const n=u.layerGroup().addTo(s),c=u.layerGroup().addTo(s),p=u.layerGroup().addTo(s),f=u.markerClusterGroup({maxClusterRadius:X,showCoverageOnHover:!1,iconCreateFunction:m=>{const x=m.getChildCount();return u.divIcon({html:`<div style="background:#ff440033;border:1px solid #ff4400;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:#ff8800;font-family:'Share Tech Mono',monospace;font-size:12px">${x}</div>`,className:"",iconSize:[36,36]})}});return s.addLayer(f),u.control.layers({},{Launches:n,"DECAY Reentries":c,"TIP Objects":p,"GDELT Events":f},{position:"topright",collapsed:!0}).addTo(s),r.current=s,a.current={launches:n,decay:c,tip:p,events:f},()=>{s.remove(),r.current=null,a.current=null}},[]),d.useEffect(()=>{if(!a.current||!e)return;const s=a.current.launches;s.clearLayers();const n=new Set;for(const c of e.upcoming){if(!c.pad.lat||!c.pad.lon)continue;const p=`${c.pad.lat},${c.pad.lon}`;n.add(p);const f=u.marker([c.pad.lat,c.pad.lon],{icon:j("#00d4ff",c.status.abbrev==="GO"),zIndexOffset:1e3});f.bindPopup(Y(c),{maxWidth:340}),s.addLayer(f)}for(const c of e.pads){const p=`${c.lat},${c.lon}`;if(n.has(p))continue;const f=u.marker([c.lat,c.lon],{icon:j("#2a5a7a")});f.bindPopup(K(c,e.upcoming),{maxWidth:320}),s.addLayer(f)}},[e]),d.useEffect(()=>{if(!a.current)return;const s=a.current.decay;s.clearLayers();for(const n of o){if(!n.lat||!n.lon)continue;const c=k(n),p=c!==null&&c<=7?"#ff2244":"#ff8800",f=u.marker([n.lat,n.lon],{icon:F(p)});f.bindPopup(w(n),{maxWidth:300}),s.addLayer(f)}},[o]),d.useEffect(()=>{if(!a.current)return;const s=a.current.tip;s.clearLayers();for(const n of i){if(!n.lat||!n.lon)continue;const c=u.marker([n.lat,n.lon],{icon:H()});c.bindPopup(w(n),{maxWidth:300}),s.addLayer(c)}},[i]),d.useEffect(()=>{if(!a.current)return;const s=a.current.events;s.clearLayers();for(const n of l){if(!n.latitude||!n.longitude)continue;const c=R(n),p=N(c),f=Math.max(5,Math.min(12,5+n.num_mentions/50)),m=u.circleMarker([n.latitude,n.longitude],{radius:f,fillColor:p,fillOpacity:.75,color:p,weight:1.5});m.bindPopup(V(n),{maxWidth:340}),s.addLayer(m)}},[l]),t.jsx("div",{id:"map",style:{width:"100%",height:"100%",background:"#0a0e1a"}})}function q({launchCount:e,decayCount:o,tipCount:i,eventCount:l,kp:r}){const[a,s]=d.useState(new Date);d.useEffect(()=>{const p=setInterval(()=>s(new Date),1e3);return()=>clearInterval(p)},[]);const n=a.toUTCString().replace("GMT","UTC");function c(p){return p===null?"#555":p>=8?"#ff2244":p>=6?"#ff8800":p>=4?"#ffdd00":"#00d4ff"}return t.jsxs("header",{style:{position:"fixed",top:0,left:0,right:0,zIndex:1e3,background:"rgba(5,8,16,0.95)",backdropFilter:"blur(8px)",borderBottom:"1px solid #00d4ff22",padding:"0 20px",height:"48px",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'Share Tech Mono', monospace",fontSize:"12px",color:"#8ab4c8"},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[t.jsx("div",{style:{color:"#00d4ff",fontSize:"16px",fontWeight:"bold",letterSpacing:"4px",textShadow:"0 0 12px #00d4ff88"},children:"◈ SPACE MONITOR"}),t.jsx("div",{style:{color:"#2a4a5a",fontSize:"11px"},children:"GLOBAL SPACE SURVEILLANCE SYSTEM"})]}),t.jsxs("div",{style:{display:"flex",gap:"24px",alignItems:"center"},children:[t.jsx(h,{label:"LAUNCHES",value:e,color:"#00d4ff"}),t.jsx(h,{label:"DECAY",value:o,color:"#ff8800"}),t.jsx(h,{label:"TIP",value:i,color:"#aa44ff"}),t.jsx(h,{label:"EVENTS",value:l,color:"#ffdd00"}),r!==null&&t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[t.jsx("span",{style:{color:"#555"},children:"Kp"}),t.jsx("span",{style:{color:c(r),fontWeight:"bold",fontSize:"14px",textShadow:`0 0 8px ${c(r)}88`},children:r.toFixed(1)})]})]}),t.jsxs("div",{style:{color:"#4a7a8a",fontSize:"11px",textAlign:"right"},children:[t.jsx("div",{style:{color:"#00d4ff55",marginBottom:"1px"},children:"UTC CLOCK"}),t.jsx("div",{style:{color:"#8ab4c8"},children:n})]})]})}function h({label:e,value:o,color:i}){return t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px"},children:[t.jsx("span",{style:{color:"#3a5a6a",fontSize:"10px"},children:e}),t.jsx("span",{style:{color:i,fontWeight:"bold",fontSize:"13px"},children:o})]})}function T(e){if(!e)return"TBD";const o=new Date(e).getTime()-Date.now();if(o<0)return"LAUNCHED";const i=Math.floor(o/864e5),l=Math.floor(o%864e5/36e5),r=Math.floor(o%36e5/6e4),a=Math.floor(o%6e4/1e3);return i>0?`T-${i}d ${l}h ${r}m`:`T-${l}h ${r}m ${a}s`}function J(e){switch(e){case"GO":return"#00d4ff";case"TBD":return"#ffdd00";case"HOLD":return"#ff8800";case"SUCCESS":return"#00ff88";case"FAILURE":return"#ff2244";default:return"#aaa"}}function Q({launch:e,isUpcoming:o}){const[i,l]=d.useState(T(e.net));d.useEffect(()=>{if(!o)return;const a=setInterval(()=>l(T(e.net)),1e3);return()=>clearInterval(a)},[e.net,o]);const r=J(e.status.abbrev);return t.jsxs("div",{style:{borderLeft:`2px solid ${r}`,padding:"10px 10px 10px 12px",marginBottom:"8px",background:"rgba(0,20,40,0.5)",borderRadius:"2px"},children:[e.image&&t.jsx("img",{src:e.image,alt:e.name,style:{width:"100%",height:"80px",objectFit:"cover",borderRadius:"2px",marginBottom:"6px"},onError:a=>{a.target.style.display="none"}}),t.jsx("div",{style:{color:"#e0e8f0",fontSize:"11px",fontWeight:"bold",marginBottom:"4px",lineHeight:1.3},children:e.name}),t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"3px"},children:[t.jsx("span",{style:{color:r,fontSize:"10px"},children:e.status.abbrev||e.status.name}),t.jsx("span",{style:{color:"#ffdd00",fontSize:"10px"},children:i})]}),t.jsxs("div",{style:{color:"#4a7a8a",fontSize:"10px",marginBottom:"2px"},children:[e.rocket.name," · ",e.agency.abbrev||e.agency.name]}),t.jsx("div",{style:{color:"#3a5a6a",fontSize:"10px"},children:e.pad.name}),e.mission.orbit&&t.jsxs("div",{style:{color:"#2a8aaa",fontSize:"10px",marginTop:"2px"},children:["↗ ",e.mission.orbit]})]})}function ee({data:e,loading:o}){const[i,l]=d.useState(!1),[r,a]=d.useState("upcoming"),s=d.useRef(null),n=(e==null?void 0:e.upcoming)??[],c=(e==null?void 0:e.previous)??[],p=r==="upcoming"?n:c;return t.jsxs(t.Fragment,{children:[t.jsx("button",{onClick:()=>l(!i),style:{position:"fixed",top:"58px",left:"10px",zIndex:1e3,background:i?"rgba(0,212,255,0.15)":"rgba(5,8,16,0.9)",border:`1px solid ${i?"#00d4ff":"#00d4ff44"}`,color:"#00d4ff",fontFamily:"'Share Tech Mono', monospace",fontSize:"12px",padding:"6px 14px",cursor:"pointer",borderRadius:"2px",letterSpacing:"2px",textShadow:i?"0 0 8px #00d4ff88":"none"},children:"◈ SPACE"}),t.jsxs("div",{ref:s,style:{position:"fixed",top:"48px",left:0,bottom:0,width:"300px",background:"rgba(4,8,18,0.97)",borderRight:"1px solid #00d4ff22",zIndex:999,transform:i?"translateX(0)":"translateX(-100%)",transition:"transform 0.25s ease",display:"flex",flexDirection:"column",fontFamily:"'Share Tech Mono', monospace"},children:[t.jsxs("div",{style:{padding:"12px 16px",borderBottom:"1px solid #00d4ff22",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[t.jsx("span",{style:{color:"#00d4ff",fontSize:"13px",letterSpacing:"2px"},children:"LAUNCH TRACKER"}),t.jsx("button",{onClick:()=>l(!1),style:{background:"none",border:"none",color:"#4a7a8a",cursor:"pointer",fontSize:"16px"},children:"×"})]}),t.jsx("div",{style:{display:"flex",borderBottom:"1px solid #00d4ff11"},children:["upcoming","previous"].map(f=>t.jsx("button",{onClick:()=>a(f),style:{flex:1,background:"none",border:"none",borderBottom:r===f?"2px solid #00d4ff":"2px solid transparent",color:r===f?"#00d4ff":"#4a7a8a",fontFamily:"'Share Tech Mono', monospace",fontSize:"11px",padding:"8px",cursor:"pointer",letterSpacing:"1px",textTransform:"uppercase"},children:f==="upcoming"?`UPCOMING (${n.length})`:`PREVIOUS (${c.length})`},f))}),t.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"10px 12px"},children:[o&&t.jsx("div",{style:{color:"#4a7a8a",fontSize:"11px",textAlign:"center",padding:"20px"},children:"LOADING DATA..."}),!o&&p.length===0&&t.jsx("div",{style:{color:"#4a7a8a",fontSize:"11px",textAlign:"center",padding:"20px"},children:"NO DATA AVAILABLE"}),p.map(f=>t.jsx(Q,{launch:f,isUpcoming:r==="upcoming"},f.id))]}),e&&t.jsxs("div",{style:{padding:"8px 12px",borderTop:"1px solid #00d4ff11",color:"#2a4a5a",fontSize:"10px"},children:["Last sync: ",new Date(e.fetchedAt).toUTCString()]})]})]})}function A(e){return e>=8?"#ff2244":e>=6?"#ff8800":e>=4?"#ffdd00":"#00d4ff"}function te(e){return e>=8?"EXTREME":e>=6?"SEVERE":e>=5?"STRONG":e>=4?"MODERATE":e>=2?"MINOR":"QUIET"}function S({label:e,value:o}){const i=parseInt(o||"0",10),l=i>=4?"#ff2244":i>=3?"#ff8800":i>=2?"#ffdd00":i>=1?"#00d4ff":"#2a4a5a";return t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[t.jsx("span",{style:{color:"#3a5a6a",fontSize:"10px"},children:e}),t.jsx("span",{style:{color:l,fontWeight:"bold",fontSize:"12px",minWidth:"16px",textShadow:i>=1?`0 0 6px ${l}88`:"none"},children:i>0?`${e}${i}`:"--"})]})}function oe({data:e,loading:o}){var s,n,c,p,f,m;const[i,l]=d.useState(!1),r=(e==null?void 0:e.kp)??null,a=A(r??0);return t.jsxs("div",{style:{position:"fixed",bottom:"20px",right:"20px",zIndex:1e3,background:"rgba(4,8,18,0.95)",border:`1px solid ${r!==null&&r>=5?a:"#00d4ff22"}`,borderRadius:"4px",fontFamily:"'Share Tech Mono', monospace",fontSize:"12px",minWidth:"200px",maxWidth:"320px",boxShadow:r!==null&&r>=5?`0 0 20px ${a}44`:"0 0 10px rgba(0,0,0,0.5)",transition:"all 0.3s"},children:[t.jsxs("div",{onClick:()=>l(!i),style:{padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"},children:[t.jsx("div",{style:{color:"#00d4ff55",fontSize:"10px",letterSpacing:"2px"},children:"SPACE WEATHER"}),o?t.jsx("span",{style:{color:"#4a7a8a",fontSize:"11px"},children:"LOADING..."}):r!==null?t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[t.jsx("span",{style:{color:"#4a7a8a",fontSize:"10px"},children:"Kp"}),t.jsx("span",{style:{color:a,fontSize:"20px",fontWeight:"bold",textShadow:`0 0 12px ${a}88`},children:r.toFixed(1)}),t.jsx("span",{style:{color:a,fontSize:"10px"},children:te(r)})]}):t.jsx("span",{style:{color:"#4a7a8a",fontSize:"11px"},children:"N/A"}),t.jsx("span",{style:{color:"#4a7a8a",fontSize:"14px"},children:i?"▼":"▲"})]}),i&&e&&t.jsxs("div",{style:{borderTop:"1px solid #00d4ff22",padding:"10px 14px"},children:[t.jsxs("div",{style:{display:"flex",gap:"16px",marginBottom:"10px"},children:[t.jsx(S,{label:"G",value:((n=(s=e.scales)==null?void 0:s.G)==null?void 0:n.current)??"0"}),t.jsx(S,{label:"S",value:((p=(c=e.scales)==null?void 0:c.S)==null?void 0:p.current)??"0"}),t.jsx(S,{label:"R",value:((m=(f=e.scales)==null?void 0:f.R)==null?void 0:m.current)??"0"})]}),e.kpForecast.length>0&&t.jsxs("div",{style:{marginBottom:"10px"},children:[t.jsx("div",{style:{color:"#3a5a6a",fontSize:"10px",marginBottom:"4px"},children:"Kp FORECAST"}),t.jsx("div",{style:{display:"flex",alignItems:"flex-end",gap:"2px",height:"32px"},children:e.kpForecast.slice(-24).map((x,b)=>{const y=Math.max(2,x.kp/9*32),z=A(x.kp);return t.jsx("div",{title:`${x.time}: Kp ${x.kp}`,style:{flex:1,height:`${y}px`,background:z,opacity:.7,borderRadius:"1px 1px 0 0"}},b)})})]}),e.alerts.length>0&&t.jsxs("div",{children:[t.jsxs("div",{style:{color:"#ff8800",fontSize:"10px",marginBottom:"4px",letterSpacing:"1px"},children:["⚠ NOAA ALERTS (",e.alerts.length,")"]}),t.jsx("div",{style:{maxHeight:"120px",overflowY:"auto"},children:e.alerts.slice(0,5).map((x,b)=>{var y;return t.jsxs("div",{style:{color:"#8ab4c8",fontSize:"10px",padding:"4px 0",borderBottom:"1px solid #1a2a3a",lineHeight:1.4},children:[t.jsx("span",{style:{color:"#ff8800"},children:(y=x.issued)==null?void 0:y.slice(0,10)})," ",x.message.slice(0,80),"..."]},b)})})]}),t.jsxs("div",{style:{color:"#1a3a4a",fontSize:"10px",marginTop:"8px"},children:["Updated: ",e.fetchedAt?new Date(e.fetchedAt).toUTCString().slice(0,25):"N/A"]})]})]})}const ne="https://space-monitoring-production.up.railway.app";function re(){const[e,o]=d.useState(null),[i,l]=d.useState(!0),[r,a]=d.useState(null),s=d.useCallback(async()=>{try{const n=await fetch(`${ne}/launches`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const c=await n.json();o(c),a(null)}catch(n){a(n instanceof Error?n.message:"Unknown error")}finally{l(!1)}},[]);return d.useEffect(()=>{s();const n=setInterval(s,6*3600*1e3);return()=>clearInterval(n)},[s]),{data:e,loading:i,error:r,refresh:s}}const se="https://space-monitoring-production.up.railway.app";function ie(){const[e,o]=d.useState([]),[i,l]=d.useState(!0),[r,a]=d.useState(null),s=d.useCallback(async()=>{try{const n=await fetch(`${se}/decay`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const c=await n.json();o(c),a(null)}catch(n){a(n instanceof Error?n.message:"Unknown error")}finally{l(!1)}},[]);return d.useEffect(()=>{s();const n=setInterval(s,12*3600*1e3);return()=>clearInterval(n)},[s]),{data:e,loading:i,error:r}}const ae="https://space-monitoring-production.up.railway.app";function le(){const[e,o]=d.useState([]),[i,l]=d.useState(!0),[r,a]=d.useState(null),s=d.useCallback(async()=>{try{const n=await fetch(`${ae}/tip`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const c=await n.json();o(c),a(null)}catch(n){a(n instanceof Error?n.message:"Unknown error")}finally{l(!1)}},[]);return d.useEffect(()=>{s();const n=setInterval(s,6*3600*1e3);return()=>clearInterval(n)},[s]),{data:e,loading:i,error:r}}const ce="https://space-monitoring-production.up.railway.app";function de(){const[e,o]=d.useState(null),[i,l]=d.useState(!0),[r,a]=d.useState(null),s=d.useCallback(async()=>{try{const n=await fetch(`${ce}/spaceweather`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const c=await n.json();o(c),a(null)}catch(n){a(n instanceof Error?n.message:"Unknown error")}finally{l(!1)}},[]);return d.useEffect(()=>{s();const n=setInterval(s,15*60*1e3);return()=>clearInterval(n)},[s]),{data:e,loading:i,error:r}}const C="https://space-monitoring-production.up.railway.app";function pe(){const[e,o]=d.useState([]),[i,l]=d.useState(!0),[r,a]=d.useState(null),s=d.useCallback(async()=>{try{const c=await fetch(`${C}/events`);if(!c.ok)throw new Error(`HTTP ${c.status}`);const p=await c.json();o(p),a(null)}catch(c){a(c instanceof Error?c.message:"Unknown error")}finally{l(!1)}},[]),n=d.useCallback(async()=>{try{await fetch(`${C}/refresh`,{method:"POST"}),setTimeout(s,5e3)}catch{}},[s]);return d.useEffect(()=>{s();const c=setInterval(s,6*3600*1e3);return()=>clearInterval(c)},[s]),{data:e,loading:i,error:r,forceRefresh:n}}function fe(){var n;const{data:e,loading:o}=re(),{data:i}=ie(),{data:l}=le(),{data:r,loading:a}=de(),{data:s}=pe();return t.jsxs("div",{style:{width:"100vw",height:"100vh",background:"#0a0e1a",overflow:"hidden"},children:[t.jsx(q,{launchCount:((n=e==null?void 0:e.upcoming)==null?void 0:n.length)??0,decayCount:i.length,tipCount:l.length,eventCount:s.length,kp:(r==null?void 0:r.kp)??null}),t.jsx(ee,{data:e,loading:o}),t.jsx("div",{style:{position:"absolute",top:"48px",left:0,right:0,bottom:0},children:t.jsx(Z,{launches:e,decay:i,tip:l,events:s})}),t.jsx(oe,{data:r,loading:a})]})}E.createRoot(document.getElementById("root")).render(t.jsx(P.StrictMode,{children:t.jsx(fe,{})}));
