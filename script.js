(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

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
  $('#theme').addEventListener('click',function(){
    setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
  });

  /* ---------- Mobile menu ---------- */
  var links=$('#links');
  $('#burger').addEventListener('click',function(){links.classList.toggle('open')});
  $$('#links a.l').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open')})});

  /* ---------- Typing ---------- */
  var phrases=['Data Engineering','Machine Learning','Data Analysis','Cloud & Infrastructure'];
  var typed=$('#typed'), pi=0, ci=0, del=false;
  function tick(){
    var p=phrases[pi];
    if(reduce){typed.textContent=p;return}
    typed.textContent=p.slice(0,ci);
    if(!del && ci<p.length){ci++;setTimeout(tick,75)}
    else if(!del){del=true;setTimeout(tick,1500)}
    else if(ci>0){ci--;setTimeout(tick,38)}
    else{del=false;pi=(pi+1)%phrases.length;setTimeout(tick,300)}
  }
  tick();

  /* ---------- Skills ---------- */
  var SK=[
    ['Python','prog','pandas · NumPy'],['scikit-learn','ml','modeling'],['SQL','prog','querying & analysis'],
    ['Supervised Learning','ml','classification · regression'],['Unsupervised Learning','ml','clustering'],['Model Evaluation','ml','metrics & validation'],['Model Deployment','ml','to production'],
    ['Tableau','viz','dashboard'],['matplotlib','viz','plotting'],['seaborn','viz','statistical plots'],
    ['PostgreSQL','db','relational'],['MongoDB','db','NoSQL'],['MySQL','db','relational'],['NoSQL','db','non-relational'],
    ['ETL','de','pipeline'],['Data Ingestion','de','source → warehouse'],['Apache Airflow','de','orchestration'],['Hadoop','de','big data'],['Spark','de','big data'],
    ['Data Validation','de','data quality'],['Data Cleaning','de','data quality'],['Preprocessing','de','data quality'],
    ['Great Expectations','de','data validation'],['TensorFlow / Keras','ml','deep learning'],['Elasticsearch & Kibana','de','search & dashboards'],['Hugging Face Spaces','ml','model demo'],['Git','dev','version control'],['GitHub','dev','collaboration'],['VSCode','dev','editor'],['Jupyter Notebook','dev','exploration'],
    ['Web Scraping','prog','data collection'],['API Integration','prog','REST'],['Time Series','ml','forecasting'],['Anomaly Detection','ml','deteksi outlier']
  ];
  var grid=$('#skills-grid');
  grid.innerHTML=SK.map(function(s){
    return '<div class="sk" data-c="'+s[1]+'"><b>'+s[0]+'</b><small>'+s[2]+'</small></div>';
  }).join('');
  $('#filters').addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b) return;
    $$('.chip').forEach(function(c){c.classList.remove('on')}); b.classList.add('on');
    var f=b.getAttribute('data-f');
    $$('.sk',grid).forEach(function(el,i){
      var show=f==='all'||el.getAttribute('data-c')===f;
      el.classList.toggle('hide',!show);
      el.classList.remove('pop');
      if(show){void el.offsetWidth;el.style.animationDelay=(i%12)*25+'ms';el.classList.add('pop')}
    });
  });

  /* ---------- Reveal, counters, bars ---------- */
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
      $$('.fill',el).forEach(function(f){f.style.width=f.getAttribute('data-w')+'%'});
      io.unobserve(el);
    });
  },{threshold:.15});
  $$('.reveal').forEach(function(el,i){
    el.style.transitionDelay=(i%3)*90+'ms'; io.observe(el);
  });

  /* ---------- Scroll: progress, nav highlight, to-top ---------- */
  var secs=$$('main section'), navs=$$('#links a.l'), prog=$('#progress'), top=$('#totop');
  function onScroll(){
    var h=document.documentElement, y=h.scrollTop||document.body.scrollTop;
    prog.style.width=(y/(h.scrollHeight-h.clientHeight)*100)+'%';
    top.classList.toggle('show',y>600);
    var cur='';
    secs.forEach(function(s){if(y+140>=s.offsetTop)cur=s.id});
    navs.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur)});
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  top.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

  /* ---------- Project card spotlight ---------- */
  $$('.proj').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty('--mx',(e.clientX-r.left)+'px');
      c.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });

  /* ---------- Terminal tilt ---------- */
  var tilt=$('#tilt');
  if(!reduce && window.matchMedia('(hover:hover)').matches){
    tilt.parentElement.addEventListener('pointermove',function(e){
      var r=tilt.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      tilt.style.transform='perspective(900px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg)';
    });
    tilt.addEventListener('pointerleave',function(){tilt.style.transform=''});
  }

  /* ---------- Copy email ---------- */
  var toast=$('#toast');
  $('#copy').addEventListener('click',function(){
    var mail='ferryansa.inbox@gmail.com';
    function done(){toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},1800)}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(mail).then(done,done)}
    else{var t=document.createElement('textarea');t.value=mail;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(t);done()}
  });
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