/* Maher Jaidane · professional record (GitHub Pages)
   The content is README.md, unchanged. This script only rearranges it:
   - the header (name, roles, links, summary) becomes the record header;
   - each list becomes a table: credential (linked to its source) and issuer.
   Lines written "Issuer - Title" are split automatically. For a main credential
   without " - ", add its exact text and issuer to BY below. */
(function () {
  var main = document.getElementById('content');
  var head = document.getElementById('head');
  var toc = document.getElementById('toc');
  if (!main || !head) return;

  var BY = {
    'Certified Integrated AI Professional (IAIP™)': 'OCEG',
    'Certified AI-Native SAFe® Agilist': 'Scaled Agile, Inc.',
    'Certified SAFe® 6 Agilist (SA)': 'Scaled Agile, Inc.',
    'Professional Scrum Master™ II (PSM II)': 'Scrum.org',
    'Professional Scrum Product Owner™ II (PSPO II)': 'Scrum.org',
    'Disciplined Agile Scrum Master (DASM)': 'Project Management Institute',
    'ICAgile Certified Professional': 'ICAgile',
    'Lean Six Sigma Black Belt Certification (CLSSBB)': 'The Council for Six Sigma Certification',
    'Certified ISO/IEC 27001:2022 Lead Auditor': 'Mastermind',
    'Registered Scrum@Scale Fundamentals™': 'Agile Education by Scrum Inc.™'
  };
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  // 1. Record header
  var n = main.firstElementChild, parts = [];
  while (n && n.tagName !== 'HR') { var nx = n.nextElementSibling; parts.push(n); n = nx; }
  if (n) n.remove();
  var h1 = parts.shift(), roles = parts.shift(), bio = parts.shift(), links = parts.shift();
  if (h1) { h1.insertAdjacentHTML('beforebegin', '<p class="kind">Profile</p>'); }
  head.appendChild(document.querySelector('.kind'));
  if (h1) head.appendChild(h1);
  if (roles) { roles.className = 'roles'; roles.textContent = roles.textContent.split('|').map(function (s) { return s.trim(); }).join(' · '); head.appendChild(roles); }
  if (links) { links.className = 'links'; head.appendChild(links); }
  if (bio) {
    var s = document.createElement('section'); s.id = 'summary';
    s.innerHTML = '<h2>Summary</h2>'; bio.className = 'abs'; s.appendChild(bio);
    head.appendChild(s);
  }

  // 2. Sections and tables
  main.querySelectorAll('hr').forEach(function (h) { h.remove(); });
  var ids = [['summary', 'Summary']];
  main.querySelectorAll('h2').forEach(function (h) {
    var list = h.nextElementSibling;
    var sec = document.createElement('section');
    sec.id = h.id || h.textContent.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
    h.parentNode.insertBefore(sec, h); sec.appendChild(h);
    ids.push([sec.id, h.textContent]);
    if (!list || !/^(OL|UL)$/.test(list.tagName)) return;
    var rows = '';
    Array.prototype.forEach.call(list.children, function (li) {
      var a = li.querySelector('a');
      var txt = li.textContent.trim(), by = '', t = txt, i = txt.indexOf(' - ');
      if (i > 0) { by = txt.slice(0, i); t = txt.slice(i + 3); if (t.indexOf('SAFe® - ') === 0) { t = 'SAFe® ' + t.slice(8); } }
      if (!by && BY[txt]) by = BY[txt];
      var m = txt.match(/^Member, (.*)$/); if (m) { t = m[1]; by = 'Member'; }
      if (by === 'Scaled Agile Inc') by = 'Scaled Agile, Inc.';
      if (by === 'PMI') by = 'Project Management Institute';
      var title = a ? '<a href="' + a.href + '" target="_blank" rel="noopener">' + esc(t) + '</a>' : esc(t);
      rows += '<tr><td class="c">' + title + (by ? '<span class="by">' + esc(by) + '</span>' : '') + '</td></tr>';
    });
    var tbl = document.createElement('table');
    tbl.innerHTML = '<thead><tr><th>' + (list.tagName === 'OL' ? 'Credential / issuer' : 'Organization') + '</th></tr></thead><tbody>' + rows + '</tbody>';
    list.replaceWith(tbl);
    sec.appendChild(tbl);
  });
  // move remaining nodes (JSON-LD script) untouched
  toc.innerHTML = ids.map(function (x) { return '<li><a href="#' + x[0] + '">' + esc(x[1]) + '</a></li>'; }).join('');
})();
