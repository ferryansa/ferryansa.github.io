/* ==========================================================
   Ferryansa — Portfolio interactions
   Quick edits:
   - Typing words:       PHRASES
   - Ticker words:       MARQUEE
   - Skills list:        SK  [name, category, subtitle, jump target id or null]
     (skill tiles are not clickable)
   - Cursor / click / touch effects: set CURSOR_FX, CLICK_FX, TOUCH_FX, MASCOT_FX, HAPTIC below to true or false
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
  var HAPTIC    = true;   // phone/tablet: tiny vibration on tap (Android only; iPhone ignores it)
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
    var fx=document.createElement('canvas'); fx.id='fireworks'; fx.setAttribute('aria-hidden','true');
    document.body.appendChild(fx);
    var g=fx.getContext('2d'), dpr=Math.min(window.devicePixelRatio||1,2), FW=0, FH=0, bits=[], running=false;
    var fit=function(){FW=innerWidth;FH=innerHeight;fx.width=FW*dpr;fx.height=FH*dpr;g.setTransform(dpr,0,0,dpr,0,0)};
    fit(); addEventListener('resize',fit);
    var COLORS=['--pink-d','--lav-d','--butter-d','--sky-d','--mint-d','--peach-d'];
    var pick=function(){var cs=getComputedStyle(document.documentElement);return COLORS.map(function(v){return cs.getPropertyValue(v).trim()||'#ec6b95'})};
    var burst=function(x,y){
      var cols=pick(), n=touch?42:34, R=touch?7.2:6.2, base=cols[Math.floor(Math.random()*cols.length)];
      for(var i=0;i<n;i++){
        var a=(Math.PI*2/n)*i+Math.random()*.15, v=R*(.55+Math.random()*.45);
        bits.push({x:x,y:y,px:x,py:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,decay:.011+Math.random()*.007,
          c:i%3===0?cols[Math.floor(Math.random()*cols.length)]:base,w:3+Math.random()*2,tw:Math.random()<.35});
      }
      // soft flash ring
      bits.push({ring:true,x:x,y:y,r:4,life:1,decay:.07,c:base});
      if(!running){running=true;requestAnimationFrame(tick)}
    };
    var tick=function(){
      g.clearRect(0,0,FW,FH);
      for(var i=bits.length-1;i>=0;i--){
        var p=bits[i];
        if(p.ring){
          p.r+=5; p.life-=p.decay;
          if(p.life<=0){bits.splice(i,1);continue}
          g.globalAlpha=p.life*.5; g.strokeStyle=p.c; g.lineWidth=2; g.beginPath(); g.arc(p.x,p.y,p.r,0,6.283); g.stroke();
          continue;
        }
        p.px=p.x; p.py=p.y;
        p.vx*=.95; p.vy=p.vy*.95+.06;      // friction + gravity
        p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
        if(p.life<=0){bits.splice(i,1);continue}
        var al=p.tw?p.life*(.5+.5*Math.sin(p.life*40)):p.life;
        g.globalAlpha=Math.max(al,0); g.strokeStyle=p.c; g.fillStyle=p.c; g.lineCap='round'; g.lineWidth=p.w*p.life+.4;
        g.beginPath(); g.moveTo(p.px,p.py); g.lineTo(p.x,p.y); g.stroke();       // trail
        g.beginPath(); g.arc(p.x,p.y,p.w*.55*p.life+.3,0,6.283); g.fill();       // head
      }
      g.globalAlpha=1;
      if(bits.length) requestAnimationFrame(tick); else {running=false;g.clearRect(0,0,FW,FH)}
    };
    document.addEventListener('click',function(e){burst(e.clientX,e.clientY)});
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
})();
