gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code = {};
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.localVariables = [];
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.idToCallbackMap = new Map();
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDBackgroundObjects1= [];
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDHomeKittenObjects1= [];
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatBedBackObjects1= [];
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatBedFrontObjects1= [];
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatRoomPaintingObjects1= [];
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDHomePetEyesObjects1= [];


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb25c10 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb67208 = function GDJSInlineCode(runtimeScene) {
"use strict";
// External events · Книга восстановления. The room owns the dialog, while Adventure owns the wallet.
if (typeof window !== 'undefined' && !window.CastleBindRestorationBook) {
  window.CastleBindRestorationBook = function (ui, core, url) {
    const root = ui.root;
    const dialog = root.querySelector('.home-book-shade');
    const trigger = root.querySelector('.home-book-chip');
    const pad=document.createElement('span');pad.className='chronicle-touch-pad';pad.setAttribute('aria-hidden','true');trigger.append(pad);
    const q = selector => dialog.querySelector(selector);
    const roman = ['0','I','II','III'];
    const ids = ['fire','shelves','cat','window','desk'];
    const stories = [
      ['Под каменным сводом дремлет тёплый уголёк.','An ember dreams beneath the stone arch.'],
      ['На этих полках каждая книга хранит свой секрет.','Every book on these shelves keeps a secret.'],
      ['Там, где мягче плед, котёнку слаще спится.','The softest blanket holds the sweetest dreams.'],
      ['Тонкий росток тянется к солнечному стеклу.','A small green shoot reaches for the sun.'],
      ['На этом столе начнётся новая история.','A new story begins at this desk.']
    ];
    const star = url('Adventure_Star.png');
    const wrap = q('.home-book');
    wrap.style.setProperty('--manuscript', 'url('+JSON.stringify(url('Chronicle_Spread.webp'))+')');
    const chapterButtons = core.ZONES.map((zone, i) => {
      const tab = document.createElement('button');
      tab.type = 'button'; tab.className = 'chronicle-chapter chronicle-entry'; tab.dataset.zone = i;
      const icon = document.createElement('img');icon.alt = '';icon.draggable = false;
      icon.src = url('Chronicle_Icon_'+ids[i]+'.webp');
      const body = document.createElement('span');
      body.innerHTML = '<span class="entry-title"></span><span class="entry-progress"><i></i><i></i><i></i></span>';
      const mark = document.createElement('span');mark.className = 'entry-mark';mark.setAttribute('aria-hidden','true');
      tab.append(icon,body,mark);
      tab.onclick = () => { preview=null; ui.selected = i; render(true); };
      q('.book-chapters').append(tab);
      return tab;
    });
    let preview=null;
    const tiers = core.COSTS.map((price,i)=>{
      const tier=document.createElement('div');tier.className='book-tier';
      const number=document.createElement('b');number.textContent=roman[i+1];
      const cost=document.createElement('span');const coin=new Image();coin.src=star;coin.alt='';cost.append(coin,String(price));
      function previewTier(){if(ui.selected!==2)return;preview=i+1;render(true);}
      tier.addEventListener('click',previewTier);
      tier.addEventListener('keydown',e=>{if(ui.selected===2&&(e.key==='Enter'||e.key===' ')){e.preventDefault();previewTier();}});
      tier.append(number,cost);q('.book-tiers').append(tier);return tier;
    });
    q('.book-wallet img').src=star;
    q('.chronicle-buy img').src=star;
    let generation=0, imageKey='', shownLevel=0, shownZone=0, busy=false, lastState='';
    function updateArt(i,level,fast) {
      const key=ids[i]+'_'+level;
      if(key===imageKey)return;
      imageKey=key;
      const version=++generation;
      const next=new Image();next.alt=core.ZONES[i][core.lang()==='en'?'en':'ru']; next.draggable=false;
      next.src=url('Chronicle_'+key+'.webp');
      const apply=()=>{
        if(version!==generation || !dialog.isConnected)return;
        const holder=q('.book-art'),old=holder.lastElementChild;
        for(const surplus of [...holder.children])if(surplus!==old)surplus.remove();
        holder.append(next);
        if(!old || fast || matchMedia('(prefers-reduced-motion: reduce)').matches){old?.remove();return;}
        const fading=next.animate([{opacity:0},{opacity:1}],{duration:240,easing:'ease-out'});
        fading.finished.then(()=>old.remove()).catch(()=>old.remove());
      };
      if(next.complete&&next.naturalWidth)apply();else next.addEventListener('load',apply,{once:true});
    }
    function render(force=false) {
      if(!dialog.open && !force)return;
      const data=core.read(), en=core.lang()==='en', i=ui.selected, lv=data.upgrades[i];
      const signature=[+en,i,data.coins,...data.upgrades].join('/');
      if(!force && signature===lastState)return;
      lastState=signature;shownZone=i;shownLevel=lv;
      q('.book-heading').textContent=en?'Restoration Book':'Книга восстановления';
      q('.book-close').setAttribute('aria-label',en?'Close the book':'Закрыть книгу');
      for(let j=0;j<chapterButtons.length;j++){
        const tab=chapterButtons[j], item=core.ZONES[j][en?'en':'ru'], tier=data.upgrades[j];
        tab.setAttribute('aria-pressed',String(j===i));tab.classList.toggle('active',j===i);
        tab.querySelector('.entry-title').textContent=item;
        tab.querySelectorAll('i').forEach((bar,n)=>bar.classList.toggle('filled',n<tier));
        tab.querySelector('.entry-mark').textContent=tier===3?'✓':'';
        tab.setAttribute('aria-label',item+', '+(en?'level ':'уровень ')+tier+(tier===3?(en?', fully restored':', полностью восстановлено'):''));
      }
      q('.book-zone-title').textContent=core.ZONES[i][en?'en':'ru'];
      const artLevel=i===2&&preview!==null?preview:lv;
      updateArt(i,artLevel,!dialog.open);
      tiers.forEach((tier,n)=>{
        if(i===2){tier.setAttribute('role','button');tier.tabIndex=0;tier.setAttribute('aria-pressed',String(n+1===Math.max(1,artLevel)));tier.style.cursor='pointer';}
        else{tier.removeAttribute('role');tier.removeAttribute('tabindex');tier.removeAttribute('aria-pressed');tier.style.removeProperty('cursor');}
      });
      dialog.dataset.artLevel=artLevel;
      q('.book-description').textContent=stories[i][+en];
      q('.book-level').textContent=(en?'Current level ':'Текущий уровень ')+roman[lv]+(lv<3? (en?'  ·  Next ':'  ·  Далее ')+roman[lv+1]:'');
      tiers.forEach((tier,n)=>{tier.dataset.status=n<lv?'owned':n===lv?'next':'locked';tier.setAttribute('aria-label',(en?'Level ':'Уровень ')+roman[n+1]+', '+core.COSTS[n]+(en?' stars':' звёзд'));});
      q('.book-wallet-label').textContent=en?'Available':'В наличии';
      q('.book-wallet-value').textContent=new Intl.NumberFormat(en?'en':'ru').format(data.coins);
      const button=q('.chronicle-buy'),hint=q('.book-feedback');
      button.hidden=lv===3;button.disabled=busy||lv===3||data.coins<core.COSTS[lv];
      if(lv<3)q('.book-purchase-caption').textContent=(en?'Restore for ':'Восстановить за ')+core.COSTS[lv];
      hint.textContent=lv===3?(en?'Fully restored':'Полностью восстановлено'):data.coins<core.COSTS[lv]?
        (en?'Need '+(core.COSTS[lv]-data.coins)+' more stars':'Не хватает звёзд: '+(core.COSTS[lv]-data.coins)):'';
      hint.classList.toggle('complete',lv===3);
      if(i===2&&preview!==null&&preview!==lv){
        const hintPrefix=en?'Preview ':'Предпросмотр ';
        hint.textContent=hintPrefix+roman[preview]+(hint.textContent?' · '+hint.textContent:'');
      }
      dialog.dataset.zone=i;dialog.dataset.level=lv;
    }
    let outsideFocus=null;
    function open() {
      if(dialog.open)return;
      preview=null;outsideFocus=document.activeElement;q('.book-art').getAnimations().forEach(a=>a.finish());
      root.querySelector('.home-rest-panel').hidden=true;dialog.hidden=false;dialog.showModal();render(true);
      q('.book-close').focus({preventScroll:true});
    }
    function close() {
      if(dialog.open)dialog.close();
      dialog.hidden=true;
      if(outsideFocus?.isConnected)outsideFocus.focus({preventScroll:true});
    }
    async function purchase(){
      if(busy||!dialog.open||q('.chronicle-buy').disabled)return;
      const zone=shownZone,expected=shownLevel;
      busy=true;q('.chronicle-buy').disabled=true;
      function commit(){
        if(!dialog.open||ui.selected!==zone||!core.purchase(zone,expected))return;
        ui.changedZone=zone;ui.update();close();
        if(core.read().upgrades.every(level=>level===3)){
          const finished=root.querySelector('.room-finished');
          finished.textContent=core.tr('Наш дом снова полон волшебства!','Our home is full of magic again!');
          setTimeout(()=>{if(finished.isConnected)finished.textContent='';},6500);
        }
      }
      try{
        if(navigator.locks)await navigator.locks.request('castleOfHours.adventure.purchase',commit);
        else commit();
      }finally{busy=false;if(dialog.open)render(true);}
    }
    function outside(e){if(e.target===dialog)close();}
    function cancel(e){e.preventDefault();close();}
    trigger.addEventListener('click',open);
    q('.book-close').addEventListener('click',close);
    q('.chronicle-buy').addEventListener('click',purchase);
    dialog.addEventListener('cancel',cancel);dialog.addEventListener('click',outside);
    dialog.addEventListener('close',()=>{if(!dialog.open)dialog.hidden=true;});
    return {open,close,render,dispose(){++generation;if(dialog.open)close();trigger.removeEventListener('click',open);}};
  };
}
};
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0x8c5530 = function GDJSInlineCode(runtimeScene) {
"use strict";
// Sprite animation and real-time interaction in the existing Adventure home.
if (typeof window !== 'undefined' && !window.CastleBindCompanion) {
  window.CastleBindCompanion = function(ui, core, url) {
    const {scene, root} = ui;
    const cat = scene.getObjects('HomeKitten')[0];
    const back = scene.getObjects('CatBedBack')[0];
    const front = scene.getObjects('CatBedFront')[0];
    const base = scene.getObjects('Background')[0];
    const camera = scene.getLayer('');
    const canvas = scene.getGame().getRenderer().getCanvas();
    const actor = root.querySelector('.room-cat');
    const hit = document.createElement('span');
    hit.className = 'companion-hit'; hit.setAttribute('aria-hidden','true'); actor.append(hit);
    const paintings = new Map();
    const sounds = {meow:new Audio(url('Gentle_Meow.wav')),purr:new Audio(url('Castle_Cat_Purring_Pixabay_28220.mp3'))};
    sounds.purr.loop = true;
    sounds.purr.preload = sounds.meow.preload = 'auto';
    const mouth = [0,2,4,4,5,6,6,7,7,7,7,7,7,7,7,6,6,6,5,5,5,5,5,4,4,4,3,3,3,3,2,2,2,1,1,0];
    const clamp = n => Math.max(0,Math.min(1,n));
    let state='', level=-1, hush=false, visit=false, frozen=false, paused=false;
    let press=null, sleepTap=-Infinity, sound='', ticket=0, purrUntil=0;
    let disposed=false, primed=false, meowAt=0, frameTime=0, last=performance.now(), geometry='';
    let left=0, top=0, ratioX=1, ratioY=1;
    function gain() {
      const music=window.__castleMusic?.state;
      return music?.enabled===false?0:clamp((window.__theCozyTimeSettings?.volume??65)/100*(music?.cat??45)/100);
    }
    function stopSound() {
      ++ticket;sound='';purrUntil=0;
      for (const a of Object.values(sounds)) { a.pause();try { a.currentTime=0; } catch(_) {} }
    }
    function unlockSound() {
      if(primed)return;
      primed=true;
      for(const [name,a] of Object.entries(sounds)){
        a.volume=0;a.play().then(()=>{if(sound!==name){a.pause();a.currentTime=0;}}).catch(()=>{});
      }
    }
    function voice(name) {
      if(hush||frozen||!gain())return false;
      if(sound===name&&!sounds[name].paused)return true;
      stopSound();sound=name;const token=ticket,a=sounds[name];a.volume=gain();
      a.play().catch(()=>{if(token===ticket)sound='';});return true;
    }
    sounds.meow.onended=()=>{if(sound==='meow')sound='';};
    const eyes=scene.createObject('HomePetEyes');
    eyes.setLayer(cat.getLayer());eyes.setZOrder(cat.getZOrder());eyes.hide(true);
    const movingEyePoses={"Cat_WakeUp":[[0,0],[0,0],[6,-3],[8,-4],[8,-4],[9,-3],[10,-3],[11,-3],[12,-2],[13,-2],[14,-2],[15,-2],[16,-1],[17,0],[18,0],[19,0],[20,2],[21,2],[22,1],[23,0],[23,0]],"Cat_FallAsleep":[[23,0],[23,0],[23,0],[23,0],[22,0],[21,0],[20,0],[19,0],[18,0],[17,0],[16,0],[15,0],[14,0],[13,0],[12,0],[11,0],[10,0],[9,0],[9,0],[8,0],[8,0],[7,0],[7,0],[6,0],[5,0],[4,0],[4,0],[3,0],[2,0],[2,0],[1,0],[1,0]]};
    const seatedEyes=[23,0], sleepingEyes=[0,0];
    const closeMs=150, holdMs=1000, openMs=180;
    let petStart=-Infinity;
    function eyePose(){
      const clip=cat.getAnimationName();
      if(clip==='Cat_Awake'||clip==='Cat_Meow')return seatedEyes;
      return movingEyePoses[clip]?.[cat.getAnimationFrame()]||sleepingEyes;
    }
    function petActive(now){return now-petStart<closeMs+holdMs+openMs;}
    function drawPetEyes(now){
      if(!petActive(now)){if(!eyes.isHidden())eyes.hide(true);return;}
      const [pose,dx]=eyePose();
      if(pose<7){eyes.hide(true);return;}
      const age=Math.max(0,now-petStart);
      let step=6;
      if(age<closeMs||age>=closeMs+holdMs){
        const t=clamp(age<closeMs?age/closeMs:1-(age-closeMs-holdMs)/openMs);
        step=Math.min(5,Math.floor(6*t*t*(3-2*t)));
      }
      if(!step){eyes.hide(true);return;}
      const name='Pet_'+pose;
      if(eyes.getAnimationName()!==name)eyes.setAnimationName(name);
      eyes.pauseAnimation();
      if(eyes.getAnimationFrame()!==step-1)eyes.setAnimationFrame(step-1);
      eyes.setScaleX(cat.getScaleX());eyes.setScaleY(cat.getScaleY());
      eyes.setPosition(cat.getX()+dx*cat.getScaleX(),cat.getY());eyes.hide(false);
    }
    let sleptAt=0, idleAt=0, meowReturn='Awake', motion=null;
    const motionKey='castleOfHours.residentMotion.v1';
    const {wakeDuration:wakeMs,wakeFrames,wakeFrameMs}=window.CastleClockSignals;
    const settleMs=32*115;
    function change(next,name){
      if(state===next&&cat.getAnimationName()===name)return;
      state=next;actor.dataset.state=next;actor.dataset.action=name;
      cat.setAnimationName(name);
      // Each clip has one clock. The GDevelop native sprite holds the exposure
      // chosen below, also while the study timer is paused or accelerated.
      cat.pauseAnimation();cat.setAnimationFrame(0);
    }
    function show(index){if(cat.getAnimationFrame()!==index)cat.setAnimationFrame(index);}
    function asleep(){
      if(state==='Sleeping')return;
      sleptAt=performance.now();change('Sleeping','Cat_Sleep');
    }
    function hold(){
      if(state!=='Awake'&&state!=='Meowing')idleAt=performance.now();
      change('Awake','Cat_Awake');
    }
    function readMotion(){
      try{const m=JSON.parse(localStorage.getItem(motionKey)||'null');return m&&Number.isFinite(m.start)&&Number.isFinite(m.nap)?m:null;}catch(_){return null;}
    }
    function writeMotion(m){motion=m;try{localStorage.setItem(motionKey,JSON.stringify(m));}catch(_){}}
    function expose(next,name,elapsed,step,count){
      change(next,name);show(Math.max(0,Math.min(count-1,Math.floor(elapsed/step))));
    }
    function applyMotion(now=Date.now()){
      if(!motion||state==='Meowing')return;
      const age=Math.max(0,now-motion.start);
      const release=motion.release||0;
      if(motion.fold!=null&&age<motion.duration){
        change('WakingUp','Cat_FallAsleep');show(Math.max(0,motion.fold-Math.floor(age/75)));return;
      }
      if(motion.fold==null){
        if(release&&age<release){
          change('WakingUp','Cat_Sleep');
          const f=motion.sleepFrame,u=Math.min(1,age/release),ease=u*u*(3-2*u);
          show(Math.round(f+(f<12?-f:24-f)*ease)%24);return;
        }
        if(age<release+wakeMs){expose('WakingUp','Cat_WakeUp',age-release,wakeFrameMs,wakeFrames);return;}
      }
      if(now<motion.nap||(visit&&!motion.forced&&state==='Awake'))hold();
      else if(now<motion.nap+settleMs)expose('FallingAsleep','Cat_FallAsleep',now-motion.nap,115,32);
      else asleep();
    }
    function wake(fromTimer=false,at=Date.now()){
      if(!['Sleeping','FallingAsleep'].includes(state)||(!fromTimer&&(hush||visit||frozen)))return false;
      stopSound();sleepTap=-Infinity;
      const start=Math.min(at,Date.now());
      const fold=state==='FallingAsleep'?cat.getAnimationFrame():null;
      const sleepFrame=fold==null?cat.getAnimationFrame():0;
      const release=sleepFrame>1&&sleepFrame<23?Math.min(245,(24-sleepFrame)*22):0;
      const duration=fold==null?release+wakeMs:(fold+1)*75;
      const nap=fromTimer?Number.MAX_SAFE_INTEGER:start+duration+40000+Math.floor(40000*Math.random());
      writeMotion({start,nap,duration,release,sleepFrame,fold});applyMotion();return true;
    }
    function fall(){
      if(state!=='Awake'||!motion||sound||press)return false;
      writeMotion({...motion,nap:Date.now(),forced:true});applyMotion();return true;
    }
    function breath(t){
      if(state==='Sleeping'){show(Math.floor(Math.max(0,t-sleptAt)*24/4000)%24);return;}
      if(state==='Awake')show(Math.floor(Math.max(0,t-idleAt)*48/4400)%48);
    }
    function setLevel(n) {
      n=Math.max(0,Math.min(3,Number(n)||0));if(level===n)return false;
      level=n;actor.dataset.level=String(n);
      for(const [object,part] of [[back,'Back'],[front,'Front']]){
        if(n)object.setAnimationName('CatBed_'+part+'_Tier'+n);
        object.hide(n===0);
      }
      geometry='';return true;
    }
    function placePainting(entry) {
      const [x,y,w,h]=entry.box;
      entry.object.setPosition(left+x*ratioX,top+y*ratioY);
      entry.object.setSize(w*ratioX,h*ratioY);
    }
    function paintRoom(id,key,box,opacity,transition) {
      let item=paintings.get(id);
      if(!item) {
        const object=id==='original'?base:scene.createObject('CatRoomPainting');
        object.setZOrder(id==='original'?0:id==='walls'?1:2+Number(id.slice(4)));
        item={object,key:'',box:box.slice(1),opacity:1,fade:0};paintings.set(id,item);
      }
      if(item.key!==key) {
        item.key=key;item.box=box.slice(1);
        if(id!=='original')item.object.setAnimationName(key);
        item.fade=transition?performance.now():0;placePainting(item);
      }
      item.opacity=opacity;
      item.object.setOpacity(item.fade?0:Math.round(255*opacity));
    }
    function layout() {
      const rect=canvas.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      const origin=camera.convertCoords(0,0), cw=camera.getCameraWidth(), ch=camera.getCameraHeight();
      const key=[cw,ch,rect.width,rect.height,origin[0],origin[1]].join('/');
      if(geometry===key)return;
      geometry=key;left=origin[0];top=origin[1];ratioX=cw/1280;ratioY=ch/720;
      const uniform=Math.min(rect.width/1280,rect.height/720);
      const sx=uniform*cw/rect.width, sy=uniform*ch/rect.height;
      const x=left+848*ratioX,y=top+546*ratioY;
      cat.setScaleX(155*sx/256);cat.setScaleY(155*sy/256);cat.setPosition(x,y);
      for(const o of [back,front]) {
        o.setScaleX(216*sx/512);o.setScaleY(216*sy/512);o.setPosition(x,y-5*sy);
      }
      actor.style.left='848px';actor.style.top='546px';
      for(const entry of paintings.values())placePainting(entry);
    }
    // Each timer stores its most recent stop in the same write as its economic result.
    // An unmounted room consumes the signal on entry. A mounted room receives it immediately.
    const studyKeys=['castleOfHours.adventure.v1','castleOfHours.moonTower.v1'];
    function readStops(){
      const events=[];
      for(const key of studyKeys){
        let d,last;try{d=JSON.parse(localStorage.getItem(key)||'null');last=localStorage.getItem(key+'.residentStopSeen');}catch(_){continue;}
        if(!d)continue;
        let list=window.CastleClockSignals.stops(d);
        if(!list.length&&key===studyKeys[0]&&d.companionGreetings?.length){
          list=[{id:'legacy/'+d.companionGreetings.at(-1),at:Date.now()}];
        }
        const i=list.findIndex(row=>row.id===last);
        for(const row of (i<0?list.slice(-1):list.slice(i+1)))events.push({key,...row});
      }
      for(const e of events.sort((a,b)=>a.at-b.at)){
        const now=Date.now(),at=Math.min(e.at||now,now);
        // Update the logical pose at the boundary. If two timers end together
        // the second signal is acknowledged but cannot restart the first wake.
        if(!document.hidden)applyMotion();
        if(state==='Sleeping'||state==='FallingAsleep')wake(true,at);
        else if(motion&&motion.nap!==Number.MAX_SAFE_INTEGER){
          writeMotion({...motion,nap:Number.MAX_SAFE_INTEGER,forced:false});
        }
        try{localStorage.setItem(e.key+'.residentStopSeen',e.id);}catch(_){}
      }
    }
    function stopped(e){if(studyKeys.includes(e.detail?.key))readStops();}
    function stored(e){
      if(e.key===motionKey){motion=readMotion();applyMotion();}
      else if(studyKeys.includes(e.key))readStops();
    }
    window.addEventListener('castle-timer-stopped',stopped);
    window.addEventListener('storage',stored);
    function context(data){
      hush=data.session?.status==='active'||!!(data.rest&&!data.rest.finished&&(data.rest.running||data.rest.miniKey));
    }
    function interactionBlocked(){return document.hidden||root.inert||!!root.querySelector('.home-book-shade')?.open||!!ui.guestRoom?.album.isOpen()||
        !!document.querySelector('#cozy-settings-root.cozy-open');}
    function tap() {
      frozen=interactionBlocked();
      const now=performance.now();
      if(frozen||petActive(now))return;
      if(eyePose()[0]>=7)petStart=now;
      if(hush||visit)return;
      if(state==='Sleeping'){
        if(frameTime-sleepTap<4.5)wake();else sleepTap=frameTime;
      } else if(state==='Awake'&&Math.random()<.4){
        meowReturn=state;voice('meow');
        meowAt=frameTime;change('Meowing','Cat_Meow',false);
      }
    }
    function stroke() {
      if(hush||visit||frozen||!['Sleeping','Awake'].includes(state))return;
      sleepTap=-Infinity;if(sound!=='purr')voice('purr');purrUntil=frameTime+1.8;
    }
    function down(e) {
      frozen=interactionBlocked();
      if(frozen||press||e.button!==0||((hush||visit)&&eyePose()[0]<7))return;
      if(!hush&&!visit)unlockSound();press={ignoreTap:petActive(performance.now()),id:e.pointerId,x:e.clientX,y:e.clientY,length:0,time:performance.now(),drag:false};
      hit.setPointerCapture?.(e.pointerId);e.preventDefault();
    }
    function move(e) {
      if(!press||e.pointerId!==press.id)return;
      press.length+=Math.hypot(e.clientX-press.x,e.clientY-press.y);press.x=e.clientX;press.y=e.clientY;
      if(press.length>=7){press.drag=true;stroke();}
    }
    function up(e) {
      if(!press||e.pointerId!==press.id)return;
      const prior=press;press=null;if(hit.hasPointerCapture?.(e.pointerId))hit.releasePointerCapture(e.pointerId);
      if(e.type==='pointerup'&&!prior.ignoreTap&&!prior.drag&&performance.now()-prior.time<450)tap();
    }
    hit.addEventListener('pointerdown',down);hit.addEventListener('pointermove',move);
    for(const n of ['pointerup','pointercancel','lostpointercapture'])hit.addEventListener(n,up);
    actor.addEventListener('click',e=>{if(e.detail===0&&e.isTrusted){unlockSound();tap();}});
    function frame(t) {
      if(disposed)return;
      const dt=clamp((t-last)/1000);last=t;layout();
      for(const item of paintings.values()){
        if(!item.fade)continue;
        const p=clamp((t-item.fade)/3500);item.object.setOpacity(Math.round(255*item.opacity*(1-Math.pow(1-p,3))));
        if(p===1)item.fade=0;
      }
      frozen=interactionBlocked();
      if(frozen&&!paused){paused=true;stopSound();}
      if(!frozen)paused=false;
      if(document.hidden)return;
      frameTime+=dt;
      if(sound){
        const v=gain();if(!v||hush||sound==='purr'&&frameTime>=purrUntil)stopSound();
        else sounds[sound].volume=(sound==='purr'?clamp((purrUntil-frameTime)/.35):1)*v;
      }
      if(state!=='Meowing'){
        applyMotion();breath(t);
      }else{
        const a=sounds.meow;
        const activeVoice=sound==='meow'&&!a.paused;
        const duration=Number.isFinite(a.duration)?a.duration:1.004;
        const elapsed=activeVoice?a.currentTime:frameTime-meowAt;
        const k=mouth[Math.min(mouth.length-1,Math.floor(Math.max(0,elapsed)/duration*mouth.length))];
        const phase=Math.floor(Math.max(0,t-idleAt)*48/4400)%48;
        const band=Math.round(Math.min(phase,48-phase)/4);show(band*8+k);
        if((!activeVoice&&elapsed>=duration)||frameTime-meowAt>=duration+.32){
          if(sound==='meow')stopSound();
          if(meowReturn==='Sleeping')asleep();else {hold();breath(t);}
        }
      }
      drawPetEyes(performance.now());
      const position=cat.getAnimationFrame();
      actor.dataset.frame=String(position);
      hit.style.clipPath=state==='Sleeping'?'ellipse(40% 27% at 50% 67%)':
        ['WakingUp','FallingAsleep'].includes(state)?'ellipse(40% 40% at 50% 55%)':'ellipse(31% 42% at 51% 55%)';
    }
    function visibility(){last=performance.now();if(document.hidden)stopSound();}
    document.addEventListener('visibilitychange',visibility);
    actor.dataset.location='Basket';setLevel(core.read().upgrades[2]);asleep();layout();motion=readMotion();applyMotion();readStops();
    return {setLevel,context,beginInterval:fall,frame,paintRoom,roomActivity:()=>false,setVisit(v){if(v&&!visit)stopSound();visit=v;},
      get state(){return state;},get location(){return 'Basket';},get action(){return actor.dataset.action;},
      get paint(){return {clip:cat.getAnimationName(),frame:cat.getAnimationFrame()};},
      dispose(){if(disposed)return;disposed=true;window.removeEventListener('castle-timer-stopped',stopped);window.removeEventListener('storage',stored);document.removeEventListener('visibilitychange',visibility);stopSound();
        for(const a of Object.values(sounds)){a.onended=null;a.removeAttribute('src');a.load();}}
    };
  };
}
};
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb638e8 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb5a8b8 = function GDJSInlineCode(runtimeScene) {
// Loaded once by the timer scenes. Ordinary browser exports retain their original interface.
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
    const style=document.createElement('style');
    style.textContent=`
    html[data-castle-mini-away] .moon-stage *,html[data-castle-mini-away] .adventure-stage *,html[data-castle-mini-away] #castle-adventure-ui *{animation-play-state:paused!important}
    .coh-mini-launch{display:inline-grid;place-items:center;box-sizing:border-box;width:38px;height:35px;padding:5px;border:0;color:#573826;background:var(--mini-material) center/100% 100% no-repeat;cursor:pointer;pointer-events:auto;filter:drop-shadow(0 2px 2px #31201770);z-index:2}
    .coh-mini-launch:focus-visible{outline:2px solid #f3cf86;border-radius:5px}.coh-mini-launch:hover{filter:brightness(1.08) drop-shadow(0 0 4px #efb45d99)}.coh-mini-launch:active{scale:.96}
    .coh-mini-launch svg{width:21px;height:19px}
    .moon-focus .coh-mini-launch{position:absolute;left:calc(50% + 110px);bottom:0}
    .ad-timer .coh-mini-launch{position:relative;margin-top:6px;flex:0 0 35px}
    .home-rest-panel .coh-mini-launch{position:absolute;top:12px;right:12px}
    .coh-mini-error{display:block;background:#4a3540;color:#fff0cf;padding:4px 7px;font:15px Georgia,serif}
    `; document.head.append(style);
  }
  function add(parent,source) {
    if (!ipc || !parent) return;
    const b=document.createElement('button');
    b.type='button';b.className='coh-mini-launch';
    b.style.setProperty('--mini-material',skin.cssUrl('Parchment_Seal.webp'));
    b.innerHTML='<svg viewBox="0 0 24 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="1.8" y="2" width="20.4" height="15.8" rx="2.1"/><rect x="11.2" y="9.1" width="8" height="5.6" rx=".7" fill="currentColor" stroke="none"/></svg>';
    function label(){b.title=localStorage.getItem('theCozyTime.language')==='en'?'Mini-timer':'Мини-таймер';b.setAttribute('aria-label',b.title);}
    label();b.onpointerenter=label;b.onfocus=label;
    b.onclick=()=>{
      if(opening || away) return;
      launch=b;adapter=source;lastMessage='';
      const value=snapshot();if(!value)return;
      opening=true;send('open',value);
    };
    parent.append(b);
  }
  window.CastleMini={add,get away(){return away||opening;}};
}
};
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbd2a48 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbcef28 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbb5060 = function GDJSInlineCode(runtimeScene) {
"use strict";
if(typeof window!=='undefined' && !window.__castleBindGuestRoom){
const guests = [
  {id:'wizard', art:'GingerWizard', keys:['wizard'], name:['Рыжий волшебник','The Ginger Wizard'],
   quote:['Не бойся ошибаться. Иногда самые чудесные открытия начинаются с маленькой шалости.',
          'Don’t be afraid to make mistakes. Sometimes the most wonderful discoveries begin with a little mischief.']},
  {id:'chemist', art:'Detective', keys:['chemist'], name:['Котик-детектив','The Kitten Detective'],
   quote:['Не обязательно знать все ответы. Достаточно не переставать задавать вопросы.',
          'You don’t have to know all the answers. Just keep asking questions.']},
  {id:'leaf', art:'Gardener', keys:['leaf'], name:['Котик-садовник','The Kitten Gardener'],
   quote:['Не торопи свои мечты. Даже самые прекрасные сады вырастают по одному маленькому ростку.',
          'Give your dreams time. Even the loveliest gardens grow one little sprout at a time.']},
  {id:'artist', art:'Artist', keys:['artist'], name:['Котик-художник','The Kitten Artist'],
   quote:['Не бойся создавать что-то своё. Даже маленькая звезда способна осветить огромное небо.',
          'Don’t be afraid to create something of your own. Even a little star can light up a vast sky.']}
];
const cast=Object.fromEntries(guests.flatMap(guest=>guest.keys.map(key=>[key,guest])));
const cap=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
const bell=(t,start,end)=>Math.sin(Math.PI*cap((t-start)/(end-start)));
const ramp=(t,start,end)=>{const a=cap((t-start)/(end-start));return a*a*(3-2*a)};
const sprite=(key,frame,x,y,size,angle=0,flip=false,opacity=1)=>({key,frame,x,y,size,angle,flip,opacity});
// All landmark coordinates refer to pixels in the unchanged album painting.
// Transparent and painted pixels pass through the same continuous displacement.
const portraitRigs={
wizard:{art:'GingerWizard',motion:'hover',width:264,effectBox:[555,235,590,271],effectDuration:1.52,
    eyes:[[380,148,435,182],[485,121,527,150]],
    patches:[{drive:'cloth',shape:[[104,212],[142,200],[186,202],[221,216],[258,240],[270,269],[269,289],[241,305],[211,298],[198,306],[154,307],[101,283],[91,249]],rim:13,pivot:[273,270],degrees:2.4}],
    light:[570,256]},
chemist:{art:'Detective',motion:'inspect',width:270,effectBox:[364,155,414,224],effectDuration:0.38,lid:'Detective_Lid.png',eyes:[[256,199,321,233]],
    patches:[
      {drive:'breath',shape:[[82,346],[163,327],[213,322],[238,334],[221,367],[179,391],[119,396],[71,376]],rim:22,pivot:[170,392],move:[0,-2.6]},
      {drive:'look',shape:[[352,175],[362,155],[383,139],[411,134],[437,144],[456,161],[463,186],[457,215],[442,234],[421,249],[418,260],[432,275],[432,297],[419,317],[409,325],[393,328],[389,310],[382,298],[385,276],[395,260],[397,250],[370,239],[355,222],[349,201]],rim:13,pivot:[398,322],degrees:4.0,move:[.8,-9],protect:[404,193,39,41,.29]}]},
leaf:{art:'Gardener',source:'Gardener_Watering_Portrait.png',motion:'water',width:286,effectBox:[394,316,458,394],effectDuration:3.65,
    eyes:[[225,171,276,207],[310,151,345,177]],
    patches:[
      {drive:'pour',shape:[[223,273],[246,255],[276,245],[299,246],[323,258],[339,266],[366,278],[373,300],[371,320],[389,310],[390,295],[403,290],[418,304],[427,322],[423,337],[405,339],[390,333],[367,354],[356,376],[338,379],[307,370],[281,356],[272,330],[267,314],[237,321],[216,315]],rim:16,pivot:[263,279],degrees:4.7},
      {drive:'flower',shape:[[407,371],[423,369],[438,382],[448,366],[473,358],[474,372],[463,385],[444,394],[438,404],[433,402],[430,392],[416,387]],rim:4,pivot:[438,406],degrees:2.8} ]},
artist:{art:'Artist',motion:'paint',width:272,effectBox:[485,113,512,143],effectDuration:4.75,eyes:[[269,151,323,186],[361,122,401,151]],
    patches:[{drive:'brush',shape:[[370,324],[378,297],[391,268],[392,247],[404,232],[415,226],[446,181],[448,163],[461,145],[490,123],[493,131],[485,157],[470,174],[459,181],[432,231],[447,244],[451,266],[446,285],[434,302],[416,305],[404,298],[384,321]],rim:9,pivot:[379,312],degrees:2.7,move:[0,-3]}],light:[498,128]}
};
const visibleClocks=new Map();
const tau=Math.PI*2;
function visitorClock(id){
  if(visibleClocks.has(id))return visibleClocks.get(id);
  const phase=Math.random(), clock={time:0,phase,blinkAt:1.15+Math.random()*3,actionAt:1.2+Math.random()*1.4,blinkStart:-100,actionStart:-100};
  visibleClocks.set(id,clock);return clock;
}
// Reserve enough of a visible visit to finish the whole gesture before its exit.
// The room owns the length, fades, and visit ledger; animation clocks own no save data.
function nextGesture(span,remaining,length){
  const windows=[];
  for(const begins of [remaining,remaining+length]){
    const lo=Math.max(10,begins+.82),hi=Math.min(15,begins+length-span-.52);
    if(hi>=lo)windows.push([lo,hi]);
  }
  if(!windows.length)return remaining+length+.82;
  const weights=windows.map(w=>w[1]-w[0]+.01),total=weights.reduce((a,b)=>a+b,0);
  const slot=windows.length===1||Math.random()*total<weights[0]?0:1;
  const [lo,hi]=windows[slot];return lo+Math.random()*(hi-lo);
}
function advanceVisitor(id,seconds,elapsed,length){
  const clock=visitorClock(id);clock.time+=seconds;
  if(clock.time>=clock.blinkAt){clock.blinkStart=clock.time;clock.blinkAt=clock.time+3.6+Math.random()*3.8;}
  const span=({wizard:1.52,chemist:4.42,leaf:3.65,artist:4.75})[id],remaining=length-elapsed;
  if(clock.time>=clock.actionAt&&elapsed>=.72&&remaining>=span+.36){
    clock.actionStart=clock.time;clock.actionAt=clock.time+nextGesture(span,remaining,length);
  }
  return clock;
}
function guestPose(clock){
  const t=clock.time, a=t-clock.actionStart,b=t-clock.blinkStart;
  return {t,a,phase:clock.phase,blink:ramp(b,0,.145)*(1-ramp(b,.185,.38)),
    cloth:Math.sin(tau*(t/3.65+clock.phase+.13))*.78+Math.sin(tau*(t/5.43+clock.phase))*.22,
    look:ramp(a,0,1.12)*(1-ramp(a,3.25,4.42)),
    brush:ramp(a,0,.95)*(1-ramp(a,1.78,2.9))+.085*Math.sin(tau*(t/4.2+clock.phase)),
    pour:ramp(a,0,.9)*(1-ramp(a,2.7,3.65)),
    flower:Math.sin(tau*(t/5.2+clock.phase))*.78+.2*Math.sin(t*2.45+clock.phase),
    breath:Math.sin(tau*(t/4.5+clock.phase))};
}
function smoothUnit(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
function insideContour(x,y,p){
  let inside=false,best=Infinity;
  for(let i=0,j=p.length-1;i<p.length;j=i++){
    const a=p[j],b=p[i],vx=b[0]-a[0],vy=b[1]-a[1];
    if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/vy+a[0])inside=!inside;
    const u=Math.max(0,Math.min(1,((x-a[0])*vx+(y-a[1])*vy)/(vx*vx+vy*vy||1)));
    const dx=x-a[0]-u*vx,dy=y-a[1]-u*vy;best=Math.min(best,dx*dx+dy*dy);
  }
  return inside?0:Math.sqrt(best);
}
function eyelid(box){
  const [l,t,r,b]=box,c=(l+r)/2,h=(b-t)/2;
  return {drive:'blink',eye:box,shape:[[l,t],[r,t],[r,b],[l,b]],rim:3,center:c,half:(r-l)/2,cy:t+h,ry:h};
}
function bakePatch(spec,source,place){
  const {k,x:ox,y:oy}=place,side=source.width,points=spec.shape;
  const guard=spec.rim+2,xx=points.map(p=>p[0]),yy=points.map(p=>p[1]);
  const x=Math.max(0,Math.floor(ox+(Math.min(...xx)-guard)*k)),y=Math.max(0,Math.floor(oy+(Math.min(...yy)-guard)*k));
  const w=Math.min(side-x,Math.ceil(ox+(Math.max(...xx)+guard)*k)-x),h=Math.min(side-y,Math.ceil(oy+(Math.max(...yy)+guard)*k)-y);
  const base=source.getContext('2d',{willReadFrequently:true}).getImageData(x,y,w,h),pixels=new ImageData(w,h);
  // Accumulate only the affected pixels. Edge colours are premultiplied before sampling.
  const rgba=base.data,pm=new Uint16Array(rgba.length);
  for(let i=0;i<rgba.length;i+=4){const a=rgba[i+3];pm[i]=rgba[i]*a;pm[i+1]=rgba[i+1]*a;pm[i+2]=rgba[i+2]*a;pm[i+3]=a;}
  const offsets=[],shifts=[],angle=(spec.degrees||0)*Math.PI/180;
  for(let py=1;py<h-1;py++)for(let px=1;px<w-1;px++){
    const u=(x+px+.5-ox)/k,v=(y+py+.5-oy)/k;
    let dx,dy;
    if(spec.eye){
      const rx=(u-spec.center)/spec.half,ry=(v-spec.cy)/spec.ry;
      const curve=Math.max(0,1-rx*rx);dx=0;dy=(spec.lidTravel||3.5)*curve*curve*Math.max(0,1-ry*ry)**2;
    }else{
      let weight=1-smoothUnit(insideContour(u,v,points)/spec.rim);
      if(spec.protect){const [cx,cy,rx,ry,soft]=spec.protect;
        const d=Math.hypot((u-cx)/rx,(v-cy)/ry);weight*=smoothUnit((d-1)/soft);}
      dx=weight*((spec.move?.[0]||0)-angle*(v-spec.pivot[1]));
      dy=weight*((spec.move?.[1]||0)+angle*(u-spec.pivot[0]));
    }
    if(Math.abs(dx)+Math.abs(dy)<.014)continue;
    offsets.push(py*w+px);shifts.push(dx*k,dy*k);
  }
  const index=Int32Array.from(offsets),field=Float32Array.from(shifts);
  let previous=NaN;
  function draw(amount,target){
    // Quantisation is below a tenth of a logical pixel even at the longest lever.
    const q=Math.round(amount*48)/48;
    if(!q){target.putImageData(base,x,y);return;}
    if(q!==previous){
      previous=q;pixels.data.set(rgba);const out=pixels.data;
      for(let j=0;j<index.length;j++){
        const pos=index[j],row=Math.floor(pos/w),sx=Math.max(0,Math.min(w-1.001,pos-row*w-field[j*2]*q)),sy=Math.max(0,Math.min(h-1.001,row-field[j*2+1]*q));
        const ix=sx|0,iy=sy|0,ax=sx-ix,ay=sy-iy;
        const a=(1-ax)*(1-ay),b=ax*(1-ay),c=(1-ax)*ay,d=ax*ay;
        const i=(iy*w+ix)*4,jx=i+4,jy=i+w*4,jxy=jy+4,loc=pos*4;
        const alpha=pm[i+3]*a+pm[jx+3]*b+pm[jy+3]*c+pm[jxy+3]*d;
        out[loc+3]=alpha;if(alpha<.5){out[loc]=out[loc+1]=out[loc+2]=0;continue;}
        for(let ch=0;ch<3;ch++)out[loc+ch]=(pm[i+ch]*a+pm[jx+ch]*b+pm[jy+ch]*c+pm[jxy+ch]*d)/alpha;
      }

    }
    // A translucent edge replaces, rather than accumulates onto, its original pixels.
    target.putImageData(pixels,x,y);
  }
  return {drive:spec.drive,bounds:{x,y,w,h},shown:NaN,draw};
}
function paintStar(ctx,x,y,r,alpha){
  if(alpha<.005)return;
  ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#dbac5b';ctx.beginPath();
  for(let i=0;i<8;i++){const ang=i*Math.PI/4,radius=i%2?r*.24:r;const px=x+Math.cos(ang)*radius,py=y+Math.sin(ang)*radius*1.16;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}
  ctx.closePath();ctx.fill();ctx.fillStyle='#ffe3a4';ctx.beginPath();ctx.arc(x,y,r*.23,0,tau);ctx.fill();ctx.restore();
}
function buildPainting(image,rig,side,lidImage){
  const base=document.createElement('canvas');base.width=base.height=side;
  const baseCtx=base.getContext('2d',{willReadFrequently:true}),k=(side*rig.width/288)/image.width;
  const place={k,x:Math.round((side-image.width*k)/2),y:Math.round(side-side*7/288-image.height*k)};
  baseCtx.imageSmoothingQuality='high';baseCtx.drawImage(image,place.x,place.y,image.width*k,image.height*k);
  const patches=[...(rig.eyes||[]).map(eyelid),...rig.patches].map(spec=>bakePatch(spec,base,place));
  const zone=rig.effectBox,fx={x:Math.floor(place.x+zone[0]*k)-1,y:Math.floor(place.y+zone[1]*k)-1,
    w:Math.ceil((zone[2]-zone[0])*k)+3,h:Math.ceil((zone[3]-zone[1])*k)+3};
  const intersects=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
  let hadEffect=false;
  function paint(pose,ctx,first){
    const hasEffect=rig.motion==='inspect'?pose.blink>.001:pose.a>=0&&pose.a<rig.effectDuration;
    const dirty=[];
    if(first){ctx.globalCompositeOperation='copy';ctx.drawImage(base,0,0);ctx.globalCompositeOperation='source-over';}
    else if(hasEffect||hadEffect){
      ctx.clearRect(fx.x,fx.y,fx.w,fx.h);ctx.drawImage(base,fx.x,fx.y,fx.w,fx.h,fx.x,fx.y,fx.w,fx.h);dirty.push(fx);
    }
    // Keep the portrait on one persistent surface. Restore only a changed patch or a
    // patch overlapped by a preceding repaint, then add the small foreground detail.
    for(const patch of patches){
      const amount=Math.round(pose[patch.drive]*48)/48;
      if(first||patch.shown!==amount||dirty.some(box=>intersects(box,patch.bounds))){
        if(!first||amount)patch.draw(amount,ctx);patch.shown=amount;dirty.push(patch.bounds);
      }
    }
    hadEffect=hasEffect;
    if(!hasEffect)return;
    ctx.save();ctx.translate(place.x,place.y);ctx.scale(k,k);
    if(rig.motion==='hover'){
      const a=pose.a,shine=ramp(a,0,.52)*(1-ramp(a,.59,1.52));
      paintStar(ctx,rig.light[0]+3*ramp(a,0,1.5),rig.light[1]-7*ramp(a,0,1.5),6.8,shine*.78);
    }
        if(rig.lid&&lidImage&&pose.blink>.001){
      const p=pose.blink,edge=157+67*p;
      ctx.save();ctx.beginPath();ctx.moveTo(365,155);ctx.lineTo(413,155);ctx.lineTo(413,edge-4);ctx.quadraticCurveTo(389,edge+4,365,edge-4);ctx.closePath();ctx.clip();ctx.drawImage(lidImage,366,158);ctx.restore();
    }
    if(rig.motion==='water'){
      const a=pose.a,turn=rig.patches[0].degrees*Math.PI/180*pose.pour;
      const x0=263+(424-263)*Math.cos(turn)-(330-279)*Math.sin(turn),y0=279+(424-263)*Math.sin(turn)+(330-279)*Math.cos(turn);
      for(let j=0;j<4;j++){
        const q=(a-.68-j*.41)/.68;if(q<=0||q>=1)continue;
        const x=x0+(439+2*Math.sin(j*2.1)-x0)*q, y=y0+(385-y0)*(.23*q+.77*q*q);
        ctx.save();ctx.translate(x,y);ctx.rotate(-.30);ctx.globalAlpha=.79*Math.min(1,q/.18,(1-q)/.18);ctx.fillStyle='#a8c3c1';ctx.beginPath();ctx.moveTo(0,-4.3);ctx.bezierCurveTo(-1.7,-1.2,-3.8,3.5,-.2,4.1);ctx.bezierCurveTo(3.8,3.4,1.9,-1,0,-4.3);ctx.fill();ctx.fillStyle='#f2e5c8';ctx.beginPath();ctx.ellipse(-.6,1.1,.72,1.3,0,0,tau);ctx.fill();ctx.restore();
      }
    }
    if(rig.motion==='paint'){
      const a=pose.a,ink=ramp(a,.85,1.55)*(1-ramp(a,3.4,4.75));
      if(ink>.001){ctx.save();ctx.translate(...rig.light);ctx.globalAlpha=.85*ink;ctx.fillStyle='#efbd68';ctx.beginPath();for(let j=0;j<10;j++){const rad=j%2?2.8:7.2,angle=-Math.PI/2+j*Math.PI/5;const x=rad*Math.cos(angle),y=rad*Math.sin(angle);if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.restore();}
    }

    ctx.restore();
  }
  return {paint};
}

function visitFrame(key,episode,t) {
  const id=cast[key].id, chapter=episode;
  const garden=id==='leaf', left=garden?460:530, ground=garden?477:545;
  const visitor=sprite(id,0,left,ground,200);
  const hero=sprite('micro',0,garden?598:675,ground+3,144,0,true), props=[];
  if(id==='wizard'){
    if(chapter===1){
      hero.frame=t>.3?8:7;
    }else if(chapter===2){
      hero.key='heroflight';hero.flip=false;hero.size=162;hero.frame=Math.min(8,Math.floor(cap(t)*9));
      hero.x+=26*ramp(t,.2,.72);hero.y-=18*bell(t,.2,.83);hero.angle=-2*bell(t,.35,.75);
    }else{hero.frame=t>.44?7:0;hero.angle=-2*bell(t,.23,.8)}
  }else if(id==='chemist'){
    hero.frame=chapter===2?(t>.55?7:2):chapter===1?(t>.6?5:7):7;
  }else if(garden){
    hero.frame=chapter===2?8:chapter===1?(t>.6?5:7):7;
  }else{
    hero.frame=t>.63?(chapter===1?6:7):0;
  }
  return {visitor,hero,props};
}
const regular=['stretch','wash','scratch','settle','look','curious'];
const playful=['yarn','box','tail','feather','butterfly'];
function chooseActivity(activeMs,lastTuftMs,desk,rng=Math.random) {
  if(activeMs-lastTuftMs>=10800000 && rng()<.025) return 'tuft';
  const list=rng()<.15?playful.filter(k=>k!=='feather'||desk>0):regular;
  return list[Math.floor(rng()*list.length)];
}
function bindAlbum(root,core,ledger,url) {
  const button=document.createElement('button');
  button.type='button';button.className='castle-btn room-icon album-trigger';button.dataset.cohAction='album';root.append(button);
  const shade=document.createElement('div');shade.className='album-shade';shade.hidden=true;
  shade.innerHTML='<section class="guest-book" role="dialog" aria-modal="true" aria-labelledby="castle-album-title"><div class="album-left"><h2 id="castle-album-title"></h2><div class="guest-portrait-wrap"><img class="visitor-portrait" alt=""></div><nav class="guest-list"></nav></div><div class="album-right" aria-live="polite"><div class="visitor-inscription"><h3></h3><span class="guest-flourish" aria-hidden="true">❧</span><blockquote></blockquote></div></div><button type="button" class="album-close" data-coh-action="close" data-compact></button></section>';
  root.append(shade);
  const find=selector=>shade.querySelector(selector),book=find('.guest-book'),nav=find('.guest-list'),plate=find('.visitor-portrait'),inscription=find('.visitor-inscription'),closeButton=find('.album-close');
  book.style.backgroundImage='url('+JSON.stringify(url('Guest_book.jpg'))+')';
  let selected=0,lastFocus=null,shield=[],generation=0;
  function unlocked(card,state){return card.keys.some(k=>state.guests[k].visits>0)}
  function unread(card,state){return card.keys.some(k=>state.guests[k].unread>0)}
  function translate(){
    button.title=core.tr('Альбом гостей','Guest album');button.setAttribute('aria-label',button.title);
    find('h2').textContent=button.title;nav.setAttribute('aria-label',core.tr('Страницы альбома','Album pages'));
    closeButton.setAttribute('aria-label',core.tr('Закрыть альбом','Close album'));
  }
  function select(index,focus=false){
    selected=index;render();if(focus)nav.children[selected].focus();
  }
  const tabs=guests.map((card,i)=>{
    const tab=document.createElement('button');tab.type='button';tab.dataset.slot=String(i);tab.className='visitor-tab';
    const thumb=document.createElement('img');thumb.alt='';tab.append(thumb);tab.onclick=()=>select(i,true);nav.append(tab);return tab;
  });
  function render(){
    const state=ledger.get(core.read());
    window.__castleVisuals.markFind(button,state.newGuestNotification,core.tr('В альбоме новый гость','New guest in the album'));
    if(shade.hidden)return;
    const l=core.lang()==='en'?1:0,card=guests[selected],known=unlocked(card,state);
    for(const [i,tab] of tabs.entries()){
      const c=guests[i],met=unlocked(c,state);
      tab.setAttribute('aria-pressed',String(i===selected));
      tab.title=met?c.name[l]:core.tr('Неоткрытая страница ','Undiscovered page ')+(i+1);
      tab.setAttribute('aria-label',tab.title);
      const name=c.art+'_'+(met?'Portrait':'Silhouette')+'.png';
      if(tab.firstChild.dataset.file!==name){tab.firstChild.dataset.file=name;tab.firstChild.src=url(name);}
    }
    const file=card.art+'_'+(known?'Portrait':'Silhouette')+'.png';
    if(plate.dataset.file!==file){plate.dataset.file=file;plate.src=url(file);}
    plate.alt=known?card.name[l]:core.tr('Силуэт незнакомого гостя','Silhouette of an undiscovered guest');
    plate.classList.toggle('undiscovered',!known);
    find('h3').textContent=known?card.name[l]:'';
    find('blockquote').textContent=known?(l?'“'+card.quote[l]+'”':'«'+card.quote[l]+'»'):'';
    inscription.hidden=!known;
    const stamp=++generation;
    if(known&&unread(card,state))plate.decode().then(()=>{
      if(shade.hidden||stamp!==generation)return;
      const latest=core.read(),b=ledger.get(latest);
      if(unread(card,b)){for(const key of card.keys)b.guests[key].unread=0;core.save(latest);}
    }).catch(()=>{});
  }
  function open(){
    if(!shade.hidden)return;
    lastFocus=document.activeElement;const data=core.read(),state=ledger.get(data);
    if(state.newGuestNotification){state.newGuestNotification=false;core.save(data);}
    const firstNew=guests.findIndex(c=>unread(c,state)),firstOpen=guests.findIndex(c=>unlocked(c,state));
    selected=firstNew>=0?firstNew:Math.max(0,firstOpen);
    shield=[...root.children].filter(el=>el.tagName==='BUTTON'&&!el.hasAttribute('inert'));
    shield.forEach(el=>el.inert=true);shade.hidden=false;render();closeButton.focus();
  }
  function close(){
    if(shade.hidden)return;
    ++generation;shade.hidden=true;shield.forEach(el=>el.removeAttribute('inert'));shield=[];
    (lastFocus?.isConnected&&lastFocus!==document.body?lastFocus:button).focus();
  }
  function onKey(e){
    if(shade.hidden)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return}
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select((selected+(e.key==='ArrowLeft'?-1:1)+guests.length)%guests.length,true);return}
    if(e.key==='Tab'){
      if(e.shiftKey&&document.activeElement===tabs[0]){e.preventDefault();closeButton.focus()}
      else if(!e.shiftKey&&document.activeElement===closeButton){e.preventDefault();tabs[0].focus()}
    }
  }
  button.onclick=open;closeButton.onclick=close;shade.onclick=e=>{if(e.target===shade)close()};
  document.addEventListener('keydown',onKey,true);translate();render();
  return {open,close,render,isOpen:()=>!shade.hidden,language(){translate();render()},dispose(){++generation;document.removeEventListener('keydown',onKey,true)}};
}
const GUEST_STYLES="#castle-adventure-ui .room-icon,#castle-adventure-ui .home-book-chip.room-icon,#castle-adventure-ui .album-trigger.room-icon{width:80px;height:64px;min-width:0;background-size:80px 64px;background-position:center;transform:none;padding:0}\n#castle-adventure-ui .castle-back.room-icon{left:17px;top:20px}\n#castle-adventure-ui .castle-settings.room-icon{right:16px;top:20px}\n#castle-adventure-ui .castle-balance.room-icon{height:64px;min-width:119px;width:auto;background-size:80px 64px;background-position:left center;padding:0 7px 0 75px;right:97px;top:20px}\n#castle-adventure-ui .home-sword-chip.room-icon{left:600px}\n#castle-adventure-ui .home-rest-chip.room-icon{left:32px}\n#castle-adventure-ui .home-book-chip.room-icon{right:25px}\n#castle-adventure-ui .album-trigger.room-icon{position:absolute;right:119px;bottom:26px;border:0}\n#castle-adventure-ui .room-icon .sword-caption,#castle-adventure-ui .room-icon .rest-chip-title{bottom:-11px}\n#castle-adventure-ui .cast-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1}\n#castle-adventure-ui .cast-layer>*{position:absolute;bottom:auto;left:0;top:0;transform-origin:50% 100%;background-repeat:no-repeat;pointer-events:none}\n#castle-adventure-ui .guest-toast{position:absolute;left:50%;top:86px;transform:translateX(-50%);z-index:3;background:#453226ed;color:#fff1c9;border:1px solid #c29d65;border-radius:15px;font:600 22px/1.2 Georgia,serif;box-shadow:0 3px 10px #42271944;padding:10px 20px;pointer-events:none}\n#castle-adventure-ui .album-shade{position:absolute;inset:0;z-index:14;background:#2b211bc9;display:grid;place-items:center;pointer-events:auto;color:#553c2c;text-shadow:none}\n#castle-adventure-ui .album-shade[hidden],#castle-adventure-ui .guest-toast[hidden],#castle-adventure-ui .cast-layer[hidden],#castle-adventure-ui .album-shade [hidden]{display:none!important}\n#castle-adventure-ui .guest-book{position:relative;width:1072px;height:638px;display:grid;grid-template-columns:1fr 1.1fr;gap:62px;padding:54px 79px 49px 70px;background-size:100% 100%;background-color:#f1dcb1;border-radius:16px;box-shadow:0 12px 40px #26170eaa;color:#533821}\n#castle-adventure-ui .guest-book .album-close{position:absolute;top:22px;right:28px;width:46px;height:46px;border:1px solid #997550;border-radius:50%;background:#f5e5c5;color:#63442f;font:32px/1 Georgia}\n\n#castle-adventure-ui .guest-book{box-sizing:border-box;width:1060px;height:605px;display:grid;grid-template-columns:1fr 1fr;column-gap:96px;padding:49px 72px 48px;border-radius:15px;background-size:100% 100%;color:#513426;font-family:Georgia,'Times New Roman',serif}\n#castle-adventure-ui .album-left{min-width:0;display:grid;grid-template-rows:auto minmax(0,1fr) 54px;row-gap:12px;align-items:center}\n#castle-adventure-ui .guest-book h2{font:normal 28px/1.1 Georgia,serif;letter-spacing:.025em;text-align:center;color:#795739;margin:0}\n#castle-adventure-ui .guest-portrait-wrap{min-height:0;width:100%;height:100%;display:grid;place-items:center}\n#castle-adventure-ui .visitor-portrait{display:block;width:100%;height:100%;max-height:360px;object-fit:contain}\n#castle-adventure-ui .visitor-portrait.undiscovered{width:82%;height:82%}\n#castle-adventure-ui .guest-list{display:flex;align-items:center;justify-content:center;gap:12px;height:56px;align-self:end}\n#castle-adventure-ui .visitor-tab{position:relative;flex:0 0 58px;height:50px;padding:5px 5px 6px;border:0;border-bottom:1px solid #ad8d6260;background:transparent;border-radius:3px;color:#5d402c;cursor:pointer;touch-action:manipulation}\n#castle-adventure-ui .visitor-tab img{height:100%;width:100%;object-fit:contain}\n#castle-adventure-ui .visitor-tab:hover,#castle-adventure-ui .visitor-tab:focus-visible{background:#e1c49355;outline:1px solid #9b7361}\n#castle-adventure-ui .visitor-tab[aria-pressed=true]{border-bottom:3px solid #8e708d;background:linear-gradient(0deg,#c1a7ad3d,transparent 60%)}\n#castle-adventure-ui .album-right{display:flex;align-items:center;justify-content:center;text-align:center;min-width:0;padding:0 8px 6px}\n#castle-adventure-ui .guest-book h3{font:normal 33px/1.16 Georgia,serif;margin:0;color:#66452e}\n#castle-adventure-ui .guest-flourish{display:flex;align-items:center;justify-content:center;gap:14px;font:27px/1 Georgia,serif;color:#a87e43;margin:21px 0}\n#castle-adventure-ui .guest-flourish:before,#castle-adventure-ui .guest-flourish:after{content:'';height:1px;width:46px;background:#b79864}\n#castle-adventure-ui .guest-book blockquote{margin:0;font:italic 32px/1.39 Georgia,'Times New Roman',serif;text-wrap:pretty;color:#4e3427}\n#castle-adventure-ui .cast-layer canvas{background:transparent;image-rendering:auto}\n\n#castle-adventure-ui .guest-book{transform:scale(var(--guest-sx,1),var(--guest-sy,1));transform-origin:center}";
// The original resident walks and rests on the bare rug only at level zero.
function bindGuestRoom(ui,core,url,resident) {
  const root=ui.root, ledger=window.__castleGuestLedger, cat=root.querySelector('.room-cat');
  const style=document.createElement('style');style.textContent=GUEST_STYLES;root.append(style);
  const stage=document.createElement('div');stage.className='cast-layer';stage.hidden=true;stage.setAttribute('aria-hidden','true');
  cat.before(stage);
  const actors=Array.from({length:4},(_,i)=>{const el=document.createElement(i===0?'canvas':'i');stage.append(el);return el});
  const toast=document.createElement('div');toast.className='guest-toast';toast.setAttribute('role','status');toast.hidden=true;root.append(toast);
  const visitor=actors[0], context=visitor.getContext('2d');
  // The original room stretches to its canvas. Keep new paintings at their
  // native aspect while their bottom-center anchor follows that room.
  const gameCanvas=document.querySelector('canvas');
  function fitGuestArt(){
    const bounds=gameCanvas?.getBoundingClientRect();
    if(!bounds?.width||!bounds.height)return;
    const sx=bounds.width/1280,sy=bounds.height/720,uniform=Math.min(sx,sy);
    root.style.setProperty('--kitten-finger',(44/uniform)+'px');root.style.setProperty('--book-finger-x',(44/sx)+'px');root.style.setProperty('--book-finger-y',(44/sy)+'px');
    root.style.setProperty('--guest-sx',uniform/sx);root.style.setProperty('--guest-sy',uniform/sy);
  }
  const resize=typeof ResizeObserver==='function'?new ResizeObserver(fitGuestArt):null;
  if(gameCanvas)resize?.observe(gameCanvas);
  window.addEventListener('resize',fitGuestArt);fitGuestArt();

  let edgeSize=288,lastCard='',lastSample=-1;
  function guestResolution(){
    const {width,height}=gameCanvas?.getBoundingClientRect()||{width:1280,height:720};
    const density=Math.min(width/1280,height/720)*(window.devicePixelRatio||1);
    return Math.max(288,Math.min(576,Math.ceil(224*density/32)*32));
  }
  edgeSize=guestResolution();visitor.width=visitor.height=edgeSize;
  const artResize=typeof ResizeObserver==='function'?new ResizeObserver(()=>{edgeSize=guestResolution();}):null;
  if(gameCanvas)artResize?.observe(gameCanvas);
  const paintings=new Map();
  function loadBitmap(file){const image=new Image();image.src=url(file);return image.decode().then(()=>image);}
  function preload(card){
    if(paintings.has(card.id))return paintings.get(card.id);
    const entry={ready:false};paintings.set(card.id,entry);
    const rig=portraitRigs[card.id];
    
    Promise.all([loadBitmap(rig.source||card.art+'_Portrait.png'),rig.lid?loadBitmap(rig.lid).catch(()=>null):null]).then(([image,lidImage])=>{
      entry.image=image;entry.lid=lidImage;entry.painting=buildPainting(image,rig,edgeSize,lidImage);entry.size=edgeSize;entry.ready=true;
    }).catch(()=>{paintings.delete(card.id);});
    return entry;
  }
  guests.forEach(preload);
  function paintVisitor(s){
    const rig=portraitRigs[s.key];
    const clock=visitorClock(s.key),p=guestPose(clock),entry=paintings.get(s.key);
    if(!entry?.ready)return;
    if(rig.motion==='hover')s.y-=3+2.8*Math.sin(tau*(p.t/3.65+p.phase));
    // Position is updated at display refresh. Slow pigment motion needs only 30 samples/s.
    const sample=Math.floor(p.t*30);
    if(lastCard===s.key&&lastSample===sample&&entry.size===edgeSize)return;
    const first=lastCard!==s.key||entry.size!==edgeSize||visitor.width!==edgeSize;
    if(entry.size!==edgeSize){entry.painting=buildPainting(entry.image,rig,edgeSize,entry.lid);entry.size=edgeSize;}
    if(visitor.width!==edgeSize){visitor.width=visitor.height=edgeSize;}
    entry.painting.paint(p,context,first);
    lastSample=sample;lastCard=s.key;
  }
  function setActor(el,s,fade) {
    if(!s){el.style.display='none';return}
    if(el===visitor){paintVisitor(s)}
    else{
      const source='Guest_'+s.key+'.webp';
      if(el.dataset.file!==source){
        el.dataset.file=source;el.style.backgroundImage='url('+JSON.stringify(url(source))+')';
        el.style.backgroundSize='contain';el.style.backgroundPosition='center bottom';
      }
    }
    el.style.display='block';el.style.width=s.size+'px';el.style.height=s.size+'px';
    el.style.opacity=String(s.opacity*fade);
    el.style.transform='translate('+(s.x-s.size/2)+'px,'+(s.y-s.size)+'px) rotate('+s.angle+'deg) '+(el===visitor?'scale(var(--guest-sx,1),var(--guest-sy,1))':'scaleX('+(s.flip?-1:1)+')');
  }
  const album=bindAlbum(root,core,ledger,url);
  const now=()=>performance.now();
  let last=now(),elapsed=0,pendingMs=0,sinceSave=0;
  let active=null,roomData=null,readIn=0,gap=650,toastLeft=0,disposed=false,activityIn=120000+Math.random()*60000;
  const isVisible=()=>!document.hidden && (typeof document.hasFocus!=='function'||document.hasFocus());
  function flush(){
    const amount=Math.floor(pendingMs);pendingMs=0;sinceSave=0;
    if(!amount||window.__castleResetScene)return;
    const d=core.read();ledger.get(d).activeMs+=amount;core.save(d);
    if(roomData)roomData.activeMs+=amount;
  }
  function refresh(){const d=core.read();roomData=ledger.get(d);readIn=500;return d}
  function clearStage(){
    stage.hidden=true;resident.setVisit(false);if(!album.isOpen())cat.removeAttribute('inert');
  }
  function stop(){active=null;elapsed=0;clearStage();}
  function startVisit(b) {
    const next=b.waiting[0];if(!next||!cast[next.key])return;
    if(!preload(cast[next.key]).ready)return false;
    const visits=b.guests[next.key].visits;
    active={type:'visit',key:next.key,id:next.id,episode:(visits+(next.variant==='clock'?2:0))%3,duration:7600};
    elapsed=0;resident.setVisit(true);return true;
  }
  function finishVisit(){
    const d=core.read(), card=cast[active.key], before=ledger.get(d);
    const alreadyMet=card.keys.some(k=>before.guests[k].visits>0);
    const result=ledger.witness(d,active.id);
    if(result){
      if(result.fresh){
        const g=ledger.get(d).guests[result.key];g.rooms||=[];
        g.rooms[result.index]=d.upgrades.slice();
        if(!alreadyMet){toast.textContent=core.tr('В альбоме новый гость','A new guest in the album');toast.hidden=false;toastLeft=3400;}
      }
      core.save(d);album.render();
    }
    refresh();gap=4200;stop();
  }
  function showPose(p,t,duration){
    const edge=cap(Math.min(t*duration/470,(1-t)*duration/550));stage.hidden=false;cat.setAttribute('inert','');
    setActor(actors[0],p.visitor,edge);
    for(let i=0;i<3;i++)setActor(actors[1+i],p.props[i],edge);
  }
  const modals=()=>album.isOpen()||!root.querySelector('.home-book-shade').hidden||
    !root.querySelector('.home-rest-panel').hidden||!root.querySelector('.rest-finished').hidden||
    !!document.querySelector('#cozy-settings-root.cozy-open');
  function tick(rest,levels,waking) {
    if(disposed)return;
    const time=now(),dt=Math.max(0,Math.min(250,time-last));last=time;
    if(!root.isConnected){dispose();return}
    if(!isVisible()||ui.pendingScene||window.__castleScreenFade?.pending||window.__castleResetScene){return}
    readIn-=dt;if(!roomData||readIn<=0)refresh();
    if(toastLeft>0){toastLeft-=dt;if(toastLeft<=0)toast.hidden=true}
    const busy=modals();
    if(active?.type==='visit'){
      if(busy)return;
      if(roomData.waiting[0]?.id!==active.id){stop();return}
      elapsed+=dt;
      if(elapsed>=active.duration){finishVisit();return}
      if(portraitRigs[cast[active.key].id])advanceVisitor(cast[active.key].id,dt/1000,elapsed/1000,active.duration/1000);
      const t=cap(elapsed/active.duration);showPose(visitFrame(active.key,active.episode,t),t,active.duration,true);return;
    }
    if(rest?.running||waking){stop();return}
    if(busy)return;
    gap=Math.max(0,gap-dt);
    if(!gap && roomData.waiting.length){stop();startVisit(roomData);return}
    pendingMs+=dt;sinceSave+=dt;if(sinceSave>=20000)flush();
    if(levels[2]===0){
      activityIn-=dt;
      if(activityIn<=0){
        activityIn=120000+Math.random()*60000;
        const kind=chooseActivity(roomData.activeMs+pendingMs,roomData.lastTuftMs,levels[4]);
        if(resident.roomActivity(kind)&&kind==='tuft'){flush();const d=core.read(),state=ledger.get(d);state.lastTuftMs=state.activeMs;core.save(d);refresh();}
      }
    }
  }
  function visibility(){last=now();if(!isVisible())flush()}
  function external(e){if(e.key==='castleOfHours.adventure.v1'){readIn=0;album.render()}}
  function dispose(){
    if(disposed)return;disposed=true;resize?.disconnect();artResize?.disconnect();window.removeEventListener('resize',fitGuestArt);flush();clearStage();album.dispose();
    window.removeEventListener('storage',external);
    window.removeEventListener('pagehide',visibilityOff);window.removeEventListener('blur',visibility);
    window.removeEventListener('focus',visibility);document.removeEventListener('visibilitychange',visibility);
  }
  const visibilityOff=()=>{last=now();flush()};
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('storage',external);window.addEventListener('pagehide',visibilityOff);
  window.addEventListener('blur',visibility);window.addEventListener('focus',visibility);
  return {album,tick,dispose,resident};
}

window.__castleBindGuestRoom=bindGuestRoom;
}
};
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbd5970 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb71020 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xaff6a0 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb04ec0 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb047d8 = function GDJSInlineCode(runtimeScene) {
"use strict";
// Общая реакция котика в меню и комнате.
if (typeof window !== "undefined" && !window.__castleBindPet) {
  window.__castleBindPet = function bindCastleCat(root, button, eyes, artBox, catalog, url) {
  const previous = window.__castleActivePet;
  previous?.dispose();
  const source = url('Castle_Cat_Purring_Pixabay_28220.mp3');
  const recording = window.__castlePurrRecording;
  const audio = recording?.source === source ? recording.audio : new Audio(source);
  window.__castlePurrRecording = {source, audio};
  audio.preload = 'auto';
  audio.loop = false;
  const doc = root.ownerDocument;
  const sensor = button.querySelector('.cat-hit') || button;
  let pose = '', poseFrames = 0, visibleFrame = -1;
  let petAt = null, nextPet = 0, hovering = false, disposed = false;
  let sounding = false, pending = false, retryOnGesture = false, ticket = 0;
  let began = 0, releaseAt = null, releaseGain = 0, joinedAt = 0, joinedGain = 0, gain = 0;
  const unit = n => Math.max(0, Math.min(1, n));
  function volume() {
    const sound = window.__castleMusic?.state;
    if (sound?.enabled === false) return 0;
    const master = window.__theCozyTimeSettings?.volume ?? 65;
    return unit(master / 100) * unit((sound?.cat ?? 45) / 100) *
      (pose === 'sleep' || pose === 'night' ? .78 : 1);
  }
  function silence() {
    ++ticket;
    sounding = pending = retryOnGesture = false;
    releaseAt = null;
    gain = 0;
    audio.volume = 0;
    audio.pause();
    try { audio.currentTime = 0; } catch (_) {}
  }
  function play() {
    retryOnGesture = false;
    if (disposed || doc.hidden || !volume()) return;
    const now = performance.now();
    if (sounding) {
      if (releaseAt !== null) {
        releaseAt = null;
        joinedGain = gain;
        joinedAt = began = now;
      }
      return;
    }
    const current = ++ticket;
    sounding = pending = true;
    began = joinedAt = now;
    joinedGain = gain = audio.volume = 0;
    releaseAt = null;
    const started = () => {
      if (ticket !== current) return;
      pending = false;
      began = joinedAt = performance.now();
    };
    const blocked = error => {
      if (ticket !== current) return;
      silence();
      retryOnGesture = hovering && (!error || error.name === 'NotAllowedError');
    };
    try {
      const request = audio.play();
      if (request?.then) request.then(started, blocked);
      else started();
    } catch (error) { blocked(error); }
  }
  function fade(now) {
    if (!sounding || releaseAt !== null) return;
    releaseAt = now;
    releaseGain = gain;
  }
  function onEnter(event) {
    if (event.pointerType === 'touch' || hovering) return;
    hovering = true;
    play();
  }
  function onLeave(event) {
    if (event.pointerType === 'touch') return;
    hovering = retryOnGesture = false;
    fade(performance.now());
  }
  function onGesture() {
    if (hovering && retryOnGesture) play();
  }
  function onPet() {
    const now = performance.now();
    if (disposed || doc.hidden || !pose || now < nextPet) return;
    petAt = now;
    nextPet = now + 2350;
    play();
  }
  function onKey(event) {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  }
  function frame(index) {
    if (!eyes || index === visibleFrame) return;
    visibleFrame = index;
    eyes.style.visibility = index > 0 ? 'visible' : 'hidden';
    if (index > 0) eyes.style.backgroundPosition = '0 ' + (100 * index / poseFrames) + '%';
  }
  function setPose(name) {
    if (name === pose) return;
    // The complete watercolor paintings retain the normal purr and have no eyelid overlay.
    if (!eyes) { pose = name; petAt = null; return; }
    const [file, width, height, x, y, w, h, frames, hit] = catalog[name];
    pose = name;
    poseFrames = frames;
    petAt = null;
    frame(0);
    Object.assign(eyes.style, {
      position: 'absolute', pointerEvents: 'none',
      left: (100 * x / width) + '%', top: (100 * y / height) + '%',
      width: (100 * w / width) + '%', height: (100 * h / height) + '%',
      backgroundImage: 'url(' + JSON.stringify(url(file)) + ')',
      backgroundRepeat: 'no-repeat', backgroundSize: '100% ' + (100 * (frames + 1)) + '%'
    });
    if (artBox) {
      const size = Math.max(width, height);
      artBox.style.width = (100 * width / size) + '%';
      artBox.style.height = (100 * height / size) + '%';
      sensor.style.clipPath = 'polygon(' + hit + ')';
    } else {
      const [left, top, bw, bh, shape] = hit;
      Object.assign(button.style, {
        left: (100 * left / width) + '%', top: (100 * top / height) + '%',
        width: (100 * bw / width) + '%', height: (100 * bh / height) + '%',
        clipPath: 'polygon(' + shape + ')'
      });
    }
  }
  function update() {
    if (disposed) return;
    if (!root.isConnected) { dispose(); return; }
    const now = performance.now();
    if (petAt !== null) {
      const elapsed = now - petAt;
      // Notice, softly close (or peek), hold, then return to the original drawing.
      const amount = elapsed < 130 ? 0 : elapsed < 710 ? (elapsed - 130) / 580 :
        elapsed < 980 ? 1 : unit(1 - (elapsed - 980) / 630);
      frame(Math.round(poseFrames * amount * amount * (3 - 2 * amount)));
      if (elapsed >= 1610) petAt = null;
    }
    if (!sounding) return;
    const target = volume();
    if (!target || doc.hidden || audio.ended) { silence(); return; }
    if (releaseAt === null && !pending && now - began >= 3600) fade(now);
    if (releaseAt !== null) {
      gain = releaseGain * (1 - unit((now - releaseAt) / 400));
      if (gain <= 0) { silence(); return; }
    } else {
      gain = joinedGain + (1 - joinedGain) * unit((now - joinedAt) / 160);
    }
    audio.volume = gain * target;
  }
  function suspend() {
    hovering = false;
    petAt = null;
    frame(0);
    silence();
  }
  const onVisibility = () => { if (doc.hidden) suspend(); };
  const onEnded = () => { if (sounding) silence(); };
  sensor.addEventListener('pointerenter', onEnter);
  sensor.addEventListener('pointerleave', onLeave);
  sensor.addEventListener('pointercancel', onLeave);
  button.addEventListener('click', onPet);
  button.addEventListener('keydown', onKey);
  doc.addEventListener('click', onGesture, true);
  doc.addEventListener('keydown', onGesture, true);
  doc.addEventListener('visibilitychange', onVisibility);
  audio.addEventListener('ended', onEnded);
  window.addEventListener('pagehide', suspend);
  const observer = typeof MutationObserver === 'function' ? new MutationObserver(() => {
    if (!root.isConnected) dispose();
  }) : null;
  observer?.observe(doc.body, {childList: true});
  function dispose() {
    if (disposed) return;
    disposed = true;
    suspend();
    observer?.disconnect();
    sensor.removeEventListener('pointerenter', onEnter);
    sensor.removeEventListener('pointerleave', onLeave);
    sensor.removeEventListener('pointercancel', onLeave);
    button.removeEventListener('click', onPet);
    button.removeEventListener('keydown', onKey);
    doc.removeEventListener('click', onGesture, true);
    doc.removeEventListener('keydown', onGesture, true);
    doc.removeEventListener('visibilitychange', onVisibility);
    audio.removeEventListener('ended', onEnded);
    window.removeEventListener('pagehide', suspend);
    if (window.__castleActivePet === controller) window.__castleActivePet = null;
  }
  const controller = {audio, update, setPose, dispose, quiet:suspend, isReacting: () => petAt !== null};
  window.__castleActivePet = controller;
  return controller;
};
}
};
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb25e40 = function GDJSInlineCode(runtimeScene) {
// Cat's original room: freely chosen rest timer, restoration book and gentle reactions.
(function(){
  if(window.__castleScreenFade?.pending?.from===runtimeScene.getName())return;
  if(typeof document==='undefined'||typeof window==='undefined')return;
  const scene=runtimeScene;
  // Shared, persistent Adventure data. Created once per preview window.
const core=window.__castleAdventureCore;

  let ui=window.__castleCatHome;
  if(!ui||ui.scene!==scene||!ui.root||!ui.root.isConnected){
    if(ui){ui.dispose?.();ui.root?.remove()}
    const root=document.createElement('div');root.id='castle-adventure-ui';
    root.innerHTML=`<style>
#castle-adventure-ui{position:fixed;width:1280px;height:720px;z-index:2147482200;pointer-events:none;isolation:isolate;
  font-family:'Castle Garamond',Georgia,serif;color:#ffeac1;text-shadow:0 1px 3px #42251a;}
#castle-adventure-ui *{box-sizing:border-box;}
#castle-adventure-ui button,#castle-adventure-ui input{font-family:inherit;}
#castle-adventure-ui button{pointer-events:auto;cursor:pointer;}
#castle-adventure-ui button:focus-visible{outline:3px solid #fff2bd;outline-offset:3px;}
#castle-adventure-ui .castle-btn{background:linear-gradient(155deg,#60402e,#34221d);border:2px solid #d4aa64;
  color:#ffedc4;box-shadow:inset 0 1px 0 #ad8652,0 3px 10px #23110cb5;border-radius:15px;font-size:25px;
  padding:8px 17px;text-shadow:0 1px 2px #1c0f0a;}
#castle-adventure-ui .castle-btn:hover{filter:brightness(1.16)}
#castle-adventure-ui .castle-btn:disabled{filter:grayscale(.65);opacity:.62;cursor:not-allowed}
#castle-adventure-ui .castle-circle{width:57px;height:57px;border-radius:16px;padding:0;font-size:33px;}
#castle-adventure-ui .castle-back{position:absolute;left:24px;top:23px;}
#castle-adventure-ui .home-chest{position:absolute;left:100px;top:19px;width:67px;height:62px;border:0;padding:0;background:transparent;touch-action:manipulation;z-index:2}
#castle-adventure-ui .home-chest::before{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:max(calc(64px * var(--coh-disc-x,1)),calc(var(--book-finger-x,0px) * .82));height:max(calc(57.6px * var(--coh-disc-y,1)),calc(var(--book-finger-y,0px) * .738));background:var(--chest-art) center/100% 100% no-repeat;pointer-events:none}
@media(pointer:coarse){#castle-adventure-ui .home-chest{left:max(103px,var(--book-finger-x,0px));width:max(67px,var(--book-finger-x,0px));height:max(62px,var(--book-finger-y,0px));background-size:contain}}
#castle-adventure-ui .castle-settings{position:absolute;right:23px;top:23px;}
#castle-adventure-ui .castle-balance{position:absolute;right:92px;top:23px;min-width:118px;height:57px;
  background:linear-gradient(#65432b,#36231c);border:2px solid #d4aa64;border-radius:16px;
  display:flex;align-items:center;justify-content:center;font-size:29px;gap:9px;box-shadow:0 4px 12px #22120a99;}
#castle-adventure-ui .castle-title{position:absolute;top:24px;left:245px;width:790px;text-align:center;
  font-size:52px;line-height:1.1;font-weight:700;color:#ffebbd;text-shadow:0 3px 4px #3b1b14,0 0 15px #5a2c17;}
#castle-adventure-ui .castle-subtitle{position:absolute;top:88px;left:250px;width:780px;text-align:center;
  font-size:25px;color:#ffebc5;text-shadow:0 2px 5px #422113;}
#castle-adventure-ui .castle-parchment{background:linear-gradient(135deg,#f8dfaa,#eac38a 48%,#f7dfb0 90%);
  border:7px double #8b5632;outline:2px solid #e6b979;box-shadow:0 15px 40px #170c09a8,inset 0 0 32px #ab74495c;
  border-radius:22px;color:#51301f;text-shadow:none;}
#castle-adventure-ui .castle-modal-shade{position:absolute;inset:0;background:rgba(24,14,14,.65);pointer-events:auto;
  display:flex;align-items:center;justify-content:center;z-index:10;}
#castle-adventure-ui .castle-modal-shade[hidden]{display:none!important}
#castle-adventure-ui .castle-modal{position:relative;max-width:660px;padding:34px 40px;text-align:center;}
#castle-adventure-ui .castle-modal h2{font-size:45px;margin:0 0 12px;}
#castle-adventure-ui .castle-modal p{font-size:27px;margin:10px 0 25px;}
#castle-adventure-ui .castle-modal .castle-btn{margin:5px;}
#castle-adventure-ui .castle-sparkles{position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0;z-index:9;}
#castle-adventure-ui .castle-sparkles.play{animation:castle-sparkle-show 2.7s ease-out forwards;}
#castle-adventure-ui .castle-sparkles:after{content:'✦   ·   ✧    ✦    ✧   ·   ✦    ✧';position:absolute;left:230px;top:240px;
  color:#ffe79d;font-size:65px;text-shadow:0 0 18px #ffcc69;animation:castle-sparkle-float 2.7s ease-out;}
@keyframes castle-sparkle-show{0%{opacity:0}15%{opacity:1}75%{opacity:1}100%{opacity:0}}
@keyframes castle-sparkle-float{from{transform:translateY(60px)}to{transform:translateY(-45px)}}
#castle-adventure-ui .castle-hint{position:absolute;bottom:12px;left:160px;right:160px;text-align:center;
  color:#ffe6bd;font-size:21px;text-shadow:0 2px 5px #24120c;}

      #castle-adventure-ui .home-rest-chip{position:absolute;bottom:25px;left:26px;width:155px;height:79px;
        font-size:24px;line-height:1.15;}
      #castle-adventure-ui .home-rest-chip small{display:block;font-size:21px;}
      #castle-adventure-ui .home-book-chip{position:absolute;bottom:26px;right:25px;width:94px;height:87px;
        font-size:49px;transform:rotate(-8deg);border-radius:12px;box-shadow:0 0 11px #ffcf70a0;}
      #castle-adventure-ui .home-sword-chip{position:absolute;bottom:25px;left:575px;width:130px;height:87px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;
        font-size:40px;line-height:1;border-radius:15px;box-shadow:0 0 11px #ffcf7055;}
      #castle-adventure-ui .home-sword-chip .sword-caption{font-size:18px;line-height:1.15;white-space:nowrap;}
      #castle-adventure-ui .home-rest-panel{position:absolute;bottom:117px;left:23px;width:355px;
        padding:19px 24px 22px;pointer-events:auto;z-index:3;}
      #castle-adventure-ui .home-rest-panel[hidden]{display:none;}
      #castle-adventure-ui .home-rest-panel h2{font-size:35px;margin:0 0 7px;text-align:center;}
      #castle-adventure-ui .home-rest-panel .rest-clock{font-size:56px;text-align:center;font-variant-numeric:tabular-nums;}
      #castle-adventure-ui .rest-presets{display:flex;gap:7px;justify-content:center;margin:8px 0 13px;}
      #castle-adventure-ui .rest-presets button{background:#8b5a3b;color:#fff0ce;border:1px solid #d4ab73;
        border-radius:10px;padding:4px 11px;font-size:20px;}
      #castle-adventure-ui .rest-presets button.selected{background:#c29151;color:#412419;}
      #castle-adventure-ui .rest-custom{display:flex;align-items:center;justify-content:center;gap:12px;font-size:23px;}
      #castle-adventure-ui .rest-custom input{width:74px;font-size:25px;border:2px solid #a06b45;
        border-radius:8px;background:#fff2d3;color:#573522;text-align:center;pointer-events:auto;}
      #castle-adventure-ui .rest-actions{display:flex;justify-content:center;gap:8px;margin-top:14px;}
      #castle-adventure-ui .rest-actions button{font-size:22px;padding:7px 12px;}
      #castle-adventure-ui .home-decor{position:absolute;inset:0;pointer-events:none;}
      #castle-adventure-ui .home-decor span{position:absolute;display:block;filter:drop-shadow(0 3px 4px #4b291966);}
      #castle-adventure-ui .home-decor .glowing-fire{left:850px;top:280px;width:190px;height:160px;
        background:radial-gradient(ellipse at bottom,#ffc85a95 0%,#e76d2555 24%,transparent 65%);
        animation:castle-fire-flicker 3s ease-in-out infinite;}
      @keyframes castle-fire-flicker{0%,100%{opacity:.6}40%{opacity:1}70%{opacity:.76}}
      #castle-adventure-ui .home-decor .fire-emoji{left:901px;top:314px;font-size:84px;opacity:.86;}
      #castle-adventure-ui .home-decor .shelf-books{left:676px;top:184px;font-size:51px;letter-spacing:-8px;}
      #castle-adventure-ui .home-decor .shelf-candle{left:737px;top:135px;font-size:41px;}
      #castle-adventure-ui .home-decor .window-pots{left:217px;top:335px;font-size:39px;}
      #castle-adventure-ui .home-decor .window-flowers{left:255px;top:250px;font-size:30px;}
      #castle-adventure-ui .home-decor .desk{left:1050px;top:520px;font-size:63px;}
      #castle-adventure-ui .home-decor .desk-items{left:1105px;top:508px;font-size:30px;}
      #castle-adventure-ui .home-decor .home-star{font-size:31px;color:#ffe7a5;animation:castle-star-pulse 3.4s infinite alternate;}
      @keyframes castle-star-pulse{from{opacity:.3;transform:scale(.7)}to{opacity:.95;transform:scale(1.2)}}
#castle-adventure-ui .home-decor img[data-layer][hidden]{display:none!important}
#castle-adventure-ui .home-decor img{position:absolute;pointer-events:none}
#castle-adventure-ui .home-decor .transforming{animation:room-restore 3.5s ease-out}
@keyframes room-restore{0%{opacity:0}45%{filter:sepia(.24) brightness(1.1)}100%{opacity:1}}
.room-finished{position:absolute;left:50%;bottom:19%;transform:translateX(-50%);border-radius:18px;padding:9px 19px;background:#61452beb;font-size:26px;color:#ffe7b8;pointer-events:none}.room-finished:empty{display:none}
#castle-adventure-ui .book-coin{display:inline-block;vertical-align:-.18em;width:1.18em;height:1.12em;background:var(--book-coin) center/140% auto no-repeat;image-rendering:pixelated}
#castle-adventure-ui .room-icon{background-color:transparent;border:0;box-shadow:none;border-radius:0;background-position:center;background-repeat:no-repeat;background-size:contain;filter:drop-shadow(0 2px 3px #4e321d66);color:#fff3ce;image-rendering:pixelated}
#castle-adventure-ui button.room-icon{transition:filter .16s ease}
#castle-adventure-ui button.room-icon:is(:hover,:focus-visible){filter:drop-shadow(0 0 5px #f4c574)}
#castle-adventure-ui button.room-icon:active{background-position:center calc(50% + 1px);filter:brightness(.92) drop-shadow(0 1px 2px #654321)}
@media(prefers-reduced-motion:reduce){#castle-adventure-ui button.room-icon{transition:none}}
#castle-adventure-ui .room-icon .sword-caption,#castle-adventure-ui .room-icon .rest-chip-title{position:absolute;bottom:-6px;left:0;width:100%;font-size:17px;text-shadow:0 1px 4px #391f10,0 1px 2px #391f10}
#castle-adventure-ui .rest-chip-time{position:absolute;right:-12px;bottom:14px;font-size:17px;background:#644831;border-radius:7px}
#castle-adventure-ui .castle-balance.room-icon{background-position:left center;background-size:58px auto;justify-content:flex-end;padding:0 9px;width:auto;min-width:100px;padding-left:61px;height:52px;text-shadow:0 2px 3px #442817}
#castle-adventure-ui .home-book-chip.room-icon{width:78px;height:75px;transform:none}
#castle-adventure-ui .room-mote{position:absolute;color:#fdd990;pointer-events:none;animation:room-mote 13s infinite;opacity:0}
@keyframes room-mote{0%,70%,100%{opacity:0}77%{opacity:.7}94%{opacity:0;transform:translate(12px,-20px)}}
#castle-adventure-ui .room-flame{position:absolute;width:52px;height:52px;transform:translate(-50%,-70%);border-radius:48%;background:radial-gradient(#ffd58060,transparent 70%);animation:room-flame 1.1s ease-in-out alternate infinite}
@keyframes room-flame{to{opacity:.4;scale:.95 1.08}}

.garden-rays{position:absolute;width:100px;height:85px;background:radial-gradient(ellipse,#ffe8a840,transparent 70%);animation:room-flame 4s infinite alternate}
.garden-leaves{mask-image:radial-gradient(ellipse at 40% 22%,black,transparent 42%);animation:garden-sway 5s ease-in-out infinite alternate}
@keyframes garden-sway{to{transform:translateX(1.8px) rotate(.25deg)}}
.kindle{position:absolute;color:#ffe4a7;font-size:18px;opacity:0;animation:room-kindle 2.6s ease-out}
@keyframes room-kindle{0%{opacity:0}25%{opacity:.85}100%{transform:translateY(-14px);opacity:0}}
#castle-adventure-ui .companion-bed,#castle-adventure-ui .companion-fly{position:absolute;display:block;pointer-events:none;user-select:none;object-fit:contain;max-width:none;max-height:none;image-rendering:auto}
#castle-adventure-ui .companion-bed{left:848px;top:571px;transform-origin:50% 100%;transform:translate(-50%,-100%) scale(var(--guest-sx,1),var(--guest-sy,1))}
#castle-adventure-ui .companion-bed[hidden],#castle-adventure-ui .companion-fly[hidden]{display:none}
#castle-adventure-ui button.room-cat{position:absolute;width:155px;height:155px;display:block;transform-origin:50% 91.8%;transform:translate(-50%,-91.8%) scale(var(--guest-sx,1),var(--guest-sy,1));pointer-events:none;touch-action:none;user-select:none;background:none;box-shadow:none;border:0;padding:0;text-shadow:none;overflow:visible;outline:0}
#castle-adventure-ui .room-cat:focus-visible:after{content:"";position:absolute;inset:35% 17% 5%;border:2px solid #e6c48d;border-radius:50%;pointer-events:none}
#castle-adventure-ui .companion-surface{display:block;width:100%;height:100%;pointer-events:none;image-rendering:auto}
#castle-adventure-ui .companion-hit{position:absolute;inset:0;display:block;cursor:pointer;pointer-events:auto;touch-action:none;clip-path:ellipse(38% 42% at 54% 57%)}
#castle-adventure-ui .room-cat:focus-visible .companion-surface{filter:drop-shadow(0 0 3px #ffcf7a)}
#castle-adventure-ui .companion-fly{width:27px;height:24px;transform-origin:center;filter:drop-shadow(0 0 2px #ecc5619c)}
@media (pointer:coarse){
 #castle-adventure-ui .room-cat .companion-hit{inset:auto;left:51%;top:58%;width:max(56%,var(--kitten-finger,55px));height:max(58%,var(--kitten-finger,55px));transform:translate(-50%,-50%);border-radius:50%;clip-path:none!important}
 #castle-adventure-ui .room-cat[data-state=Sleeping] .companion-hit{top:67%}
 #castle-adventure-ui .home-book-chip .chronicle-touch-pad{display:block;position:absolute;left:54%;top:50%;width:max(100%,var(--book-finger-x,55px));height:max(100%,var(--book-finger-y,55px));transform:translate(-50%,-50%);pointer-events:auto}
}

#castle-adventure-ui .home-book-shade {
  position:fixed;inset:0;margin:0;padding:0;border:0;width:100%;height:100%;max-width:none;max-height:none;
  background:transparent;color:#482b20;font:normal 18px/1.25 Georgia,'Times New Roman',serif;
  pointer-events:auto;overflow:hidden;text-shadow:none;
}
#castle-adventure-ui .home-book-shade[open]{display:grid;place-items:center}
#castle-adventure-ui .home-book-shade[hidden]{display:none}
.home-book-shade::backdrop{background:rgba(37,23,22,.48)}
#castle-adventure-ui .chronicle {
  position:relative;box-sizing:border-box;isolation:isolate;container-type:inline-size;
  width:min(96vw,152vh,1250px);aspect-ratio:1.62;display:grid;grid-template-columns:1fr 1fr;
  color:#482b20;background:#f4e1b8 var(--manuscript) center/100% 100% no-repeat;
  border:0;border-radius:2.8%/3.8%;padding:0;box-shadow:0 12px 45px #25130d88;
  animation:book-arrive .32s ease-out both;overflow:visible;
}
@keyframes book-arrive{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
#castle-adventure-ui .chronicle *{box-sizing:border-box}
#castle-adventure-ui .chronicle .home-page{position:relative;width:auto;height:100%;min-height:0;overflow:visible;border:0;border-radius:0;background:none;box-shadow:none;padding:0}
#castle-adventure-ui .chronicle .left{display:flex;flex-direction:column;justify-content:center;padding:4% 7.2% 7.5% 11.8%}
#castle-adventure-ui .chronicle .book-heading{margin:0 0 2.1cqw;font:500 clamp(24px,3.9cqw,51px)/1.02 Georgia,serif;text-align:center;color:#64402e;letter-spacing:-.035em;text-wrap:balance}
#castle-adventure-ui .chronicle .book-heading::first-letter{font-size:1.28em;color:#785478}
#castle-adventure-ui .chronicle .book-chapters{display:grid;gap:1.05cqw}
#castle-adventure-ui .chronicle .chronicle-chapter{
  width:100%;min-height:0;height:6.15cqw;display:grid;align-items:center;grid-template-columns:21% 1fr 6%;
  gap:2%;margin:0;padding:0 3%;border:1px solid #bb935d;border-radius:23% 4% 16% 6% / 13% 20% 13% 20%;
  color:#4c3022;font:500 clamp(15px,2.02cqw,27px)/1.04 Georgia,serif;text-align:left;
  background:linear-gradient(105deg,#fbecc765,#edc78628 55%,#fff2ce50);box-shadow:inset 0 0 0 2px #f7e4c16b;text-shadow:none;
}
#castle-adventure-ui .chronicle .chronicle-chapter[aria-pressed=true]{border-color:#9c7045;background:linear-gradient(105deg,#dcc6cfa6,#ead8d398 60%,#dfc4d185)}
#castle-adventure-ui .chronicle .chronicle-chapter:hover{border-color:#946334;filter:brightness(1.035)}
#castle-adventure-ui .chronicle button:focus-visible{outline:2px solid #74516d;outline-offset:2px}
#castle-adventure-ui .chronicle .chronicle-chapter img{width:100%;height:5.35cqw;object-fit:contain;mix-blend-mode:multiply;pointer-events:none}
#castle-adventure-ui .entry-progress{display:flex;gap:.46cqw;margin:.6cqw 0 0}
#castle-adventure-ui .entry-progress i{width:3.9cqw;height:.62cqw;min-height:4px;border:1px solid #ab854e;border-radius:12px;background:#dcb88979}
#castle-adventure-ui .entry-progress i.filled{background:linear-gradient(#bd92af,#946784);border-color:#906683}
#castle-adventure-ui .entry-mark{font:600 1.6cqw Georgia;color:#826641}
#castle-adventure-ui .chronicle .right{display:grid;grid-template-rows:auto minmax(0,1fr) auto auto auto auto auto;align-content:stretch;justify-items:center;row-gap:.45cqw;padding:7.8% 12.5% 8.4% 7.3%;text-align:center}
#castle-adventure-ui .chronicle .book-zone-title{margin:0;color:#613a29;font:normal clamp(24px,3.62cqw,47px)/1.08 Georgia,serif;letter-spacing:-.035em;text-wrap:balance}
#castle-adventure-ui .chronicle .book-art{width:100%;height:100%;min-height:0;position:relative;isolation:isolate;mix-blend-mode:multiply}
#castle-adventure-ui .chronicle .book-art img{position:absolute;display:block;inset:0;width:100%;height:100%;object-fit:contain}
#castle-adventure-ui .chronicle .book-description{font:italic clamp(13px,1.45cqw,20px)/1.19 Georgia,serif;margin:0;min-height:0;color:#684631;text-wrap:balance}
#castle-adventure-ui .chronicle .book-level{font:normal clamp(12px,1.12cqw,16px)/1.12 Georgia,serif;margin:.32cqw 0 0;color:#73533a}
#castle-adventure-ui .chronicle .book-tiers{width:100%;display:flex;justify-content:center;gap:1.15cqw;margin:.45cqw 0}
#castle-adventure-ui .chronicle .book-tier{display:grid;justify-items:center;flex:1;max-width:9.3cqw;min-width:0;gap:.1cqw;padding:.45cqw .35cqw;background:#ebcba063;border:1px solid #c49c6b;border-radius:29% 29% 14% 14%/32% 32% 16% 16%;font:normal 1.65cqw/1.07 Georgia,serif}
#castle-adventure-ui .chronicle .book-tier b{font-size:2.08cqw;font-weight:500}
#castle-adventure-ui .chronicle .book-tier[data-status=next]{border:2px solid #b8863d;background:#ffdfa36b;box-shadow:0 0 5px #bd94545c}
#castle-adventure-ui .chronicle .book-tier[data-status=owned]{border-color:#a08353;background:#e0ca87a3}
#castle-adventure-ui .chronicle .book-tier span,#castle-adventure-ui .chronicle .book-wallet,#castle-adventure-ui .chronicle .chronicle-buy{display:flex;align-items:center;justify-content:center;gap:.48cqw}
#castle-adventure-ui .chronicle .book-tier img,#castle-adventure-ui .chronicle .book-wallet img,#castle-adventure-ui .chronicle .chronicle-buy img{width:1.55cqw;height:1.55cqw;object-fit:contain}
#castle-adventure-ui .chronicle .book-wallet{font:normal clamp(13px,1.48cqw,20px)/1.25 Georgia,serif}
#castle-adventure-ui .chronicle .book-wallet-value{font-weight:600}
#castle-adventure-ui .chronicle .book-order{display:grid;justify-items:center;align-content:start;gap:.32cqw;min-height:4.8cqw;width:100%}
#castle-adventure-ui .chronicle .chronicle-buy{min-height:3.55cqw;max-width:100%;padding:.48cqw 2.35cqw;margin:0;border:1.5px solid #a47d39;border-radius:18% 5% 17% 5%/24% 36% 24% 36%;background:linear-gradient(125deg,#795071,#65425f 70%,#795174);color:#fff0c9;box-shadow:inset 0 0 0 2px #e1bd7344;font:normal clamp(15px,1.88cqw,24px)/1.16 Georgia,serif}
#castle-adventure-ui .chronicle .chronicle-buy:disabled{background:#998879;color:#fff6dc;cursor:default}
#castle-adventure-ui .chronicle .chronicle-buy[hidden]{display:none!important}
#castle-adventure-ui .chronicle .book-feedback{min-height:1em;font:normal clamp(12px,1.04cqw,15px)/1.1 Georgia,serif;color:#75462d}
#castle-adventure-ui .chronicle .book-feedback.complete{font:italic 2.1cqw/1.5 Georgia,serif;color:#6e4d72}
#castle-adventure-ui .chronicle .book-close{position:absolute;right:1.8%;top:2.5%;min-width:34px;min-height:34px;width:3.9cqw;height:3.7cqw;display:grid;place-items:center;border:1px solid #af864f;border-radius:30% 16% 25% 12%;background:#f5e2bc;color:#65412e;font:normal clamp(22px,3.1cqw,39px)/1 Georgia,serif;box-shadow:0 1px 4px #8f633d33;padding:0}
@media(max-width:650px) and (orientation:portrait){
 #castle-adventure-ui .home-book-shade[open]{display:block;padding:max(8px,env(safe-area-inset-top)) 7px max(8px,env(safe-area-inset-bottom));overflow:auto}
 #castle-adventure-ui .chronicle{width:100%;height:auto;min-height:calc(100dvh - 16px);display:block;aspect-ratio:auto;border-radius:12px;background-color:#f8e7c6;background-size:200% 100%;background-position:left}
 #castle-adventure-ui .chronicle .left{padding:20px 24px 9px 22px}
 #castle-adventure-ui .chronicle .book-heading{font-size:clamp(24px,7cqw,31px);margin:0 21px 12px 0}
 #castle-adventure-ui .chronicle .book-chapters{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
 #castle-adventure-ui .chronicle .chronicle-chapter{height:47px;font-size:clamp(13px,3.65cqw,16px);grid-template-columns:26% 1fr 6%;padding:2px 4px;gap:2%}
 #castle-adventure-ui .chronicle .chronicle-chapter img{height:38px}
 #castle-adventure-ui .chronicle .entry-progress i{width:14px;height:4px}
 #castle-adventure-ui .chronicle .entry-mark{font-size:13px}
 #castle-adventure-ui .chronicle .right{margin:8px 0 0;padding:14px 24px 25px;grid-template-rows:auto minmax(115px,22dvh) auto auto auto auto auto;gap:6px;border-top:1px solid #c49e65;background:linear-gradient(180deg,#c29a6344,transparent 8px)}
 #castle-adventure-ui .chronicle .book-zone-title{font-size:23px}
 #castle-adventure-ui .chronicle .book-description{font-size:15px}
 #castle-adventure-ui .chronicle .book-level,#castle-adventure-ui .chronicle .book-wallet,#castle-adventure-ui .chronicle .book-feedback{font-size:14px}
 #castle-adventure-ui .chronicle .book-tier{max-width:77px;font-size:14px;padding:5px 3px}
 #castle-adventure-ui .chronicle .book-tier b{font-size:17px}
 #castle-adventure-ui .chronicle .book-tier img,#castle-adventure-ui .chronicle .book-wallet img,#castle-adventure-ui .chronicle .chronicle-buy img{width:16px;height:16px}
 #castle-adventure-ui .chronicle .chronicle-buy{font-size:17px;min-height:44px;padding:5px 20px}
 #castle-adventure-ui .chronicle .book-feedback.complete{font-size:18px}
 #castle-adventure-ui .chronicle .book-close{min-width:42px;min-height:42px;top:4px;right:4px}
}
@media(max-height:520px) and (orientation:landscape){
 #castle-adventure-ui .home-book-shade[open]{display:block;overflow:auto;padding:3px 5px}
 #castle-adventure-ui .chronicle{width:100%;min-height:355px;height:calc(100dvh - 6px);aspect-ratio:auto}
 #castle-adventure-ui .chronicle .left{padding:10px 7% 12px 9%}
 #castle-adventure-ui .chronicle .right{padding:12px 11% 9px 7%;row-gap:2px}
 #castle-adventure-ui .chronicle .book-heading{font-size:24px;margin-bottom:6px}
 #castle-adventure-ui .chronicle .book-chapters{gap:4px}
 #castle-adventure-ui .chronicle .chronicle-chapter{height:clamp(38px,10.7vh,48px);font-size:16px}
 #castle-adventure-ui .chronicle .chronicle-chapter img{height:34px}
 #castle-adventure-ui .chronicle .book-zone-title{font-size:22px}
 #castle-adventure-ui .chronicle .book-tier{padding:2px;font-size:14px}
 #castle-adventure-ui .chronicle .book-tier b{font-size:17px}
 #castle-adventure-ui .chronicle .chronicle-buy{min-height:36px}
}
@media(prefers-reduced-motion:reduce){#castle-adventure-ui .chronicle{animation:none}}

    </style>
    <div class="home-decor" aria-hidden="true"></div><button class="room-cat" type="button" aria-label="Котик"></button><div class="room-finished" role="status"></div>
    <button type="button" class="home-chest chest-icon" aria-label="Волшебный сундук" aria-controls="castle-menu-note" aria-haspopup="dialog"></button>
    <button class="castle-btn castle-circle castle-back room-icon" data-coh-action="home" title="Назад" aria-label="Назад"></button>
    ${window.__castleVisuals.balance}
    <button class="castle-btn castle-circle castle-settings room-icon" data-coh-action="gear" aria-label="Настройки"></button>
    <button class="castle-btn home-rest-chip room-icon" data-coh-action="hourglass"><span class="rest-chip-title">Отдых</span><small class="rest-chip-time"></small></button>
    <button class="castle-btn home-sword-chip room-icon" data-coh-action="doors" title="К четырём дверям" aria-label="К четырём дверям"><span class="sword-caption">К дверям</span></button>
    <button class="castle-btn home-book-chip room-icon" data-coh-action="book" title="Книга восстановления" aria-label="Книга восстановления"></button>
    <dialog class="leave-rest"><p></p><button type="button" class="stay-rest"></button><button type="button" class="end-rest"></button></dialog><section class="castle-parchment home-rest-panel" hidden><h2 class="rest-heading">Время отдохнуть</h2>
      <div class="rest-clock">10:00</div><div class="rest-presets">
        <button data-minutes="5">5</button><button data-minutes="10" class="selected">10</button>
        <button data-minutes="15">15</button><button data-minutes="30">30</button></div>
      <div class="rest-custom"><label for="castle-rest-minutes" class="rest-custom-label">Минуты:</label>
        <input id="castle-rest-minutes" type="number" min="1" max="240" value="10"></div>
      <div class="rest-actions"><button class="castle-btn rest-start">▶ Начать</button>
        <button class="castle-btn rest-pause" data-coh-action="pause" data-compact hidden>Ⅱ</button><button class="castle-btn rest-stop" data-coh-action="stop" data-compact>■</button></div></section>
    <dialog class="home-book-shade" aria-labelledby="chronicle-title" hidden>
      <div class="home-book chronicle">
        <section class="home-page left">
          <h2 class="book-heading" id="chronicle-title">Книга восстановления</h2>
          <div class="book-chapters"></div>
        </section>
        <section class="home-page right">
          <h2 class="book-zone-title"></h2>
          <div class="book-art"></div>
          <p class="book-description"></p>
          <p class="book-level"></p>
          <div class="book-tiers"></div>
          <div class="book-wallet"><span class="book-wallet-label"></span> <b class="book-wallet-value"></b><img alt=""></div>
          <div class="book-order"><button class="chronicle-buy" type="button"><span class="book-purchase-caption"></span><img alt=""></button>
            <span class="book-feedback" role="status"></span></div>
        </section>
        <button class="book-close" type="button" aria-label="Закрыть книгу">×</button>
      </div>
    </dialog>

    <div class="castle-sparkles"></div>
    <div class="castle-modal-shade rest-finished" hidden><div class="castle-parchment castle-modal">
      <h2 class="rest-finished-title"></h2><p class="rest-finished-text"></p>
      <button class="castle-btn rest-finished-ok"></button></div></div>`;
    document.body.appendChild(root);
    ui={root,scene,pendingScene:null,lang:null,selected:0,lastDecor:''};
    window.__castleCatHome=ui;
    const q=s=>root.querySelector(s);
    window.CastleMini?.add(q('.home-rest-panel'),{
      read:()=>core.miniRead('rest',Math.max(0,Math.min(240,Number(q('#castle-rest-minutes').value)||0))),
      change:(key,paused)=>core.miniChange('rest',key,paused),refresh:()=>ui.update()});
    q('.castle-back').addEventListener('click',()=>core.requestScene(ui,'Главное меню'));
    q('.home-sword-chip').addEventListener('click',()=>{
      if(!core.canNavigate(ui))return;
      const d=core.checkRest();
      if(d.rest&&!d.rest.finished){
        const ask=q('.leave-rest');
        ask.querySelector('p').textContent=core.tr('Завершить отдых и перейти к дверям?','End your break and go to the doors?');
        q('.stay-rest').textContent=core.tr('Остаться','Stay');q('.end-rest').textContent=core.tr('К дверям','Go to the doors');
        ask.dataset.interval=core.miniRead('rest').key;ask.showModal();q('.stay-rest').focus();return;
      }
      core.requestScene(ui,'Волшебные двери');
    });
    q('.stay-rest').onclick=()=>q('.leave-rest').close();
    q('.end-rest').onclick=()=>{
      if(!q('.leave-rest').open || !core.requestScene(ui,'Волшебные двери'))return;
      core.stopRest(q('.leave-rest').dataset.interval);q('.leave-rest').close();
    };
    q('.castle-settings').addEventListener('click',core.openSettings);
    q('.home-rest-chip').addEventListener('click',()=>{
      q('.home-rest-panel').hidden=!q('.home-rest-panel').hidden;
      ui.book.close();
    });
    q('.rest-finished-ok').addEventListener('click',()=>{
      core.stopRest(q('.rest-finished').dataset.interval,true);q('.rest-finished').hidden=true;ui.update();
    });
    q('.rest-presets').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      q('#castle-rest-minutes').value=b.dataset.minutes;
      q('.rest-presets').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));
      if(!core.read().rest)q('.rest-clock').textContent=core.fmt(+b.dataset.minutes*60);
    }));
    q('#castle-rest-minutes').addEventListener('input',()=>{
      q('.rest-presets').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x.dataset.minutes===q('#castle-rest-minutes').value));
      if(!core.read().rest)q('.rest-clock').textContent=core.fmt((+q('#castle-rest-minutes').value||0)*60);
    });
    q('.rest-start').addEventListener('click',()=>{
      const minutes=Number(q('#castle-rest-minutes').value);
      if(!Number.isInteger(minutes)||minutes<1||minutes>240){q('#castle-rest-minutes').focus();return}
      const d=core.read();if(d.rest&&!d.rest.finished)return;
      d.rest={minutes,miniKey:"rest/"+(window.crypto?.randomUUID?.()||String(Date.now())+"/"+Math.random().toString(36).slice(2)),running:true,remaining:minutes*60,endAt:Date.now()+minutes*60000,finished:false};
      core.save(d);window.CastleClockSignals.started();ui.update();
    });
    q('.rest-pause').addEventListener('click',()=>{
      const d=core.checkRest(),r=d.rest;if(!r||r.finished)return;
      core.miniChange('rest',core.miniRead('rest').key,r.running);ui.update();
    });
    q('.rest-stop').addEventListener('click',()=>{
      core.stopRest();q('.rest-finished').hidden=true;ui.update();
    });
    const assets={"base": ["Warm Beige Autumnal Room with Golden Light.png", 0, 0, 1280, 720], "walls": ["Room_walls.png", 0, 0, 1280, 720], "4_0": ["Room_4_0.png", -42, 506, 315, 258], "0_1": ["Room_0_1.png", 841, 259, 220, 174], "1_1": ["Room_1_1.png", 638, 53, 642, 447], "3_1": ["Room_3_1.png", 92, 0, 463, 416], "4_1": ["Room_4_1.png", 0, 464, 405, 256], "0_2": ["Room_0_2.png", 787, 97, 322, 393], "1_2": ["Room_1_2.png", 638, 53, 642, 447], "3_2": ["Room_3_2.png", 92, 0, 463, 480], "4_2": ["Room_4_2.png", 0, 464, 501, 256], "0_3": ["Room_0_3.png", 787, 97, 322, 393], "1_3": ["Room_1_3.png", 638, 53, 642, 447], "3_3": ["Room_3_3.png", 92, 0, 463, 480], "4_3": ["Room_4_3.png", 0, 464, 501, 256]};
    const files=new Map(scene.getGame().getGameData().resources.resources.map(r=>[r.name,r.file]));
    const url=n=>files.get(n)||n;
    q('.home-chest').style.setProperty('--chest-art',window.__castleVisuals.cssUrl('Menu_Chest.png'));
    const chest=window.CastleRoomNote(root,scene,'.home-chest','chest',core.lang,()=>!!ui.pendingScene);
    ui.book=window.CastleBindRestorationBook(ui,core,url);
    ui.resident=window.CastleBindCompanion(ui,core,url);
    ui.guestRoom=window.__castleBindGuestRoom(ui,core,url,ui.resident);
    ui.dispose=()=>{ui.guestRoom.dispose();ui.resident.dispose();ui.book.dispose();};
    const decor=q('.home-decor');
    const layer=(id,key,opacity=1,transform=false)=>{
      const [file,x,y,w,h]=assets[key];
      let img=decor.querySelector('[data-layer="'+id+'"]');
      if(!img){img=document.createElement('img');img.dataset.layer=id;img.alt='';decor.append(img)}
      if(img.dataset.file!==file){
        img.dataset.file=file;img.src=url(file);Object.assign(img.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
        img.classList.remove('transforming');if(transform){void img.offsetWidth;img.classList.add('transforming')}
      }
      img.style.opacity=opacity;
      img.hidden=true;ui.resident.paintRoom(id,key,assets[key],opacity,transform);
    };
    ui.updateDecor=()=>{
      const lv=core.read().upgrades, fingerprint=lv.join(',');
      if(ui.lastDecor===fingerprint)return;ui.lastDecor=fingerprint;
      const total=lv.reduce((a,b)=>a+b,0);
      layer('original','base');layer('walls','walls',total/15);
      for(const [i,level] of lv.entries()){
        const k=i+'_'+level;
        if(assets[k])layer('zone'+i,k,1,ui.changedZone===i);
      }
      ui.resident.setLevel(lv[2]);
      decor.querySelectorAll('i').forEach(el=>el.remove());
      const detail=(x,y,cls,text='')=>{const el=document.createElement('i');el.className=cls;el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';decor.append(el)};
      if(lv[0])detail(944,358,'room-flame');
      if(ui.changedZone===0 && lv[0]===1)detail(942,360,'kindle','✧');
      if(lv[0]===3)detail(949,352,'room-mote','✧');
      if(lv[1]===3)detail(1171,282,'room-mote','✧');
      if(lv[3]){
        detail(318,258,'room-mote garden','🦋');
        detail(290,196,'garden-rays');
        const foliage=decor.querySelector('[data-layer="zone3"]').cloneNode();
        foliage.hidden=false;foliage.removeAttribute('data-layer');foliage.className='garden-leaves';foliage.setAttribute('data-foliage','');decor.querySelector('[data-foliage]')?.remove();decor.append(foliage);
      }
      if(lv[4]===3)detail(182,555,'room-mote','· ✦');
      ui.changedZone=null;
    };

    ui.renderLanguage=()=>{
      const en=core.lang()==='en';
      q('.room-cat').setAttribute('aria-label',en?'Pet the cat':'Погладить котика');
      window.__castleVisuals.label(q('.castle-back'),en?'Main menu':'В главное меню');
      window.__castleVisuals.label(q('.rest-stop'),en?'End break':'Завершить отдых');
      window.__castleVisuals.label(q('.home-rest-chip'),en?'Rest timer':'Таймер отдыха');

      q('.castle-settings').setAttribute('aria-label',en?'Settings':'Настройки');
      q('.rest-chip-title').textContent=en?'Rest':'Отдых';
      q('.sword-caption').textContent=en?'Doors':'К дверям';
      q('.home-sword-chip').title=en?'To the four doors':'К четырём дверям';
      q('.home-sword-chip').setAttribute('aria-label',q('.home-sword-chip').title);
      q('.rest-heading').textContent=en?'Time to rest':'Время отдохнуть';
      q('.rest-custom-label').textContent=en?'Minutes:':'Минуты:';
      q('.rest-start').innerHTML=window.__castleVisuals.token('play')+(en?' Start':' Начать');
      q('.home-book-chip').title=en?'Restoration book':'Книга восстановления';
      q('.home-book-chip').setAttribute('aria-label',q('.home-book-chip').title);
      chest.labels();ui.guestRoom.album.language();ui.book.render(true);ui.update();
    };
    ui.update=()=>{
      const d=core.checkRest(),r=d.rest;ui.guestRest=r;ui.guestLevels=d.upgrades;
      window.__castleVisuals.wallet(q('.castle-balance'),d.coins,core.lang()==='en');
      const remaining=r?core.currentSeconds(r):(+q('#castle-rest-minutes').value||10)*60;
      q('.rest-clock').textContent=core.fmt(remaining);
      q('.rest-chip-time').textContent=r&&!r.finished?core.fmt(remaining):'';
      q('.rest-pause').hidden=!r||r.running||r.finished;q('.rest-pause').disabled=q('.rest-pause').hidden;
      if(!q('.rest-pause').hidden){q('.rest-pause').dataset.cohAction='play';window.__castleVisuals.label(q('.rest-pause'),core.tr('Продолжить отдых','Resume break'));}
      q('.rest-pause').textContent=r&&!r.running?'▶':'Ⅱ';
      q('.rest-start').disabled=!!(r&&!r.finished);
      if(r&&r.finished){q('.rest-finished').dataset.interval=core.miniRead('rest').key;q('.rest-finished').hidden=false;
        if(!ui.restFinishedAt)ui.restFinishedAt=Date.now();
        if(window.CastleMini?.away)ui.restFinishedAt=0;
        else if(Date.now()-ui.restFinishedAt>3500){const fresh=core.read();if(fresh.rest?.finished)core.stopRest();q('.rest-finished').hidden=true;ui.restFinishedAt=0;}

        q('.rest-finished-title').textContent=core.tr('Отдых окончен! 🐱','Rest is over! 🐱');
        q('.rest-finished-text').textContent=core.tr('Котик проснулся. Замок ждёт новых приключений!','The cat is awake. The castle awaits!');
        q('.rest-finished-ok').textContent=core.tr('Продолжить','Continue');
      }
      ui.updateDecor();ui.resident.context(d);ui.book.render();
    };
  }
  if(ui.pendingScene){core.switchIfPending(ui,scene,'__castleCatHome');return;}
  core.align(ui.root);
  if(ui.lang!==core.lang()){ui.lang=core.lang();ui.renderLanguage()}
  if(!ui.lastTick||Date.now()-ui.lastTick>180){ui.lastTick=Date.now();ui.update()}
  ui.guestRoom.tick(ui.guestRest,ui.guestLevels,['WakingUp','Stretching'].includes(ui.resident.state));
  ui.resident.frame(performance.now());


})();
};
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb05438 = function GDJSInlineCode(runtimeScene) {
if(window.__castleResetScene===runtimeScene){
  window.__castleCatHome?.guestRoom?.dispose();
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
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.eventsList0 = function(runtimeScene) {

{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb25c10(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb67208(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0x8c5530(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb638e8(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb5a8b8(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbd2a48(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbcef28(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbb5060(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xbd5970(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb71020(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xaff6a0(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb04ec0(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb047d8(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb25e40(runtimeScene);

}


{


gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.userFunc0xb05438(runtimeScene);

}


};

gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDBackgroundObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDHomeKittenObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatBedBackObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatBedFrontObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatRoomPaintingObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDHomePetEyesObjects1.length = 0;

gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.eventsList0(runtimeScene);
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDBackgroundObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDHomeKittenObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatBedBackObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatBedFrontObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDCatRoomPaintingObjects1.length = 0;
gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code.GDHomePetEyesObjects1.length = 0;


return;

}

gdjs['_1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code'] = gdjs._1050_1086_1084_1085_1072_1090_1072_32_1082_1086_1090_1080_1082_1072Code;
