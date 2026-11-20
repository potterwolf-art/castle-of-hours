gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code = {};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.localVariables = [];
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.idToCallbackMap = new Map();
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.GDBackgroundObjects1= [];


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6098 = function GDJSInlineCode(runtimeScene) {
// Domain rules shared by the scene, its journal, and the GDevelop preview.
if (!window.CastleMoonRules) {
  const STATE_KEY = 'castleOfHours.moonTower.v1';
  const DAY = 24 * 60 * 60 * 1000;
  const ids = ['MoonWindowLevel','TelescopeLevel','LibraryLevel','CatCornerLevel','TarotTableLevel'];
  const costs = [12,30,54];
  const duration = {study:[1,240,25],short:[1,120,5],long:[1,240,15]};
  const integer = (v, fallback = 0) => Number.isFinite(v) ? Math.max(0,Math.floor(v)) : fallback;
  const bounded = (v,min,max) => Math.max(min,Math.min(max,v));
  function localDay(time) {
    const d = new Date(time);
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  }
  function sumLevels(s) { return ids.reduce((sum,id) => sum+s.levels[id],0); }
  function completion(s) {
    const sum=sumLevels(s);
    s.RestorationProgress = Math.round(100*sum/15);
    s.TowerCompleted = sum===15;
  }
  function fromSave(raw = {}, now = 0) {
    if (!raw || typeof raw!=='object') raw={};
    const legacy = raw.moonVersion !== 2;
    const oldIndices=[3,0,1,4,2];
    const levels=Object.fromEntries(ids.map((id,i)=>[id,bounded(integer(legacy?raw.levels?.[oldIndices[i]]:raw.levels?.[id]),0,3)]));
    const prefs={};
    for(const [k,[min,max,value]] of Object.entries(duration)) {
      prefs[k]=bounded(integer(raw.prefs?.[k],value),min,max);
    }
    prefs.sound=['bell','mew','chimes','harp','starlight','crystal','silent'].includes(raw.prefs?.sound)?raw.prefs.sound:'bell';
    prefs.volume=bounded(integer(raw.prefs?.volume,65),0,100);
    const earned=integer(raw.earned);
    const studyStates=['IDLE','STUDY','SHORT_BREAK','LONG_BREAK','READY'];
    let phase=studyStates.includes(raw.phase)?raw.phase:'IDLE';
    let endAt=integer(raw.endAt), minutes=integer(raw.intervalMinutes);
    if(legacy) {
      // Old builds already paid for completed focus before entering countdown/rest.
      if(raw.running && (raw.phase==='rest' || raw.phase==='countdown')) {
        endAt+=raw.phase==='countdown'?prefs.short*60000:0;
        phase=endAt>now?'SHORT_BREAK':'READY'; minutes=prefs.short;
      } else if(raw.phase==='ready') phase='READY';
    }
    if(!['STUDY','SHORT_BREAK','LONG_BREAK'].includes(phase)||!endAt) {
      if(['STUDY','SHORT_BREAK','LONG_BREAK'].includes(phase)) phase='IDLE';
      endAt=0;minutes=0;
    }
    const previous=raw.journal || {};
    const opened=[...new Set((Array.isArray(raw.tarot?.opened)?raw.tarot.opened:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<22))];
    const s={moonVersion:2, coins:integer(raw.coins),earned,levels,prefs,phase,endAt,intervalMinutes:minutes,
      owner:typeof raw.owner==='string'?raw.owner:'', cycle:bounded(integer(raw.cycle),0,4),
      remainder:integer(raw.remainder)%25,
      journal:{total:integer(previous.total,legacy?25*earned:0),sessions:integer(previous.sessions,legacy?earned:0),days:previous.days&&typeof previous.days==='object'?previous.days:{}},
      tarot:{opened,newTarotNotification:raw.tarot?.newTarotNotification===true,last:opened.includes(raw.tarot?.last)?raw.tarot.last:null,at:integer(raw.tarot?.at),complete:opened.length===22},
      FinalCelebrationShown:Boolean(raw.FinalCelebrationShown)
    };
    s.companionStopAt=Number.isFinite(raw.companionStopAt)?raw.companionStopAt:0;
    s.lastCompanionStop=typeof raw.lastCompanionStop==='string'?raw.lastCompanionStop:'';
    s.companionStops=window.CastleClockSignals.stops(raw).slice(-12);
    s.miniKey=endAt ? (typeof raw.miniKey==='string' && raw.miniKey ? raw.miniKey : phase+'/'+endAt) : '';
    s.pausedRemainingMs=endAt && Number.isFinite(raw.pausedRemainingMs) ?
      bounded(raw.pausedRemainingMs,0,minutes*60000) : null;
    completion(s);
    if(legacy&&s.TowerCompleted) s.FinalCelebrationShown=true;
    return s;
  }
  function start(s,now,owner) {
    if(!['IDLE','READY'].includes(s.phase)) return false;
    s.phase='STUDY';s.intervalMinutes=s.prefs.study;s.endAt=now+s.intervalMinutes*60000;s.owner=owner;
    s.pausedRemainingMs=null;s.miniKey='STUDY/'+owner+'/'+now;
    return true;
  }
  function abandon(s) {
    if(s.phase!=='STUDY')return false;
    window.CastleClockSignals.mark(s,'moon/'+(s.miniKey||s.owner+'/'+s.endAt),Date.now());
    s.phase='IDLE';s.endAt=0;s.owner='';s.intervalMinutes=0;s.miniKey='';s.pausedRemainingMs=null;
    return true;
  }
  function finishRest(s,at=Date.now()) {
    if(!['SHORT_BREAK','LONG_BREAK'].includes(s.phase))return false;
    window.CastleClockSignals.mark(s,'moon/'+(s.miniKey||s.phase+'/'+s.endAt),at);
    if(s.phase==='LONG_BREAK')s.cycle=0;
    s.phase='READY';s.intervalMinutes=0;s.endAt=0;s.owner='';s.miniKey='';s.pausedRemainingMs=null;
    return true;
  }
  function reconcile(s,clock,real,owner,speed=1) {
    const events=[];
    if(s.pausedRemainingMs!=null)return events;
    if(s.phase==='STUDY' && s.owner===owner && clock>=s.endAt) {
      const end=s.endAt, minutes=s.intervalMinutes;
      window.CastleClockSignals.mark(s,'moon/'+(s.miniKey||owner+'/'+end),real-Math.max(0,clock-end)/Math.max(1,speed));
      const day=localDay(real-Math.max(0,clock-end)/Math.max(1,speed));
      const rec=s.journal.days[day] || {minutes:0,sessions:0};
      s.journal.days[day]={minutes:rec.minutes+minutes,sessions:rec.sessions+1};
      s.journal.total+=minutes;s.journal.sessions++;
      const credit=s.remainder+minutes, reward=Math.floor(credit/25);
      s.remainder=credit%25;s.coins+=reward;s.earned+=reward;
      s.cycle=Math.min(4,s.cycle+1);
      s.phase=s.cycle===4?'LONG_BREAK':'SHORT_BREAK';
      s.intervalMinutes=s.cycle===4?s.prefs.long:s.prefs.short;
      s.endAt=end+s.intervalMinutes*60000;s.owner='';s.miniKey=s.phase+'/'+s.endAt;s.pausedRemainingMs=null;
      events.push({type:'study',reward,minutes,alertId:'moon/study/'+owner+'/'+end});
    }
    if((s.phase==='SHORT_BREAK'||s.phase==='LONG_BREAK')&&clock>=s.endAt) {
      const restEnd=s.endAt; finishRest(s,real-Math.max(0,clock-restEnd)/Math.max(1,speed)); events.push({type:'rest',alertId:'moon/rest/'+restEnd});
    }
    return events;
  }
  function upgrade(s,id,expected) {
    const level=s.levels[id];
    if(!ids.includes(id)||level!==expected||level>=3||s.coins<costs[level])return null;
    s.coins-=costs[level];s.levels[id]=level+1;completion(s);
    const celebrate=s.TowerCompleted&&!s.FinalCelebrationShown;
    if(celebrate)s.FinalCelebrationShown=true;
    return {level:level+1,celebrate};
  }
  function draw(s,real,random=Math.random) {
    if(s.tarot.last!==null&&real<s.tarot.at+DAY)return {id:s.tarot.last,fresh:false};
    const deck=Array.from({length:22},(_,i)=>i);
    const pool=s.tarot.complete?deck:deck.filter(id=>!s.tarot.opened.includes(id));
    const id=pool[Math.floor(random()*pool.length)],wasComplete=s.tarot.complete;
    if(!s.tarot.opened.includes(id)){s.tarot.opened.push(id);s.tarot.newTarotNotification=true;}
    s.tarot.last=id;s.tarot.at=real;s.tarot.complete=s.tarot.opened.length===22;
    return {id,fresh:true,completed:!wasComplete&&s.tarot.complete};
  }
  function timeLeft(s,now) {
    if(s.pausedRemainingMs!=null)return s.pausedRemainingMs;
    return s.endAt?Math.max(0,s.endAt-now):s.prefs.study*60000;
  }
  function remaining(s,now){return Math.ceil(timeLeft(s,now)/1000);}
  function pause(s,key,paused,now,owner){
    if(!s.endAt||s.miniKey!==key||(s.phase==='STUDY'&&s.owner!==owner)||(s.pausedRemainingMs!=null)===paused)return false;
    if(paused)s.pausedRemainingMs=timeLeft(s,now);
    else {s.endAt=now+s.pausedRemainingMs;s.pausedRemainingMs=null;}
    return true;
  }
  function clockText(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
  async function hasLiveOwner(owner) {
    if(!owner)return false;
    if(navigator.locks?.query){
      try{return (await navigator.locks.query()).held.some(lock=>lock.name==='castleOfHours.moon.page.'+owner);}catch{}
    }
    if(!window.BroadcastChannel)return false;
    const probe=new BroadcastChannel('castleOfHours.moon.presence');
    const requester=window.crypto?.randomUUID?.()||String(Math.random());
    return new Promise(resolve=>{
      const done=alive=>{clearTimeout(timeout);probe.close();resolve(alive);};
      const timeout=setTimeout(()=>done(false),350);
      probe.onmessage=({data})=>{if(data?.alive===owner&&data?.for===requester)done(true);};
      probe.postMessage({ask:owner,requester});
    });
  }
  window.CastleMoonRules={hasLiveOwner,STATE_KEY,DAY,ids,costs,duration,fromSave,localDay,start,abandon,finishRest,reconcile,upgrade,draw,remaining,timeLeft,pause,clockText};
}
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0x81cc80 = function GDJSInlineCode(runtimeScene) {
if(typeof window!=='undefined'&&!window.__castleVkResourceChecked){
  window.__castleVkResourceChecked=true;
  if(!window.__castleVkLaunch&&(window.vkBridge?.send||new URLSearchParams(location.search).has('vk_app_id')||new URLSearchParams(location.hash.slice(1)).has('vk_app_id'))){
    const file=runtimeScene.getGame().getGameData().resources.resources.find(r=>r.name==='VKLaunch.js');
    if(file){const tag=document.createElement('script');tag.src=file.file;document.head.appendChild(tag);}
  }
}
// Shared control illustrations and resource URLs follow the GDevelop export map.
if(typeof window!=='undefined' && typeof document!=='undefined' && !window.__castleVisuals){
  const resources=new Map(runtimeScene.getGame().getGameData().resources.resources.map(r=>[r.name,r.file]));
  const url=name=>resources.get(name)||name;
  // The native cursor is shared by all scenes and all DOM overlays.
  const cursorScript=document.createElement('script');
  cursorScript.src=url('MagicCursor.js');
  const cursorResources={};
  for(const state of ['default','hover','pressed']){
    for(const suffix of ['', '_2x']){
      const file='cursor_magic_'+state+suffix+'.png';
      cursorResources[file]=url(file);
    }
  }
  cursorScript.dataset.cursorResources=JSON.stringify(cursorResources);
  document.head.append(cursorScript);
  const cssUrl=name=>'url('+JSON.stringify(url(name))+')';
  const icons=["album", "back", "book", "cat", "chair", "chart", "clock", "close", "doors", "fire", "gear", "home", "hourglass", "leaf", "moon", "music", "mute", "pause", "play", "quill", "right", "speaker", "stop", "telescope", "window"];
  const style=document.createElement('style');style.id='castle-control-material';
  const fonts=[];
  for(const weight of [500,600]){
    for(const [lang,range] of [['latin','U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC'],['cyrillic','U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116']]){
      fonts.push("@font-face{font-family:'Castle Garamond';font-weight:"+weight+";font-style:normal;font-display:swap;src:"+cssUrl('CastleGaramond_'+lang+'_'+weight+'.woff2')+" format('woff2');unicode-range:"+range+"}");
    }
  }
  style.textContent=fonts.join('\n')+'\n:root{--coh-star:'+cssUrl('Adventure_Star.png')+'}'+
    icons.map(key=>'[data-coh-action="'+key+'"]{--coh-glyph:'+cssUrl('Control_'+key+'.png')+'}').join('\n')+
    "/* The same control material is used with a single, cream-coloured symbol. */\n[data-coh-action]{--disc-size:62px;position:relative;width:var(--disc-size)!important;height:var(--disc-size)!important;min-width:0!important;border:0!important;border-radius:50%!important;background:none!important;box-shadow:none!important;color:transparent!important;font-size:0!important;padding:0!important;cursor:pointer;touch-action:manipulation;isolation:isolate}\n[data-coh-action][data-compact]{--disc-size:41px}\n[data-coh-action]::before{content:\"\"!important;position:absolute;inset:0;display:block;background:var(--coh-glyph) center/contain no-repeat;transform:scale(var(--coh-disc-x,1),var(--coh-disc-y,1));filter:drop-shadow(0 2px 2px #29160970);transition:filter .2s ease,translate .12s ease;pointer-events:none}\n[data-coh-action]:is(:hover,:focus-visible)::before{filter:brightness(1.1) drop-shadow(0 0 5px #ffc37a8a)}\n[data-coh-action]:active::before{translate:0 1px;filter:brightness(1.04)}\n[data-coh-action]:focus-visible{outline:2px solid #ffdf9b!important;outline-offset:2px}\n[data-coh-action][disabled]{cursor:default}\n[data-coh-action][disabled]::before{filter:saturate(.4);opacity:.66}\n.coh-mini{display:inline-block;width:31px;height:31px;vertical-align:middle;object-fit:contain}\n.coh-star,.book-coin{display:inline-block;width:1.12em;height:1.12em;vertical-align:-.18em;background:var(--coh-star) center/contain no-repeat!important;image-rendering:auto!important}\n#castle-adventure-ui .coh-balance{position:absolute;top:20px;right:95px;min-width:117px;width:auto;height:48px;display:flex;align-items:center;justify-content:center;gap:6px;padding:4px 15px 5px 10px;border:1px solid #cea469;border-radius:21px;background:linear-gradient(100deg,#58331dba,#43271bbc)!important;color:#fff0ce;font:600 28px/1 'Castle Garamond',Georgia,serif;white-space:nowrap;font-variant-numeric:lining-nums tabular-nums;box-shadow:inset 0 1px #f0ca8921,0 2px 4px #34201548;text-shadow:0 1px 3px #301b0d}\n#castle-adventure-ui .coh-balance .coh-star{width:35px;height:35px;flex:none}\n#castle-adventure-ui .room-icon[data-coh-action]{background:none!important;filter:none!important;image-rendering:auto}\n#castle-adventure-ui .room-icon[data-coh-action] .sword-caption,#castle-adventure-ui .room-icon[data-coh-action] .rest-chip-title{color:#ffedc4;bottom:-12px}\n#castle-adventure-ui .room-icon[data-coh-action] .rest-chip-time{color:#ffedc4;z-index:1}\n#castle-adventure-ui .room-icon.home-sword-chip[data-coh-action]{left:609px}\n#castle-adventure-ui .room-icon.album-trigger[data-coh-action]{right:111px;bottom:26px}\n#castle-adventure-ui .room-icon.home-book-chip[data-coh-action]{right:27px}\n#castle-adventure-ui .home-rest-panel .rest-stop[data-coh-action]{vertical-align:middle}\n#castle-adventure-ui .book-chapter .chapter-icon{background:none;border:0}\n#castle-adventure-ui .book-chapter .coh-mini{width:41px;height:41px}\n#cozy-settings-root .castle-audio-options .music-toggle{display:flex;align-items:center;gap:7px}\n#cozy-settings-root .castle-audio-options label .coh-mini{width:25px;height:25px;margin-right:6px}\n#castle-moon-tower .shop-row .zone-icon .coh-mini{width:37px;height:37px}\n\n#castle-adventure-ui.adventure-stage{position:fixed;z-index:2147482200;overflow:hidden;pointer-events:none;isolation:isolate;background:#2c2019;font-family:'Castle Garamond',Georgia,serif;color:#ffebc5}\n.adventure-stage *{box-sizing:border-box}\n.adventure-stage::before{content:\"\";position:absolute;inset:-22px;background:var(--scene-paint) center/cover;filter:blur(17px) brightness(.51)}\n.adventure-stage .ad-canvas{position:absolute;left:50%;top:50%;width:1280px;height:720px;transform-origin:50% 50%;background:var(--scene-paint) center/100% 100% no-repeat;overflow:hidden;--coh-disc-x:1;--coh-disc-y:1}\n.adventure-stage button{font-family:inherit;pointer-events:auto}\n.adventure-stage [hidden]{display:none!important}\n.adventure-stage .ad-nav,.adventure-stage .ad-settings{position:absolute;top:12px;z-index:3}\n.adventure-stage .ad-nav{left:17px}.adventure-stage .ad-settings{right:17px}\n.adventure-stage h1,.adventure-stage p{margin:0}\n.adventure-stage .ad-header{position:absolute;top:14px;left:215px;right:215px;text-align:center;text-shadow:0 2px 5px #321c10,0 0 16px #342519bb;pointer-events:none}\n.adventure-stage .ad-heading{font-size:52px;font-weight:600;line-height:1.03;letter-spacing:.005em;color:#ffebc4}\n.adventure-stage .ad-sub{font-size:24px;line-height:1.12;margin-top:4px;font-weight:600}\n.adventure-stage .ad-corridor-hint{position:absolute;left:10%;right:10%;bottom:21px;text-align:center;font-size:24px;font-weight:600;line-height:1.15;text-shadow:0 1px 4px #2b1b11,0 0 10px #342013}\n.adventure-stage .ad-corridor-hint::before,.adventure-stage .ad-corridor-hint::after{content:\"\";width:53px;height:1px;vertical-align:middle;display:inline-block;margin:0 14px;background:linear-gradient(90deg,transparent,#e2b777)}\n.adventure-stage .ad-corridor-hint::after{transform:rotate(180deg)}\n.adventure-stage .castle-door{position:absolute;background:transparent;border:0;padding:0;cursor:pointer;border-radius:48% 48% 1% 1% / 30% 30% 1% 1%;-webkit-tap-highlight-color:transparent;touch-action:manipulation}\n.adventure-stage .door-leaf{position:absolute;inset:0;display:block;pointer-events:none;background-position:center;background-repeat:no-repeat;background-size:100% 100%}\n.adventure-stage .door-leaf{transition:filter .22s}\n.adventure-stage .castle-door:is(:hover,:focus-visible):not(:disabled) .door-leaf{filter:brightness(1.16) drop-shadow(0 0 3px #f5b96d)}\n.adventure-stage .castle-door:focus-visible{outline:2px solid #ffdfa1;outline-offset:-4px}\n.adventure-stage .castle-door[data-state=waiting] .door-leaf{filter:brightness(1.13)}\n.adventure-stage .castle-door[data-state=locked] .door-leaf{filter:brightness(.81) saturate(.83)}\n.adventure-stage .castle-resume{position:absolute;left:50%;bottom:56px;transform:translateX(-50%);max-width:820px;width:max-content;text-align:center;padding:11px 21px 13px;border:1px solid #c39b66;border-radius:15px;background:#422c1cef;box-shadow:0 3px 13px #26180b66;pointer-events:auto}\n.adventure-stage .resume-text{font-size:23px;line-height:1.15;margin-bottom:8px}\n.adventure-stage .text-button{font:600 22px/1.12 'Castle Garamond',Georgia,serif;min-height:38px;padding:6px 18px;border-radius:13px;border:1px solid #cca071;background:linear-gradient(#895932,#654024);color:#fff0d0;cursor:pointer;box-shadow:0 1px 3px #462b1a40}\n.adventure-stage .text-button:hover,.adventure-stage .text-button:focus-visible{filter:brightness(1.09);outline:1px solid #ebc88d}\n.adventure-stage .actions{display:flex;justify-content:center;gap:12px}\n.adventure-stage .ad-study-heading{top:15px}\n.adventure-stage .ad-study-heading .ad-heading{font-size:44px}\n.adventure-stage .ad-study-heading .ad-heading::before,.adventure-stage .ad-study-heading .ad-heading::after{content:\"❧\";display:inline-block;font-size:31px;color:#eed098;font-weight:400;vertical-align:5px;margin:0 14px}\n.adventure-stage .ad-study-heading .ad-heading::after{transform:scaleX(-1)}\n.adventure-stage .ad-timer{position:absolute;left:0;right:0;top:26.6%;height:45.5%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;isolation:isolate;text-align:center}\n.adventure-stage .ad-timer::before{content:\"\";position:absolute;z-index:-1;left:12%;right:12%;top:-18%;bottom:-7%;background:radial-gradient(ellipse at center,#2d241a87 0%,#332a2077 30%,#3c30224d 52%,transparent 74%);pointer-events:none}\n.adventure-stage .clock-time{font-family:'Castle Garamond',Georgia,serif;font-variant-numeric:lining-nums tabular-nums;font-weight:500;font-size:221px;line-height:1;letter-spacing:-.025em;color:#ffe5ac;text-shadow:0 2px 5px #48351e88,0 1px 15px #432f1d4d}\n.adventure-stage .clock-divider{display:flex;align-items:center;gap:12px;height:31px;margin-top:1px;color:#fada9e;font:24px/1 Georgia,serif}\n.adventure-stage .clock-divider::before,.adventure-stage .clock-divider::after{content:\"\";height:1px;width:110px;background:linear-gradient(90deg,transparent,#efcc88)}\n.adventure-stage .clock-divider::after{transform:rotate(180deg)}\n.adventure-stage .clock-label{font-weight:600;font-size:31px;line-height:1.2;margin-top:1px;color:#ffebba;text-shadow:0 2px 5px #3a301c,0 0 8px #3a301c7a}\n.adventure-stage .legacy-resume{margin-top:10px}\n.adventure-stage .castle-modal-shade{position:absolute;inset:0;display:grid;place-items:center;z-index:5;pointer-events:auto;background:#2d201ab5}\n.adventure-stage .castle-modal{max-width:630px;padding:26px 37px;text-align:center;color:#4e3221;background:linear-gradient(130deg,#f8e3bb,#f2d6aa 58%,#f8e6c3);border:2px solid #ba925e;border-radius:19px;box-shadow:0 10px 32px #26170d66}\n.adventure-stage .castle-modal h2{margin:0 0 5px;font-weight:600;font-size:39px;line-height:1.07}\n.adventure-stage .castle-modal p{font-size:25px;line-height:1.16;margin:9px 0 18px}\n.adventure-stage .reward-chip{display:inline-flex;align-items:center;gap:.13em;font-weight:600;white-space:nowrap}\n.adventure-stage .castle-door[data-state=chosen] .door-leaf{filter:brightness(1.09)}\n@media(prefers-reduced-motion:reduce){.adventure-stage .door-leaf,[data-coh-action]::before{transition:none!important}}\n#castle-adventure-ui .book-art .coh-mini{width:80px;height:80px}\n\n.adventure-stage .ad-nav::after,.adventure-stage .ad-settings::after{content:'';position:absolute;top:0;width:var(--ad-touch-size,62px);height:var(--ad-touch-size,62px);border-radius:50%}\n.adventure-stage .ad-nav::after{left:0}.adventure-stage .ad-settings::after{right:0}\n";
  for(const [key,name] of Object.entries({"paper-strip": "Parchment_Strip.webp", "paper-seal": "Parchment_Seal.webp", "ink-hourglass": "Ink_hourglass.png", "ink-doors": "Ink_doors.png", "ink-deck": "Ink_deck.png", "ink-right": "Ink_right.png", "ink-star": "Ink_star.png", "ink-moon": "Ink_moon.png"}))document.documentElement.style.setProperty('--'+key,cssUrl(name));
  style.textContent+='\n'+":root{--coh-ink:#51311f;--coh-russet:#754725;--coh-thread:#8e708d;--coh-shade:drop-shadow(0 2px 2px #35201665)}\n/* Artwork is the shared surface. The original button element owns focus, click and touch. */\n[data-coh-action][data-coh-action]{border-radius:10px!important}\n[data-coh-action][data-coh-action]::before{filter:var(--coh-shade);transition:filter .16s ease,scale .1s ease;image-rendering:auto}\n[data-coh-action][data-coh-action]:is(:hover,:focus-visible):not(:disabled)::before{filter:brightness(1.045) drop-shadow(0 0 4px #edbe75aa)}\n[data-coh-action][data-coh-action]:active:not(:disabled)::before{scale:.965;translate:none}\n:is(#castle-adventure-ui,#castle-moon-tower,#cozy-settings-root) :is(.text-button,.rest-start,.rest-finished-ok,.rest-presets button,.book-purchase,.book-chapter,.guest-entry,.moon-primary,.moon-secondary,.moon-smalllink,.cozy-language,.music-toggle,.progress-reset,.progress-dialog button,.preview-alert,.leave-rest button,.actions button:not([data-coh-action]),.unlock,.moon-days button){\n background:var(--paper-strip) center/100% 100% no-repeat!important;color:var(--coh-ink)!important;\n border:0!important;border-radius:5px!important;box-shadow:none!important;text-shadow:none!important;\n filter:var(--coh-shade);text-decoration:none!important;cursor:pointer;touch-action:manipulation;transition:filter .16s ease,scale .1s ease;\n}\n:is(#castle-adventure-ui,#castle-moon-tower,#cozy-settings-root) :is(.text-button,.rest-start,.rest-finished-ok,.book-purchase,.moon-primary,.moon-secondary,.moon-smalllink,.preview-alert,.progress-reset,.progress-dialog button,.leave-rest button,.actions button:not([data-coh-action]),.unlock){padding:8px 19px 12px!important;font-family:'Castle Garamond',Georgia,serif}\n:is(#castle-adventure-ui,#castle-moon-tower,#cozy-settings-root) :is(.text-button,.rest-start,.rest-finished-ok,.rest-presets button,.book-purchase,.book-chapter,.guest-entry,.moon-primary,.moon-secondary,.moon-smalllink,.cozy-language,.music-toggle,.progress-reset,.progress-dialog button,.preview-alert,.leave-rest button,.actions button,.unlock,.moon-days button,.memory-thumb,.moon-slot):is(:hover,:focus-visible):not(:disabled){filter:brightness(1.045) drop-shadow(0 0 3px #c6934d8c)}\n:is(#castle-adventure-ui,#castle-moon-tower,#cozy-settings-root) button:where(:not(.castle-door,.room-cat,.moon-pet,.moon-prop,.moon-flip,[data-coh-action])):active:not(:disabled){scale:.975}\n:is(#castle-adventure-ui,#castle-moon-tower,#cozy-settings-root) button:focus-visible{outline:2px solid #865d81!important;outline-offset:1px}\n:is(#castle-adventure-ui,#castle-moon-tower,#cozy-settings-root) :is(.guest-entry[aria-pressed=true],.cozy-language[aria-pressed=true],.book-chapter.active,.rest-presets button.selected,.moon-days button.chosen){color:#50314e!important;text-decoration:underline!important;text-underline-offset:.2em;text-decoration-color:#a980a0!important}\n#castle-adventure-ui .book-chapter{padding:6px 14px 9px}#castle-adventure-ui .guest-entry{padding:6px 12px 9px}\n#castle-adventure-ui .book-purchase:disabled,#castle-moon-tower .buy:disabled{opacity:.66;cursor:default}\n#castle-adventure-ui .chapter-name,#castle-adventure-ui .guest-entry{color:var(--coh-ink)}\n#castle-adventure-ui .coh-balance.coh-balance,#castle-moon-tower .moon-wallet.moon-wallet{background:var(--paper-strip) center/100% 100% no-repeat!important;border:0!important;border-radius:0!important;box-shadow:none!important;text-shadow:none!important;color:var(--coh-ink)!important;filter:var(--coh-shade);padding:7px 18px 12px!important;gap:4px;white-space:nowrap}\n#castle-adventure-ui .coh-balance .coh-star{width:29px;height:29px;background:var(--ink-star) center/contain no-repeat!important}\n#castle-moon-tower .moon-wallet i{width:24px;height:24px;font-size:0;background:var(--ink-moon) center/contain no-repeat}\n#castle-adventure-ui .room-icon:is(.home-rest-chip,.home-sword-chip)[data-coh-action]{width:100px!important;height:77px!important;--disc-size:77px}\n#castle-adventure-ui .room-icon.home-sword-chip[data-coh-action]{left:590px}\n#castle-adventure-ui .room-icon:is(.home-rest-chip,.home-sword-chip)[data-coh-action]::before{background-image:var(--paper-seal);background-size:100% 100%}\n#castle-adventure-ui .home-rest-chip::after,#castle-adventure-ui .home-sword-chip::after{content:\"\";position:absolute;left:0;right:0;top:8%;height:50%;background:var(--ink-gl) center/contain no-repeat;pointer-events:none}\n#castle-adventure-ui .home-rest-chip{--ink-gl:var(--ink-hourglass)}#castle-adventure-ui .home-sword-chip{--ink-gl:var(--ink-doors)}\n#castle-adventure-ui .room-icon[data-coh-action] :is(.sword-caption,.rest-chip-title){bottom:17%!important;color:var(--coh-ink)!important;text-shadow:none;font:600 18px/1 'Castle Garamond',Georgia,serif}\n#castle-adventure-ui .room-icon .rest-chip-time:not(:empty){right:-13px;bottom:11px;color:var(--coh-ink)!important;background:var(--paper-strip) center/100% 100%;padding:3px 8px 6px;text-shadow:none}\n#castle-adventure-ui .memory-thumb{border:2px solid #b18b5f;border-radius:5px;background:#efdbb8}#castle-adventure-ui .memory-thumb[aria-pressed=true]{outline:2px solid #93728c}\n#castle-adventure-ui .leave-rest{max-width:min(470px,80%);background:#f5e2c1;color:var(--coh-ink);border:1px solid #9c805c;border-radius:12px;padding:22px 30px;text-align:center;font:600 24px 'Castle Garamond',serif}\n#castle-adventure-ui .leave-rest::backdrop{background:#34251b77}\n#castle-adventure-ui .leave-rest button{font-size:21px;margin:0 5px}\n#castle-moon-tower .moon-focus,#castle-moon-tower.portrait .moon-focus{left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;width:45%}\n#castle-moon-tower.portrait .moon-focus{width:68%}\n#castle-moon-tower .moon-cycle{width:100%}#castle-moon-tower .clock{text-align:center}\n#castle-moon-tower .moon-prop[data-item=MoonWindowLevel],#castle-moon-tower .moon-prop[data-item=TelescopeLevel]{clip-path:none}\n#castle-moon-tower .moon-prop[data-item=TelescopeLevel]{height:39%;width:17%;left:15%;bottom:18.3%}\n#castle-moon-tower .moon-prop[data-item=TelescopeLevel] .paint,#castle-moon-tower .moon-prop[data-item=CatCornerLevel][data-level=\"3\"] .paint{object-fit:contain}\n#castle-moon-tower .moon-prop[data-item=CatCornerLevel][data-level=\"3\"]{left:66.9%;bottom:6.9%;width:29%;height:21.4%;clip-path:none}\n#castle-moon-tower .moon-kitten.finished-nook{bottom:15.2%}\n#castle-moon-tower .moon-bar nav{gap:11px}\n#castle-moon-tower .moon-deck-icon{width:24px;height:24px;font-size:0;background:var(--ink-deck) center/contain no-repeat;border:0;box-shadow:none;transform:none}\n#castle-moon-tower .moon-cal-nav .next{transform:none}\n#castle-moon-tower .moon-slot{border-color:#987650}\n#castle-moon-tower .moon-slot:disabled{background:var(--paper-seal) center/100% 100% no-repeat;color:#7b5c40;border:0}\n#castle-moon-tower .moon-slot:disabled::before{display:none}\n#castle-moon-tower .moon-days button{background-image:var(--paper-seal)!important;padding-bottom:3px}\n#castle-moon-tower .moon-days .marked{color:#5c3d62!important;font-weight:700}\n#castle-moon-tower .moon-smalllink{line-height:1.15}\n#castle-moon-tower.portrait .moon-prop[data-item=TelescopeLevel]{height:27%;width:23%;left:8%;bottom:22%}\n#castle-moon-tower.portrait .moon-prop[data-item=CatCornerLevel][data-level=\"3\"]{width:40%;height:15%;left:55%;bottom:10.5%}\n#castle-moon-tower.portrait .moon-kitten.finished-nook{bottom:16.3%}\n.castle-notifications{border-top:1px solid #b6966d;padding-top:8px;margin-top:10px;text-align:left;color:var(--coh-ink);font:500 19px/1.15 'Castle Garamond',Georgia,serif}\n.castle-notifications label{display:block;margin:4px 0}\n.castle-notifications select{display:block;width:100%;margin:3px 0 8px;padding:5px 8px;color:var(--coh-ink);background:#faebd3;border:1px solid #af8a60;border-radius:4px;font:inherit}\n.castle-notifications input[type=range]{display:block;width:100%;accent-color:#8a6a83}\n.castle-notifications output{float:right}.castle-notifications .preview-alert{font-size:19px}\n#cozy-settings-root .cozy-panel{scrollbar-color:#a38866 #eddabc}\n\n\n@media(prefers-reduced-motion:reduce){button,button::before{transition-duration:.01s!important}}\n";
  style.textContent+="\n#cozy-settings-root .cozy-panel{max-height:670px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}\n#cozy-settings-root .castle-audio-options{font:500 20px/1.15 'Castle Garamond',Georgia,serif;text-align:left;margin:8px 0;border-top:1px solid #b59a71;padding-top:8px}\n#cozy-settings-root .castle-audio-options>label{display:block;margin:6px 0}#cozy-settings-root .castle-audio-options output{float:right}\n#cozy-settings-root .castle-audio-options input[type=range],#cozy-settings-root .castle-audio-options select{display:block;width:100%;accent-color:#846679}\n#cozy-settings-root .castle-audio-options select{font:inherit;background:#fff2d7;color:#543921;border:1px solid #aa885b;border-radius:4px;padding:4px}\n.castle-desktop-alerts label,#cozy-settings-root .switch-line,#castle-moon-tower .tower-switch{display:flex;align-items:center;gap:9px;cursor:pointer}\n.castle-desktop-alerts input[type=checkbox],#cozy-settings-root .switch-line input,#castle-moon-tower .tower-switch input{width:18px;height:18px;accent-color:#805e72;flex:0 0 auto}\n.castle-desktop-alerts small:empty{display:none}\n#cozy-settings-root .castle-desktop-alerts{border-top:1px solid #b59a71;margin:12px 0;padding-top:8px}\n#cozy-settings-root .castle-desktop-alerts:before{content:'\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u0440\u0430\u0431\u043e\u0447\u0435\u0433\u043e \u0441\u0442\u043e\u043b\u0430';font-weight:600}\n#cozy-settings-root .castle-desktop-alerts[data-language=en]:before{content:'Desktop notifications'}\n#cozy-settings-root .castle-desktop-alerts label{margin:5px 0}\n.castle-find-glow{position:absolute;inset:1% 4% 6%;border-radius:30%;box-shadow:0 0 8px 4px #f0bd6390,inset 0 0 5px #fbe3a561;pointer-events:none;display:none}\n.castle-find-glow:after{content:'\u2726';position:absolute;top:-15%;right:-5%;color:#ffe1a2;text-shadow:0 0 5px #a9753a;font:20px/1 Georgia,serif}\n.castle-new-find .castle-find-glow{display:block;animation:castleFindLight 2.65s ease-in-out infinite}\n@keyframes castleFindLight{0%,100%{opacity:.54}50%{opacity:1}}\n@media(prefers-reduced-motion:reduce){.castle-new-find .castle-find-glow{animation:none;opacity:.82}}\n";
  document.head.append(style);
  const token=key=>'<img class="coh-mini" alt="" aria-hidden="true" src="'+url('Control_'+key+'.png').replaceAll('&','&amp;').replaceAll('"','&quot;')+'">';
  const star='<span class="coh-star" aria-hidden="true"></span>';
  const balance='<div class="castle-balance coh-balance">'+star+'<span class="coins">0</span></div>';
  function label(el,text){el.setAttribute('aria-label',text);el.title=text}
  function wallet(el,value,en){
    const text=(en?'Golden stars: ':'Золотые звёздочки: ')+value;
    if(el.getAttribute('aria-label')!==text){
      label(el,text);el.querySelector('.coins').textContent=String(value);
    }
  }
  // Retain round discs in the pre-existing overlays, which scale on two axes.
  function fitDiscs(root,sx,sy){
    if(sx<=0||sy<=0)return;
    const key=sx+'/'+sy;if(root.dataset.discScale===key)return;
    root.dataset.discScale=key;root.style.setProperty('--coh-disc-x',String(Math.min(1,sy/sx)));root.style.setProperty('--coh-disc-y',String(Math.min(1,sx/sy)));
  }
  let raf=0;
  function watchWindow(){
    if(raf)return;raf=requestAnimationFrame(()=>{
      raf=0;const canvas=document.querySelector('canvas');if(!canvas)return;
      const r=canvas.getBoundingClientRect();fitDiscs(document.documentElement,r.width/1280,r.height/720);
    });
  }
  window.addEventListener('resize',watchWindow);watchWindow();
  const canvas=document.querySelector('canvas');if(canvas&&window.ResizeObserver)new ResizeObserver(watchWindow).observe(canvas);
  function menuRect(canvas){
    const bounds=canvas.getBoundingClientRect(),scale=Math.min(bounds.width/1280,bounds.height/720);
    return {width:1280*scale,height:720*scale,left:bounds.left+(bounds.width-1280*scale)/2,top:bounds.top+(bounds.height-720*scale)/2};
  }
  // The album art keeps its normal hit area and its existing pictogram.
  function markFind(button,on,description){
    if(!button.querySelector('.castle-find-glow')){
      const light=document.createElement('i');light.className='castle-find-glow';light.setAttribute('aria-hidden','true');button.append(light);
    }
    button.classList.toggle('castle-new-find',!!on);
    if(on){if(button.getAttribute('aria-description')!==description)button.setAttribute('aria-description',description);}
    else if(button.hasAttribute('aria-description'))button.removeAttribute('aria-description');
  }
  window.__castleVisuals={markFind,url,cssUrl,token,star,balance,label,wallet,fitDiscs,menuRect};
}

if(!window.CastleRoomNote){
 window.CastleRoomNote=function(root,scene,selector,kind,lang,blocked){
    if(!document.getElementById('castle-note-theme')){
      const css=document.createElement('style');css.id='castle-note-theme';css.textContent="dialog.castle-menu-note{position:fixed;inset:0;box-sizing:border-box;margin:auto;width:min(400px,calc(100vw - 24px));max-height:calc(100dvh - 20px);padding:31px 28px 27px;overflow:auto;pointer-events:auto;text-align:center;color:#4f3441;border:1px solid #a47b4e;border-radius:15px 19px 15px 17px;background:radial-gradient(ellipse at 0 2%,#ccadd56b,transparent 42%),radial-gradient(ellipse at 100% 100%,#cfb8db77,transparent 45%),linear-gradient(130deg,#fcf2dd,#f6e6c9 60%,#f6ecd9);box-shadow:inset 0 0 0 3px #f6e7d0,inset 0 0 0 4px #c79e6f85,0 10px 34px #2c1c2666;font:500 20px/1.3 'Castle Garamond',Georgia,serif}\ndialog.castle-menu-note::backdrop{background:#2d1e294d}\n.castle-menu-note h2{margin:3px 10px 12px;font:600 32px/1.1 'Castle Garamond',Georgia,serif;color:#65414b}\n.castle-menu-note .note-copy{margin:5px 0 18px}\n.castle-menu-note .note-footer{margin:14px 0 0;color:#695043;font-size:17px;line-height:1.27}\n.castle-menu-note .note-cross{position:absolute;top:0;right:0;width:44px;height:44px;border:0;border-radius:12px;background:transparent;color:#705047;font:30px/1 'Castle Garamond',Georgia,serif;cursor:pointer;touch-action:manipulation}\n.castle-menu-note .note-link{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:6px 18px 8px;border:1px solid #ac8751;border-radius:9px 11px 8px 10px;background:linear-gradient(150deg,#8c627c,#71475d);box-shadow:inset 0 0 0 2px #e0c89935;color:#fff5df;font:600 21px/1.2 'Castle Garamond',Georgia,serif;text-decoration:none;touch-action:manipulation}\n.castle-menu-note [hidden]{display:none!important}\n.castle-menu-note :focus-visible{outline:2px solid #886440;outline-offset:-4px}\n.castle-menu-note .note-link:focus-visible{outline-color:#ffe2a3}\n@media(max-height:440px){dialog.castle-menu-note{padding:23px 25px 19px}.castle-menu-note h2{font-size:27px}.castle-menu-note .note-footer{margin-top:9px}}\n.castle-menu-note::before,.castle-menu-note::after{position:absolute;content:'';width:56px;height:27px;pointer-events:none;opacity:.7;background:var(--note-sprig) center/contain no-repeat}\n.castle-menu-note::before{left:9px;top:7px}\n.castle-menu-note::after{right:9px;bottom:6px;transform:rotate(180deg)}\n.castle-menu-note[data-kind=chest] h2{font-size:clamp(23px,5vw,28px);text-wrap:balance;margin-inline:0}\n";document.head.append(css);
    }
    const models={
      support:{
        title:['Поддержать проект','Support the project'],
        message:['Каждая ваша поддержка — это ещё немного волшебства для нашего замка и ещё одна тёплая корзинка для котика. 🐾','Every bit of support brings a little more magic to our castle and another warm basket for the kitten. 🐾'],
        action:['❤️ Поддержать на Boosty','❤️ Support on Boosty'],
        href:'https://boosty.to/veinvee',
        footer:['Спасибо, что помогаете нашему маленькому миру становиться уютнее! ✨','Thank you for helping our little world grow cozier! ✨']
      },
      chest:{
        title:['Здесь что-то будет, мяу! 🐾','Something will appear here, meow! 🐾'],
        footer:['Кажется, котик пока хранит это в секрете...','It seems the kitten is keeping it a secret for now...']
      }
    };
    const trigger=root.querySelector(selector);
    const holder=document.createElement('template');holder.innerHTML="<dialog class=\"castle-menu-note\" id=\"castle-menu-note\" aria-labelledby=\"castle-note-heading\">\n        <button class=\"note-cross\" type=\"button\" aria-label=\"Закрыть\">×</button>\n        <h2 id=\"castle-note-heading\"></h2><p class=\"note-copy\"></p>\n        <a class=\"note-link\" target=\"_blank\" rel=\"noopener noreferrer\" hidden></a><p class=\"note-footer\"></p>\n      </dialog>";
    const note=holder.content.firstElementChild;root.appendChild(note);
    note.style.setProperty('--note-sprig',window.__castleVisuals.cssUrl('Menu_Lavender.png'));
    const noteCross=note.querySelector('.note-cross'),noteLink=note.querySelector('.note-link');
    let noteKind='',sourceButton=null;
    function noteLabels(){
      const index=lang()==='en'?1:0;
      window.__castleVisuals.label(trigger,kind==='chest'?['Волшебный сундук','Magic chest'][index]:models.support.title[index]);
      if(!noteKind)return;
      const m=models[noteKind];
      note.querySelector('h2').textContent=m.title[index];
      const copy=note.querySelector('.note-copy');
      copy.hidden=!m.message;copy.textContent=m.message?.[index]||'';
      note.querySelector('.note-footer').textContent=m.footer[index];
      noteLink.hidden=!m.href;
      if(m.href){noteLink.href=m.href;noteLink.textContent=m.action[index];}
      else{noteLink.removeAttribute('href');noteLink.textContent='';}
      noteCross.setAttribute('aria-label',index?'Close':'Закрыть');
    }
    function openNote(kind,trigger){
      if(blocked()||note.open)return;
      noteKind=kind;sourceButton=trigger;note.dataset.kind=kind;noteLabels();
      note.showModal();noteCross.focus({preventScroll:true});
    }
    trigger.addEventListener('click',()=>openNote(kind,trigger));
    noteCross.onclick=()=>note.close();
    note.addEventListener('close',()=>{noteKind='';sourceButton?.focus({preventScroll:true});sourceButton=null;});
    noteLink.addEventListener('click',e=>{
      // A packaged desktop game hands the HTTPS URL to the OS. Browsers follow the real link.
      if(scene.getGame().getRenderer().getElectronRemote?.()?.getCurrentWindow() && gdjs.evtTools.window.openURL){
        e.preventDefault();gdjs.evtTools.window.openURL(models.support.href,scene);
      }
    });
    noteLabels();return {note,labels:noteLabels};
 };
}
if (!window.CastleClockSignals) {
  const motionKey='castleOfHours.residentMotion.v1';
  const wakeFrameMs=105, wakeFrames=21;
  const wakeDuration=wakeFrameMs*wakeFrames;
  function stops(data){
    if(Array.isArray(data?.companionStops))return data.companionStops.filter(row=>row&&typeof row.id==='string'&&Number.isFinite(row.at));
    return data?.lastCompanionStop?[{id:data.lastCompanionStop,at:data.companionStopAt||Date.now()}]:[];
  }
  function mark(data,id,at){
    const history=stops(data);
    if(history.some(row=>row.id===id))return;
    data.lastCompanionStop=id;data.companionStopAt=at;
    data.companionStops=[...history,{id,at}].slice(-12);
  }
  function send(key,record){
    // Keep the same real-time timeline even while a different room is visible.
    // A second boundary can extend wakefulness, but cannot rewind the kitten.
    if(!window.__castleCatHome?.root?.isConnected){
      try{
        const seenKey=key+'.residentStopSeen';
        if(localStorage.getItem(seenKey)!==record.id){
          const m=JSON.parse(localStorage.getItem(motionKey)||'null'),at=Math.min(Date.now(),record.at);
          let next=m;
          if(!m||at>=m.nap){
            const fold=m&&at<m.nap+32*115?Math.min(31,Math.floor((at-m.nap)/115)):null;
            next={start:at,nap:Number.MAX_SAFE_INTEGER,fold,sleepFrame:0,release:0,duration:fold==null?wakeDuration:(fold+1)*75};
          }else if(at>=m.start&&m.nap!==Number.MAX_SAFE_INTEGER&&!m.forced){
            next={...m,nap:Number.MAX_SAFE_INTEGER};
          }
          if(next!==m)localStorage.setItem(motionKey,JSON.stringify(next));
          localStorage.setItem(seenKey,record.id);
        }
      }catch(_){}
    }
    window.dispatchEvent(new CustomEvent('castle-timer-stopped',{detail:{key,...record}}));
  }
  function publish(key,before,after){
    const known=new Set(stops(before).map(row=>row.id));
    for(const row of stops(after))if(!known.has(row.id))send(key,row);
  }
  function started(){
    const home=window.__castleCatHome;
    if(home?.root?.isConnected&&home.resident){home.resident.beginInterval();return;}
    try{
      const m=JSON.parse(localStorage.getItem(motionKey)||'null'),now=Date.now();
      if(m&&now>=m.start+(m.fold==null?(m.release||0)+wakeDuration:(m.fold+1)*75)&&now<m.nap){
        localStorage.setItem(motionKey,JSON.stringify({...m,nap:now,forced:true}));
      }
    }catch(_){}
  }
  // A running break may outlive its scene. Re-read the same save inside the tower
  // writer's lock, so the visible tower and another open document cannot both finish it.
  let checking=false,last=0;
  function checkAway(){
    if(!window.CastleTimerAlerts)return;
    const adv=window.__castleAdventureCore;
    if(adv){
      const data=adv.read();
      if(data.rest?.running&&adv.currentSeconds(data.rest)<=0)adv.checkRest();
      if(data.session?.status==='active'&&data.session.running&&adv.currentSeconds(data.session)<=0&&window.__castleGuestLedger)adv.checkSession();
    }
    const rules=window.CastleMoonRules;
    if(!rules||window.__castleMoonTower?.root?.isConnected||checking)return;
    const read=()=>{try{return JSON.parse(localStorage.getItem(rules.STATE_KEY)||'{}')||{};}catch(_){return {};}};
    const now=()=>Date.now();
    const due=s=>['SHORT_BREAK','LONG_BREAK'].includes(s.phase)&&s.pausedRemainingMs==null&&s.endAt&&s.endAt<=now();
    if(!due(read()))return;
    checking=true;
    const commit=()=>{
      const original=read();if(!due(original))return;
      const data=rules.fromSave(original,now());
      const events=rules.reconcile(data,now(),Date.now(),'',1);
      if(!events.length)return;
      localStorage.setItem(rules.STATE_KEY,JSON.stringify(data));publish(rules.STATE_KEY,original,data);
      for(const e of events)window.CastleTimerAlerts.once(e.alertId);
    };
    (navigator.locks?.request?navigator.locks.request('castleOfHours.moon.write',commit):Promise.resolve().then(commit)).finally(()=>{checking=false;});
  }
  function frame(){
    const t=performance.now();if(t-last<160)return;last=t;checkAway();
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkAway();});
  window.CastleClockSignals={mark,stops,publish,send,started,frame,wakeDuration,wakeFrames,wakeFrameMs};
}
window.CastleClockSignals.frame();
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0x8f3998 = function GDJSInlineCode(runtimeScene) {
// The desktop and browser views display the same saved interval.
if (!window.CastleMini) {
  let ipc, adapter, launch, clock, opening=false, away=false, shown=false, lastMessage='';
  const skin=window.__castleVisuals;
  try {
    if (location.protocol==='file:' && typeof require==='function' && typeof process==='object' && process.versions?.electron) {
      const remote=runtimeScene.getGame().getRenderer().getElectronRemote();
      if (remote) {
        const url=new URL(skin.url('MiniTimerHost.cjs'),document.baseURI);
        const host=remote.require(require('url').fileURLToPath(url));
        if (host.attach(remote.getCurrentWindow().id)) ipc=require('electron').ipcRenderer;
      }
    }
  } catch (error) { console.warn('Castle of Hours: mini-timer unavailable',error); }
  const send=(c,v)=>ipc.send('coh-mini:'+c,v);
  function snapshot() {
    const s=adapter?.read();
    return s && {...s,en:localStorage.getItem('theCozyTime.language')==='en'};
  }
  function publish(force=false) {
    if (!shown) return;
    const value=snapshot();
    if (!value) return;
    const message=JSON.stringify(value);
    if (force || message!==lastMessage) {send('publish',value);lastMessage=message;}
  }
  if (ipc) {
    const game=runtimeScene.getGame(),normalFps=game.getGameData().properties.maxFPS;
    function backgroundDrawing(hidden){
      game.setMaximumFps(hidden?Math.min(normalFps||4,4):normalFps);
      document.documentElement.toggleAttribute('data-castle-mini-away',hidden);
    }
    ipc.on('coh-mini:mode',(_e,data)=>{
      opening=false;away=data.away;shown=data.visible;backgroundDrawing(away);
      clearInterval(clock); clock=null;
      if (shown) {publish(true);clock=setInterval(publish,250);}
      if (!away) adapter?.refresh?.();
    });
    ipc.on('coh-mini:command',async(_e,action)=>{
      try {if (adapter && away) await adapter.change(action.key,action.type==='pause');}
      finally {publish(true);}
    });
    ipc.on('coh-mini:error',()=>{
      opening=false;away=false;shown=false;backgroundDrawing(false);clearInterval(clock);
      if (!launch?.isConnected) return;
      const e=document.createElement('span');e.className='coh-mini-error';e.setAttribute('role','status');
      e.textContent=localStorage.getItem('theCozyTime.language')==='en'?'Could not open the mini-timer':'Не удалось открыть мини-таймер';
      launch.after(e);setTimeout(()=>e.remove(),4200);
    });
  }
  // Browser presentation of the same panel and Adventure session as the desktop mini-window.
  let web = null;
  function closeWeb() {
    if (!web) return;
    clearInterval(web.repaint);
    web.frame.remove();
    web = null;
    adapter = null;
    launch = null;
  }
  function explorer() {
    return [window.__castleCatHome, window.__castleCorridor].find(ui =>
      ui && window.__castleAdventureCore.canNavigate(ui));
  }
  function positionPanel(frame, ui) {
    const root = ui.root;
    const back = root.querySelector('.castle-back').getBoundingClientRect();
    const width = frame.offsetWidth, height = frame.offsetHeight;
    const right = Math.max(6, innerWidth - width - 6), bottom = Math.max(6, innerHeight - height - 6);
    const below = Math.min(bottom, back.bottom + 6);
    const spots = [[6, 6], [6, below], [right, below], [6, bottom], [right, bottom], [right, 6]];
    const controls = Array.from(root.querySelectorAll('button:not([hidden]),.castle-resume,.ad-header'))
      .map(el => el.getBoundingClientRect()).filter(r => r.width && r.height);
    const overlap = ([x,y]) => controls.reduce((area,r) => area +
      Math.max(0, Math.min(x+width,r.right)-Math.max(x,r.left)) *
      Math.max(0, Math.min(y+height,r.bottom)-Math.max(y,r.top)), 0);
    const [x,y] = spots.reduce((best,spot) => overlap(spot)<overlap(best)?spot:best);
    frame.style.left=x+'px'; frame.style.top=y+'px';
  }
  function updateWeb() {
    const w=web;
    if (!w) return;
    const value=snapshot();
    if (!value || value.key!==w.key) {closeWeb();return;}
    if (!w.render) return;
    const study=window.__castleStudy;
    if (study?.root.isConnected && study.scene!==w.origin && study.scene.getName()===w.room) {
      closeWeb();return;
    }
    const ui=explorer();
    const modal=document.querySelector('dialog[open],.cozy-open,.castle-modal-shade:not([hidden]),.home-rest-panel:not([hidden])');
    w.frame.hidden=w.dismissed || !ui || !!modal;
    if (!w.frame.hidden) {positionPanel(w.frame,ui);w.render(value);}
    if (w.dismissed && value.status==='done') closeWeb();
  }
  function openWeb(source, value) {
    if (web || !['paused','running'].includes(value.status)) return;
    const frame=document.createElement('iframe');
    frame.className='coh-web-mini';frame.title=value.en?'Study mini-timer':'Мини-таймер учёбы';
    frame.hidden=true;
    const w={frame,key:value.key,room:source.room,origin:window.__castleStudy.scene,dismissed:false};
    web=w;
    frame.addEventListener('load',()=>{
      if(web!==w || w.render)return;
      const button=launch;
      closeWeb();
      if(button?.isConnected)button.title=value.en?'Could not load mini-timer':'Не удалось загрузить мини-таймер';
    },{once:true});
    frame.src=skin.url('MiniTimerPanel.html');
    document.body.append(frame);
  }
  function panelFor(child) {
    const w=web;
    if (!w || w.frame.contentWindow!==child) return null;
    return {
      subscribe(render) {
        if (web!==w || w.render) return;
        const value=snapshot();
        if (!value || value.key!==w.key || value.status==='done' || !adapter.collapse()) {closeWeb();return;}
        w.render=render;
        render(value);
        // Repaint from the saved deadline. This interval owns no timer or rewards.
        w.repaint=setInterval(updateWeb,250);
        updateWeb();
      },
      action(type,key) {
        if (web!==w) return;
        const value=snapshot(),ui=explorer();
        if (!value || value.key!==w.key) {closeWeb();return;}
        if (!ui || w.frame.hidden) return;
        if (type==='restore') {
          if (window.__castleAdventureCore.requestScene(ui,w.room)) closeWeb();
        } else if (type==='hide') {
          w.dismissed=true;updateWeb();
        } else if (key===w.key && (type==='pause' || type==='resume')) {
          adapter.change(key,type==='pause');updateWeb();
        }
      }
    };
  }
  {
    const style=document.createElement('style');
    style.textContent=`
    html[data-castle-mini-away] .moon-stage *,html[data-castle-mini-away] .adventure-stage *,html[data-castle-mini-away] #castle-adventure-ui *{animation-play-state:paused!important}
    .coh-mini-launch{display:inline-grid;place-items:center;box-sizing:border-box;width:38px;height:35px;padding:5px;border:0;color:#573826;background:var(--mini-material) center/100% 100% no-repeat;cursor:pointer;pointer-events:auto;filter:drop-shadow(0 2px 2px #31201770);z-index:2}
    .coh-mini-launch:focus-visible{outline:2px solid #f3cf86;border-radius:5px}.coh-mini-launch:hover{filter:brightness(1.08) drop-shadow(0 0 4px #efb45d99)}.coh-mini-launch:active{scale:.96}
    .coh-mini-launch svg{width:21px;height:19px}
    .moon-focus .coh-mini-launch{position:absolute;left:calc(50% + 110px);bottom:0}
    .ad-timer .coh-mini-launch{position:relative;margin-top:6px;flex:0 0 35px}
    .home-rest-panel .coh-mini-launch{position:absolute;top:12px;right:12px}
    .coh-web-mini{position:fixed;z-index:2147482250;border:0;background:transparent;width:min(238px,calc(100vw - 12px));height:74px;color-scheme:light}
    .coh-web-mini[hidden]{display:none}
    .ad-timer .coh-web-launch{display:inline-flex;gap:6px;align-items:center;justify-content:center;width:auto;min-width:170px;height:40px;flex:0 0 40px;padding:4px 18px;background-image:var(--paper-strip);font:600 17px/1.1 'Castle Garamond',Georgia,serif;white-space:nowrap}
    @media (pointer:coarse),(max-width:600px){.ad-timer .coh-web-launch{min-height:var(--ad-touch-size);min-width:max(170px,calc(var(--ad-touch-size) * 3.1));font-size:max(17px,calc(var(--ad-touch-size) * .32))}}
    .coh-mini-error{display:block;background:#4a3540;color:#fff0cf;padding:4px 7px;font:15px Georgia,serif}
    `; document.head.append(style);
  }
  function add(parent,source) {
    if (!parent || (!ipc && !source.collapse)) return;
    const b=document.createElement('button');
    b.type='button';b.className='coh-mini-launch';
    b.style.setProperty('--mini-material',skin.cssUrl('Parchment_Seal.webp'));
    b.innerHTML='<svg viewBox="0 0 24 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="1.8" y="2" width="20.4" height="15.8" rx="2.1"/><rect x="11.2" y="9.1" width="8" height="5.6" rx=".7" fill="currentColor" stroke="none"/></svg>';
    if (!ipc) {b.classList.add('coh-web-launch');b.append(document.createElement('span'));}
    function label(){b.title=localStorage.getItem('theCozyTime.language')==='en'?'Mini-timer':'Мини-таймер';if(!ipc){b.title=window.__castleAdventureCore.tr('Свернуть таймер','Minimize timer');b.lastElementChild.textContent=b.title;}b.setAttribute('aria-label',b.title);}
    label();b.onpointerenter=label;b.onfocus=label;
    b.onclick=()=>{
      if(opening || away) return;
      launch=b;adapter=source;lastMessage='';
      const value=snapshot();if(!value)return;
      if(!ipc){openWeb(source,value);return;}
      opening=true;send('open',value);
    };
    parent.append(b);
  }
  window.CastleMini={add,panelFor,get away(){return away||opening;}};
}
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xaf52a0 = function GDJSInlineCode(runtimeScene) {
// One notification library for all GDevelop layouts. Its preferences are independent of both wallets.
if (!window.CastleTimerAlerts) {
  const library=[
    ['bell','Волшебный колокольчик','Magic bell','Magic_Bell.wav'],
    ['mew','Нежное мяу','Gentle meow','Gentle_Meow.wav'],
    ['chimes','Лунные колокольчики','Moon chimes','Moon_Chimes.wav'],
    ['harp','Волшебная арфа','Magic harp','Magic_Harp.wav'],
    ['starlight','Звёздная пыль','Stardust','Starlight.wav'],
    ['crystal','Хрустальный перезвон','Crystal chimes','Crystal_Chimes.wav'],
    ['silent','Без звука','Silent',null]
  ];
  const key='castleOfHours.notifications.v1',seenKey=key+'.played';
  const decode=(id,fallback)=>{try{return JSON.parse(localStorage.getItem(id))??fallback;}catch{return fallback;}};
  const initial=decode('castleOfHours.moonTower.v1',{})?.prefs||{};
  function preferences(){
    const p=decode(key,initial)||{};
    return {desktopStudy:p.desktopStudy===true,desktopRest:p.desktopRest===true,sound:library.some(row=>row[0]===p.sound)?p.sound:'bell',volume:Number.isFinite(p.volume)?Math.min(100,Math.max(0,p.volume)):65};
  }
  const audio=new Audio();audio.preload='auto';
  let playing=false,wait=0,primed=false,generation=0,currentScene='';
  function level(p){
    const master=localStorage.getItem('theCozyTime.volume');
    return window.__castleMusic?.state?.enabled===false||p.sound==='silent'?0:p.volume/100*Math.min(1,Math.max(0,master===null ? 0.65 : Number(master)/100));
  }
  function stop(){generation++;playing=false;wait=0;audio.pause();}
  function play(preview=false){
    const p=preferences(),file=library.find(row=>row[0]===p.sound)[3],gain=level(p);
    if(!file||!(gain>0)){stop();return;}
    if(playing&&!preview){wait++;return;}
    if(preview)wait=0;
    const rev=++generation;playing=true;audio.pause();audio.muted=false;audio.volume=gain;
    audio.src=window.__castleVisuals.url(file);audio.currentTime=0;
    audio.play()?.catch(()=>{if(rev===generation){playing=false;wait=0;}});
  }
  audio.onended=()=>{playing=false;if(wait){wait--;play();}};
  const desktopKinds=['desktopStudy','desktopRest'];
  let prompting=null;
  function permission(){
    if(!window.isSecureContext || !window.Notification || typeof Notification.requestPermission!=='function')return 'unavailable';
    return Notification.permission;
  }
  function displayDesktop(id){
    const kind=id.includes('/study/')?'desktopStudy':id.includes('/rest/')?'desktopRest':'';
    if(!kind||!preferences()[kind]||permission()!=='granted')return;
    const en=localStorage.getItem('theCozyTime.language')==='en';
    const body=kind==='desktopStudy'?(en?'Your study interval is complete.':'Учебный интервал завершён.'):(en?'Your break is complete.':'Перерыв завершён.');
    try {new Notification('Castle of Hours',{body,tag:id,silent:true});} catch {}
  }
  function redrawDesktop(form){
    const en=form.dataset.language==='en',allowed=permission(),p=preferences();
    for(const kind of desktopKinds){
      const box=form.querySelector('[name='+kind+']');
      box.checked=p[kind]&&allowed==='granted';box.disabled=allowed==='unavailable'||allowed==='denied'||!!prompting;
    }
    const messages={denied:en?'Notifications are blocked. You can allow them in the browser or system settings.':'Уведомления заблокированы. Разрешить их можно в настройках браузера или системы.',
      unavailable:en?'This environment does not support desktop notifications.':'В этой среде уведомления рабочего стола недоступны.',
      default:en?'Your browser may ask for permission when you enable an alert.':'При включении браузер может запросить разрешение.'};
    form.querySelector('small').textContent=messages[allowed]||'';
  }
  async function toggleDesktop(kind,value){
    if(!value){set({[kind]:false});return;}
    let result=permission();
    if(result==='default'){
      try {prompting ||= Notification.requestPermission();sync();result=await prompting;}
      catch { result='unavailable'; } finally {prompting=null;}
    }
    if(result==='granted')set({[kind]:true});else sync();
  }
  function bindDesktop(container,en){
    let form=container.querySelector(':scope > .castle-desktop-alerts');
    if(!form){
      form=document.createElement('section');form.className='castle-desktop-alerts';
      for(const kind of desktopKinds){
        const label=document.createElement('label'),input=document.createElement('input');
        input.type='checkbox';input.name=kind;input.onchange=()=>toggleDesktop(kind,input.checked);
        label.append(input,document.createElement('span'));form.append(label);
      }
      const status=document.createElement('small');status.setAttribute('role','status');form.append(status);container.append(form);
    }
    form.dataset.language=en?'en':'ru';
    const labels=en?['End of study interval','End of break']:['О завершении учёбы','О завершении перерыва'];
    form.querySelectorAll('label span').forEach((span,i)=>span.textContent=labels[i]);redrawDesktop(form);
  }
  window.addEventListener('focus',()=>document.querySelectorAll('.castle-desktop-alerts').forEach(redrawDesktop));
  function sync(){
    const p=preferences(),gain=level(p);
    if(playing){if(gain>0)audio.volume=gain;else stop();}
    document.querySelectorAll('.castle-desktop-alerts').forEach(redrawDesktop);
    for(const form of document.querySelectorAll('.castle-notifications'))refresh(form,p);
  }
  function refresh(form,p){
    form.querySelector('[name=alert-tone]').value=p.sound;form.querySelector('[name=alert-volume]').value=p.volume;
    form.querySelector('output').textContent=p.volume+'%';
  }
  function set(change){localStorage.setItem(key,JSON.stringify({...preferences(),...change}));sync();window.dispatchEvent(new Event('castle-alert-preferences'));}
  function bind(container,en){
    let field=container.querySelector(':scope > .castle-notifications');
    if(!field){
      field=document.createElement('section');field.className='castle-notifications';
      field.innerHTML='<label><span class="alert-name"></span><select name="alert-tone"></select></label><label><span class="alert-volume-title"></span><output></output><input type="range" name="alert-volume" min="0" max="100"></label><button type="button" class="preview-alert"></button>';
      const tone=field.querySelector('select'),range=field.querySelector('input');
      tone.onchange=()=>set({sound:tone.value});range.oninput=()=>set({volume:Number(range.value)});
      field.querySelector('button').onclick=()=>play(true);container.append(field);
    }
    if(field.dataset.language!==(en?'en':'ru')){
      field.dataset.language=en?'en':'ru';
      field.querySelector('.alert-name').textContent=en?'Timer notification':'Уведомление таймера';
      const volumeName=en?'Notification volume':'Громкость уведомления';
      field.querySelector('.alert-volume-title').textContent=volumeName;field.querySelector('input').setAttribute('aria-label',volumeName);
      field.querySelector('select').replaceChildren(...library.map(([id,ru,eng])=>new Option(en?eng:ru,id)));
      field.querySelector('.preview-alert').textContent=en?'Preview sound':'Прослушать';
    }
    refresh(field,preferences());return field;
  }
  function prime(){
    if(primed||playing)return;
    const p=preferences();if(level(p)<=0)return;
    primed=true;const rev=++generation;
    audio.muted=true;audio.src=window.__castleVisuals.url(library[0][3]);
    const done=()=>{if(rev===generation&&!playing){audio.pause();audio.currentTime=0;audio.muted=false;}};
    audio.play()?.then(done,()=>{primed=false;done();});
  }
  document.addEventListener('pointerdown',prime,true);document.addEventListener('keydown',prime,true);
  document.addEventListener('input',e=>{if(e.target.matches('.cozy-slider'))sync();});
  document.addEventListener('click',e=>{if(e.target.closest?.('.music-toggle'))sync();});
  window.addEventListener('storage',e=>{if(e.key===key){sync();window.dispatchEvent(new Event('castle-alert-preferences'));}});
  window.addEventListener('pagehide',stop);
  function once(id){
    const run=()=>{
      const history=decode(seenKey,[]);const ids=Array.isArray(history)?history:[];
      if(ids.includes(id))return;
      localStorage.setItem(seenKey,JSON.stringify([...ids.slice(-63),id]));
      play();displayDesktop(id);
    };
    if(navigator.locks?.request)navigator.locks.request(seenKey,run).catch(()=>{});else run();
  }
  function background(){
    const core=window.__castleAdventureCore;
    if(!core)return;
    if(currentScene==='Комната котика')core.checkRest();
    else if(core.ROOMS?.some(room=>room.scene===currentScene)||currentScene==='Волшебные двери')core.checkSession();
  }
  setInterval(()=>{if(document.hidden||window.CastleMini?.away)background();},750);
  document.addEventListener('visibilitychange',background);
  window.CastleTimerAlerts={bind,bindDesktop,sync,preferences,once,enter(scene){currentScene=scene;}};
}
window.CastleTimerAlerts.enter(runtimeScene.getName());
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xb2aa28 = function GDJSInlineCode(runtimeScene) {
if(typeof window!=='undefined' && !window.__castleAdventureCore){
const core = window.__castleAdventureCore || (window.__castleAdventureCore = (() => {
  const KEY='castleOfHours.adventure.v1';
  const ROOMS=[
    {"scene": "Забытая оранжерея", "ru": "Забытая оранжерея", "en": "Forgotten Greenhouse"},
    {"scene": "Мастерская алхимика", "ru": "Мастерская алхимика", "en": "Alchemist’s Workshop"},
    {"scene": "Забытая библиотека", "ru": "Забытая библиотека", "en": "Forgotten Library"},
    {"scene": "Часовая мастерская", "ru": "Часовая мастерская", "en": "Clockwork Workshop"}
  ];
  const ZONES=[
    {ru:'Камин',en:'Fireplace',icon:'♨',ruDesc:["Разжечь огонь", "Установить полку с книгами, часами и свечами", "Украсить камень золотистыми узорами"],enDesc:["Kindle the fire", "Fit a mantel with books, clock and candles", "Add delicate gold tracery"]},
    {ru:'Книжный уголок',en:'Book corner',icon:'▥',ruDesc:["Восстановить шкаф и расставить книги", "Добавить песочные часы, зелья и артефакты", "Поставить волшебную книгу"],enDesc:["Restore the shelves and fill them with books", "Add an hourglass, potions and artifacts", "Shelve the enchanted book"]},
    {ru:'Уголок котика',en:'Cat corner',icon:'🐾',ruDesc:["Поставить круглую лежанку с цветочной вышивкой", "Устроить плетёное гнёздышко с мягким пледом", "Добавить пышную подушку и плед с лавандой"],enDesc:["Set out a round bed with floral embroidery", "Make a wicker nest with a soft blanket", "Add a plump cushion and a lavender-embroidered throw"]},
    {ru:'Окно и растения',en:'Window and plants',icon:'❀',ruDesc:["Открыть окно в сад и повесить льняные шторы", "Устроить сиденье с пледом", "Расставить цветы и пустить лозу вокруг окна"],enDesc:["Open the garden window and hang linen curtains", "Add a cushioned window seat", "Grow flowers and climbing vines"]},
    {ru:'Письменный стол',en:'Writing desk',icon:'✒',ruDesc:["Починить стол, добавить перо и чернила", "Зажечь настольную лампу", "Разложить письма с золотыми печатями"],enDesc:["Restore the desk with quill and ink", "Light the desk lamp", "Lay out letters with golden seals"]}
  ];
  const COSTS=[20,60,120];
  const empty=()=>({coins:0,upgrades:[0,0,0,0,0],session:null,rest:null,completed:0});
  const read=()=>{
    let d;try{d=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){d=null}
    if(!d||typeof d!=='object')d=empty();
    d.coins=Number.isFinite(+d.coins)?Math.max(0,Math.floor(+d.coins)):0;
    d.upgrades=Array.from({length:5},(_,i)=>Math.min(3,Math.max(0,Math.floor(+(d.upgrades||[])[i]||0))));
    d.completed=Math.max(0,Math.floor(+d.completed||0));
    if(window.__castleGuestLedger?.migrate(d)){
      try{localStorage.setItem(KEY,JSON.stringify(d))}catch(_){}
    }
    return d;
  };
  const save=d=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch(_){}};
  const lang=()=>{
    try{return localStorage.getItem('theCozyTime.language')==='en'?'en':'ru'}catch(_){return 'ru'}
  };
  const tr=(ru,en)=>lang()==='en'?en:ru;
  const fmt=seconds=>{const s=Math.max(0,Math.ceil(seconds));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
  const currentSeconds=s=>s?(s.running?Math.max(0,(s.endAt-Date.now())/1000):Math.max(0,s.remaining||0)):0;
  const startSession=room=>{
    const d=read();
    if(d.session && d.session.status==='active')return false;
    const minutes=15+Math.floor(Math.random()*106);
    d.session={id:String(Date.now())+'-'+Math.floor(Math.random()*1e6),room,minutes,
      running:true,endAt:Date.now()+minutes*60000,remaining:minutes*60,status:'active'};
    save(d);window.CastleClockSignals.started();return true;
  };
  const checkSession=()=>{
    const d=read();const s=d.session;
    if(s && s.status==='active' && s.running && currentSeconds(s)<=0){
      s.status='complete';s.running=false;s.remaining=0;s.reward=Math.floor(s.minutes/15);
      d.coins+=s.reward;d.completed+=1;
      window.CastleClockSignals.mark(d,'adventure/'+s.id,Date.now()-Math.max(0,Date.now()-s.endAt)/1);
      window.__castleGuestLedger.complete(d,s);save(d);notifyStop(d);
      window.CastleTimerAlerts.once('adventure/study/'+s.id);
    }
    return d;
  };
  const checkRest=()=>{
    const d=read();const r=d.rest;
    if(r&&r.running&&currentSeconds(r)<=0){r.running=false;r.remaining=0;r.finished=true;
      window.CastleClockSignals.mark(d,'adventure/'+miniKey('rest',r),Date.now()-Math.max(0,(Date.now())-r.endAt)/(1));
      save(d);notifyStop(d);window.CastleTimerAlerts.once('adventure/rest/'+r.endAt)}
    return d;
  };
  // Both the full game and its desktop window operate on the same saved interval.
  const miniKey=(kind,timer)=>String(kind==='rest'?(timer.miniKey||'rest/'+timer.endAt):timer.id);
  function miniRead(kind,initialMinutes=0) {
    const rest=kind==='rest', d=rest?checkRest():checkSession(), t=rest?d.rest:d.session;
    const kindName=rest?'rest':'study';
    if(!t)return {theme:'doors',kind:kindName,key:'idle/'+kind,status:'idle',left:initialMinutes*60000,total:initialMinutes*60000};
    const done=rest?t.finished:t.status==='complete';
    return {theme:'doors',kind:kindName,key:miniKey(kind,t),status:done?'done':t.running?'running':'paused',
      left:done?0:currentSeconds(t)*1000,total:t.minutes*60000};
  }
  function miniChange(kind,key,paused) {
    const rest=kind==='rest',d=rest?checkRest():checkSession(),t=rest?d.rest:d.session;
    if(!t||t.finished||t.status==='complete'||key!==miniKey(kind,t)||paused===!t.running)return false;
    if(rest)t.miniKey=key;
    if(paused)t.remaining=currentSeconds(t);
    else t.endAt=Date.now()+t.remaining*1000;
    t.running=!paused;save(d);return true;
  }
  function notifyStop(data){
    window.CastleClockSignals.send(KEY,{id:data.lastCompanionStop,at:data.companionStopAt});
  }
  function stopSession(data=checkSession()){
    const session=data.session;
    if(!session)return;
    const unfinished=session.status==='active';
    if(unfinished)window.CastleClockSignals.mark(data,'adventure/'+session.id,Date.now());
    data.session=null;save(data);
    if(unfinished)notifyStop(data);
  }
  function stopRest(expected,finishedOnly=false){
    const d=checkRest(),r=d.rest;
    if(!r||(finishedOnly&&!r.finished)||(expected&&expected!==miniKey('rest',r)))return false;
    if(!r.finished)window.CastleClockSignals.mark(d,'adventure/'+miniKey('rest',r),Date.now());
    d.rest=null;save(d);if(!r.finished)notifyStop(d);return true;
  }
  const purchase=(i,expectedTier)=>{
    const d=read(),level=d.upgrades[i];
    if(!Number.isInteger(i)||i<0||i>4||(expectedTier!==undefined&&expectedTier!==level)||level>=3||d.coins<COSTS[level])return false;
    d.coins-=COSTS[level];d.upgrades[i]++;save(d);return true;
  };
  const openSettings=()=>{
    const settings=window.__theCozyTimeSettings;
    if(settings&&settings.root){const gear=settings.root.querySelector('.cozy-gear');if(gear)gear.click()}
  };
  const clearSettings=()=>{
    const settings=window.__theCozyTimeSettings;
    if(settings&&settings.root){
      if(settings.onKeyDown)document.removeEventListener('keydown',settings.onKeyDown);
      settings.root.remove();window.__theCozyTimeSettings=null;
    }
  };
  const align=root=>{
    const canvas=document.querySelector('canvas');if(!canvas)return;
    const r=canvas.getBoundingClientRect();if(r.width>0&&r.height>0){
      root.style.left=r.left+'px';root.style.top=r.top+'px';root.style.transformOrigin='top left';
      root.style.transform='scale('+(r.width/1280)+','+(r.height/720)+')';
    }
  };
  function canNavigate(ui){
    return !ui.pendingScene && !ui.root.inert && ui.root.isConnected &&
      !window.__castleScreenFade.pending && ui.scene.getGame().getSceneStack().getCurrentScene()===ui.scene;
  }
  function requestScene(ui,destination){
    if(!canNavigate(ui))return false;
    ui.pendingScene=destination;
    ui.root.inert=true;
    return true;
  }
  function switchIfPending(ui,scene,key){
    if(!ui.pendingScene || window[key]!==ui || ui.scene!==scene)return;
    if(!window.__castleTransitionQueue(scene,ui.pendingScene))return;
    ui.dispose?.();
    if(ui.root.classList.contains('adventure-stage'))window.__castleOutgoingStage=ui.root;
    else ui.root.remove();
    window[key]=null;
    clearSettings();
  }
  return {ROOMS,ZONES,COSTS,read,save,lang,tr,fmt,currentSeconds,startSession,checkSession,
    checkRest,stopRest,miniRead,miniChange,stopSession,purchase,openSettings,clearSettings,align,canNavigate,requestScene,switchIfPending};
})());
}
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6250 = function GDJSInlineCode(runtimeScene) {
"use strict";
// Draw an approved room at its design aspect. The native background sprite uses the same painting.
if(typeof window!=='undefined' && typeof document!=='undefined' && !window.__castleAdventureView){
  const skin=window.__castleVisuals;
  const doors=[{"name": "green", "x": 144.096, "y": 166.624, "w": 189.317, "h": 369.936, "path": "M 4,480 L 1,167 C 1,83 50,20 112,5 C 171,-8 240,51 243,150 L 243,479 Z", "sourceW": 247, "sourceH": 484}, {"name": "alchemy", "x": 418.491, "y": 168.153, "w": 190.084, "h": 368.408, "path": "M 3,478 L 1,145 C 0,75 46,11 106,4 C 175,-9 239,45 245,142 L 245,478 Z", "sourceW": 248, "sourceH": 482}, {"name": "library", "x": 699.018, "y": 167.389, "w": 192.383, "h": 369.172, "path": "M 3,477 L 2,149 C 2,77 41,18 109,4 C 179,-8 242,53 246,145 L 247,478 Z", "sourceW": 251, "sourceH": 483}, {"name": "clock", "x": 985.677, "y": 168.917, "w": 186.251, "h": 367.643, "path": "M 2,476 L 1,145 C 0,69 45,10 111,4 C 178,-5 234,52 239,144 L 239,477 Z", "sourceW": 243, "sourceH": 481}];
  const backgrounds={'Забытая оранжерея':'Adventure_Greenhouse.jpg','Мастерская алхимика':'Adventure_Alchemy.jpg',
    'Забытая библиотека':'Adventure_Library.jpg','Часовая мастерская':'Adventure_Clockwork.jpg','Волшебные двери':'Adventure_Corridor.jpg'};
  const nav='<button class="castle-back ad-nav" type="button" data-coh-action="back"></button>'+skin.balance+'<button class="castle-settings ad-settings" type="button" data-coh-action="gear"></button>';
  const title='<header class="ad-header"><h1 class="ad-heading"></h1><p class="ad-sub"></p></header>';
  const studyHeader='<header class="ad-header ad-study-heading"><h1 class="ad-heading"></h1></header>';
  function dialog(kind,first,second){
    return '<div class="castle-modal-shade castle-'+kind+'" hidden><section class="castle-modal" role="dialog" aria-modal="true" aria-labelledby="ad-'+kind+'-title"><h2 id="ad-'+kind+'-title"></h2><p class="message"></p><div class="actions"><button type="button" class="text-button '+first+'"></button><button type="button" class="text-button '+second+'"></button></div></section></div>';
  }
  function mount(scene,html,core){
    const name=scene.getName(),root=document.createElement('div');root.id='castle-adventure-ui';root.className='adventure-stage';
    root.style.setProperty('--scene-paint',skin.cssUrl(backgrounds[name]));
    root.innerHTML='<div class="ad-canvas">'+nav+html+'</div>';document.body.append(root);
    const frame=root.querySelector('.ad-canvas'),q=s=>root.querySelector(s);
    let last='',previousFocus=null;
    function resize(){
      const canvas=document.querySelector('canvas');if(!canvas)return;
      const r=canvas.getBoundingClientRect(),stamp=[r.x,r.y,r.width,r.height].join('/');
      if(stamp===last||!r.width||!r.height)return;last=stamp;
      Object.assign(root.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
      const scale=Math.min(r.width/1280,r.height/720);
      frame.style.transform='translate(-50%,-50%) scale('+scale+')';
      frame.style.setProperty('--ad-touch-size',Math.max(62,44/scale)+'px');
    }
    function modal(node,open,focusSelector){
      if(node.hidden===!open)return;
      node.hidden=!open;
      if(open){previousFocus=document.activeElement;node.querySelector(focusSelector||'button')?.focus()}
      else if(previousFocus?.isConnected)previousFocus.focus();
    }
    function keydown(e){
      const d=root.querySelector('.castle-modal-shade:not([hidden])');if(!d)return;
      if(e.key==='Escape'&&d.classList.contains('castle-confirm')){e.preventDefault();modal(d,false)}
      if(e.key==='Tab'){
        const buttons=[...d.querySelectorAll('button')],first=buttons[0],end=buttons[buttons.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}
        else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}
      }
    }
    root.addEventListener('keydown',keydown);
    q('.castle-settings').onclick=core.openSettings;
    function chrome(en){skin.label(q('.castle-back'),en?'Back':'Назад');skin.label(q('.castle-settings'),en?'Settings':'Настройки')}
    const canvas=document.querySelector('canvas'),observer=window.ResizeObserver?new ResizeObserver(resize):null;
    if(canvas)observer?.observe(canvas);
    window.addEventListener('resize',resize);resize();
    function dispose(){observer?.disconnect();window.removeEventListener('resize',resize)}
    return {root,q,resize,dispose,chrome,modal,scene,pendingScene:null,lang:null,lastTick:-Infinity};
  }
  function makeCorridor(scene,core){
    const hint='<p class="ad-corridor-hint"></p>';
    const resume='<section class="castle-resume" hidden><p class="resume-text"></p><div class="actions"><button class="text-button resume"></button><button class="text-button abandon"></button></div></section>';
    const ui=mount(scene,title+'<div class="door-row"></div>'+hint+resume+dialog('confirm','confirm-no','confirm-yes'),core);
    const {root,q}=ui;
    let opening=null;
    const emblems=[['Зелёная дверь с веточкой','Green door with a leaf'],['Красная дверь с солнцем','Red door with a sun'],['Синяя дверь с полумесяцем','Blue door with a crescent'],['Медовая дверь с часами','Honey-coloured door with a clock']];
    const buttons=[];
    const select=i=>{
      if(opening || !core.canNavigate(ui))return;
      const room=core.ROOMS[i],d=core.checkSession();
      if(d.session && d.session.room!==room.scene)return;
      if(!d.session&&!core.startSession(room.scene))return;
      if(d.session?.status==='active'&&!d.session.running){
        d.session.endAt=Date.now()+Math.max(0,d.session.remaining||0)*1000;
        d.session.running=true;core.save(d);
      }
      core.requestScene(ui,room.scene);opening=room.scene;
      q('.castle-back').disabled=true;q('.castle-settings').disabled=true;
      q('.castle-resume').hidden=true;ui.update();
    };
    doors.forEach((spec,i)=>{
      const room=core.ROOMS[i],b=document.createElement('button');
      b.className='castle-door';b.type='button';b.dataset.room=String(i);b.dataset.destination=room.scene;
      Object.assign(b.style,{left:spec.x+'px',top:spec.y+'px',width:spec.w+'px',height:spec.h+'px'});
      b.style.clipPath='url(#coh-door-'+i+')';
      const svg='<svg aria-hidden="true" width="0" height="0" style="position:absolute"><defs><clipPath clipPathUnits="objectBoundingBox" id="coh-door-'+i+'"><path transform="scale('+(1/spec.sourceW)+' '+(1/spec.sourceH)+')" d="'+spec.path+'"/></clipPath></defs></svg>';
      b.innerHTML=svg+'<span class="door-leaf"></span>';
      b.lastChild.style.backgroundImage=skin.cssUrl('Door_'+spec.name+'.webp');
      b.onclick=()=>select(i);
      q('.door-row').append(b);buttons.push(b);
    });
    const confirm=q('.castle-confirm');
    q('.castle-back').onclick=()=>{if(!opening)core.requestScene(ui,'Комната котика')};
    q('.resume').onclick=()=>{const s=core.checkSession().session,i=core.ROOMS.findIndex(r=>r.scene===s?.room);if(i>=0)select(i)};
    q('.abandon').onclick=()=>{if(!opening)ui.modal(confirm,true,'.confirm-no')};
    q('.confirm-no').onclick=()=>ui.modal(confirm,false);
    q('.confirm-yes').onclick=()=>{if(confirm.hidden || !core.canNavigate(ui))return;const d=core.checkSession();if(d.session?.status==='active')core.stopSession();ui.modal(confirm,false);ui.update()};
    ui.renderLanguage=()=>{
      const en=core.lang()==='en';ui.chrome(en);
      q('h1').textContent=en?'Magic Doors':'Волшебные двери';
      q('.ad-sub').textContent=en?'Four doors. Four mysteries. One adventure.':'Четыре двери. Четыре тайны. Одно приключение.';
      buttons.forEach((b,i)=>b.setAttribute('aria-label',emblems[i][en?1:0]));
      q('.ad-corridor-hint').textContent=en?'Choose a door and your study time will begin':'Выбери дверь — и время учёбы начнёт отсчитываться';
      q('.abandon').textContent=en?'Abandon':'Прервать';
      q('#ad-confirm-title').textContent=en?'Leave this adventure?':'Прервать занятие?';
      confirm.querySelector('.message').textContent=en?'An unfinished session earns no golden stars.':'За незавершённое занятие звёздочки не начисляются.';
      q('.confirm-no').textContent=en?'Keep studying':'Продолжить учёбу';q('.confirm-yes').textContent=en?'Leave':'Прервать';
      ui.update();
    };
    ui.update=()=>{
      const d=core.checkSession(),s=d.session,en=core.lang()==='en';
      skin.wallet(q('.castle-balance'),d.coins,en);
      buttons.forEach((b,i)=>{
        const dest=core.ROOMS[i].scene,chosen=opening===dest,associated=s?.room===dest;
        b.dataset.state=chosen?'chosen':opening||s&&!associated?'locked':associated?'waiting':'closed';
        b.disabled=!!opening||!!s&&!associated;
      });
      q('.castle-resume').hidden=!!opening||!s;
      if(s){
        q('.abandon').hidden=s.status!=='active';
        q('.resume').textContent=s.status==='complete'?core.tr('Посмотреть результат','View result'):core.tr('Продолжить','Resume');
        const r=core.ROOMS.find(r=>r.scene===s.room);
        q('.resume-text').textContent=s.status==='complete'?core.tr('Приключение завершено','Adventure complete'):(r?r[en?'en':'ru']:s.room)+' · '+clock(core.currentSeconds(s));
      }
    };
    return ui;
  }
  function clock(seconds){
    const t=Math.max(0,Math.ceil(seconds||0));
    return [Math.floor(t/3600),Math.floor(t/60)%60,t%60].map(n=>String(n).padStart(2,'0')).join(':');
  }
  function makeStudy(scene,core){
    const name=scene.getName();
    let session=core.read().session;
    if(!session && core.startSession(name))session=core.read().session;
    const sessionId=session?.id;
    const owns=s=>!!s && s.room===name && s.id===sessionId;
    const timer='<section class="ad-timer"><div class="clock-time" role="timer" aria-live="off"></div><div class="clock-divider" aria-hidden="true">❧</div><p class="clock-label"></p><button type="button" class="text-button legacy-resume" hidden></button></section>';
    const ui=mount(scene,studyHeader+timer+dialog('confirm','cancel','abandon')+dialog('success','to-home','to-doors'),core);
    const {q}=ui,confirm=q('.castle-confirm'),success=q('.castle-success');
    const finishTitle=q('#ad-success-title');
    finishTitle.tabIndex=-1;
    window.CastleMini?.add(q('.ad-timer'),{
      room:name,
      collapse:name==='Забытая библиотека'?()=>core.requestScene(ui,'Комната котика'):null,
      read:()=>owns(core.read().session)?core.miniRead('study'):null,
      change:(key,paused)=>owns(core.read().session) && core.miniChange('study',key,paused),
      refresh:()=>ui.update()
    });
    function leave(destination,expectedStatus){
      if(!core.canNavigate(ui))return;
      const d=core.checkSession();
      if(!owns(d.session) || d.session.status!==expectedStatus){ui.update();return;}
      if(!core.requestScene(ui,destination))return;
      core.stopSession(d);
    }
    q('.castle-back').onclick=()=>{
      if(!core.canNavigate(ui))return;
      const s=core.checkSession().session;
      if(!owns(s)){core.requestScene(ui,'Волшебные двери');return;}
      if(s.status==='complete')ui.update();
      else ui.modal(confirm,true,'.cancel');
    };
    q('.cancel').onclick=()=>ui.modal(confirm,false);
    q('.abandon').onclick=()=>{if(!confirm.hidden)leave('Волшебные двери','active');};
    q('.to-home').onclick=()=>{if(!success.hidden)leave('Комната котика','complete');};
    q('.to-doors').onclick=()=>{if(!success.hidden)leave('Волшебные двери','complete');};
    q('.legacy-resume').onclick=()=>{
      const s=core.read().session;
      if(!core.canNavigate(ui)||!owns(s)||s.status!=='active'||s.running)return;
      core.miniChange('study',String(s.id),false);ui.update();
    };
    ui.renderLanguage=()=>{
      const en=core.lang()==='en',room=core.ROOMS.find(r=>r.scene===name);
      ui.chrome(en);q('h1').textContent=room[en?'en':'ru'];
      q('.clock-label').textContent=en?'Until your adventure ends':'До завершения приключения';
      q('.clock-time').setAttribute('aria-label',en?'Study time remaining':'Оставшееся время учёбы');
      q('.legacy-resume').textContent=en?'Resume':'Продолжить';
      q('#ad-confirm-title').textContent=en?'Leave this adventure?':'Покинуть приключение?';
      confirm.querySelector('.message').textContent=en?'An unfinished session earns no golden stars.':'За незавершённое занятие звёздочки не начисляются.';
      q('.cancel').textContent=en?'Stay':'Остаться';q('.abandon').textContent=en?'Leave without a reward':'Выйти без награды';
      q('#ad-success-title').textContent=en?'Adventure complete!':'Приключение завершено!';
      q('.to-home').textContent=en?'Cat’s room':'К котику';q('.to-doors').textContent=en?'More doors':'К дверям';ui.update();
    };
    ui.update=()=>{
      if(ui.pendingScene || ui.root.inert || !ui.root.isConnected)return;
      const d=core.checkSession(),s=d.session,en=core.lang()==='en';
      skin.wallet(q('.castle-balance'),d.coins,en);
      if(!owns(s)){
        q('.clock-time').textContent=clock(0);q('.legacy-resume').hidden=true;
        ui.modal(confirm,false);ui.modal(success,false);
        return;
      }
      q('.clock-time').textContent=clock(core.currentSeconds(s));q('.legacy-resume').hidden=s.running||s.status!=='active';
      if(s.status!=='complete')return;
      ui.modal(confirm,false);ui.modal(success,true,'#ad-success-title');
      const noun=en?(s.reward===1?'golden star':'golden stars'):s.reward===1?'золотая звёздочка':s.reward<5?'золотые звёздочки':'золотых звёздочек';
      success.querySelector('.message').innerHTML=(en?'Study time: ':'Время учёбы — ')+Number(s.minutes)+(en?' min. Reward: ':' мин. Награда — ')+'<span class="reward-chip">'+skin.star+Number(s.reward)+' '+noun+'</span>.';
    };
    return ui;
  }
  function run(scene,type){
    const core=window.__castleAdventureCore;
    if(!core||window.__castleScreenFade?.pending?.from===scene.getName())return;
    const key=type==='corridor'?'__castleCorridor':'__castleStudy';
    let ui=window[key];
    if(!ui||ui.scene!==scene||!ui.root.isConnected){
      if(ui){ui.dispose?.();ui.root?.remove()}
      ui=type==='corridor'?makeCorridor(scene,core):makeStudy(scene,core);window[key]=ui;
    }
    if(ui.pendingScene){core.switchIfPending(ui,scene,key);return;}
    ui.resize();const lang=core.lang();
    if(ui.lang!==lang){ui.lang=lang;ui.renderLanguage()}
    const now=performance.now();
    if(now-ui.lastTick>=120){ui.lastTick=now;ui.update()}
  }
  window.__castleAdventureView={run,clock};
}
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6318 = function GDJSInlineCode(runtimeScene) {
"use strict";
// Each completed session and its guest draw share one Adventure save.
if (typeof window !== 'undefined' && !window.__castleGuestLedger) {
  window.__castleGuestLedger = (() => {
    const doors = ['Забытая оранжерея', 'Мастерская алхимика', 'Забытая библиотека', 'Часовая мастерская'];
    const guests = ['leaf', 'chemist', 'wizard', 'artist'];
    const integer = n => Number.isSafeInteger(n) && n >= 0 ? n : 0;
function migrate(data) {
      const b=data.guestAlbum;
      if(!b||typeof b!=='object')return false;
      const legacy=b.guests?.rabbit;
      if(b.rosterVersion===2&&!legacy&&!Object.prototype.hasOwnProperty.call(b,'rabbitMisses')&&!b.waiting?.some?.(v=>v?.key==='rabbit'))return false;
      if(legacy){
        const artist=b.guests.artist||(b.guests.artist={});
        artist.visits=integer(artist.visits)+integer(legacy.visits);
        for(const field of ['photos','stories','unread'])artist[field]=integer(artist[field])|integer(legacy[field]);
        if(Array.isArray(legacy.rooms)){
          artist.rooms=Array.isArray(artist.rooms)?artist.rooms:[];
          legacy.rooms.forEach((levels,i)=>{if(!artist.rooms[i]&&Array.isArray(levels))artist.rooms[i]=levels;});
        }
        delete b.guests.rabbit;
      }
      for(const visit of Array.isArray(b.waiting)?b.waiting:[]){
        if(visit?.key==='rabbit'){visit.key='artist';visit.variant='clock';}
      }
      if(Object.prototype.hasOwnProperty.call(b,'rabbitMisses'))b.clockRareMisses=integer(b.rabbitMisses);
      delete b.rabbitMisses;b.rosterVersion=2;return true;
    }
    function get(data) {
      const b = data.guestAlbum || (data.guestAlbum = {});
      b.misses = Array.from({length:4}, (_, i) => Math.min(11, integer(b.misses?.[i])));
      migrate(data);
      b.clockRareMisses = Math.min(29, integer(b.clockRareMisses));
      b.newGuestNotification=b.newGuestNotification===true;
      b.guests ||= {};
      for (const key of guests) {
        const g = b.guests[key] || (b.guests[key] = {});
        g.visits = integer(g.visits);
        const maxMask = (1 << Math.min(3,g.visits)) - 1;
        g.photos = maxMask; g.stories = maxMask;
        g.unread = integer(g.unread) & maxMask;
      }
      if (!Array.isArray(b.waiting)) b.waiting = [];
      b.activeMs = integer(b.activeMs);
      b.lastTuftMs = integer(b.lastTuftMs);
      return b;
    }
    function chance(attempt) {
      return attempt >= 12 ? 1 : attempt >= 9 ? .50 : attempt >= 6 ? .25 : .15;
    }
    // Different streams per session and guest. Reloading or finishing in another
    // window makes exactly the same draw from the already-saved session ID.
    function sample(id, salt) {
      let h = 2166136261;
      for (const c of id + '/' + salt) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
      h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b);
      h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }
    function complete(data, session) {
      const door = doors.indexOf(session.room);
      if (door < 0 || session.status !== 'complete' || session.guestDrawn) return;
      const id = String(session.id || (session.room + '/' + session.endAt + '/' + data.completed));
      const b = get(data), common = b.misses[door] + 1, clock = door === 3;
      const rareDue = clock && b.clockRareMisses >= 29, commonDue = common >= 12;
      const rareHit = clock && sample(id,'rabbit') < .05;
      const commonHit = sample(id,guests[door]) < chance(common);
      // Keep the old draw stream and both guarantees. Every clock visit now features the artist.
      const rare = rareDue || (!commonDue && rareHit);
      const regular = !rare && (commonDue || commonHit);
      const key = (regular || rare) ? guests[door] : '';
      b.misses[door] = regular ? 0 : Math.min(11,common);
      if(clock)b.clockRareMisses = rare ? 0 : Math.min(29,b.clockRareMisses+1);
      if(key)b.waiting.push(rare ? {id,key,variant:'clock'} : {id,key});
      session.guestDrawn = true;
      return key;
    }
    function witness(data, id) {
      const b = get(data), next = b.waiting[0];
      if (!next || next.id !== id || !guests.includes(next.key)) return null;
      const g = b.guests[next.key], index = g.visits % 3;
      b.waiting.shift();
      const fresh = g.visits < 3;
      if(g.visits===0)b.newGuestNotification=true;
      ++g.visits;
      if (fresh) {
        g.photos |= 1 << index; g.stories |= 1 << index; g.unread |= 1 << index;
      }
      return {key:next.key, index, fresh};
    }
    return {get, migrate, chance, sample, complete, witness, guests, doors};
  })();
}
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xacbed8 = function GDJSInlineCode(runtimeScene) {
// Run on each scene's first frame and accept one destination from the current scene instance.
(function(){
  if(typeof window==='undefined'||typeof document==='undefined')return;
  let fade=window.__castleScreenFade;
  if(!fade){
    const cover=document.createElement('div');
    cover.id='castle-fade-cover';
    cover.style.cssText='position:fixed;inset:0;background:#261b22;opacity:0;pointer-events:none;z-index:2147483100;transition:opacity 350ms ease;';
    document.body.appendChild(cover);
    fade={cover,pending:null,switched:false};
    window.__castleScreenFade=fade;
    window.__castleTransitionQueue=(source,destination)=>{
      if(fade.pending || source.getGame().getSceneStack().getCurrentScene()!==source)return false;
      fade.pending={name:destination,from:source.getName(),source,at:performance.now()};
      fade.switched=false;
      cover.style.pointerEvents='auto';
      cover.style.opacity='1';
      return true;
    };
  }
  const route=fade.pending;
  if(!route || route.source!==runtimeScene){
    if(route){
      fade.pending=null;
      fade.switched=false;
      fade.cover.style.opacity='0';
    }
    if(fade.cover.style.pointerEvents!=='none')fade.cover.style.pointerEvents='none';
    return;
  }
  if(fade.switched || performance.now()-route.at<350)return;
  fade.switched=true;
  window.__castleOutgoingStage?.remove();
  window.__castleOutgoingStage=null;
  if(route.from==='Главное меню'){
    const fx=window.__castleMenuFX;
    if(fx){fx.cleanup?.();fx.fireplace?.pause();fx.fireplace2?.pause();fx.purr?.pause();fx.root?.remove();window.__castleMenuFX=null;}
  }
  gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,route.name,false);
})();
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6438 = function GDJSInlineCode(runtimeScene) {
// Castle of Hours — approved settings window (RU/EN and master volume).
// This event only adds the settings overlay. It does not change the scene art,
// cat animation, study modes, or any other game mechanics.
(function () {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const game = runtimeScene.getGame();
  const scene = runtimeScene;
  const key = "__theCozyTimeSettings";
  let ui = window[key];
  const safeRead = (name, fallback) => {
    try { return window.localStorage.getItem(name) || fallback; }
    catch (_) { return fallback; }
  };
  const safeSave = (name, value) => {
    try { window.localStorage.setItem(name, String(value)); }
    catch (_) { /* Settings still work for this session. */ }
  };
  const setMasterVolume = (value) => {
    const manager = game.getSoundManager();
    if (manager && typeof manager.setGlobalVolume === "function") {
      manager.setGlobalVolume(value);
    }
  };
  if (!ui || !ui.root || !ui.root.isConnected || ui.scene !== scene) {
    if (ui && ui.root && ui.root.isConnected) ui.root.remove();
    const root = document.createElement("div");
    root.id = "cozy-settings-root";
    root.setAttribute("data-cozy-ui", "settings");
    root.innerHTML = `
      <style>
        
        #cozy-settings-root {position:fixed; z-index:2147483000; pointer-events:none; overflow:hidden;
          font-family:'Castle Garamond',Georgia,serif; color:#563923; isolation:isolate;}
        #cozy-settings-root * {box-sizing:border-box;}
        #cozy-settings-root button, #cozy-settings-root input {font:inherit;}
        #cozy-settings-root .cozy-gear {position:absolute; top:20px;right:24px; width:64px;height:64px;
          transform:scale(var(--cozy-scale,1));transform-origin:top right;
          border:2px solid #b48b54;border-radius:50%;background:linear-gradient(140deg,#fff3d4,#e4bd83);
          color:#63452d;font-size:31px;box-shadow:0 4px 0 #9a714b,0 8px 22px #422a185c;
          cursor:pointer;pointer-events:auto; display:flex;align-items:center;justify-content:center;}
        #cozy-settings-root .cozy-gear:hover {filter:brightness(1.07);}
        #cozy-settings-root .cozy-backdrop {position:absolute;inset:0;display:none;
          background:rgba(30,22,17,.53);pointer-events:auto;}
        #cozy-settings-root.cozy-open .cozy-backdrop {display:block;}
        #cozy-settings-root .cozy-panel {position:absolute;top:50%;left:50%;width:550px;
          padding:34px 40px 38px;border:6px solid #9b7449;border-radius:20px;
          background:radial-gradient(ellipse at 48% 25%,#fff8e5 0%,#f4dfb9 68%,#e7c995 100%);
          box-shadow:inset 0 0 0 2px #f9edcb,inset 0 0 0 5px #c49d68,0 18px 50px #1a100c9e;
          transform:translate(-50%,-50%) scale(var(--cozy-scale,1));
          display:none;pointer-events:auto;transform-origin:center center;}
        #cozy-settings-root.cozy-open .cozy-panel {display:block;}
        #cozy-settings-root .cozy-panel::before {content:'✦';position:absolute;pointer-events:none;top:13px;left:20px;
          font-size:20px;color:#b58a54;}
        #cozy-settings-root .cozy-panel::after {content:'✦';position:absolute;pointer-events:none;top:13px;right:20px;
          font-size:20px;color:#b58a54;}
        #cozy-settings-root .cozy-heading {text-align:center;font-size:44px;font-weight:600;
          line-height:1.15;margin:0 0 14px;letter-spacing:.3px;}
        #cozy-settings-root .cozy-rule {height:2px;margin:0 0 22px;
          background:linear-gradient(90deg,transparent,#b48a57,transparent);}
        #cozy-settings-root .cozy-close {position:absolute;top:8px;right:12px;z-index:2;pointer-events:auto;border:0;background:transparent;
          color:#765538;font-size:28px;cursor:pointer;line-height:1;}
        #cozy-settings-root .cozy-label {font-size:28px;font-weight:600;margin-bottom:10px;}
        #cozy-settings-root .cozy-languages {display:flex;gap:12px;margin-bottom:26px;}
        #cozy-settings-root .cozy-language {flex:1;border:2px solid #b99a71;border-radius:12px;
          background:#fff6e4;padding:10px 6px;font-size:25px;color:#64452e;cursor:pointer;}
        #cozy-settings-root .cozy-language[aria-pressed='true'] {background:#8a6040;
          color:#fff6e3;border-color:#765032;box-shadow:inset 0 2px 6px #49301d55;}
        #cozy-settings-root .cozy-volume-head {display:flex;justify-content:space-between;align-items:baseline;}
        #cozy-settings-root .cozy-value {font-size:25px;}
        #cozy-settings-root .cozy-slider {width:100%;height:12px;appearance:none;-webkit-appearance:none;
          border-radius:99px;background:linear-gradient(90deg,#a47749 var(--cozy-volume,65%),#d8bd91 var(--cozy-volume,65%));
          outline:none;cursor:pointer;margin:15px 0 12px;}
        #cozy-settings-root .cozy-slider::-webkit-slider-thumb {appearance:none;-webkit-appearance:none;
          width:28px;height:28px;border-radius:50%;border:3px solid #f8e8c6;background:#9a6a3e;
          box-shadow:0 2px 5px #40291577;}
        #cozy-settings-root .cozy-slider::-moz-range-thumb {width:22px;height:22px;
          border-radius:50%;border:3px solid #f8e8c6;background:#9a6a3e;}
        #cozy-settings-root .cozy-footer {text-align:center;font-size:22px;color:#9a754f;
          margin-top:12px;letter-spacing:1px;}
      .progress-reset,.progress-dialog button{background:#825a42;color:#fff2dc;border:0;border-radius:9px;padding:8px 14px;cursor:pointer}.progress-reset{display:block;margin:12px auto}.progress-dialog{background:#f5e0bc;color:#4c3222;border:2px solid #ab865b;border-radius:12px;text-align:center}.progress-dialog::backdrop{background:#2f211ab0}</style>
      <button class="cozy-gear" data-coh-action="gear" type="button" aria-label="Настройки / Settings" title="Настройки / Settings">⚙</button>
      <div class="cozy-backdrop" aria-hidden="true"></div>
      <section class="cozy-panel" role="dialog" aria-modal="true" aria-label="Настройки / Settings">
        <button class="cozy-close" data-coh-action="close" data-compact type="button" aria-label="Закрыть / Close">×</button>
        <h2 class="cozy-heading" data-cozy-text="title">Настройки</h2>
        <div class="cozy-rule"></div>
        <div class="cozy-label" data-cozy-text="language">Язык / Language</div>
        <div class="cozy-languages" role="group" aria-label="Language">
          <button class="cozy-language" type="button" data-cozy-lang="ru">Русский</button>
          <button class="cozy-language" type="button" data-cozy-lang="en">English</button>
        </div>
        <div class="cozy-volume-head"><label class="cozy-label" for="cozy-master-volume" data-cozy-text="volume">Громкость</label>
          <output class="cozy-value" data-cozy-text="percent">65%</output></div>
        <input id="cozy-master-volume" class="cozy-slider" type="range" min="0" max="100" step="1" value="65" aria-label="Master volume">
        <button class="progress-reset" data-cozy-text="reset">Сбросить весь прогресс</button>
        <dialog class="progress-dialog"><p data-cozy-text="ask"></p><button class="cancel" data-cozy-text="cancel"></button> <button class="confirm" data-cozy-text="yes"></button></dialog>
        <div class="cozy-footer">✦ Castle of Hours ✦</div>
      </section>`;
    document.body.appendChild(root);
    const language = safeRead("theCozyTime.language", "ru") === "en" ? "en" : "ru";
    const storedVolume = Number(safeRead("theCozyTime.volume", "65"));
    const volume = Number.isFinite(storedVolume) ? Math.max(0, Math.min(100,storedVolume)) : 65;
    ui = {root,scene,language,volume};
    window[key] = ui;
    const gear = root.querySelector(".cozy-gear");
    const backdrop = root.querySelector(".cozy-backdrop");
    const panel = root.querySelector(".cozy-panel");
    const close = root.querySelector(".cozy-close");
    const slider = root.querySelector(".cozy-slider");

  const resetButton=root.querySelector('.progress-reset'), confirmBox=root.querySelector('.progress-dialog');
  resetButton.onclick=()=>{confirmBox.showModal();confirmBox.querySelector('.cancel').focus()};
  confirmBox.querySelector('.cancel').onclick=()=>confirmBox.close();
  ui.confirmReset=()=>{
    confirmBox.close();root.classList.remove('cozy-open');window.__castleResetScene=scene;
  };
    confirmBox.querySelector('.confirm').onclick=ui.confirmReset;
    const redraw = () => {
      const en=ui.language==="en";
      for(const [key,ru,english] of [['reset','Сбросить весь прогресс','Reset all progress'],['ask','Сбросить весь игровой прогресс?','Reset all game progress?'],['cancel','Отмена','Cancel'],['yes','Сбросить прогресс','Reset progress']]){
        root.querySelector('[data-cozy-text="'+key+'"]').textContent=en?english:ru;
      }
      root.querySelector('[data-cozy-text="title"]').textContent = ui.language === "ru" ? "Настройки" : "Settings";
      root.querySelector('[data-cozy-text="language"]').textContent = ui.language === "ru" ? "Язык / Language" : "Language / Язык";
      root.querySelector('[data-cozy-text="volume"]').textContent = ui.language === "ru" ? "Громкость" : "Volume";
      root.querySelector('[data-cozy-text="percent"]').textContent = ui.volume + "%";
      slider.value = String(ui.volume);
      slider.style.setProperty("--cozy-volume",ui.volume + "%");
      root.querySelectorAll("[data-cozy-lang]").forEach(button => {
        button.setAttribute("aria-pressed",String(button.dataset.cozyLang === ui.language));
      });
      document.documentElement.lang = ui.language;
    };
    const hide = () => {root.classList.remove("cozy-open");};
    gear.addEventListener("click",() => {root.classList.add("cozy-open");close.focus();});
    close.addEventListener("click",hide);
    backdrop.addEventListener("click",hide);
    panel.addEventListener("click",event => event.stopPropagation());
    ui.setLanguage=value=>{
      ui.language=value==='en'?'en':'ru';safeSave("theCozyTime.language",ui.language);redraw();window.dispatchEvent(new Event('castle-general-change'));
    };
    ui.setMaster=value=>{
      ui.volume=Math.max(0,Math.min(100,Number(value)));safeSave("theCozyTime.volume",ui.volume);setMasterVolume(ui.volume);redraw();window.dispatchEvent(new Event('castle-general-change'));
    };
    ui.reload=()=>{
      ui.language=safeRead("theCozyTime.language","ru")==='en'?'en':'ru';
      ui.volume=Math.max(0,Math.min(100,Number(safeRead("theCozyTime.volume","65"))));
      setMasterVolume(ui.volume);redraw();
    };
    root.querySelectorAll("[data-cozy-lang]").forEach(button=>button.onclick=()=>ui.setLanguage(button.dataset.cozyLang));
    slider.oninput=()=>ui.setMaster(slider.value);
    ui.onKeyDown = event => {
      if (event.key === "Escape" && root.classList.contains("cozy-open")) hide();
    };
    document.addEventListener("keydown",ui.onKeyDown);
    redraw();
    setMasterVolume(volume);
  }
  // The approved main-menu illustration already contains the settings icon.
  // Keep the real settings panel but hide its duplicate top-right gear on that scene.
  const settingsGear = ui.root.querySelector('.cozy-gear');
  if (settingsGear) settingsGear.style.display = 'none';
  // Keep overlay aligned to the game canvas in windowed/fullscreen preview.
  const canvas = document.querySelector("canvas");
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      ui.root.style.left = rect.left + "px";
      ui.root.style.top = rect.top + "px";
      ui.root.style.width = rect.width + "px";
      ui.root.style.height = rect.height + "px";
      ui.root.style.setProperty("--cozy-scale",String(Math.min(rect.width / 1280,rect.height / 720)));
    }
  }
})();
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac64d8 = function GDJSInlineCode(runtimeScene) {
// Single playback and storage owner for the soundtrack and room ambience.
(function () {
  const key = 'castleOfHours.audio.v1';
  const tracks = {tavern:'01_Cozy_Tavern_Lofi.mp3',library:'02_Enchanted_Library.mp3',afternoon:'03_Castle_Afternoon_Instrumental.mp3'};
  const scene = runtimeScene.getName();
  const automatic = room => ['Забытая библиотека','Помодоро'].includes(room) ? 'library' :
    ['Забытая оранжерея','Часовая мастерская'].includes(room) ? 'silent' : 'tavern';
  let audio = window.__castleMusic;
  if (!audio) {
    function saved() {
      let s; try { s=JSON.parse(localStorage.getItem(key)) || {}; } catch { s={}; }
      const volume=(v,def)=> v!=null && Number.isFinite(+v) ? Math.min(100,Math.max(0,+v)) : def;
      const selection=s.choice || 'auto';
      return {...s,choice:selection==='auto'||selection==='silent'||Object.hasOwn(tracks,selection)?selection:'silent',
        enabled:s.enabled!==false,musicEnabled:s.musicEnabled!==false,ambienceEnabled:s.ambienceEnabled!==false,
        music:volume(s.music,55),ambience:volume(s.ambience,35),cat:volume(s.cat,45)};
    }
    const state=saved(), music=new Audio(), ambient=new Audio();
    music.loop=ambient.loop=true; music.preload='auto';ambient.preload='none';
    for(const player of [music,ambient]) {player.hidden=true;document.body.append(player);}
    const persist=()=>localStorage.setItem(key,JSON.stringify(state));
    if(localStorage.getItem(key)!==null)persist();
    audio={state,music,ambient,persist,current:null,scene:null,homeAmbientGate:{requested:false}};
    window.__castleMusic=audio;
    const play=player=>{if(player.paused)player.play()?.catch(()=>{});};
    audio.apply=()=>{
      const target=state.choice==='auto'?automatic(audio.scene):state.choice;
      if(target!==audio.current){
        audio.current=target;
        if(tracks[target]) {music.src=window.__castleVisuals.url(tracks[target]);music.load();}
        else if(music.hasAttribute('src')) {music.pause();music.removeAttribute('src');music.load();}
      }
      const master=Number(localStorage.getItem('theCozyTime.volume')??65)/100;
      music.volume=state.music/100*master;ambient.volume=state.ambience/100*master;
      if(state.enabled&&state.musicEnabled&&tracks[target]&&audio.scene!=='Главное меню')play(music);else music.pause();
      if(state.enabled&&state.ambienceEnabled&&audio.scene==='Комната котика'&&audio.homeAmbientGate.requested&&state.ambience>0){
        if(!ambient.hasAttribute('src'))ambient.src=window.__castleVisuals.url('The_Cozy_Time_Fireplace_01_Quiet_Embers.mp3');
        play(ambient);
      }else {
        ambient.pause();
        if(ambient.hasAttribute('src')){ambient.removeAttribute('src');ambient.load();}
      }
    };
    const announce=()=>window.dispatchEvent(new Event('castle-audio-change'));
    audio.set=(name,value)=>{
      Object.assign(state,saved(),{[name]:value});
      if(audio.scene==='Комната котика'&&(name==='ambience'||name==='ambienceEnabled'))audio.homeAmbientGate.requested=state.ambienceEnabled&&state.ambience>0;
      persist();audio.apply();announce();
    };
    audio.toggle=()=>audio.set('enabled',!state.enabled);
    window.addEventListener('storage',e=>{
      if(e.key===key){Object.assign(state,saved());audio.apply();announce();}
      if(e.key==='theCozyTime.volume'||e.key==='theCozyTime.language'){
        window.__theCozyTimeSettings?.reload();audio.apply();announce();
      }
    });
    window.addEventListener('castle-general-change',()=>{audio.apply();announce();});
    window.addEventListener('castle-audio-change',()=>{window.__theCozyTimeSettings?.refreshSound?.();window.CastleTimerAlerts?.sync();});
    window.addEventListener('pagehide',()=>{music.pause();ambient.pause();});
    const retry=()=>{if(music.paused||ambient.paused)audio.apply();};
    document.addEventListener('pointerup',retry,{once:true});document.addEventListener('keydown',retry,{once:true});
  }
  if(audio.scene!==scene){audio.scene=scene;audio.homeAmbientGate.requested=false;audio.apply();}
  const ui=window.__theCozyTimeSettings;
  if(!ui?.root||ui.refreshSound)return;
  const wrap=document.createElement('div');wrap.className='castle-audio-options';
  wrap.innerHTML='<label class="music-title"></label><label class="switch-line"><input type="checkbox" name="musicEnabled"> <span></span></label><select class="music-choice" name="choice"></select><label><span class="audio-name"></span> <output></output><input type="range" min="0" max="100" name="music" class="music-volume"></label><label class="switch-line"><input type="checkbox" name="ambienceEnabled"> <span></span></label><label><span class="audio-name"></span> <output></output><input type="range" min="0" max="100" name="ambience" class="ambient-volume"></label><label><span class="audio-name"></span> <output></output><input type="range" min="0" max="100" name="cat" class="cat-volume"></label><button type="button" class="music-toggle"></button>';
  ui.root.querySelector('.progress-reset').before(wrap);
  const q=s=>wrap.querySelector(s);
  for(const input of wrap.querySelectorAll('input,select')){
    const range=input.type==='range';
    input.addEventListener(range?'input':'change',()=>audio.set(input.name,range?Number(input.value):input.type==='checkbox'?input.checked:input.value));
  }
  q('button').onclick=audio.toggle;
  let lastLang=null;
  ui.refreshSound=()=>{
    const en=ui.language==='en',s=audio.state;
    if(lastLang!==en){
      lastLang=en;
      q('.music-title').textContent=en?'Music':'Музыка';
      q('.music-choice').setAttribute('aria-label',en?'Music track':'Композиция');
      q('.music-choice').replaceChildren(...audio.trackOptions(en));
      wrap.querySelectorAll('.switch-line span').forEach((n,i)=>n.textContent=(en?['Background music','Room ambience']:['Фоновая музыка','Звуки окружения'])[i]);
      wrap.querySelectorAll('.audio-name').forEach((n,i)=>n.innerHTML=window.__castleVisuals.token(['music','fire','cat'][i])+(en?['Music','Fireplace','Cat']:['Музыка','Камин','Котик'])[i]);
    }
    for(const [name,ru,english] of [['music','Громкость музыки','Music volume'],['ambience','Громкость окружения','Ambience volume'],['cat','Громкость котика','Cat volume']]){
      q('input[name='+name+']').setAttribute('aria-label',en?english:ru);
    }
    for(const input of wrap.querySelectorAll('[name=choice],[name=musicEnabled],[name=ambienceEnabled],[name=music],[name=ambience],[name=cat]')){
      if(input.type==='checkbox')input.checked=s[input.name];
      else {input.value=s[input.name];if(input.type==='range')input.parentNode.querySelector('output').textContent=s[input.name]+'%';}
    }
    q('.music-toggle').innerHTML=window.__castleVisuals.token(s.enabled?'speaker':'mute')+(s.enabled?(en?'Turn sound off':'Выключить звук'):(en?'Turn sound on':'Включить звук'));
    window.CastleTimerAlerts.bind(wrap,en);
    window.CastleTimerAlerts.bindDesktop(wrap,en);
  };
  audio.trackOptions=en=>[[en?'Automatic (by room)':'Автоматически (по комнате)','auto'],['Cozy Tavern Lo-fi','tavern'],['Enchanted Library','library'],[en?'Castle Afternoon · instrumental':'Castle Afternoon · инструментальная','afternoon'],[en?'No music':'Без музыки','silent']].map(([name,id])=>new Option(name,id));
  ui.refreshSound();
})();
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xb78240 = function GDJSInlineCode(runtimeScene) {
if(typeof window!=='undefined')window.__castleAdventureView.run(runtimeScene,'study');
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xb77d18 = function GDJSInlineCode(runtimeScene) {
if(window.__castleResetScene===runtimeScene){
  window.__castleResetScene=null;
  for(const key of ['castleOfHours.adventure.v1','castleOfHours.moonTower.v1'])localStorage.removeItem(key);
  const menu=window.__cozyMainMenu;
  if(menu?.captureNavigation){for(const event of ['pointerdown','mousedown'])document.removeEventListener(event,menu.captureNavigation,true)}
  const settings=window.__theCozyTimeSettings;
  if(settings?.onKeyDown)document.removeEventListener('keydown',settings.onKeyDown);
  const fx=window.__castleMenuFX;
  if(fx){fx.cleanup?.();fx.purr.pause();fx.fireplace.pause();fx.fireplace2.pause()}
  for(const name of ['__cozyMainMenu','__castleMenuFX','__castleCatHome','__castleStudy','__castleCorridor','__castleMoonTower','__theCozyTimeSettings']){
    window[name]?.dispose?.();window[name]?.root?.remove();window[name]=null;
  }
  const transition=window.__castleScreenFade;
  transition.pending=null;transition.cover.style.opacity='0';
  gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,'Главное меню',false);
}
};
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.eventsList0 = function(runtimeScene) {

{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6098(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0x81cc80(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0x8f3998(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xaf52a0(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xb2aa28(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6250(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6318(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xacbed8(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac6438(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xac64d8(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xb78240(runtimeScene);

}


{


gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.userFunc0xb77d18(runtimeScene);

}


};

gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.GDBackgroundObjects1.length = 0;

gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.eventsList0(runtimeScene);
gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code.GDBackgroundObjects1.length = 0;


return;

}

gdjs['_1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code'] = gdjs._1047_1072_1073_1099_1090_1072_1103_32_1073_1080_1073_1083_1080_1086_1090_1077_1082_1072Code;
