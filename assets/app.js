const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const files={projects:['one-universe','leavesync','education-crm'],artefacts:['requirements-traceability','process-models','user-story-backlog']};
async function json(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(path);return r.json()}
async function collection(type){try{const manifest=await json('data/'+type+'-index.json');return await Promise.all(manifest.map(p=>json('content/'+type+'/'+p+'.json')))}catch(e){return await Promise.all(files[type].map(p=>json('content/'+type+'/'+p+'.json')))}}
let artefacts=[];

/* Dynamically rendered Pages CMS sections; numeric order includes existing sections. */
function safeHref(value){try{const u=new URL(String(value||''),location.href);return ['http:','https:','mailto:'].includes(u.protocol)?u.href:''}catch{return ''}}
function safeMedia(value){const s=String(value||'');if(!s||s.startsWith('//')||s.includes('..'))return '';try{const u=new URL(s,location.href);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}}
function safeRichText(value){const template=document.createElement('template');template.innerHTML=String(value||'');const allowed=new Set(['P','BR','B','STRONG','I','EM','U','H3','H4','UL','OL','LI','BLOCKQUOTE','A']);const walk=node=>{for(const child of [...node.childNodes]){if(child.nodeType===8){child.remove();continue}if(child.nodeType!==1)continue;if(!allowed.has(child.tagName)){child.replaceWith(document.createTextNode(child.textContent||''));continue}for(const attr of [...child.attributes])child.removeAttribute(attr.name);if(child.tagName==='A'){const href=safeHref(nodeHref.get(child)||'');if(href){child.setAttribute('href',href);child.setAttribute('rel','noopener noreferrer')} }walk(child)}};const nodeHref=new Map();template.content.querySelectorAll('a').forEach(a=>nodeHref.set(a,a.getAttribute('href')));walk(template.content);return template.innerHTML}
async function renderCustomSections(){
  let sections=[];try{sections=(await collection('sections')).filter(s=>s.published!==false)}catch(e){console.warn('Custom sections not available yet',e)}
  const container=$('#customSections');if(!container)return;
  const nav=$('#nav');const main=$('#main');
  const fixed=[['home',0],['about',100],['experience',200],['projects',300],['artefacts',400],['contact',500]];
  const used=new Set(fixed.map(x=>x[0]));
  sections.forEach((s,i)=>{
    const slug='custom-'+String(s.title||'section').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60);
    let id=slug||'custom-section';let k=2;while(used.has(id))id=slug+'-'+k++;used.add(id);
    const order=Number.isFinite(Number(s.order))&&s.order!==''&&s.order!=null?Number(s.order):600+i;
    const section=document.createElement('section');section.className='page-section custom-section';section.id=id;
    const media=safeMedia(s.image),doc=safeMedia(s.document),link=safeHref(s.link_url);
    section.innerHTML='<div class="inner"><div class="eyebrow">CUSTOM SECTION</div><h2>'+esc(s.title)+'</h2>'+
      (s.subtitle?'<p class="section-intro">'+esc(s.subtitle)+'</p>':'')+
      (s.body?'<div class="custom-content">'+safeRichText(s.body)+'</div>':'')+
      (media?'<img class="custom-media" alt="" src="'+esc(media)+'">':'')+
      '<div class="custom-links">'+(link?'<a target="_blank" rel="noopener noreferrer" href="'+esc(link)+'">'+esc(s.link_label||'Learn more')+' ↗</a>':'')+
      (doc?'<a target="_blank" rel="noopener noreferrer" href="'+esc(doc)+'">Open document ↗</a>':'')+'</div></div>';
    container.appendChild(section);
    const a=document.createElement('a');a.href='#'+id;a.textContent=s.title||'New section';nav.appendChild(a);
    fixed.push([id,order]);
  });
  fixed.sort((a,b)=>a[1]-b[1]);
  for(const [id] of fixed){const section=$('#'+id),anchor=nav.querySelector('a[href="#'+id+'"]');if(section)main.insertBefore(section,container);if(anchor)nav.appendChild(anchor)}
  container.remove();
}

function renderArtefacts(category='All'){const arr=artefacts.filter(a=>a.published!==false&&(category==='All'||a.category===category));$('#artefactGrid').innerHTML=arr.length?arr.map(a=>`<div class="artefact"><div><h3>${esc(a.title)}</h3><p>${esc(a.category)} · ${esc(a.project)}<br>${esc(a.description)}</p></div>${a.file?`<a href="${esc(a.file)}" target="_blank" rel="noopener">Open file ↗</a>`:'<span class="fineprint">Preview pending</span>'}</div>`).join(''):'<p class="fineprint">No artefacts in this category yet.</p>'}
function setupNav(){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){$$('#nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}})},{rootMargin:'-30% 0px -60% 0px'});$$('.page-section').forEach(s=>obs.observe(s));$('#menuToggle').onclick=()=>$('#sidebar').classList.toggle('open');$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#sidebar').classList.remove('open')))}
async function init(){try{const p=await json('data/profile.json');document.title=p.name+' | Business Analyst';$('#headline').textContent=p.headline;$('#intro').textContent=p.intro;$('#aboutText').textContent=p.about;$('#sectors').textContent=p.sectors;$('#footerName').textContent=p.name;['about','experience','projects','artefacts','contact'].forEach(s=>{if(p['show_'+s]===false){$('#'+s).remove();const a=$('#nav a[href="#'+s+'"]');if(a)a.remove()}});$('#contactLinks').innerHTML=(p.email?`<a href="mailto:${esc(p.email)}">Email ↗</a>`:'')+(p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`:'')||'<span class="fineprint">Contact details to be added.</span>';
const projects=(await collection('projects')).filter(x=>x.published!==false);if($('#projectGrid')){$('#projectGrid').innerHTML=projects.map((x,i)=>`<button class="project" data-i="${i}"><small>${esc(x.category)}</small><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p><span class="arrow">↗</span></button>`).join('');$$('.project').forEach(b=>b.onclick=()=>{const x=projects[+b.dataset.i];$('#dialogBody').innerHTML=`<div class="eyebrow">${esc(x.category)}</div><h2>${esc(x.title)}</h2><p>${esc(x.summary)}</p><h4>Business challenge</h4><p>${esc(x.challenge)}</p><h4>My contribution</h4><p>${esc(x.approach)}</p><h4>Outcome</h4><p>${esc(x.outcome)}</p>`;$('#projectDialog').showModal()})}
artefacts=await collection('artefacts');if($('#artefactGrid'))renderArtefacts();$$('#filters button').forEach(b=>b.onclick=()=>{$$('#filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderArtefacts(b.dataset.filter)});$('#closeDialog').onclick=()=>$('#projectDialog').close();$('#projectDialog').onclick=e=>{if(e.target.id==='projectDialog')e.target.close()};$('#year').textContent=new Date().getFullYear();await renderCustomSections();setupNav()}catch(e){console.error(e);$('#intro').textContent='Unable to load content. Use a local web server or publish on GitHub Pages.'}}init();
