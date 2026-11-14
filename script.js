/* ==========================================================
   Ferryansa — Portfolio interactions
   Quick edits:
   - Typing words:      PHRASES
   - Skills list:       SK  (name, category, subtitle, jump target id, label)
   - Marquee tech list: MARQUEE
   ========================================================== */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ---------- Editable data ---------- */
  var PHRASES = ['Data Analysis','Data Engineering','Data Pipelines','Linux & Infrastructure'];

  var MARQUEE = ['Python','SQL','PostgreSQL','Apache Airflow','Elasticsearch','Kibana','Great Expectations','TensorFlow / Keras','Linux','VMware vSphere','OpenStack','Ansible','Grafana'];

  var WHERE = {
    'p-bike':'Global Bike Sales Pipeline','p-bird':'Bird Species Classification',
    'j-lion':'PT Lion Super Indo','j-inovasi':'PT Inovasi Informatika','j-kemensos':'Kemensos internship',
    'credentials':'Credentials'
  };
  var CAT_COLOR = {prog:'var(--accent)',de:'var(--accent2)',db:'#a78bfa',viz:'#f59e0b',ml:'var(--ok)',infra:'var(--accent3)',auto:'#38bdf8'};

  // [name, category, subtitle, jump target]
  var SK = [
    ['Python','prog','Pandas · scripting','j-inovasi'],['SQL','prog','querying & analysis','p-bike'],['Pandas','prog','data processing','p-bike'],
    ['Statistics','prog','data analysis','credentials'],['Excel / Google Sheets','prog','pivot tables · VLOOKUP','credentials'],['Bash','prog','scripting','j-inovasi'],
    ['Apache Airflow','de','orchestration','p-bike'],['ETL','de','pipelines','p-bike'],['Great Expectations','de','data validation','p-bike'],['Data Quality Assurance','de','accuracy & consistency','j-lion'],
    ['PostgreSQL','db','relational','p-bike'],['Elasticsearch','db','search & indexing','p-bike'],
    ['Kibana','viz','dashboards','p-bike'],['Matplotlib','viz','plotting','p-bird'],['Seaborn','viz','statistical plots','p-bird'],
    ['MobileNetV2','ml','transfer learning','p-bird'],['TensorFlow / Keras','ml','deep learning','p-bird'],['Hugging Face Spaces','ml','model demo','p-bird'],
    ['Linux','infra','RHEL · CentOS · Ubuntu · SUSE','j-inovasi'],['Windows Server & AD','infra','Active Directory','j-lion'],['VMware vSphere','infra','virtualization','j-lion'],['OpenStack','infra','private cloud','j-inovasi'],
    ['Red Hat Satellite','infra','patch & content mgmt','j-inovasi'],['HPE / Dell','infra','servers & SAN','j-lion'],['DNS / DHCP','infra','network services','j-lion'],['Apache / Nginx','infra','web servers','j-inovasi'],
    ['Linux Firewall','infra','security','j-inovasi'],['Email Server','infra','administration','j-inovasi'],['Veeam DRaaS','infra','backup & DR','j-lion'],['SSL/TLS Certificates','infra','renewal & mgmt','j-lion'],['IPAM','infra','IP address mgmt','j-lion'],
    ['Ansible','auto','automation','j-inovasi'],['Patch Management','auto','provisioning','j-inovasi'],['Grafana','auto','monitoring','j-inovasi'],['ELK Stack','auto','log monitoring','j-inovasi'],['Log Analysis','auto','anomaly detection','j-kemensos']
  ];

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var ICON_MOON = 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
  var ICON_SUN = 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z';
  function setTheme(t){
    root.setAttribute('data-theme',t);
    $('#themeIcon').setAttribute('d', t==='dark'?ICON_MOON:ICON_SUN);
    $('meta[name=theme-color]').setAttribute('content', t==='dark'?'#0b0f1a':'#f6f8fc');
    try{localStorage.setItem('theme',t)}catch(e){}
  }
  var saved=null; try{saved=localStorage.getItem('theme')}catch(e){}
  if(!saved && window.matchMedia('(prefers-color-scheme: light)').matches) saved='light';
  setTheme(saved||'dark');
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

  /* ---------- Marquee (click -> skill) ---------- */
  var mq=$('#marquee'), mqHtml='';
  [0,1].forEach(function(n){
    MARQUEE.forEach(function(m){
      mqHtml+='<a class="mq" href="#skills" data-skill="'+m+'"'+(n?' tabindex="-1" aria-hidden="true"':'')+'>'+m+'</a>';
    });
  });
  mq.innerHTML=mqHtml;

  /* ---------- Skills grid + filters ---------- */
  var grid=$('#skills-grid');
  grid.innerHTML=SK.map(function(s){
    var w=WHERE[s[3]]||'';
    return '<a class="sk" href="#'+s[3]+'" data-name="'+s[0]+'" data-c="'+s[1]+'" style="--cat:'+CAT_COLOR[s[1]]+'">'+
           '<b>'+s[0]+'</b><small>'+s[2]+'</small><span class="w">↗ '+w+'</span></a>';
  }).join('');
  var counts={all:SK.length};
  SK.forEach(function(s){counts[s[1]]=(counts[s[1]]||0)+1});
  $$('#filters .chip').forEach(function(c){
    c.insertAdjacentHTML('beforeend','<i>'+counts[c.getAttribute('data-f')]+'</i>');
  });
  function applyFilter(f){
    $$('#filters .chip').forEach(function(c){c.classList.toggle('on',c.getAttribute('data-f')===f)});
    $$('.sk',grid).forEach(function(el,i){
      var show=f==='all'||el.getAttribute('data-c')===f;
      el.classList.toggle('hide',!show);
      el.classList.remove('pop');
      if(show){void el.offsetWidth;el.style.animationDelay=(i%12)*25+'ms';el.classList.add('pop')}
    });
  }
  $('#filters').addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b) return;
    applyFilter(b.getAttribute('data-f'));
  });

  /* ---------- Jumping between related sections ---------- */
  function flash(el){
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    setTimeout(function(){el.classList.remove('flash')},2100);
  }
  function scrollToEl(el,center){
    el.scrollIntoView({behavior:reduce?'auto':'smooth',block:center?'center':'start'});
  }
  function goTo(id){
    var el=document.getElementById(id); if(!el) return;
    var isSection = el.tagName==='SECTION' || el.id==='top';
    scrollToEl(el,!isSection);
    if(!isSection){
      setTimeout(function(){
        if(id==='cert-list') $$('.cert',el).forEach(flash); else flash(el);
      },reduce?0:550);
    }
  }
  function goSkill(name){
    var f=$('#filters .chip.on'); if(f && f.getAttribute('data-f')!=='all') applyFilter('all');
    var tile=$$('.sk',grid).filter(function(t){return t.getAttribute('data-name')===name})[0];
    if(!tile){goTo('skills');return}
    scrollToEl(tile,true);
    setTimeout(function(){flash(tile)},reduce?0:600);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');
    if(!a) return;
    var id=a.getAttribute('href').slice(1);
    if(!id) return;
    e.preventDefault();
    links.classList.remove('open');
    var sk=a.getAttribute('data-skill');
    if(sk) goSkill(sk); else goTo(id);
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
      if(el.hasAttribute('data-count')) countUp(el);
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
    secs.forEach(function(s){if(y+160>=s.offsetTop)cur=s.id});
    navs.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur)});
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  top.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

  /* ---------- Project card spotlight + hero glow ---------- */
  $$('.proj').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty('--mx',(e.clientX-r.left)+'px');
      c.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });
  var hero=$('#hero');
  hero.addEventListener('pointermove',function(e){
    var r=hero.getBoundingClientRect();
    hero.style.setProperty('--hx',(e.clientX-r.left)+'px');
    hero.style.setProperty('--hy',(e.clientY-r.top)+'px');
  });

  /* ---------- Terminal tilt ---------- */
  var tilt=$('#tilt');
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    tilt.parentElement.addEventListener('pointermove',function(e){
      var r=tilt.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      tilt.style.transform='perspective(900px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg)';
    });
    tilt.addEventListener('pointerleave',function(){tilt.style.transform=''});
  }

  $('#yr').textContent=new Date().getFullYear();

  /* ---------- Network canvas background ---------- */
  var cv=$('#bg'), ctx=cv.getContext('2d'), W,H,pts=[],mouse={x:-999,y:-999};
  function size(){
    var d=Math.min(window.devicePixelRatio||1,2);
    W=cv.width=innerWidth*d; H=cv.height=innerHeight*d; cv._d=d;
    var n=Math.min(70,Math.floor(innerWidth*innerHeight/20000));
    pts=[]; for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35*d,vy:(Math.random()-.5)*.35*d});
  }
  size(); addEventListener('resize',size);
  addEventListener('pointermove',function(e){mouse.x=e.clientX*cv._d;mouse.y=e.clientY*cv._d});
  function draw(){
    ctx.clearRect(0,0,W,H);
    var light=root.getAttribute('data-theme')==='light', col=light?'79,70,229':'129,140,248', d=cv._d, L=150*d;
    for(var i=0;i<pts.length;i++){
      var p=pts[i]; p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,1.6*d,0,6.283); ctx.fillStyle='rgba('+col+',.55)'; ctx.fill();
      for(var j=i+1;j<pts.length;j++){
        var q=pts[j], dx=p.x-q.x, dy=p.y-q.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<L){ctx.strokeStyle='rgba('+col+','+(.18*(1-dist/L))+')';ctx.lineWidth=d;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}
      }
      var mx=p.x-mouse.x,my=p.y-mouse.y,md=Math.sqrt(mx*mx+my*my);
      if(md<L*1.2){ctx.strokeStyle='rgba(34,211,238,'+(.4*(1-md/(L*1.2)))+')';ctx.lineWidth=d;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke()}
    }
    if(!reduce)requestAnimationFrame(draw);
  }
  draw();
})();
