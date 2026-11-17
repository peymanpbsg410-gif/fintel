(function(){
  const section=document.getElementById('market-bond-yield');if(!section)return;
  // Demo fixture only. Replace this single array with normalized API data when a verified live feed is added.
  const DEMO_BOND_YIELDS=[{ticker:'DEMO-01',ytm:34.2},{ticker:'DEMO-02',ytm:32.8},{ticker:'DEMO-03',ytm:31.4},{ticker:'DEMO-04',ytm:29.9},{ticker:'DEMO-05',ytm:28.6},{ticker:'DEMO-06',ytm:27.1},{ticker:'DEMO-07',ytm:25.7},{ticker:'DEMO-08',ytm:24.3}];
  const data=[...DEMO_BOND_YIELDS].sort((a,b)=>b.ytm-a.ytm),fmt=n=>Number(n).toLocaleString('fa-IR',{minimumFractionDigits:1,maximumFractionDigits:1})+'٪';
  section.querySelector('[data-demo-high]').textContent=fmt(data[0].ytm);section.querySelector('[data-demo-average]').textContent=fmt(data.reduce((sum,item)=>sum+item.ytm,0)/data.length);section.querySelector('[data-demo-count]').textContent=Number(data.length).toLocaleString('fa-IR');
  const tbody=section.querySelector('[data-demo-rows]');data.forEach((item,i)=>{const tr=document.createElement('tr'),rank=document.createElement('td'),symbol=document.createElement('td'),value=document.createElement('td'),badge=document.createElement('span');badge.className='by-rank '+(['gold','silver','bronze'][i]||'');badge.textContent=Number(i+1).toLocaleString('fa-IR');rank.append(badge);symbol.className='by-symbol';symbol.textContent=item.ticker;value.textContent=fmt(item.ytm);tr.append(rank,symbol,value);tbody.append(tr)});
  const W=960,left=220,right=790,top=82,row=56,barH=20,max=40,bottom=top+data.length*row,ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${bottom+52}`);svg.setAttribute('role','img');svg.setAttribute('aria-labelledby','by-svg-title by-svg-desc');
  const title=document.createElementNS(ns,'title');title.id='by-svg-title';title.textContent='رتبه‌بندی نمودار نمایشی YTM از بیشترین به کمترین';svg.append(title);const desc=document.createElementNS(ns,'desc');desc.id='by-svg-desc';desc.textContent='هشت نماد فرضی؛ برای جزئیات هر ردیف با ماوس یا صفحه‌کلید تمرکز کنید. هیچ داده‌ای زنده نیست.';svg.append(desc);
  const defs=document.createElementNS(ns,'defs');[['byGold','#fbbf24','#fb923c'],['byAqua','#22d3ee','#34d399'],['byBlue','#38bdf8','#818cf8']].forEach(([id,a,b])=>{const g=document.createElementNS(ns,'linearGradient');g.id=id;g.setAttribute('x1','0');g.setAttribute('y1','0');g.setAttribute('x2','1');g.setAttribute('y2','0');g.innerHTML=`<stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/>`;defs.append(g)});svg.append(defs);
  const add=(parent,tag,attrs,text)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));if(text!==undefined)el.textContent=text;parent.append(el);return el};
  add(svg,'text',{x:60,y:43,fill:'#8294ad','font-size':'11','font-weight':'700','font-family':'sans-serif'},'نماد');add(svg,'text',{x:930,y:43,fill:'#8294ad','font-size':'11','font-weight':'700','text-anchor':'end','font-family':'sans-serif'},'بازده YTM');
  [0,10,20,30,40].forEach(v=>{const x=left+(right-left)*v/max;add(svg,'line',{x1:x,y1:top-12,x2:x,y2:bottom-7,stroke:v===0?'rgba(148,163,184,.28)':'rgba(148,163,184,.16)','stroke-width':v===0?'1.3':'1','stroke-dasharray':v===0?'none':'3 6'});add(svg,'text',{x,y:bottom+17,fill:'#91a1b8','font-size':'11','font-weight':'600','text-anchor':'middle','font-family':'sans-serif'},fmt(v))});
  data.forEach((item,i)=>{const y=top+i*row,w=(right-left)*item.ytm/max,center=y+barH/2,group=add(svg,'g',{class:'by-row',tabindex:'0',role:'img','aria-label':`رتبه ${i+1}، ${item.ticker}، YTM ${fmt(item.ytm)}`});group.dataset.tip=`رتبهٔ ${Number(i+1).toLocaleString('fa-IR')}  ·  ${item.ticker}  ·  YTM ${fmt(item.ytm)}`;
    if(i===0)add(group,'rect',{x:12,y:y-12,width:920,height:44,rx:12,fill:'rgba(251,191,36,.045)',stroke:'rgba(251,191,36,.11)','stroke-width':'1'});else if(i%2)add(group,'rect',{x:12,y:y-12,width:920,height:44,rx:12,fill:'rgba(148,163,184,.025)'});
    if(i<3){add(group,'circle',{cx:35,cy:center,r:13,fill:i===0?'rgba(251,191,36,.14)':i===1?'rgba(203,213,225,.10)':'rgba(251,146,60,.10)',stroke:i===0?'rgba(251,191,36,.55)':i===1?'rgba(203,213,225,.38)':'rgba(251,146,60,.38)','stroke-width':'1'});add(group,'text',{x:35,y:center+.5,fill:i===0?'#fbd77b':i===1?'#d6e1ef':'#fdba74','font-size':'11','font-weight':'800','text-anchor':'middle','dominant-baseline':'middle','font-family':'sans-serif'},String(i+1))}else add(group,'text',{x:35,y:center+.5,fill:'#8294ad','font-size':'10','font-weight':'700','text-anchor':'middle','dominant-baseline':'middle','font-family':'sans-serif'},String(i+1).padStart(2,'0'));
    add(group,'text',{x:60,y:center+1,fill:i===0?'#f4e6bb':'#d5dfed','font-size':'13','font-weight':i===0?'700':'600','dominant-baseline':'middle','font-family':'ui-monospace,SFMono-Regular,Menlo,monospace'},item.ticker);add(group,'rect',{x:left,y:center-7,width:right-left,height:14,rx:7,fill:'rgba(148,163,184,.09)'});const bar=add(group,'rect',{class:'by-bar',x:left,y:center-7,width:w,height:14,rx:7,fill:`url(#${i===0?'byGold':i<3?'byAqua':'byBlue'})`,opacity:i===0?'1':'.9'});bar.style.animationDelay=`${i*.075}s`;add(group,'circle',{cx:left+w,cy:center,r:3.5,fill:i===0?'#fef3c7':i<3?'#a7f3d0':'#dbeafe'});add(group,'text',{x:930,y:center+1,fill:i===0?'#fbd77b':i<3?'#a7f3d0':'#dbeafe','font-size':'13','font-weight':i===0?'800':'700','text-anchor':'end','dominant-baseline':'middle','font-family':'sans-serif'},fmt(item.ytm));if(i<data.length-1)add(group,'line',{x1:24,y1:y+row-10,x2:932,y2:y+row-10,stroke:'rgba(148,163,184,.075)','stroke-width':'1'});
  });
  const chart=section.querySelector('[data-demo-chart]'),tooltip=chart.querySelector('.by-tooltip');chart.append(svg);
  const show=(e)=>{const g=e.target.closest('.by-row');if(!g)return;tooltip.textContent=g.dataset.tip;tooltip.classList.add('is-visible');const box=chart.getBoundingClientRect(),x=e.clientX?e.clientX-box.left:Math.min(box.width-160,260),y=e.clientY?e.clientY-box.top:75;tooltip.style.left=Math.max(8,Math.min(box.width-190,x+12))+'px';tooltip.style.top=Math.max(8,y-12)+'px'};
  svg.addEventListener('pointermove',show);svg.addEventListener('pointerleave',()=>tooltip.classList.remove('is-visible'));svg.addEventListener('focusin',e=>show(e));svg.addEventListener('focusout',()=>tooltip.classList.remove('is-visible'));
})();

 function saveLoginInfo(){
    var username=document.getElementById('new-username').value.trim();
    var password=document.getElementById('new-password').value;
    var repeat=document.getElementById('repeat-password').value;
    var message=document.getElementById('login-message');
    message.classList.remove('error');
    if(password!==repeat){message.textContent='رمز عبور و تکرار آن یکسان نیستند.';message.classList.add('error');return}
    if(!username || !password){message.textContent='لطفاً نام کاربری و رمز عبور جدید را وارد کنید.';message.classList.add('error');return}
    message.textContent='اطلاعات ورود بررسی شد؛ در این نسخه چیزی ذخیره نمی‌شود.';
  }
  function addFeeRow(){
    var row=document.createElement('tr');
    var nameCell=document.createElement('td');
    var name=document.createElement('input');name.type='text';name.className='settings-input fee-name';name.setAttribute('aria-label','نوع اوراق');name.placeholder='نام نوع اوراق';nameCell.appendChild(name);row.appendChild(nameCell);
    ['کارمزد خرید درصد','کارمزد فروش درصد'].forEach(function(label){var cell=document.createElement('td');var input=document.createElement('input');input.type='number';input.min='0';input.step='0.001';input.className='settings-input fee-number';input.setAttribute('aria-label',label);cell.appendChild(input);row.appendChild(cell)});
    document.getElementById('fees-table-body').appendChild(row);
    name.focus();
  }
  function addIconPreview(){
    var title=document.getElementById('icon-title').value.trim();
    var actionName=document.getElementById('icon-action-name').value.trim();
    if(!title){document.getElementById('icon-title').focus();return}
    var list=document.getElementById('created-icons');
    if(list.querySelector('.settings-note')) list.replaceChildren();
    var item=document.createElement('div');item.className='created-icon-preview';
    var swatch=document.createElement('span');swatch.className='created-icon-swatch';swatch.style.backgroundColor=document.getElementById('icon-color').value;
    var text=document.createElement('div');var heading=document.createElement('strong');heading.textContent=title;text.appendChild(heading);
    if(actionName){var detail=document.createElement('small');detail.textContent=actionName;text.appendChild(detail)}
    item.appendChild(swatch);item.appendChild(text);list.appendChild(item);
    document.getElementById('icon-title').value='';document.getElementById('icon-action-name').value='';
  }

  var ACCESS_ROLE_STORAGE_KEY = 'bazdehyar-access-roles-v1';
  var accessRoles = [];
  function getFeatureLabel(featureId){
    var feature=DASHBOARD_ITEMS.find(function(item){return item.id===featureId});
    return feature ? feature.label : featureId;
  }
  function buildRolePermissionOptions(){
    var container=document.getElementById('role-permissions');
    container.replaceChildren();
    DASHBOARD_ITEMS.forEach(function(item){
      var label=document.createElement('label');label.className='role-permission-option';
      var checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=item.id;checkbox.name='role-permission';
      var text=document.createElement('span');text.textContent=item.label;
      label.appendChild(checkbox);label.appendChild(text);container.appendChild(label);
    });
  }
  function saveAccessRoles(){
    try{localStorage.setItem(ACCESS_ROLE_STORAGE_KEY,JSON.stringify(accessRoles))}catch(error){}
  }
  function populateAccessLevelSelect(){
    var select=document.getElementById('access-level');
    var selected=select.value;
    select.replaceChildren();
    var placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='انتخاب سطح دسترسی';select.appendChild(placeholder);
    accessRoles.forEach(function(role){var option=document.createElement('option');option.value=role.id;option.textContent=role.title;select.appendChild(option)});
    if(accessRoles.some(function(role){return role.id===selected}))select.value=selected;
  }
  function renderAccessRoles(){
    var body=document.getElementById('access-roles-list');body.replaceChildren();
    accessRoles.forEach(function(role){
      var row=document.createElement('tr');
      var title=document.createElement('th');title.scope='row';title.textContent=role.title;row.appendChild(title);
      var permissions=document.createElement('td');var badges=document.createElement('div');badges.className='role-badges';
      role.permissions.forEach(function(id){var badge=document.createElement('span');badge.className='role-badge';badge.textContent=getFeatureLabel(id);badges.appendChild(badge)});
      if(!role.permissions.length){var none=document.createElement('span');none.className='settings-note';none.textContent='بدون دسترسی';badges.appendChild(none)}
      permissions.appendChild(badges);row.appendChild(permissions);
      var statusCell=document.createElement('td');var status=document.createElement('span');status.className='role-status'+(role.active?'':' inactive');status.textContent=role.active?'فعال':'غیرفعال';statusCell.appendChild(status);row.appendChild(statusCell);
      var actions=document.createElement('td');var controls=document.createElement('div');controls.className='role-manage';
      [['ویرایش','role-edit',function(){editAccessRole(role.id)}], [role.active?'غیرفعال‌کردن':'فعال‌کردن','role-toggle',function(){toggleAccessRole(role.id)}], ['حذف','role-delete',function(){deleteAccessRole(role.id)}]].forEach(function(entry){var button=document.createElement('button');button.type='button';button.className=entry[1];button.textContent=entry[0];button.addEventListener('click',entry[2]);controls.appendChild(button)});
      actions.appendChild(controls);row.appendChild(actions);body.appendChild(row);
    });
    document.getElementById('roles-empty').hidden=accessRoles.length>0;
    populateAccessLevelSelect();
  }
  function saveAccessRole(){
    var title=document.getElementById('role-title').value.trim();var feedback=document.getElementById('role-feedback');
    var editingId=document.getElementById('editing-role-id').value;
    feedback.classList.remove('error');
    if(!title){feedback.textContent='لطفاً عنوان سطح دسترسی را وارد کنید.';feedback.classList.add('error');document.getElementById('role-title').focus();return}
    if(accessRoles.some(function(role){return role.title.toLocaleLowerCase()===title.toLocaleLowerCase() && role.id!==editingId})){feedback.textContent='سطحی با این عنوان وجود دارد.';feedback.classList.add('error');return}
    var permissions=Array.from(document.querySelectorAll('input[name="role-permission"]:checked')).map(function(input){return input.value});
    if(editingId){var existing=accessRoles.find(function(role){return role.id===editingId});if(existing){existing.title=title;existing.permissions=permissions}feedback.textContent='سطح دسترسی ویرایش شد.'}
    else{accessRoles.push({id:'role-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),title:title,permissions:permissions,active:true});feedback.textContent='سطح دسترسی افزوده شد.'}
    saveAccessRoles();renderAccessRoles();cancelRoleEdit(false);
  }
  function editAccessRole(id){
    var role=accessRoles.find(function(item){return item.id===id});if(!role)return;
    document.getElementById('role-title').value=role.title;document.getElementById('editing-role-id').value=role.id;
    document.querySelectorAll('input[name="role-permission"]').forEach(function(input){input.checked=role.permissions.indexOf(input.value)!==-1});
    document.getElementById('save-role-button').textContent='ذخیره تغییرات';document.getElementById('cancel-role-edit').hidden=false;document.getElementById('role-title').focus();
  }
  function cancelRoleEdit(clearMessage){
    document.getElementById('role-title').value='';document.getElementById('editing-role-id').value='';
    document.querySelectorAll('input[name="role-permission"]').forEach(function(input){input.checked=false});
    document.getElementById('save-role-button').textContent='افزودن سطح دسترسی';document.getElementById('cancel-role-edit').hidden=true;
    if(clearMessage!==false)document.getElementById('role-feedback').textContent='';
  }
  function toggleAccessRole(id){var role=accessRoles.find(function(item){return item.id===id});if(!role)return;role.active=!role.active;saveAccessRoles();renderAccessRoles()}
  function deleteAccessRole(id){
    var role=accessRoles.find(function(item){return item.id===id});if(!role)return;
    accessRoles=accessRoles.filter(function(item){return item.id!==id});
    if(document.getElementById('editing-role-id').value===id)cancelRoleEdit();
    saveAccessRoles();renderAccessRoles();document.getElementById('role-feedback').textContent='سطح دسترسی حذف شد.';
  }
  function initializeAccessRoles(){
    try{var saved=JSON.parse(localStorage.getItem(ACCESS_ROLE_STORAGE_KEY)||'[]');if(Array.isArray(saved))accessRoles=saved.filter(function(role){return role && typeof role.id==='string' && typeof role.title==='string' && Array.isArray(role.permissions)}).map(function(role){return {id:role.id,title:role.title,permissions:role.permissions.filter(function(id){return DASHBOARD_ITEMS.some(function(item){return item.id===id})}),active:role.active!==false}})}catch(error){accessRoles=[]}
    buildRolePermissionOptions();renderAccessRoles();
  }

  function showName(files){
    if(files && files.length > 0){
      document.getElementById('file-name').textContent = files[0].name;
    }
  }
  function showNotice(){
    var n = document.getElementById('proto-notice');
    n.classList.add('show');
  }
  var SMS_CONTACT_STORAGE_KEY = 'bondYarSmsContacts';
  var smsContacts = [];
  function renderSmsContacts(){
    var list=document.getElementById('sms-contacts-list');
    var empty=document.getElementById('contacts-empty');
    if(!list || !empty) return;
    list.replaceChildren();
    smsContacts.forEach(function(contact,index){
      var row=document.createElement('tr');
      var selectCell=document.createElement('td');var selectLabel=document.createElement('label');selectLabel.className='contact-row-select';
      var checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.className='sms-contact-select';checkbox.dataset.index=String(index);checkbox.setAttribute('aria-label','انتخاب '+contact.name);checkbox.addEventListener('change',syncSmsSelectAll);
      selectLabel.appendChild(checkbox);var hiddenText=document.createElement('span');hiddenText.className='sr-only';hiddenText.textContent='انتخاب مخاطب';selectLabel.appendChild(hiddenText);selectCell.appendChild(selectLabel);row.appendChild(selectCell);
      [contact.name,contact.mobile].forEach(function(value){var cell=document.createElement('td');cell.textContent=value;row.appendChild(cell)});
      var daysCell=document.createElement('td');var daysInput=document.createElement('input');daysInput.type='number';daysInput.min='0';daysInput.step='1';daysInput.inputMode='numeric';daysInput.value=String(contact.daysBefore);daysInput.className='settings-input contact-days-input';daysInput.setAttribute('aria-label','روز قبل از سررسید برای '+contact.name);daysInput.addEventListener('change',function(){updateSmsContactDays(index,daysInput)});daysCell.appendChild(daysInput);row.appendChild(daysCell);
      var actionCell=document.createElement('td');var removeButton=document.createElement('button');removeButton.type='button';removeButton.className='settings-action';removeButton.style.marginTop='0';removeButton.textContent='حذف';removeButton.setAttribute('aria-label','حذف مخاطب '+contact.name);
      removeButton.addEventListener('click',function(){smsContacts.splice(index,1);saveSmsContacts();renderSmsContacts()});
      actionCell.appendChild(removeButton);row.appendChild(actionCell);list.appendChild(row);
    });
    empty.hidden=smsContacts.length>0;
    syncSmsSelectAll();
  }
  function updateSmsContactDays(index,input){
    var days=Number(input.value);var feedback=document.getElementById('contacts-feedback');
    if(!input.value || !Number.isInteger(days) || days<0){input.value=String(smsContacts[index].daysBefore);feedback.textContent='تعداد روز باید عدد صحیح و صفر یا بیشتر باشد.';feedback.classList.add('error');return}
    smsContacts[index].daysBefore=days;feedback.classList.remove('error');feedback.textContent='روزهای پیش از سررسید به‌روزرسانی شد.';saveSmsContacts();
  }
  function toggleAllSmsContacts(checked){document.querySelectorAll('.sms-contact-select').forEach(function(input){input.checked=checked});syncSmsSelectAll()}
  function syncSmsSelectAll(){var all=document.getElementById('select-all-contacts');if(!all)return;var items=Array.from(document.querySelectorAll('.sms-contact-select'));var selected=items.filter(function(item){return item.checked}).length;all.checked=items.length>0 && selected===items.length;all.indeterminate=selected>0 && selected<items.length;all.disabled=items.length===0}
  var SMS_TEMPLATE_STORAGE_KEY='bondYarSmsTemplate';
  function saveSmsTemplate(){var text=document.getElementById('sms-message-template').value;try{localStorage.setItem(SMS_TEMPLATE_STORAGE_KEY,text);var feedback=document.getElementById('contacts-feedback');feedback.classList.remove('error');feedback.textContent='متن پیام یادآور در همین مرورگر ذخیره شد.'}catch(error){var feedback=document.getElementById('contacts-feedback');feedback.textContent='ذخیره متن پیام در مرورگر انجام نشد.';feedback.classList.add('error')}}
  function saveSmsContacts(){
    try{localStorage.setItem(SMS_CONTACT_STORAGE_KEY,JSON.stringify(smsContacts));return true}
    catch(error){var feedback=document.getElementById('contacts-feedback');if(feedback){feedback.textContent='ذخیره در مرورگر انجام نشد.';feedback.classList.add('error')}return false}
  }
  function addSmsContact(){
    var nameInput=document.getElementById('contact-name');
    var mobileInput=document.getElementById('contact-mobile');
    var daysInput=document.getElementById('contact-days-before');
    var feedback=document.getElementById('contacts-feedback');
    var name=nameInput.value.trim(),mobile=mobileInput.value.trim(),days=Number(daysInput.value);
    feedback.classList.remove('error');
    if(!name || !mobile || daysInput.value==='' || !Number.isInteger(days) || days<0){feedback.textContent='نام، شماره موبایل و تعداد روز معتبر را وارد کنید.';feedback.classList.add('error');return}
    smsContacts.push({name:name,mobile:mobile,daysBefore:days});
    if(saveSmsContacts()){feedback.textContent='مخاطب با موفقیت افزوده و ذخیره شد.'}
    renderSmsContacts();nameInput.value='';mobileInput.value='';daysInput.value='1';nameInput.focus();
  }
  function initializeSmsContacts(){
    try{document.getElementById('sms-message-template').value=localStorage.getItem(SMS_TEMPLATE_STORAGE_KEY)||''}catch(error){}
    try{var saved=JSON.parse(localStorage.getItem(SMS_CONTACT_STORAGE_KEY)||'[]');if(Array.isArray(saved))smsContacts=saved.filter(function(c){return c && typeof c.name==='string' && typeof c.mobile==='string' && Number.isInteger(c.daysBefore) && c.daysBefore>=0})}catch(error){smsContacts=[]}
    renderSmsContacts();
  }
  function switchSettingsTab(name){
    var tabs=document.querySelectorAll('.settings-tab[role="tab"]');
    tabs.forEach(function(tab){var active=tab.id==='settings-tab-'+name;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',active?'true':'false');tab.tabIndex=active?0:-1});
    document.querySelectorAll('.settings-tab-content[role="tabpanel"]').forEach(function(panel){panel.hidden=panel.id!=='settings-panel-'+name});
    if(name==='account'){document.querySelectorAll('#settings-panel-account>#settings-password-section,#settings-panel-account>#settings-level-section,#settings-panel-account>#user-account-manager,#settings-panel-account>#access-manager').forEach(function(el){el.classList.remove('settings-subsection-hidden')})}
    closeRadialMenu('settings-radial-menu');
  }
  document.querySelectorAll('.settings-tab[role="tab"]').forEach(function(tab,index,tabs){tab.addEventListener('keydown',function(event){var next=index;if(event.key==='ArrowLeft')next=(index+1)%tabs.length;else if(event.key==='ArrowRight')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();switchSettingsTab(tabs[next].id.replace('settings-tab-',''))})});

  function showView(view){
    closeRadialMenu('calc-radial-menu');closeRadialMenu('settings-radial-menu');closeRadialMenu('fund-radial-menu');
    if(view==='settings'){
      // Entering settings always starts on a clean screen; panels open only from an explicit icon click.
      document.querySelectorAll('#settings-view .settings-tab-content').forEach(function(panel){panel.hidden=true});
      document.querySelectorAll('#settings-view .settings-tab').forEach(function(tab){tab.classList.remove('is-active')});
      document.querySelectorAll('#settings-view .settings-subsection-hidden').forEach(function(panel){panel.classList.remove('settings-subsection-hidden')});
    }
    if(view==='calc'){document.querySelectorAll('#calc-view>.card[id]').forEach(function(panel){panel.hidden=true});document.querySelectorAll('.calc-icon-tab').forEach(function(tab){tab.classList.remove('is-active')});var intro=document.querySelector('#calc-view>.hero');if(intro)intro.hidden=true}
    if(view==='fund'){var fundTabs=document.querySelectorAll('#fund-view .fund-tab');fundTabs.forEach(function(tab){var active=tab.getAttribute('aria-controls')==='fund-liquidity';tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',active?'true':'false')});document.querySelectorAll('#fund-view .fund-card').forEach(function(panel){panel.hidden=panel.id!=='fund-liquidity'})}
    var views = {dashboard:'dashboard-view', calc:'calc-view', settings:'settings-view', fund:'fund-view'};
    Object.keys(views).forEach(function(key){
      document.getElementById(views[key]).hidden = key !== view;
    });
  }

  // افزودن یک شیء به این آرایه کافی است؛ موقعیت حلقه با تعداد گزینه‌ها خودکار محاسبه می‌شود.
  var dashboardOpen = false;
  var DASHBOARD_ITEMS = [
    {id:'calc', label:'محاسبه', action:function(){showView('calc')}, svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" stroke-width="2.4"/></svg>'},
    {id:'settings', label:'تنظیمات', action:function(){showView('settings')}, svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.65 3.25h4.7l.62 2.13a7.3 7.3 0 0 1 1.58.91l2.13-.62 2.35 4.07-1.51 1.64a7.4 7.4 0 0 1 0 1.82l1.51 1.64-2.35 4.07-2.13-.62a7.3 7.3 0 0 1-1.58.91l-.62 2.13h-4.7l-.62-2.13a7.3 7.3 0 0 1-1.58-.91l-2.13.62-2.35-4.07 1.51-1.64a7.4 7.4 0 0 1 0-1.82L2.97 9.74l2.35-4.07 2.13.62a7.3 7.3 0 0 1 1.58-.91l.62-2.13Z"/><circle cx="12" cy="12" r="3.15"/></svg>'},
    {id:'fund', label:'صندوق', action:function(){showView('fund')}, svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v12H3zM2 5h20v3H2z"/><path d="M12 8v12M7 5c-2.2-2.8 2.1-4.5 5 0 2.9-4.5 7.2-2.8 5 0"/></svg>'},
    {id:'contracts', label:'قراردادها', action:'placeholder', svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6M9 19h3"/></svg>'},
    {id:'news', label:'اخبار', action:'placeholder', svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h14a1 1 0 0 1 1 1v14H6a2 2 0 0 1-2-2v-12a1 1 0 0 1 1-1Z"/><path d="M4 7h16M8 10h8v5H8zM8 18h3m3 0h2"/></svg>'},
    {id:'learning', label:'آموزش', action:'placeholder', svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.5C9.7 4.8 6.8 4.3 3.5 5v14c3.3-.7 6.2-.2 8.5 1.5 2.3-1.7 5.2-2.2 8.5-1.5V5c-3.3-.7-6.2-.2-8.5 1.5Z"/><path d="M12 6.5v14M6.5 9.5c1.2-.1 2.2.1 3.1.5m-3.1 2.5c1.2-.1 2.2.1 3.1.5m8-3.5c-1.2-.1-2.2.1-3.1.5m3.1 2.5c-1.2-.1-2.2.1-3.1.5"/></svg>'}
  ];
  function renderDashboard(){
    var container = document.getElementById('dashboard-items');
    var stage = document.getElementById('dashboard-stage');
    container.replaceChildren();
    var count = DASHBOARD_ITEMS.length;
    DASHBOARD_ITEMS.forEach(function(item,index){
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'dashboard-item';
      button.setAttribute('aria-label',item.label);
      button.setAttribute('aria-hidden', dashboardOpen ? 'false' : 'true');
      button.tabIndex = dashboardOpen ? 0 : -1;
      button.innerHTML = item.svg + '<span></span>';
      button.querySelector('span').textContent = item.label;
      button.addEventListener('click',function(){
        if(typeof item.action === 'function') item.action();
        else openPlaceholder(item.label);
      });
      // محاسبه موقعیت‌های دایره‌ای گزینه‌ها
      var angle = -90 + (360 * index / count);
      var itemSize = window.matchMedia('(max-width: 560px)').matches ? 92 : 128;
      var radius = Math.max(0, Math.min(stage.clientWidth, stage.clientHeight) / 2 - itemSize / 2 - 14);
      var radians = angle * Math.PI / 180;
      button.style.setProperty('--dx', (Math.cos(radians) * radius) + 'px');
      button.style.setProperty('--dy', (Math.sin(radians) * radius) + 'px');
      container.appendChild(button);
    });
  }
  function setDashboardOpen(open){
    dashboardOpen = !!open;
    var stage = document.getElementById('dashboard-stage');
    var center = stage.querySelector('.dashboard-center');
    stage.classList.toggle('is-open', dashboardOpen);
    center.setAttribute('aria-expanded', dashboardOpen ? 'true' : 'false');
    center.setAttribute('aria-label', dashboardOpen ? 'بستن گزینه‌های داشبورد' : 'نمایش گزینه‌های داشبورد');
    stage.querySelectorAll('.dashboard-item').forEach(function(item){
      item.setAttribute('aria-hidden', dashboardOpen ? 'false' : 'true');
      item.tabIndex = dashboardOpen ? 0 : -1;
    });
  }
  var dashboardCenter = document.querySelector('.dashboard-center');
  dashboardCenter.addEventListener('click',function(){setDashboardOpen(!dashboardOpen)});
  dashboardCenter.addEventListener('keydown',function(event){
    if(event.key==='Enter' || event.key===' '){event.preventDefault();setDashboardOpen(!dashboardOpen)}
  });
  document.addEventListener('click',function(event){
    var stage=document.getElementById('dashboard-stage');
    if(dashboardOpen && !stage.contains(event.target)) setDashboardOpen(false);
  });
  function openPlaceholder(label){
    var modal=document.getElementById('placeholder-modal');
    document.getElementById('placeholder-title').textContent='این بخش در نسخه‌های بعدی فعال می‌شود.';
    modal.hidden=false;
    modal.querySelector('.placeholder-close').focus();
  }
  function closePlaceholder(){document.getElementById('placeholder-modal').hidden=true}
  document.addEventListener('keydown',function(event){if(event.key==='Escape') closePlaceholder()});

  function togglePasswordVisibility(id,button){var input=document.getElementById(id);var show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'پنهان':'نمایش';button.setAttribute('aria-label',show?'پنهان‌کردن رمز عبور':'نمایش رمز عبور')}
  function positionRadialMenu(menu){if(!menu)return;var items=Array.from(menu.querySelectorAll('.radial-option'));if(menu.id==='calc-radial-menu'||menu.id==='settings-radial-menu'){var small=window.matchMedia('(max-width:560px)').matches;var size=small?56:64;var radius=Math.min(small?142:170,Math.max(96,(window.innerHeight-size-36)/2));items.forEach(function(item,index){var angle=(-90+180*index/Math.max(1,items.length-1))*Math.PI/180;item.style.setProperty('--dx',(-Math.cos(angle)*radius)+'px');item.style.setProperty('--dy',(Math.sin(angle)*radius)+'px')});return}var radius=window.matchMedia('(max-width:560px)').matches?102:126;var safe=Math.max(86,Math.min(radius,menu.clientWidth/2-40));items.forEach(function(item,index){var angle=-90+360*index/items.length;item.style.setProperty('--dx',(Math.cos(angle*Math.PI/180)*safe)+'px');item.style.setProperty('--dy',(Math.sin(angle*Math.PI/180)*safe)+'px')})}
  function toggleRadialMenu(id){var menu=document.getElementById(id);if(!menu)return;var open=!menu.classList.contains('is-open');menu.classList.toggle('is-open',open);var center=menu.querySelector('.radial-center');if(center){center.setAttribute('aria-expanded',open?'true':'false');center.setAttribute('aria-label',open?'بستن گزینه‌ها':'نمایش گزینه‌ها')}if(open)positionRadialMenu(menu)}
  function closeRadialMenu(id){var menu=document.getElementById(id);if(!menu)return;menu.classList.remove('is-open');var center=menu.querySelector('.radial-center');if(center)center.setAttribute('aria-expanded','false')}
  function openSettingsSection(name){var settings=document.getElementById('settings-view');var menu=document.getElementById('settings-radial-menu');var account=['password','level','accounts','roles'].indexOf(name)!==-1;
    document.querySelectorAll('#settings-panel-account>#settings-password-section,#settings-panel-account>#settings-level-section,#settings-panel-account>#user-account-manager,#settings-panel-account>#access-manager').forEach(function(el){el.classList.add('settings-subsection-hidden')});
    if(account){switchSettingsTab('account');var map={password:'settings-password-section',level:'settings-level-section',accounts:'user-account-manager',roles:'access-manager'};var target=document.getElementById(map[name]);if(target)target.classList.remove('settings-subsection-hidden')}
    else{switchSettingsTab(name)}
    if(menu){menu.querySelectorAll('.radial-option').forEach(function(item){item.classList.toggle('is-active',(item.dataset.settingSection||item.id.replace('settings-tab-',''))===name)})}closeRadialMenu('settings-radial-menu');
  }
  window.addEventListener('resize',function(){['calc-radial-menu','settings-radial-menu'].forEach(function(id){var el=document.getElementById(id);if(el&&el.classList.contains('is-open'))positionRadialMenu(el)})});
  function goFundPane(id,button){var target=document.getElementById(id);var fund=document.getElementById('fund-view');if(!target||!fund.contains(target))return;fund.querySelectorAll('.fund-card').forEach(function(panel){panel.hidden=panel!==target});fund.querySelectorAll('.fund-tab').forEach(function(tab){var active=tab===button;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',active?'true':'false')})}
  function goCalcPane(id,button){var target=document.getElementById(id);if(!target||!document.getElementById('calc-view').contains(target))return;document.querySelectorAll('#calc-view>.card[id]').forEach(function(panel){panel.hidden=panel!==target});document.querySelectorAll('.calc-icon-tab').forEach(function(tab){tab.classList.toggle('is-active',tab===button)});target.scrollIntoView({behavior:'smooth',block:'start'});closeRadialMenu('calc-radial-menu')}
  var USER_ACCOUNT_KEY='bazdehyar-user-accounts-v1', userAccounts=[];
  function persistUserAccounts(){try{localStorage.setItem(USER_ACCOUNT_KEY,JSON.stringify(userAccounts))}catch(e){}}
  function refreshAccountRoleOptions(){['account-role','access-level'].forEach(function(id){var select=document.getElementById(id);if(!select)return;var old=select.value;select.replaceChildren();var first=document.createElement('option');first.value='';first.textContent='انتخاب سطح دسترسی';select.appendChild(first);accessRoles.forEach(function(role){var o=document.createElement('option');o.value=role.id;o.textContent=role.title;select.appendChild(o)});if(accessRoles.some(function(r){return r.id===old}))select.value=old})}
  function renderUserAccounts(){var body=document.getElementById('user-accounts-list');if(!body)return;body.replaceChildren();userAccounts.forEach(function(account,index){var row=document.createElement('tr'),name=document.createElement('th');name.scope='row';name.textContent=account.username;row.appendChild(name);var roleCell=document.createElement('td'),select=document.createElement('select');select.setAttribute('aria-label','نقش حساب '+account.username);var empty=document.createElement('option');empty.value='';empty.textContent='بدون نقش';select.appendChild(empty);accessRoles.forEach(function(role){var o=document.createElement('option');o.value=role.id;o.textContent=role.title;select.appendChild(o)});select.value=account.roleId||'';select.addEventListener('change',function(){account.roleId=select.value;persistUserAccounts()});roleCell.appendChild(select);row.appendChild(roleCell);var actions=document.createElement('td'),del=document.createElement('button');del.type='button';del.className='role-delete';del.textContent='حذف';del.addEventListener('click',function(){userAccounts.splice(index,1);persistUserAccounts();renderUserAccounts()});actions.appendChild(del);row.appendChild(actions);body.appendChild(row)});var emptyEl=document.getElementById('accounts-empty');if(emptyEl)emptyEl.hidden=userAccounts.length>0}
  function saveUserAccount(){var username=document.getElementById('account-username').value.trim(),roleId=document.getElementById('account-role').value,fb=document.getElementById('accounts-feedback');fb.classList.remove('error');if(!username){fb.textContent='نام کاربری را وارد کنید.';fb.classList.add('error');return}if(!roleId){fb.textContent='یک سطح دسترسی انتخاب کنید.';fb.classList.add('error');return}var existing=userAccounts.find(function(a){return a.username.toLocaleLowerCase()===username.toLocaleLowerCase()});if(existing){existing.roleId=roleId;fb.textContent='نقش حساب به‌روزرسانی شد.'}else{userAccounts.push({username:username,roleId:roleId});fb.textContent='حساب با نقش انتخاب‌شده ثبت شد.'}persistUserAccounts();renderUserAccounts();document.getElementById('account-username').value=''}
  try{var savedAccounts=JSON.parse(localStorage.getItem(USER_ACCOUNT_KEY)||'[]');if(Array.isArray(savedAccounts))userAccounts=savedAccounts.filter(function(a){return a&&typeof a.username==='string'&&typeof a.roleId==='string'})}catch(e){}
  var ICON_STORAGE_KEY='bazdehyar-dashboard-icons-v1', customDashboardIcons=[];
  try{var savedIcons=JSON.parse(localStorage.getItem(ICON_STORAGE_KEY)||'[]');if(Array.isArray(savedIcons))customDashboardIcons=savedIcons.filter(function(i){return i&&typeof i.id==='string'&&typeof i.label==='string'&&typeof i.color==='string'})}catch(e){}
  function saveCustomIcons(){try{localStorage.setItem(ICON_STORAGE_KEY,JSON.stringify(customDashboardIcons))}catch(e){}}
  function customIconSvg(color){return '<svg viewBox="0 0 24 24" aria-hidden="true" style="color:'+color+'"><path d="M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/></svg>'}
  function applyCustomIcons(){DASHBOARD_ITEMS=DASHBOARD_ITEMS.filter(function(i){return !i.custom});customDashboardIcons.forEach(function(data){var action=data.action==='calc'?function(){showView('calc')}:data.action==='settings'?function(){showView('settings')}:function(){openPlaceholder(data.label)};DASHBOARD_ITEMS.push({id:data.id,label:data.label,color:data.color,custom:true,action:action,svg:customIconSvg(data.color)})});renderDashboard();buildRolePermissionOptions();if(typeof renderAccessRoles==='function')renderAccessRoles()}
  function cancelIconEdit(){document.getElementById('editing-icon-id').value='';document.getElementById('icon-title').value='';document.getElementById('icon-action-name').value='';document.getElementById('save-icon-button').textContent='افزودن آیکون جدید';document.getElementById('cancel-icon-edit').hidden=true}
  function addIconPreview(){var title=document.getElementById('icon-title').value.trim(), actionName=document.getElementById('icon-action-name').value.trim(), color=document.getElementById('icon-color').value, editing=document.getElementById('editing-icon-id').value, feedback;if(!title){document.getElementById('icon-title').focus();return}var id=editing||('custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7));var action=(actionName==='calc'||actionName==='settings')?actionName:'placeholder';var item={id:id,label:title,color:color,action:action};var idx=customDashboardIcons.findIndex(function(x){return x.id===id});if(idx>=0)customDashboardIcons[idx]=item;else customDashboardIcons.push(item);saveCustomIcons();applyCustomIcons();cancelIconEdit();renderCreatedIcons();}
  function editCustomIcon(id){var item=customDashboardIcons.find(function(x){return x.id===id});if(!item)return;document.getElementById('editing-icon-id').value=item.id;document.getElementById('icon-title').value=item.label;document.getElementById('icon-color').value=item.color;document.getElementById('icon-action-name').value=item.action==='placeholder'?'':item.action;document.getElementById('save-icon-button').textContent='ذخیره ویرایش';document.getElementById('cancel-icon-edit').hidden=false;document.getElementById('icon-title').focus()}
  function deleteCustomIcon(id){customDashboardIcons=customDashboardIcons.filter(function(x){return x.id!==id});saveCustomIcons();applyCustomIcons();renderCreatedIcons()}
  function renderCreatedIcons(){var list=document.getElementById('created-icons');if(!list)return;list.replaceChildren();if(!customDashboardIcons.length){var empty=document.createElement('p');empty.className='settings-note';empty.textContent='آیکون جدیدی ثبت نشده است.';list.appendChild(empty);return}customDashboardIcons.forEach(function(icon){var card=document.createElement('div');card.className='created-icon-preview';var swatch=document.createElement('span');swatch.className='created-icon-swatch';swatch.style.backgroundColor=icon.color;var text=document.createElement('div'),title=document.createElement('strong');title.textContent=icon.label;text.appendChild(title);var detail=document.createElement('small');detail.textContent=icon.action==='placeholder'?'نمایشی':icon.action;text.appendChild(detail);card.appendChild(swatch);card.appendChild(text);var actions=document.createElement('div');actions.className='icon-item-actions';[['ویرایش',function(){editCustomIcon(icon.id)}],['حذف',function(){deleteCustomIcon(icon.id)}]].forEach(function(pair){var b=document.createElement('button');b.type='button';b.textContent=pair[0];b.addEventListener('click',pair[1]);actions.appendChild(b)});card.appendChild(actions);list.appendChild(card)})}
  function renderSmsContacts(){var list=document.getElementById('sms-contacts-list'),empty=document.getElementById('contacts-empty');if(!list||!empty)return;list.replaceChildren();smsContacts.forEach(function(contact,index){var row=document.createElement('tr'),selectCell=document.createElement('td'),label=document.createElement('label');label.className='contact-row-select';var cb=document.createElement('input');cb.type='checkbox';cb.className='sms-contact-select';cb.dataset.index=String(index);cb.setAttribute('aria-label','انتخاب '+contact.name);cb.addEventListener('change',syncSmsSelectAll);label.appendChild(cb);selectCell.appendChild(label);row.appendChild(selectCell);[contact.name,contact.mobile].forEach(function(v){var td=document.createElement('td');td.textContent=v;row.appendChild(td)});var daysTd=document.createElement('td'),days=document.createElement('input');days.type='number';days.min='0';days.step='1';days.value=String(contact.daysBefore);days.className='settings-input contact-days-input';days.setAttribute('aria-label','روز قبل از سررسید برای '+contact.name);days.addEventListener('change',function(){updateSmsContactDays(index,days)});daysTd.appendChild(days);row.appendChild(daysTd);var actions=document.createElement('td'),edit=document.createElement('button');edit.type='button';edit.className='role-edit';edit.textContent='ویرایش';edit.addEventListener('click',function(){document.getElementById('contact-name').value=contact.name;document.getElementById('contact-mobile').value=contact.mobile;document.getElementById('contact-days-before').value=String(contact.daysBefore);editingSmsContact=index;var add=document.querySelector('#settings-panel-contacts button[onclick="addSmsContact()"]');add.textContent='ذخیره ویرایش مخاطب';document.getElementById('contact-name').focus()});actions.appendChild(edit);var del=document.createElement('button');del.type='button';del.className='role-delete';del.textContent='حذف';del.addEventListener('click',function(){smsContacts.splice(index,1);saveSmsContacts();renderSmsContacts()});actions.appendChild(del);row.appendChild(actions);list.appendChild(row)});empty.hidden=smsContacts.length>0;syncSmsSelectAll()}
  var editingSmsContact=-1;
  function addSmsContact(){var ni=document.getElementById('contact-name'),mi=document.getElementById('contact-mobile'),di=document.getElementById('contact-days-before'),fb=document.getElementById('contacts-feedback'),name=ni.value.trim(),mobile=mi.value.trim(),days=Number(di.value);fb.classList.remove('error');if(!name||!mobile||di.value===''||!Number.isInteger(days)||days<0){fb.textContent='نام، شماره موبایل و تعداد روز معتبر را وارد کنید.';fb.classList.add('error');return}var data={name:name,mobile:mobile,daysBefore:days};if(editingSmsContact>=0){smsContacts[editingSmsContact]=data;editingSmsContact=-1;fb.textContent='اطلاعات مخاطب ویرایش و ذخیره شد.'}else{smsContacts.push(data);fb.textContent='مخاطب با موفقیت افزوده و ذخیره شد.'}saveSmsContacts();renderSmsContacts();ni.value='';mi.value='';di.value='1';var add=document.querySelector('#settings-panel-contacts button[onclick="addSmsContact()"]');add.textContent='افزودن مخاطب'}
  var originalRenderAccessRoles=renderAccessRoles;
  renderAccessRoles=function(){originalRenderAccessRoles();refreshAccountRoleOptions();renderUserAccounts()};
  var originalInitializeAccessRoles=initializeAccessRoles;
  initializeAccessRoles=function(){originalInitializeAccessRoles();refreshAccountRoleOptions();renderUserAccounts()};

  initializeAccessRoles();
  initializeSmsContacts();
  renderDashboard();
  applyCustomIcons();
  renderCreatedIcons();
  refreshAccountRoleOptions();renderUserAccounts();
  window.addEventListener('resize',renderDashboard);
document.addEventListener('DOMContentLoaded',function(){['calc-radial-menu','settings-radial-menu'].forEach(function(id){positionRadialMenu(document.getElementById(id))})});
(function(){
  'use strict';
  var loginView=document.getElementById('login-view');
  var timeNode=document.getElementById('fintel-live-time');
  var jalaliNode=document.getElementById('fintel-jalali-date');
  var gregorianNode=document.getElementById('fintel-gregorian-date');
  var jalaliFormatter=new Intl.DateTimeFormat('fa-IR',{calendar:'persian',dateStyle:'full'});
  var gregorianFormatter=new Intl.DateTimeFormat('en-US',{dateStyle:'full'});
  var timeFormatter=new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  function updateFintelClock(){
    var now=new Date();
    timeNode.textContent=timeFormatter.format(now);
    jalaliNode.textContent=jalaliFormatter.format(now);
    gregorianNode.textContent=gregorianFormatter.format(now);
  }
  window.handleLogin=function(){
    var configured=window.FINTEL_CREDENTIALS||{};
    var expectedUser=typeof configured.username==='string'?configured.username:'admin';
    var expectedPassword=typeof configured.password==='string'?configured.password:'1234';
    var username=document.getElementById('fintel-username').value.trim();
    var password=document.getElementById('fintel-password').value;
    var errorNode=document.getElementById('fintel-login-error');
    if (username === expectedUser && password === expectedPassword) {
      try { localStorage.setItem('fintel_logged_in', 'true'); } catch (e) {}
      loginView.hidden = true;
      errorNode.textContent = '';
      return false;
    }
    errorNode.textContent = 'نام کاربری یا رمز عبور نادرست است.';
    return false;
  };
  updateFintelClock();
  window.setInterval(updateFintelClock,1000);
  try{if(localStorage.getItem('fintel_logged_in')==='true')loginView.hidden=true}catch(e){}
})();