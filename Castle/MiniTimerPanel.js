// This view only paints the game snapshot. It never starts or advances an interval.
'use strict';
(() => {
  const view = window.castleMiniPanel;
  const q = s => document.querySelector(s);
  const clock=q('#clock'), phase=q('#phase'), toggle=q('#toggle'), track=q('.track'), fill=q('.fill');
  let current;
  const tip = (b,v) => { b.title=v;b.setAttribute('aria-label',v); };
  function render(s) {
    if (!s) return;
    const en=s.en, rest=s.kind==='rest', paused=s.status==='paused';
    const secs=Math.ceil(Math.max(0,s.left)/1000);
    const value=Math.min(1,Math.max(0,s.status==='done'?1:s.total?1-s.left/s.total:0));
    document.documentElement.lang=en?'en':'ru';
    document.documentElement.dataset.theme=s.theme;
    phase.textContent=rest?(en?'BREAK':'ОТДЫХ'):(en?'STUDY':'УЧЁБА');
    clock.textContent=String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0');
    tip(toggle,paused?(en?'Resume':'Продолжить'):(en?'Pause':'Пауза'));
    tip(q('#restore'),en?'Return to the castle':'Вернуться в замок');
    tip(q('#hide'),en?'Hide mini-timer':'Скрыть мини-таймер');
    q('nav').setAttribute('aria-label',en?'Timer controls':'Управление таймером');
    toggle.disabled=!['running','paused'].includes(s.status);
    toggle.classList.toggle('paused',paused);
    track.setAttribute('aria-label',en?'Interval progress':'Прогресс интервала');
    track.setAttribute('aria-valuenow',String(Math.round(value*100)));
    track.classList.toggle('jump',current?.key!==s.key || s.status!=='running' || current?.status!==s.status);
    fill.style.transform='scaleX('+value+')'; current=s;
  }
  toggle.onclick=()=>{if(current && !toggle.disabled) view.action(current.status==='paused'?'resume':'pause',current.key);};
  q('#restore').onclick=()=>view.action('restore');
  q('#hide').onclick=()=>view.action('hide');
  view.subscribe(render);
})();
