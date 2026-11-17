/* ==========================================================
   Ferryansa — Portfolio interactions
   Quick edits:
   - Typing words:       PHRASES
   - Ticker words:       MARQUEE
   - Skills list:        SK  [name, category, subtitle, jump target id or null]
     (skill tiles are not clickable)
   - Cursor / click / touch effects: set CURSOR_FX, CLICK_FX, TOUCH_FX, MASCOT_FX, HAPTIC below
   - Background music: MUSIC_FILE, MUSIC_VOLUME, MUSIC_AUTOPLAY, MUSIC_CREDIT below to true or false
   ========================================================== */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ---------- Cursor & click effect (desktop with mouse only) ---------- */
  var CURSOR_FX = true;   // pink dot + ring that follows the mouse
  var CLICK_FX  = true;   // small sparkle burst on click
  var TOUCH_FX  = true;   // phone/tablet: tap sparkles + tap the mascot to make it jump
  var MASCOT_FX = true;   // click / tap the mascot and it jumps (laptop + phone)
  var HAPTIC    = true;

  /* ---------- Background music ---------- */
  var MUSIC_FILE   = 'bgm.mp3';        // put your mp3 next to index.html (set to '' to remove the music button)
  var MUSIC_AUTOPLAY = true;           // try to start when the page opens (see note in the music code)
  var MUSIC_VOLUME = 0.25;             // 0 (silent) to 1 (full)
  var MUSIC_CREDIT = '';               // e.g. 'Music: "Title" by Artist (Pixabay)'; shown in the footer when set
   // phone/tablet: tiny vibration on tap (Android only; iPhone ignores it)
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  /* ---------- Editable data ---------- */
  var PHRASES = ['Data Analyst','Data Engineer','Data Pipelines','Linux & Infrastructure'];
  var MARQUEE = ['Python','SQL','PostgreSQL','Apache Airflow','Elasticsearch','Kibana','Great Expectations','TensorFlow / Keras','Linux','VMware vSphere','OpenStack','Ansible','Grafana'];

  var WHERE = {
    'p-bike':'Bike Sales Pipeline','p-bird':'Bird Species Classification',
    'j-lion':'PT Lion Super Indo','j-inovasi':'PT Inovasi Informatika','j-kemensos':'Kemensos internship'
  };
  var CAT = {prog:'lav',de:'sky',db:'butter',viz:'pink',ml:'mint',infra:'peach',auto:'aqua'};

  var SK = [
    ['Python','prog','Pandas · scripting','j-inovasi'],['SQL','prog','querying & analysis','p-bike'],['Pandas','prog','data processing','p-bike'],
    ['Statistics','prog','data analysis',null],['Excel / Google Sheets','prog','pivot tables · VLOOKUP',null],['Bash','prog','scripting','j-inovasi'],
    ['Apache Airflow','de','orchestration','p-bike'],['ETL','de','pipelines','p-bike'],['Great Expectations','de','data validation','p-bike'],['Data Quality Assurance','de','accuracy & consistency','j-lion'],
    ['PostgreSQL','db','relational','p-bike'],['Elasticsearch','db','search & indexing','p-bike'],
    ['Kibana','viz','dashboards','p-bike'],['Matplotlib','viz','plotting','p-bird'],['Seaborn','viz','statistical plots','p-bird'],
    ['MobileNetV2','ml','transfer learning','p-bird'],['TensorFlow / Keras','ml','deep learning','p-bird'],['Hugging Face Spaces','ml','model demo','p-bird'],
    ['Linux','infra','RHEL · CentOS · Ubuntu · SUSE','j-inovasi'],['Windows Server & AD','infra','Active Directory','j-lion'],['VMware vSphere','infra','virtualization','j-lion'],['OpenStack','infra','private cloud','j-inovasi'],
    ['Red Hat Satellite','infra','patch & content mgmt','j-inovasi'],['HPE / Dell','infra','servers & SAN','j-lion'],['DNS / DHCP','infra','network services','j-lion'],['Apache / Nginx','infra','web servers','j-inovasi'],
    ['Linux Firewall','infra','security','j-inovasi'],['Email Server','infra','administration','j-inovasi'],['Veeam DRaaS','infra','backup & DR','j-lion'],['SSL/TLS Certificates','infra','renewal & mgmt','j-lion'],['IPAM','infra','IP address mgmt','j-lion'],
    ['Ansible','auto','automation','j-inovasi'],['Patch Management','auto','provisioning','j-inovasi'],['Grafana','auto','monitoring',null],['ELK Stack','auto','log monitoring',null],['Log Analysis','auto','anomaly detection','j-kemensos']
  ];

  /* ---------- Theme (day / night) ---------- */
  var root = document.documentElement;
  function setTheme(t){
    root.setAttribute('data-theme',t);
    $('#themeIcon').textContent = t==='dark' ? '☀️' : '🌙';
    $('meta[name=theme-color]').setAttribute('content', t==='dark'?'#1c1929':'#fff8f1');
    try{localStorage.setItem('theme',t)}catch(e){}
  }
  var saved=null; try{saved=localStorage.getItem('theme')}catch(e){}
  if(!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) saved='dark';
  setTheme(saved||'light');
  $('#theme').addEventListener('click',function(){ setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'); });

  /* ---------- Mobile menu ---------- */
  var links=$('#links');
  $('#burger').addEventListener('click',function(){links.classList.toggle('open')});

  /* ---------- Typing ---------- */
  var typed=$('#typed'), pi=0, ci=0, del=false;
  function tick(){
    var p=PHRASES[pi];
    if(reduce){typed.textContent=p;return}
    typed.textContent=p.slice(0,ci);
    if(!del && ci<p.length){ci++;setTimeout(tick,75)}
    else if(!del){del=true;setTimeout(tick,1500)}
    else if(ci>0){ci--;setTimeout(tick,38)}
    else{del=false;pi=(pi+1)%PHRASES.length;setTimeout(tick,300)}
  }
  tick();

  /* ---------- Ticker (decorative, not clickable) ---------- */
  var mqHtml='';
  [0,1].forEach(function(){ MARQUEE.forEach(function(m){ mqHtml+='<span class="mq">'+m+'</span>'; }); });
  $('#marquee').innerHTML=mqHtml;

  /* ---------- Skills grid + filters ---------- */
  var grid=$('#skills-grid');
  grid.innerHTML=SK.map(function(s){
    var c=CAT[s[1]];
    var attrs='data-name="'+s[0]+'" data-c="'+s[1]+'" style="--t:var(--'+c+');--d:var(--'+c+'-d)"';
    var inner='<b>'+s[0]+'</b><small>'+s[2]+'</small>';
    return '<div class="sk static" '+attrs+'>'+inner+'</div>';
  }).join('');
  var counts={all:SK.length};
  SK.forEach(function(s){counts[s[1]]=(counts[s[1]]||0)+1});
  $$('#filters .chip').forEach(function(c){
    c.insertAdjacentHTML('beforeend','<i>'+counts[c.getAttribute('data-f')]+'</i>');
  });
  $('#filters').addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b) return;
    var f=b.getAttribute('data-f');
    $$('#filters .chip').forEach(function(c){c.classList.toggle('on',c===b)});
    $$('.sk',grid).forEach(function(el,i){
      var show=f==='all'||el.getAttribute('data-c')===f;
      el.classList.toggle('hide',!show);
      el.classList.remove('pop');
      if(show){void el.offsetWidth;el.style.animationDelay=(i%12)*25+'ms';el.classList.add('pop')}
    });
  });

  /* ---------- Jumping (only links that have a real destination) ---------- */
  function flash(el){
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    setTimeout(function(){el.classList.remove('flash')},2100);
  }
  function goTo(id){
    var el=document.getElementById(id); if(!el) return;
    var isSection = el.tagName==='SECTION' || el.id==='top';
    el.scrollIntoView({behavior:reduce?'auto':'smooth',block:isSection?'start':'center'});
    if(!isSection){
      setTimeout(function(){
        if(id==='cert-list') $$('.cert',el).forEach(flash); else flash(el);
      },reduce?0:550);
    }
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');
    if(!a) return;
    var id=a.getAttribute('href').slice(1);
    if(!id) return;
    e.preventDefault();
    links.classList.remove('open');
    goTo(id);
  });

  /* ---------- Counters + reveal ---------- */
  function countUp(el){
    var to=+el.getAttribute('data-count'), suf=el.getAttribute('data-suffix')||'', t0=null;
    if(reduce){el.textContent=to+suf;return}
    (function step(ts){
      if(!t0)t0=ts; var p=Math.min((ts-t0)/1200,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(to*e)+suf;
      if(p<1)requestAnimationFrame(step);
    })(performance.now());
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(!en.isIntersecting)return;
      var el=en.target; el.classList.add('in');
      $$('[data-count]',el).forEach(countUp);
      io.unobserve(el);
    });
  },{threshold:.12});
  $$('.reveal').forEach(function(el,i){
    el.style.transitionDelay=(i%3)*80+'ms'; io.observe(el);
  });

  /* ---------- Scroll: progress, nav highlight, to-top ---------- */
  var secs=$$('main section'), navs=$$('#links a.l'), prog=$('#progress'), top=$('#totop');
  function onScroll(){
    var h=document.documentElement, y=h.scrollTop||document.body.scrollTop;
    prog.style.width=(y/(h.scrollHeight-h.clientHeight)*100)+'%';
    top.classList.toggle('show',y>600);
    var cur='';
    secs.forEach(function(s){if(y+200>=s.offsetTop)cur=s.id});
    navs.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur)});
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  top.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
  $('#yr').textContent=new Date().getFullYear();

  /* ---------- Falling sakura petals ---------- */
  var cv=$('#bg'), ctx=cv.getContext('2d'), W,H,petals=[];
  function size(){
    var d=Math.min(window.devicePixelRatio||1,2);
    W=cv.width=innerWidth*d; H=cv.height=innerHeight*d; cv._d=d;
    var n=Math.min(26,Math.floor(innerWidth/55));
    petals=[]; for(var i=0;i<n;i++)petals.push(newPetal(true));
  }
  function newPetal(anywhere){
    var d=cv._d||1;
    return {x:Math.random()*W,y:anywhere?Math.random()*H:-20*d,r:(5+Math.random()*7)*d,rot:Math.random()*6.28,
            vr:(Math.random()-.5)*.02,vy:(.35+Math.random()*.6)*d,sw:Math.random()*6.28,swv:.01+Math.random()*.015,a:.35+Math.random()*.35};
  }
  function drawPetal(p,col){
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha=p.a;
    ctx.fillStyle='rgb('+col+')';
    ctx.beginPath(); ctx.moveTo(0,-p.r);
    ctx.bezierCurveTo(p.r*.9,-p.r*.8,p.r*.9,p.r*.5,0,p.r);
    ctx.bezierCurveTo(-p.r*.9,p.r*.5,-p.r*.9,-p.r*.8,0,-p.r);
    ctx.fill(); ctx.restore();
  }
  size(); addEventListener('resize',size);
  function draw(){
    ctx.clearRect(0,0,W,H);
    var dark=root.getAttribute('data-theme')==='dark', col=dark?'255,159,189':'247,150,182';
    petals.forEach(function(p,i){
      if(!reduce){
        p.sw+=p.swv; p.x+=Math.sin(p.sw)*.6*cv._d; p.y+=p.vy; p.rot+=p.vr;
        if(p.y>H+20||p.x<-30||p.x>W+30) petals[i]=newPetal(false);
      }
      drawPetal(p,col);
    });
    if(!reduce)requestAnimationFrame(draw);
  }
  draw();

  /* ---------- Custom cursor ---------- */
  if(fine && CURSOR_FX && !reduce){
    var dot=document.createElement('div'), ring=document.createElement('div');
    dot.className='cur-dot'; ring.className='cur-ring';
    document.body.appendChild(ring); document.body.appendChild(dot);
    document.documentElement.classList.add('has-cursor');
    var mx=-100,my=-100,rx=-100,ry=-100,shown=false;
    document.addEventListener('mousemove',function(e){
      mx=e.clientX; my=e.clientY;
      dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
      if(!shown){shown=true;rx=mx;ry=my;dot.classList.add('on');ring.classList.add('on')}
      var t=e.target.closest&&e.target.closest('a,button,.chip,.btn,.icon-btn,.jump,.mascot');
      ring.classList.toggle('hover',!!t);
    });
    document.addEventListener('mousedown',function(){ring.classList.add('down')});
    document.addEventListener('mouseup',function(){ring.classList.remove('down')});
    document.documentElement.addEventListener('mouseleave',function(){shown=false;dot.classList.remove('on');ring.classList.remove('on')});
    (function follow(){
      rx+=(mx-rx)*.18; ry+=(my-ry)*.18;
      ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- Click / tap fireworks (hanabi) ---------- */
  if(((fine && CLICK_FX) || (touch && TOUCH_FX)) && !reduce){
    var fwCanvas=document.createElement('canvas'); fwCanvas.id='fireworks'; fwCanvas.setAttribute('aria-hidden','true');
    document.body.appendChild(fwCanvas);
    var fwCtx=fwCanvas.getContext('2d'), fwDpr=Math.min(window.devicePixelRatio||1,2), fwW=0, fwH=0, fwBits=[], fwRunning=false;
    var fwFit=function(){fwW=innerWidth;fwH=innerHeight;fwCanvas.width=fwW*fwDpr;fwCanvas.height=fwH*fwDpr;fwCtx.setTransform(fwDpr,0,0,fwDpr,0,0)};
    fwFit(); addEventListener('resize',fwFit);
    var FW_COLORS=['--pink-d','--lav-d','--butter-d','--sky-d','--mint-d','--peach-d'];
    var fwPick=function(){var cs=getComputedStyle(document.documentElement);return FW_COLORS.map(function(v){return cs.getPropertyValue(v).trim()||'#ec6b95'})};
    var fwBurst=function(x,y){
      var cols=fwPick(), n=touch?42:34, R=touch?7.2:6.2, base=cols[Math.floor(Math.random()*cols.length)];
      for(var i=0;i<n;i++){
        var a=(Math.PI*2/n)*i+Math.random()*.15, v=R*(.55+Math.random()*.45);
        fwBits.push({x:x,y:y,px:x,py:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,decay:.011+Math.random()*.007,
          c:i%3===0?cols[Math.floor(Math.random()*cols.length)]:base,w:3+Math.random()*2,tw:Math.random()<.35});
      }
      // soft flash ring
      fwBits.push({ring:true,x:x,y:y,r:4,life:1,decay:.07,c:base});
      if(!fwRunning){fwRunning=true;requestAnimationFrame(fwTick)}
    };
    var fwTick=function(){
      fwCtx.clearRect(0,0,fwW,fwH);
      for(var i=fwBits.length-1;i>=0;i--){
        var p=fwBits[i];
        if(p.ring){
          p.r+=5; p.life-=p.decay;
          if(p.life<=0){fwBits.splice(i,1);continue}
          fwCtx.globalAlpha=p.life*.5; fwCtx.strokeStyle=p.c; fwCtx.lineWidth=2; fwCtx.beginPath(); fwCtx.arc(p.x,p.y,p.r,0,6.283); fwCtx.stroke();
          continue;
        }
        p.px=p.x; p.py=p.y;
        p.vx*=.95; p.vy=p.vy*.95+.06;      // friction + gravity
        p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
        if(p.life<=0){fwBits.splice(i,1);continue}
        var al=p.tw?p.life*(.5+.5*Math.sin(p.life*40)):p.life;
        fwCtx.globalAlpha=Math.max(al,0); fwCtx.strokeStyle=p.c; fwCtx.fillStyle=p.c; fwCtx.lineCap='round'; fwCtx.lineWidth=p.w*p.life+.4;
        fwCtx.beginPath(); fwCtx.moveTo(p.px,p.py); fwCtx.lineTo(p.x,p.y); fwCtx.stroke();       // trail
        fwCtx.beginPath(); fwCtx.arc(p.x,p.y,p.w*.55*p.life+.3,0,6.283); fwCtx.fill();       // head
      }
      fwCtx.globalAlpha=1;
      if(fwBits.length) requestAnimationFrame(fwTick); else {fwRunning=false;fwCtx.clearRect(0,0,fwW,fwH)}
    };
    document.addEventListener('click',function(e){fwBurst(e.clientX,e.clientY)});
  }

  /* ---------- Mascot jump (click on laptop, tap on phone/tablet) ---------- */
  if(MASCOT_FX && !reduce){
    document.addEventListener('click',function(e){
      var m=e.target.closest&&e.target.closest('.mascot');
      if(!m) return;
      m.classList.remove('boing'); void m.getBoundingClientRect(); m.classList.add('boing');
      setTimeout(function(){m.classList.remove('boing')},700);
    });
  }

  /* ---------- Phone / tablet extras ---------- */
  // tiny vibration when tapping buttons / links (Android)
  if(touch && HAPTIC && navigator.vibrate){
    document.addEventListener('click',function(e){
      if(e.target.closest&&e.target.closest('a,button,.chip,.btn,.icon-btn')) navigator.vibrate(12);
    });
  }

  /* ---------- Background music player ---------- */
  (function(){
    var btn=$('#music'), icon=$('#musicIcon');
    if(!btn||!MUSIC_FILE) return;
    var au=null, wantOn=false, fade=null, KEY='bgm';
    var credit=$('#musicCredit'); if(credit&&MUSIC_CREDIT) credit.textContent=' · '+MUSIC_CREDIT;
    var ui=function(on){
      icon.textContent=on?'🎵':'🔇'; btn.classList.toggle('playing',on);
      btn.setAttribute('aria-label',on?'Pause background music':'Play background music');
      btn.setAttribute('aria-pressed',on?'true':'false');
    };
    var setSaved=function(v){try{localStorage.setItem(KEY,v)}catch(e){}};
    var ramp=function(to,done){
      clearInterval(fade);
      fade=setInterval(function(){
        var d=to-au.volume;
        if(Math.abs(d)<.02){au.volume=to;clearInterval(fade);if(done)done();return}
        au.volume=Math.min(1,Math.max(0,au.volume+(d>0?.02:-.02)));
      },40);
    };
    var make=function(){
      au=new Audio(MUSIC_FILE); au.loop=true; au.preload='none'; au.volume=0;
      au.addEventListener('error',function(){btn.hidden=true;wantOn=false}); // file missing -> hide button
    };
    var start=function(){
      if(!au) make();
      var pr=au.play();
      if(pr&&pr.then){pr.then(function(){wantOn=true;ui(true);setSaved('on');ramp(MUSIC_VOLUME)}).catch(function(){ui(false)})}
      else{wantOn=true;ui(true);setSaved('on');ramp(MUSIC_VOLUME)}
    };
    var stop=function(){
      wantOn=false; ui(false); setSaved('off');
      if(au) ramp(0,function(){au.pause()});
    };
    // Autoplay: browsers often block sound until the visitor interacts, so we
    // 1) try to play right away, 2) if blocked, start on the first tap / click / key.
    var saved=null; try{saved=localStorage.getItem(KEY)}catch(e){}
    var armed=false;
    var armFirstGesture=function(){
      if(armed) return; armed=true;
      var go=function(){
        document.removeEventListener('pointerdown',go);document.removeEventListener('keydown',go);document.removeEventListener('touchend',go);
        if(!wantOn && !btn.hidden && !document.hidden) start();
      };
      document.addEventListener('pointerdown',go);
      document.addEventListener('keydown',go);
      document.addEventListener('touchend',go);
    };
    var autoStart=function(){
      if(saved==='off' || !(MUSIC_AUTOPLAY || saved==='on')) return;   // visitor turned it off before -> respect that
      if(!au) make();
      var pr=au.play();
      if(pr&&pr.then){
        pr.then(function(){wantOn=true;ui(true);ramp(MUSIC_VOLUME)}).catch(armFirstGesture);
      } else { armFirstGesture(); }
    };

    // show the button only when the file really exists, then try to autoplay
    var probe=new Audio(); probe.preload='metadata';
    probe.addEventListener('loadedmetadata',function(){btn.hidden=false;autoStart()});
    probe.addEventListener('error',function(){btn.hidden=true});
    probe.src=MUSIC_FILE;
    btn.addEventListener('click',function(e){e.stopPropagation();wantOn?stop():start()});
    // pause while the tab is hidden
    document.addEventListener('visibilitychange',function(){
      if(!au||!wantOn) return;
      if(document.hidden){au.pause()} else {var p=au.play(); if(p&&p.catch)p.catch(function(){})}
    });
  })();
})();
