(() => {
const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);
let W=960,H=540,keys={},touch={},lastTime=0,toastTimer=null;
let player={x:480,y:290,speed:185,hp:100,maxHp:100,level:1,xp:0,coins:0,score:0,name:'Petualang',npcDone:false};
let world={width:1800,height:1300};
let coins=[],trees=[],rocks=[],flowers=[],npc={x:900,y:620};
let saveKey='mandiriGameSaveV1',rankKey='mandiriGameRanksV1';
function rnd(min,max){return Math.random()*(max-min)+min}
function generateWorld(){coins=[];trees=[];rocks=[];flowers=[];
 for(let i=0;i<55;i++){let x=rnd(50,world.width-50),y=rnd(50,world.height-50);if(Math.hypot(x-480,y-290)>100)coins.push({x,y,taken:false});}
 for(let i=0;i<125;i++){let x=rnd(25,world.width-25),y=rnd(25,world.height-25);if(Math.hypot(x-480,y-290)>100&&Math.hypot(x-npc.x,y-npc.y)>75)trees.push({x,y,r:rnd(15,26)});}
 for(let i=0;i<90;i++)flowers.push({x:rnd(0,world.width),y:rnd(0,world.height),c:Math.random()>.5?'#f8d36d':'#e8a6b8'});}
generateWorld();
function resize(){const r=canvas.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);W=r.width;H=r.height;}
window.addEventListener('resize',resize);resize();
function showMessage(msg){$('statusMessage').textContent=msg;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('statusMessage').textContent='Jelajahi dunia dan selesaikan misi!',3800);}
function save(){try{localStorage.setItem(saveKey,JSON.stringify({...player,coinsMap:coins.map(c=>c.taken)}));showMessage('Permainan berhasil disimpan di perangkat ini.');}catch(e){showMessage('Penyimpanan tidak tersedia di browser ini.');}}
function load(){try{let d=JSON.parse(localStorage.getItem(saveKey)||'null');if(d){Object.assign(player,d);if(Array.isArray(d.coinsMap))coins.forEach((c,i)=>c.taken=!!d.coinsMap[i]);}}catch(e){}}
function addRank(){let arr=[];try{arr=JSON.parse(localStorage.getItem(rankKey)||'[]')}catch(e){}let old=arr.find(x=>x.name===player.name);if(old){old.score=Math.max(old.score,player.score);old.level=Math.max(old.level,player.level)}else arr.push({name:player.name,score:player.score,level:player.level});arr.sort((a,b)=>b.score-a.score);arr=arr.slice(0,10);localStorage.setItem(rankKey,JSON.stringify(arr));renderRanks();}
function renderRanks(){let arr=[];try{arr=JSON.parse(localStorage.getItem(rankKey)||'[]')}catch(e){}const html=arr.length?arr.map((p,i)=>`<div class="rank-row"><span class="rank">${i+1}</span><span>${escapeHtml(p.name)}</span><span>Lv. ${p.level}</span><span class="points">${p.score}</span></div>`).join(''):'<div class="empty">Belum ada skor. Selesaikan misi untuk mencatat skor!</div>';$('leaderboardPreview').innerHTML=html;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function levelCheck(){while(player.xp>=player.level*100){player.xp-=player.level*100;player.level++;player.maxHp+=10;player.hp=player.maxHp;player.score+=100;showMessage('Naik level! Sekarang Level '+player.level+'!');} }
function updateHUD(){$('playerNameTop').textContent=player.name;$('playerNameHud').textContent=player.name;$('levelTop').textContent=player.level;$('levelHud').textContent=player.level;$('coins').textContent=player.coins;$('score').textContent=player.score;$('hpText').textContent=player.hp+'/'+player.maxHp;$('hpBar').style.width=(player.hp/player.maxHp*100)+'%';$('xpText').textContent=player.xp+'/'+(player.level*100);$('xpBar').style.width=(player.xp/(player.level*100)*100)+'%';$('coinQuest').textContent=Math.min(player.coins,5)+' / 5 koin';$('questBar').style.width=Math.min(player.coins/5*100,100)+'%';$('npcQuest').textContent=player.npcDone?'Misi selesai ✓':'Belum selesai';}
function interact(){let d=Math.hypot(player.x-npc.x,player.y-npc.y);if(d<100){if(!player.npcDone){player.npcDone=true;player.xp+=60;player.score+=150;player.coins+=2;levelCheck();showMessage('Penduduk: Terima kasih sudah datang! Kamu mendapat 2 koin dan 60 XP.');}else showMessage('Penduduk: Semoga petualanganmu menyenangkan!');}else{let nearest=coins.filter(c=>!c.taken).sort((a,b)=>Math.hypot(player.x-a.x,player.y-a.y)-Math.hypot(player.x-b.x,player.y-b.y))[0];if(nearest&&Math.hypot(player.x-nearest.x,player.y-nearest.y)<75){nearest.taken=true;player.coins++;player.score+=25;player.xp+=15;levelCheck();showMessage('Koin ditemukan! +25 skor, +15 XP.');if(player.coins>=5)showMessage('Misi Koin Pertama selesai! +100 skor.');}else showMessage('Dekati koin atau penduduk untuk berinteraksi.');}addRank();updateHUD();}
function update(dt){let dx=0,dy=0;if(keys.ArrowLeft||keys.a||touch.left)dx--;if(keys.ArrowRight||keys.d||touch.right)dx++;if(keys.ArrowUp||keys.w||touch.up)dy--;if(keys.ArrowDown||keys.s||touch.down)dy++;if(dx||dy){let l=Math.hypot(dx,dy);player.x+=dx/l*player.speed*dt;player.y+=dy/l*player.speed*dt;}player.x=Math.max(20,Math.min(world.width-20,player.x));player.y=Math.max(20,Math.min(world.height-20,player.y));
 for(const c of coins){if(!c.taken&&Math.hypot(player.x-c.x,player.y-c.y)<24){c.taken=true;player.coins++;player.score+=25;player.xp+=15;levelCheck();if(player.coins===5){player.score+=100;showMessage('Misi Koin Pertama selesai! Bonus +100 skor.');}addRank();}}
 if(Math.hypot(player.x-npc.x,player.y-npc.y)<45&&!player.npcDone){$('canvasTip').textContent='Penduduk di dekatmu! Tekan E / Aksi untuk bicara.';}else $('canvasTip').textContent='Jelajahi dunia, kumpulkan koin, dan temui warga!';
 updateHUD();}
function drawTree(x,y,r){ctx.fillStyle='#6b432c';ctx.fillRect(x-5,y-r*.15,10,r*.75);ctx.fillStyle='#1a694a';ctx.beginPath();ctx.arc(x,y-r*.5,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#27835a';ctx.beginPath();ctx.arc(x-r*.35,y-r*.55,r*.58,0,Math.PI*2);ctx.fill();ctx.fillStyle='#369966';ctx.beginPath();ctx.arc(x+r*.35,y-r*.65,r*.52,0,Math.PI*2);ctx.fill();}
function draw(){const scale=Math.min(W/760,H/430);const vw=W/scale,vh=H/scale;const camX=Math.max(0,Math.min(world.width-vw,player.x-vw/2)),camY=Math.max(0,Math.min(world.height-vh,player.y-vh/2));
 ctx.save();ctx.scale(scale,scale);ctx.translate(-camX,-camY);
 ctx.fillStyle='#6caa61';ctx.fillRect(0,0,world.width,world.height);
 // grass texture
 for(let x=Math.floor(camX/65)*65;x<camX+vw+65;x+=65)for(let y=Math.floor(camY/65)*65;y<camY+vh+65;y+=65){ctx.fillStyle=((x/65+y/65)%2)?'#73b467':'#70ad61';ctx.fillRect(x,y,65,65);ctx.fillStyle='#9aca78';ctx.fillRect(x+12,y+18,3,2);ctx.fillRect(x+43,y+47,2,3);}
 // winding path
 ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#c7ae7b';ctx.lineWidth=85;ctx.beginPath();ctx.moveTo(350,world.height);ctx.bezierCurveTo(400,900,650,850,650,650);ctx.bezierCurveTo(650,430,470,440,500,270);ctx.bezierCurveTo(520,150,800,190,900,90);ctx.stroke();ctx.strokeStyle='#ddc897';ctx.lineWidth=68;ctx.stroke();
 // lake
 ctx.fillStyle='#4dabc0';ctx.beginPath();ctx.ellipse(1450,900,200,120,-.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8bd8dd';ctx.lineWidth=7;ctx.stroke();
 // village houses
 for(let i=0;i<8;i++){let x=730+(i%4)*80,y=490+Math.floor(i/4)*75;ctx.fillStyle='#d7c59a';ctx.fillRect(x,y,54,42);ctx.fillStyle='#8c4c36';ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x+27,y-29);ctx.lineTo(x+62,y);ctx.closePath();ctx.fill();ctx.fillStyle='#523d31';ctx.fillRect(x+21,y+18,13,24);ctx.fillStyle='#8bd5ef';ctx.fillRect(x+6,y+12,10,9);}
 for(const f of flowers){if(f.x>camX-5&&f.x<camX+vw+5&&f.y>camY-5&&f.y<camY+vh+5){ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(f.x,f.y,2.4,0,Math.PI*2);ctx.fill();}}
 for(const t of trees){if(t.x>camX-50&&t.x<camX+vw+50&&t.y>camY-60&&t.y<camY+vh+60)drawTree(t.x,t.y,t.r);}
 for(const c of coins){if(!c.taken){ctx.fillStyle='#6d501b';ctx.beginPath();ctx.ellipse(c.x,c.y+5,9,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffce36';ctx.beginPath();ctx.arc(c.x,c.y,9,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff0a1';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#a56a0c';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText('$',c.x,c.y+4);}}
 // NPC
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(npc.x,npc.y+14,17,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#efc9a0';ctx.beginPath();ctx.arc(npc.x,npc.y-12,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#b04b37';ctx.fillRect(npc.x-11,npc.y-2,22,25);ctx.fillStyle='#eee4ce';ctx.fillRect(npc.x-8,npc.y+22,7,13);ctx.fillRect(npc.x+2,npc.y+22,7,13);ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('Penduduk',npc.x,npc.y-31);
 // Player shadow and character
 ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(player.x,player.y+13,18,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e8bd94';ctx.beginPath();ctx.arc(player.x,player.y-12,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#283e5d';ctx.beginPath();ctx.arc(player.x,player.y-16,12,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#e6b83f';ctx.fillRect(player.x-12,player.y-1,24,25);ctx.fillStyle='#263d59';ctx.fillRect(player.x-10,player.y+24,8,12);ctx.fillRect(player.x+2,player.y+24,8,12);ctx.strokeStyle='#e5e8f0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(player.x+12,player.y+3);ctx.lineTo(player.x+24,player.y-16);ctx.stroke();
 ctx.restore();
 // minimap
 const mw=94,mh=70,mx=W-mw-12,my=12;ctx.fillStyle='#07192bdc';ctx.fillRect(mx-4,my-4,mw+8,mh+8);ctx.fillStyle='#76b968';ctx.fillRect(mx,my,mw,mh);ctx.fillStyle='#c8b27e';ctx.fillRect(mx+mw*.34,my+mh*.48,mw*.42,5);ctx.fillStyle='#4dabc0';ctx.beginPath();ctx.ellipse(mx+mw*.76,my+mh*.7,12,8,-.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffc94a';for(const c of coins){if(!c.taken)ctx.fillRect(mx+c.x/world.width*mw,my+c.y/world.height*mh,2,2);}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(mx+player.x/world.width*mw,my+player.y/world.height*mh,3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff8';ctx.strokeRect(mx,my,mw,mh);}
function loop(t){const dt=Math.min((t-lastTime)/1000||0,.04);lastTime=t;update(dt);draw();requestAnimationFrame(loop);}
requestAnimationFrame(loop);
window.addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(k==='e'||k===' '){interact();}});
window.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=false;});
document.querySelectorAll('[data-dir]').forEach(btn=>{const d=btn.dataset.dir;const down=e=>{e.preventDefault();touch[d]=true;};const up=e=>{e.preventDefault();touch[d]=false;};btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up);});
$('actionBtn').addEventListener('pointerdown',e=>{e.preventDefault();interact();});
$('talkBtn').addEventListener('click',()=>{if(Math.hypot(player.x-npc.x,player.y-npc.y)<130)interact();else showMessage('Penduduk berada di dekat desa. Cari ikon penduduk pada peta.');});
$('saveBtn').addEventListener('click',save);
$('nameBtn').addEventListener('click',()=>{const n=prompt('Masukkan nama petualang (maksimal 18 karakter):',player.name);if(n&&n.trim()){player.name=n.trim().slice(0,18);updateHUD();addRank();showMessage('Nama pemain diperbarui.');save();}});
function openModal(title,html){$('modalTitle').textContent=title;$('modalContent').innerHTML=html;$('modal').classList.remove('hidden');}
$('leaderboardBtn').addEventListener('click',()=>{let arr=[];try{arr=JSON.parse(localStorage.getItem(rankKey)||'[]')}catch(e){};openModal('🏆 Papan Peringkat',arr.length?'<div class="leaderboard-list">'+arr.map((p,i)=>`<div class="rank-row"><span class="rank">#${i+1}</span><span>${escapeHtml(p.name)}</span><span>Lv. ${p.level}</span><span class="points">${p.score} skor</span></div>`).join('')+'</div>':'<p>Belum ada catatan. Jelajahi dunia dan kumpulkan skor!</p><p class="muted">Peringkat ini tersimpan di perangkat ini. Lihat README untuk mengaktifkan leaderboard lintas perangkat.</p>');});
$('closeModal').addEventListener('click',()=>$('modal').classList.add('hidden'));$('modal').addEventListener('click',e=>{if(e.target===$('modal'))$('modal').classList.add('hidden');});
load();updateHUD();renderRanks();
})();