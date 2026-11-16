/* ===== Ferryansa portfolio — optional features =====
   Switch any feature on/off with true/false below.
   The site works fine even if this file is removed. */
(function(){
  'use strict';

  var FEATURES = {
    theme:    true,   // light/dark button in the menu
    typing:   true,   // typing line under the role chips
    countUp:  true,   // numbers count up in About
    reveal:   true,   // sections fade in while scrolling
    filter:   true,   // skill category chips
    progress: true,   // reading-progress bar + back-to-top button + active menu link
    ticker:   false,  // scrolling tech strip under the hero
    petals:   false   // falling sakura petals
  };

  var PHRASES = ['SQL · Python · Airflow · Kibana','Building data pipelines','Turning data into insight','Linux & infrastructure background'];
  var TICKER  = ['PostgreSQL','Apache Airflow','Great Expectations','Elasticsearch','Kibana','Python','SQL','TensorFlow','Linux','Ansible'];

  var $  = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* ---- Theme ---- */
  if(FEATURES.theme){
    var root=document.documentElement, btn=$('#theme');
    var setTheme=function(t){
      root.setAttribute('data-theme',t);
      if(btn) btn.textContent = t==='dark' ? '☀️' : '🌙';
      var m=$('meta[name=theme-color]'); if(m) m.setAttribute('content', t==='dark'?'#1b1833':'#fff6e5');
      try{localStorage.setItem('theme',t)}catch(e){}
    };
    var saved=null; try{saved=localStorage.getItem('theme')}catch(e){}
    if(!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) saved='dark';
    setTheme(saved||'light');
    if(btn) btn.addEventListener('click',function(){ setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'); });
  } else { var tb=$('#theme'); if(tb) tb.style.display='none'; }

  /* ---- Typing ---- */
  var typed=$('#typed');
  if(FEATURES.typing && typed && !reduce){
    var pi=0, ci=0, del=false;
    var tick=function(){
      var p=PHRASES[pi];
      typed.textContent=p.slice(0,ci);
      if(!del && ci<p.length){ci++;setTimeout(tick,70)}
      else if(!del){del=true;setTimeout(tick,1600)}
      else if(ci>0){ci--;setTimeout(tick,35)}
      else{del=false;pi=(pi+1)%PHRASES.length;setTimeout(tick,300)}
    };
    ci=0; tick();
  } else if(!FEATURES.typing){ var tp=$('.typing'); if(tp) tp.style.display='none'; }

  /* ---- Count-up ---- */
  var countUp=function(el){
    var end=+el.getAttribute('data-count'), suf=el.getAttribute('data-suffix')||'', t0=null, dur=1100;
    var step=function(t){
      if(!t0) t0=t;
      var k=Math.min((t-t0)/dur,1); el.textContent=Math.round(end*(1-Math.pow(1-k,3)))+suf;
      if(k<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---- Reveal + count-up on scroll ---- */
  var targets=$$('.head,.stat,.job,.earlier,.proj,.sk-box,.learning,.edu,.certs,.mail');
  if('IntersectionObserver' in window && (FEATURES.reveal || FEATURES.countUp) && !reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        if(FEATURES.countUp){ var n=$('[data-count]',e.target); if(n) countUp(n); }
      });
    },{threshold:.15});
    targets.forEach(function(t){ if(FEATURES.reveal) t.classList.add('reveal'); io.observe(t); });
  }

  /* ---- Skill filter ---- */
  if(FEATURES.filter){
    var boxes=$$('.sk-box'), grid=$('.skill-grid');
    if(grid && boxes.length){
      var bar=document.createElement('div'); bar.className='filters';
      var mk=function(label,cat){
        var b=document.createElement('button'); b.type='button'; b.className='chip'+(cat==='all'?' on':''); b.textContent=label; b.setAttribute('data-f',cat); return b;
      };
      bar.appendChild(mk('All','all'));
      boxes.forEach(function(b){ bar.appendChild(mk($('h3',b).textContent,b.getAttribute('data-cat'))); });
      grid.parentNode.insertBefore(bar,grid);
      bar.addEventListener('click',function(e){
        var c=e.target.closest('.chip'); if(!c) return;
        $$('.chip',bar).forEach(function(x){x.classList.toggle('on',x===c)});
        var f=c.getAttribute('data-f');
        boxes.forEach(function(b){ b.classList.toggle('hide', f!=='all' && b.getAttribute('data-cat')!==f); });
      });
    }
  }

  /* ---- Progress bar, back-to-top, active menu link ---- */
  if(FEATURES.progress){
    var bar2=$('#progress'), top=document.createElement('button');
    top.className='totop'; top.type='button'; top.setAttribute('aria-label','Back to top'); top.textContent='↑';
    top.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
    document.body.appendChild(top);
    var links=$$('.links a'), secs=links.map(function(a){return $(a.getAttribute('href'))});
    var onScroll=function(){
      var h=document.documentElement, max=h.scrollHeight-h.clientHeight;
      if(bar2) bar2.style.width=(max>0?window.scrollY/max*100:0)+'%';
      top.classList.toggle('show',window.scrollY>600);
      var cur=-1; secs.forEach(function(s,i){ if(s && s.getBoundingClientRect().top<=120) cur=i; });
      links.forEach(function(a,i){a.classList.toggle('on',i===cur)});
    };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  } else { var pb=$('#progress'); if(pb) pb.style.display='none'; }

  /* ---- Ticker ---- */
  if(FEATURES.ticker){
    var hero=$('.hero');
    if(hero){
      var w=document.createElement('div'); w.className='mq-wrap'; w.setAttribute('aria-hidden','true');
      var tr=document.createElement('div'); tr.className='mq-track';
      tr.innerHTML=TICKER.concat(TICKER).map(function(t){return '<span>'+t+'</span>'}).join('');
      w.appendChild(tr); hero.parentNode.insertBefore(w,hero.nextSibling);
    }
  }

  /* ---- Falling petals ---- */
  if(FEATURES.petals && !reduce){
    var cv=document.createElement('canvas'); cv.id='petals'; cv.setAttribute('aria-hidden','true'); document.body.appendChild(cv);
    var cx=cv.getContext('2d'), W=0,H=0, ps=[];
    var size=function(){W=cv.width=innerWidth;H=cv.height=innerHeight};
    size(); addEventListener('resize',size);
    var np=function(init){return{x:Math.random()*W,y:init?Math.random()*H:-20,r:4+Math.random()*5,vy:.5+Math.random()*.9,vx:-.3+Math.random()*.6,a:Math.random()*6.28,va:.01+Math.random()*.02}};
    for(var i=0;i<22;i++) ps.push(np(true));
    (function draw(){
      cx.clearRect(0,0,W,H);
      ps.forEach(function(p,i){
        p.y+=p.vy; p.x+=p.vx+Math.sin(p.a)*.4; p.a+=p.va;
        if(p.y>H+20) ps[i]=np(false);
        cx.save(); cx.translate(p.x,p.y); cx.rotate(p.a); cx.fillStyle='rgba(255,143,179,.75)';
        cx.beginPath(); cx.ellipse(0,0,p.r,p.r*.6,0,0,6.28); cx.fill(); cx.restore();
      });
      requestAnimationFrame(draw);
    })();
  }
})();
