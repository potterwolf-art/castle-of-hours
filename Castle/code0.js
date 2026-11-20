gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code = {};
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.localVariables = [];
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.idToCallbackMap = new Map();
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.GDMenuBackgroundObjects1= [];


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c5338 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c5438 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb638e8 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c4e18 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c4da0 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8f3990 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xbb5060 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb5a8b8 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xbd72e8 = function GDJSInlineCode(runtimeScene) {
// Castle of Hours — bilingual main menu with reliable click navigation.
// Transparent interactive hotspots align with the illustrated menu buttons.
(function () {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const scene = runtimeScene;
  if(window.__castleScreenFade?.pending?.from==='Главное меню') return;
  let ui = window.__cozyMainMenu;
  if (!ui || ui.scene !== scene || !ui.root || !ui.root.isConnected) {
    if (ui && ui.root) ui.root.remove();
    const root = document.createElement('div');
    root.id = 'cozy-main-menu';
    root.innerHTML = `
      <style>
        
        #cozy-main-menu {position:fixed;width:1280px;height:720px;z-index:2147482000;pointer-events:none;
          font-family:'Castle Garamond',Georgia,serif; color:#442414;isolation:isolate;}
        #cozy-main-menu * {box-sizing:border-box;}
        /* The watercolor background is the entire design: no wood plates or outlines. */
        #cozy-main-menu .title{display:none}
        #cozy-main-menu .mode{position:absolute;left:480px;width:420px;height:114px;
          border:0;background:transparent;color:#f9e9d0;text-align:left;cursor:pointer;
          pointer-events:auto;font:inherit;border-radius:16px;outline:none!important;
          text-shadow:0 1px 4px #25191a,0 0 10px #40271c66;
          transition:filter .32s ease,text-shadow .32s ease,opacity .32s ease;}
        #cozy-main-menu .mode:hover,#cozy-main-menu .mode:focus-visible{
          outline:none!important;filter:brightness(1.055);
          text-shadow:0 1px 4px #25191a,0 0 14px #ffd99b77,0 0 25px #ffc87640;}
        #cozy-main-menu .mode:active{filter:brightness(1.10)}
        #cozy-main-menu .doors{top:272px}#cozy-main-menu .pomodoro{top:398px}
        #cozy-main-menu .mode-label{position:absolute;left:38px;top:9px;width:360px;
          font-size:42px;line-height:1.08;font-weight:700;white-space:nowrap;}
        #cozy-main-menu .mode-description{position:absolute;left:40px;top:62px;width:360px;
          font-size:22px;line-height:1.05;font-weight:600;white-space:pre-line;color:#f0dcc3;}
        #cozy-main-menu .mode[data-lang='en'] .mode-label{font-size:39px}
        #cozy-main-menu .mode[data-lang='en'] .mode-description{font-size:20px}
        #cozy-main-menu .menu-icon{position:absolute;top:578px;width:72px;height:67px;
          border:0;background:transparent;pointer-events:auto;cursor:pointer;border-radius:50%;
          color:#f7e8ca;text-shadow:0 0 8px #3d291b77;font-size:43px;
          transition:filter .3s ease,text-shadow .3s ease;outline:none!important}
        #cozy-main-menu .menu-icon:hover,#cozy-main-menu .menu-icon:focus-visible{
          outline:none!important;filter:brightness(1.055);text-shadow:0 0 13px #ffdfab85;}
        #cozy-main-menu .settings-icon{left:590px}#cozy-main-menu .heart-icon{left:690px}
        #cozy-main-menu .settings-icon::before{content:'⚙'}
        #cozy-main-menu .heart-icon::before{content:'♥'}
        #cozy-main-menu .toast {position:absolute;left:445px;top:652px;width:430px;
          text-align:center;font-size:23px;color:#ffe9b8;text-shadow:0 2px 5px #281409;
          opacity:0;transition:opacity .2s;pointer-events:none;}
        #cozy-main-menu .toast.show {opacity:1;}
        #cozy-main-menu .home-caption{position:absolute;left:670px;top:650px;width:125px;
          text-align:center;font-size:22px;color:#ffedc7;text-shadow:0 2px 4px #30150e;}
      #cozy-main-menu .mode{left:409px;width:524px;height:126px}
#cozy-main-menu .doors{top:246px}#cozy-main-menu .pomodoro{top:395px}
#cozy-main-menu .mode[data-lang=ru] span,#cozy-main-menu .heart-icon,#cozy-main-menu .home-caption{display:none}

#cozy-main-menu .mode[data-lang=en] span{left:168px;width:302px;text-align:center}
#cozy-main-menu .settings-icon{left:598px;top:553px;width:62px;height:62px}
#cozy-main-menu .settings-icon::before{content:none}
#cozy-main-menu .settings-icon:is(:hover,:focus-visible){box-shadow:0 0 12px 2px #ffd5888c,inset 0 0 7px #ffcc7777}
#cozy-main-menu button:hover,#cozy-main-menu button:focus-visible{box-shadow:inset 0 0 13px #ffdf9b99}
#cozy-main-menu .menu-rug{position:absolute;left:41.986%;top:75.239%;width:21.89%;height:12.01%;background: center/100% 100% no-repeat;pointer-events:none}
#cozy-main-menu .menu-tools{position:absolute;top:75.666%;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16.8px}
#cozy-main-menu .menu-tools::before,#cozy-main-menu .menu-tools::after{content:'';position:absolute;pointer-events:none;width:48px;height:34.5px;top:23px;background:var(--menu-sprig) center/100% 100% no-repeat}
#cozy-main-menu .menu-tools::before{right:calc(100% - 12px)}#cozy-main-menu .menu-tools::after{left:calc(100% - 12px);transform:scaleX(-1)}
#cozy-main-menu .menu-tools .menu-icon{display:block;position:relative;inset:auto;width:79.6px;height:78px;padding:0;border:0;border-radius:50%;box-shadow:none;background:transparent center/100% 100% no-repeat;touch-action:manipulation;transition:filter .19s ease,transform .13s ease}
#cozy-main-menu .menu-tools .menu-icon::before{display:none}
#cozy-main-menu .menu-tools .menu-icon:is(:hover,:focus-visible){filter:brightness(1.10) drop-shadow(0 0 4px #ffd58c98);box-shadow:none}
#cozy-main-menu .menu-tools .menu-icon:focus-visible{outline:2px solid #ffdf97!important;outline-offset:0}
#cozy-main-menu .menu-tools .menu-icon:active{transform:scale(.965)}
dialog.castle-quit{position:fixed;inset:0;margin:auto;pointer-events:auto;box-sizing:border-box;width:min(405px,calc(100vw - 28px));max-height:calc(100dvh - 24px);overflow:auto;padding:31px 28px 24px;border:1px solid #a47544;border-radius:13px 17px 14px 16px;color:#55341f;text-align:center;background:radial-gradient(ellipse at 40% 25%,#fff4d8,#f1dbaf 75%,#dcc295);box-shadow:inset 0 0 0 3px #ecd2a8,inset 0 0 0 4px #b68b5875,0 11px 35px #25120970;font:20px/1.25 'Castle Garamond',Georgia,serif}
dialog.castle-quit::backdrop{background:rgba(43,26,17,.52)}dialog.castle-quit h2{margin:0 8px;font:600 34px/1.15 'Castle Garamond',Georgia,serif}dialog.castle-quit p{margin:13px 0 21px}
dialog.castle-quit .quit-actions{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}
dialog.castle-quit button{font:600 18px/1.2 'Castle Garamond',Georgia,serif;color:#624027;cursor:pointer}
dialog.castle-quit .quit-actions button{padding:10px 16px 13px;background:var(--paper-strip) center/100% 100% no-repeat;border:0}
dialog.castle-quit .quit-cross{position:absolute;top:6px;right:7px;border:0;width:34px;height:34px;background:transparent;font-size:26px;font-weight:400}
dialog.castle-quit button:focus-visible{outline:2px solid #956f45;outline-offset:1px;border-radius:5px}

</style>
      <div class="title">Castle of Hours</div>
      <button class="mode doors" type="button" aria-label="Волшебные двери">
        <span class="mode-label"></span><span class="mode-description"></span></button>
      <button class="mode pomodoro" type="button" aria-label="Помодоро">
        <span class="mode-label"></span><span class="mode-description"></span></button>
      <div class="menu-rug" aria-hidden="true"></div>
      <div class="menu-tools"><button class="menu-icon settings-icon" type="button" aria-label="Настройки"></button>
      <button class="menu-icon heart-icon" type="button" aria-label="Поддержать проект" aria-haspopup="dialog" aria-controls="castle-menu-note"></button>
      <button class="menu-icon quit-icon" type="button" aria-label="Выход из игры"></button></div>
      
      <dialog class="castle-quit" aria-labelledby="castle-quit-title" aria-describedby="castle-quit-message">
        <button class="quit-cross" type="button" aria-label="Закрыть">×</button><h2 id="castle-quit-title"></h2>
        <p id="castle-quit-message" aria-live="polite"></p><div class="quit-actions"><button class="stay" type="button"></button><button class="leave" type="button"></button></div></dialog>
      <div class="toast" aria-live="polite"></div><div class="home-caption"></div>`;
    document.body.appendChild(root);
    ui = {scene,root,language:null};
    window.__cozyMainMenu = ui;
    // Robust navigation: use both actual DOM buttons and a canvas-coordinate
    // fallback for GDevelop preview windows where transparent HTML overlays
    // sometimes do not receive the pointer event.
    // DOM events fire between GDevelop frames. Queue the requested scene and
    // perform replaceScene INSIDE the per-frame JavaScript event below.
    const toScene = (name) => {
      if (ui.navigating || ui.note?.open || !root.isConnected) return;
      ui.navigating = true;
      ui.pendingScene = name;
    };
    ui.captureNavigation = event => {
      if (ui.quitOpen || ui.note?.open || ui.navigating || !root.isConnected) return;
      const settings = window.__theCozyTimeSettings;
      if (settings && settings.root && settings.root.classList.contains('cozy-open')) return;
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const r = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = (event.clientX - r.left) * 1280 / r.width;
      const y = (event.clientY - r.top) * 720 / r.height;
      if (x < 409 || x > 933) return;
      let target = null;
      if (y >= 246 && y <= 372) target = 'Комната котика';
      if (y >= 395 && y <= 521) target = 'Помодоро';
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      toScene(target);
    };
    document.addEventListener('pointerdown', ui.captureNavigation, true);
    document.addEventListener('mousedown', ui.captureNavigation, true);
    root.querySelector('.doors').addEventListener('click',() => toScene('Комната котика'));
    root.querySelector('.pomodoro').addEventListener('click',() => toScene('Помодоро'));
    root.querySelector('.settings-icon').addEventListener('click',() => {
      const settings = window.__theCozyTimeSettings;
      if (settings && settings.root) {
        const gear = settings.root.querySelector('.cozy-gear');
        if (gear) gear.click();
      }
    });
    const asset=file=>window.__castleVisuals.cssUrl(file);
    for(const [selector,file] of [['.settings-icon','Menu_Gear.png'],['.heart-icon','Menu_Heart.png'],['.quit-icon','Menu_Exit.png'],['.menu-rug','Menu_Rug.webp']]){
      root.querySelector(selector).style.backgroundImage=asset(file);
    }
    root.style.setProperty('--menu-sprig',asset('Menu_Sprig.png'));
    root.style.setProperty('--note-sprig',asset('Menu_Lavender.png'));
    const quit=root.querySelector('.quit-icon'),dialog=root.querySelector('.castle-quit');
    const ask=dialog.querySelector('p'),stay=dialog.querySelector('.stay'),yes=dialog.querySelector('.leave');
    const cross=dialog.querySelector('.quit-cross'),title=dialog.querySelector('h2');
    const text=(ru,en)=>ui.language==='en'?en:ru;
    const notice=window.CastleRoomNote(root,scene,'.heart-icon','support',()=>ui.language,()=>ui.navigating||ui.quitOpen);
    ui.note=notice.note;
    const noteLabels=notice.labels;
    function setQuitLabels(){
      title.textContent=text('Покинуть замок?','Leave the castle?');
      ask.textContent=text('Вы точно хотите выйти из игры?','Are you sure you want to leave the game?');
      yes.textContent=text('Да, выйти','Yes, leave');stay.textContent=text('Нет, остаться','No, stay');
      cross.setAttribute('aria-label',text('Закрыть','Close'));
      window.__castleVisuals.label(quit,text('Выход из игры','Exit the game'));
      noteLabels();
    }
    ui.setQuitLabels=setQuitLabels;
    function restoreFocus(){if(!dialog.open){ui.quitOpen=false;quit.focus({preventScroll:true});}}
    function closeQuit(){if(!ui.saving&&dialog.open){dialog.close();restoreFocus();}}
    cross.onclick=stay.onclick=closeQuit;
    dialog.addEventListener('cancel',event=>{if(ui.saving)event.preventDefault();});
    dialog.addEventListener('close',restoreFocus);
    dialog.addEventListener('keydown',event=>{
      if(event.key!=='Tab')return;
      const controls=[cross,stay,yes].filter(b=>!b.hidden&&!b.disabled);
      if(!controls.length){event.preventDefault();return;}
      if(event.shiftKey&&document.activeElement===controls[0]){event.preventDefault();controls.at(-1).focus();}
      else if(!event.shiftKey&&document.activeElement===controls.at(-1)){event.preventDefault();controls[0].focus();}
    });
    quit.onclick=()=>{
      if(ui.navigating||ui.quitOpen||ui.note?.open)return;
      ui.quitOpen=true;setQuitLabels();yes.hidden=false;dialog.showModal();stay.focus({preventScroll:true});
    };
    yes.onclick=async()=>{
      if(ui.saving)return;
      ui.saving=true;yes.disabled=stay.disabled=cross.disabled=true;
      try{
        const rules=window.CastleMoonRules;
        const settle=async()=>{
          const raw=JSON.parse(localStorage.getItem(rules.STATE_KEY)||'null');
          if(!raw)return;
          const state=rules.fromSave(raw,Date.now());
          if(state.phase==='STUDY'&&!(await rules.hasLiveOwner(state.owner))&&rules.abandon(state)){
            Object.assign(raw,{phase:state.phase,owner:state.owner,intervalMinutes:state.intervalMinutes,endAt:state.endAt,lastCompanionStop:state.lastCompanionStop,companionStopAt:state.companionStopAt,companionStops:state.companionStops});
            // Old formats also have a running marker. Modern readers and old saves both stay idle.
            if('running' in raw)raw.running=false;
            localStorage.setItem(rules.STATE_KEY,JSON.stringify(raw));
            window.CastleClockSignals.send(rules.STATE_KEY,{id:raw.lastCompanionStop,at:raw.companionStopAt});
          }
        };
        if(navigator.locks?.request)await navigator.locks.request('castleOfHours.moon.write',settle);else await settle();
        const adventure=window.__castleAdventureCore;
        if(adventure.checkSession().session?.status==='active'){
          adventure.stopSession();
          if(adventure.read().session?.status==='active')throw new Error('Adventure save unavailable');
        }
        // Both ledgers commit at each award, upgrade, album opening and interval boundary.
        // Only a desktop renderer with GDevelop's own bridge supports the stop-game request.
        if(scene.getGame().getRenderer().getElectronRemote?.()?.getCurrentWindow()){
          ui.pendingQuit=true;return;
        }
        ask.textContent=text('Вы можете закрыть вкладку браузера. До новых встреч в замке!','You can close this browser tab. Until we meet again in the castle!');
        yes.hidden=true;stay.textContent=text('Остаться в замке','Stay in the castle');
      }catch{
        ask.textContent=text('Не удалось сохранить прогресс. Попробуйте ещё раз.','Progress could not be saved. Please try again.');
      }finally{
        if(!ui.pendingQuit){ui.saving=false;yes.disabled=stay.disabled=cross.disabled=false;stay.focus({preventScroll:true});}
      }
    };

    
  }
  const settings = window.__theCozyTimeSettings;
  let lang = settings && settings.scene === scene ? settings.language : 'ru';
  if (lang !== 'en') lang = 'ru';
  if (ui.language !== lang) {
    ui.language = lang;
    const dict = lang === 'ru' ? {
      doors:'Волшебные двери', doorsDescription:'Случайное время учёбы\nот 15 до 120 минут',
      pomodoro:'Помодоро',pomodoroDescription:'25 минут работы\nи 5 минут отдыха',settings:'Настройки'
    } : {
      doors:'Adventure',doorsDescription:'4 magical doors\n15–120 min of study',
      pomodoro:'Pomodoro',pomodoroDescription:'25 minutes of focus\nand 5 minutes of rest',settings:'Settings'
    };
    for (const [selector,label,description] of [
      ['.doors',dict.doors,dict.doorsDescription],['.pomodoro',dict.pomodoro,dict.pomodoroDescription]
    ]) {
      const button=ui.root.querySelector(selector);
      button.dataset.lang=lang;
      button.setAttribute('aria-label',label);
      button.querySelector('.mode-label').textContent=label;
      button.querySelector('.mode-description').textContent=description;
    }
    ui.root.querySelector('.settings-icon').setAttribute('aria-label',dict.settings);
    ui.root.querySelector('.settings-icon').title=dict.settings;
    ui.root.querySelector('.toast').classList.remove('show');
    ui.root.querySelector('.home-caption').textContent=lang==='en'?'Cat’s room':'К котику';
    ui.setQuitLabels();
  }
  const canvas = document.querySelector('canvas');
  if (canvas) {
    const r=window.__castleVisuals.menuRect(canvas);
    if (r.width>0 && r.height>0) {
      ui.root.style.left=r.left+'px';
      ui.root.style.top=r.top+'px';
      ui.root.style.transformOrigin='top left';
      ui.root.style.setProperty('--menu-finger',(44*1280/r.width)+'px');
      ui.root.style.transform='scale('+(r.width/1280)+','+(r.height/720)+')';
    }
  }
  // Scene changes must be requested during the GDevelop event execution.
  if(ui.pendingQuit){ui.pendingQuit=false;gdjs.evtTools.runtimeScene.stopGame(scene);return;}
  if (ui.pendingScene) {
    const destination = ui.pendingScene;
    ui.pendingScene = null;
    if (ui.captureNavigation) {
      document.removeEventListener('pointerdown', ui.captureNavigation, true);
      document.removeEventListener('mousedown', ui.captureNavigation, true);
    }
    ui.root.remove();
    window.__cozyMainMenu = null;
    const settingsToClose = window.__theCozyTimeSettings;
    if (settingsToClose && settingsToClose.root) {
      if (settingsToClose.onKeyDown) document.removeEventListener('keydown', settingsToClose.onKeyDown);
      settingsToClose.root.remove();
      window.__theCozyTimeSettings = null;
    }
    window.__castleTransitionQueue(scene,destination);
  }
})();
};
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb32f78 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb16598 = function GDJSInlineCode(runtimeScene) {
// Castle of Hours: gentle cat breath, hover purr, fireplace shimmer and small rare sparks.
(function(){
 if(typeof window==='undefined'||typeof document==='undefined')return;
 const scene=runtimeScene, canvas=document.querySelector('canvas');if(!canvas)return;
 if(!document.getElementById('cozy-main-menu')){
   const old=window.__castleMenuFX;
   if(old){old.cleanup();old.fireplace.pause();old.fireplace2.pause();old.root.remove();window.__castleMenuFX=null}
   return;
 }
 let fx=window.__castleMenuFX;
 if(!fx||fx.scene!==scene||!fx.root?.isConnected){
   if(fx){fx.cleanup();fx.fireplace.pause();fx.fireplace2.pause();fx.root.remove()}
   const root=document.createElement('div');root.id='castle-menu-fx';
   const url=name=>scene.getGame().getGameData().resources.resources.find(r=>r.name===name)?.file || name;
   root.dataset.theme='MenuNight';
   const art=url(root.dataset.theme+'.jpg');
   root.style.backgroundImage='url('+JSON.stringify(art)+')';
   root.style.backgroundSize='100% 100%';
   root.style.setProperty('--art','url('+JSON.stringify(art)+')');
   root.innerHTML=`<style>
#castle-menu-fx{position:fixed;width:1280px;height:720px;z-index:2147481900;pointer-events:none;overflow:hidden;isolation:isolate;box-shadow:0 0 0 150vmax #281b1b}
#castle-menu-fx .breath{position:absolute;left:85px;top:382px;width:315px;height:257px;
 background:var(--art) -85px -382px / 1280px 720px no-repeat;
 mask-image:radial-gradient(ellipse at 47% 35%,black 15%,transparent 62%);
 transform-origin:50% 90%;animation:castleBreath 3.6s ease-in-out infinite;}
@keyframes castleBreath{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.011)}}
#castle-menu-fx .fire-glow{position:absolute;left:1030px;top:275px;width:265px;height:240px;border-radius:50%;
 background:radial-gradient(ellipse,#ffc36c40 0%,#fba43c15 48%,transparent 75%);
 mix-blend-mode:screen;animation:castleFireGlow 3.1s ease-in-out infinite alternate}
@keyframes castleFireGlow{from{opacity:.42;transform:scale(.97)}to{opacity:.77;transform:scale(1.025)}}
#castle-menu-fx .spark{position:absolute;width:3px;height:3px;border-radius:50%;background:#ffe6a1;
 box-shadow:0 0 5px #ffc463,0 0 9px #ffbf62;animation:castleSpark var(--dur) ease-out forwards}
@keyframes castleSpark{0%{transform:translate(0,0) scale(.5);opacity:0}16%{opacity:.8}75%{opacity:.48}100%{transform:translate(var(--dx),-70px) scale(.1);opacity:0}}
#castle-menu-fx .cat-hover{position:absolute;pointer-events:auto;cursor:pointer;appearance:none;border:none;padding:0;margin:0;background:transparent;touch-action:manipulation}
#castle-menu-fx .fire-glow::before{content:'';position:absolute;left:68px;top:22px;width:160px;height:129px;background:var(--art) -1098px -297px/1280px 720px;mask-image:radial-gradient(ellipse,black 40%,transparent 70%);transform-origin:55% 95%;animation:flames .83s ease-in-out infinite alternate}
@keyframes flames{to{transform:scale(1.025,1.07) skewX(1.7deg);filter:brightness(1.1)}}
</style><div class="breath"></div><div class="fire-glow"></div><span class="cat-eyes" aria-hidden="true"></span><button class="cat-hover" type="button" aria-label="Погладить котика"></button>`;
   document.body.appendChild(root);
   const pet=window.__castleBindPet(root, root.querySelector('.cat-hover'), root.querySelector('.cat-eyes'), null, {"day":["Cat_eyes_day.png",1672,941,250,429,136,73,14,[88,324,448,412,"0.00% 76.21%,2.68% 61.65%,9.82% 38.35%,17.86% 32.04%,19.64% 19.90%,24.55% 4.85%,29.46% 0.00%,35.27% 5.34%,47.77% 4.85%,59.82% 6.80%,67.86% 0.97%,69.64% 3.40%,66.52% 17.96%,70.54% 30.10%,66.96% 38.35%,62.05% 43.20%,69.20% 47.57%,71.43% 52.43%,65.18% 55.83%,58.93% 62.62%,50.00% 56.80%,30.80% 50.49%,29.46% 63.59%,33.93% 63.59%,34.38% 72.33%,30.80% 76.21%,29.46% 82.52%,35.27% 84.47%,52.23% 84.47%,58.04% 89.81%,65.18% 87.86%,71.43% 84.95%,77.68% 79.61%,90.18% 77.18%,98.21% 80.58%,100.00% 84.95%,89.29% 87.86%,79.02% 91.26%,74.11% 95.15%,59.38% 97.09%,52.68% 100.00%,34.38% 99.51%,26.34% 95.15%,26.34% 87.38%,17.86% 84.95%,11.16% 79.61%"]],"night":["Cat_eyes_night.png",1672,941,224,523,139,83,14,[54,432,478,268,"0.00% 66.42%,2.93% 50.75%,7.53% 40.30%,13.39% 32.84%,14.64% 19.40%,17.99% 17.91%,28.87% 26.87%,38.91% 19.40%,49.79% 13.43%,56.90% 0.00%,59.41% 1.49%,61.92% 22.39%,65.27% 29.10%,69.46% 32.09%,71.55% 41.04%,81.17% 44.03%,90.38% 52.24%,96.65% 65.67%,100.00% 87.31%,96.65% 92.54%,86.61% 95.52%,74.90% 96.27%,67.36% 100.00%,56.07% 98.51%,48.12% 94.78%,38.49% 91.79%,25.10% 90.30%,14.64% 88.06%,7.95% 79.85%"]]}, url);
   pet.setPose('night');
   const fireplace=new Audio(url('Castle_Fireplace_JuliusH_8012.mp3'));
   const fireplace2=new Audio(url('Castle_Fireplace_JuliusH_8012.mp3'));
   fireplace.loop=false;fireplace2.loop=false;fireplace.preload='auto';fireplace2.preload='auto';
   const start=(sound)=>{sound.currentTime=0;sound.volume=0;const pr=sound.play();if(pr?.catch)pr.catch(()=>{})};
   fx={root,scene,pet,purr:pet.audio,fireplace,fireplace2,started:false,switchAt:0,nextSpark:performance.now()+6000,active:fireplace,other:fireplace2};
   window.__castleMenuFX=fx;
   // End-of-track blending: two synchronized 2.5-second overlapping players.
   const crossfade=()=>{
     const old=fx.active,other=fx.other;fx.active=other;fx.other=old;start(other);
     const began=performance.now(),duration=2500;
     const tick=()=>{
       if(!fx.root.isConnected||!fx.audible||fx.active!==other)return;
       const progress=Math.min(1,(performance.now()-began)/duration);
       const v=fx.volume;
       old.volume=v*(1-progress);other.volume=v*progress;
       if(progress<1)requestAnimationFrame(tick);else{old.pause();old.currentTime=0}
     };requestAnimationFrame(tick);
   };
   fx.crossfade=crossfade;
   const retry=()=>{if(root.isConnected && fx.audible && fx.active.paused)fx.active.play().catch(()=>{});};
   root.ownerDocument.addEventListener('click',retry,true);
   root.ownerDocument.addEventListener('keydown',retry,true);
   fx.cleanup=()=>{pet.dispose();document.removeEventListener('click',retry,true);document.removeEventListener('keydown',retry,true);};
 }
 const language=window.__theCozyTimeSettings?.language||'ru';
 if(fx.language!==language){
   fx.language=language;
   fx.root.querySelector('.cat-hover').setAttribute('aria-label',language==='en'?'Pet the cat':'Погладить котика');
   const name=fx.root.dataset.theme+(language==='en'?'English':'')+'.jpg';
   const file=scene.getGame().getGameData().resources.resources.find(r=>r.name===name)?.file||name;
   fx.root.style.backgroundImage='url('+JSON.stringify(file)+')';
   fx.root.style.setProperty('--art',fx.root.style.backgroundImage);
 }
 fx.pet.update();
 const rect=window.__castleVisuals.menuRect(canvas);
 fx.root.style.left=rect.left+'px';fx.root.style.top=rect.top+'px';
 fx.root.style.transformOrigin='top left';
 fx.root.style.transform=`scale(${rect.width/1280},${rect.height/720})`;
 const state=window.__castleMusic?.state;
 fx.audible=state?.enabled!==false&&state?.ambienceEnabled!==false&&(state?.ambience??35)>0;
 fx.volume=fx.audible?Math.min(1,.2*(state?.ambience??35)/35)*((window.__theCozyTimeSettings?.volume??65)/100):0;
 if(fx.other.paused)fx.active.volume=fx.volume;
 if(!fx.audible){if(fx.started){fx.fireplace.pause();fx.fireplace2.pause();fx.started=false;}}
 else if(!fx.started){fx.started=true;fx.active.play().catch(()=>{});}
 const now=performance.now();
 const dur=fx.active.duration;
 if(fx.audible&&Number.isFinite(dur)&&dur>4&&fx.active.currentTime>=dur-2.5&&now>fx.switchAt){fx.switchAt=now+3000;fx.crossfade()}
 if(now>=fx.nextSpark){
   for(let i=0;i<2+Math.floor(Math.random()*2);i++){
     const spark=document.createElement('i');spark.className='spark';
     spark.style.left=(1140+Math.random()*98)+'px';spark.style.top=(378+Math.random()*65)+'px';
     spark.style.setProperty('--dx',(Math.random()*26-13)+'px');
     spark.style.setProperty('--dur',(2.4+Math.random()*.8)+'s');
     fx.root.appendChild(spark);setTimeout(()=>spark.remove(),3600);
   }
   fx.nextSpark=now+5000+Math.random()*3000;
 }
 if(window.__cozyMainMenu?.navigating){fx.fireplace.volume=Math.max(0,fx.fireplace.volume-.01);fx.fireplace2.volume=Math.max(0,fx.fireplace2.volume-.01)}

})();
};
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c5288 = function GDJSInlineCode(runtimeScene) {
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
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.eventsList0 = function(runtimeScene) {

{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c5338(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c5438(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb638e8(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c4e18(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c4da0(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8f3990(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xbb5060(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb5a8b8(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xbd72e8(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb32f78(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0xb16598(runtimeScene);

}


{


gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.userFunc0x8c5288(runtimeScene);

}


};

gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.GDMenuBackgroundObjects1.length = 0;

gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.eventsList0(runtimeScene);
gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code.GDMenuBackgroundObjects1.length = 0;


return;

}

gdjs['_1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code'] = gdjs._1043_1083_1072_1074_1085_1086_1077_32_1084_1077_1085_1102Code;
