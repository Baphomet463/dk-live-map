(function () {
  'use strict';

  var STORAGE_KEY = 'dk-live-map-overlay-v1';

  var CATEGORY_META = {
    festival: { label: 'Festival', color: '#ff4d6d' },
    stadium: { label: 'Stadium', color: '#4dc3ff' },
    arena: { label: 'Arena', color: '#ffd166' },
    hall: { label: 'Hall / venue', color: '#7bd88f' }
  };

  var CAPACITY_FILTERS = [
    { value: 0, label: 'Any capacity' },
    { value: 1000, label: '1,000+ guests' },
    { value: 5000, label: '5,000+ guests' },
    { value: 10000, label: '10,000+ guests' },
    { value: 20000, label: '20,000+ guests' }
  ];

  var SOCIAL_FIELDS = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'x', label: 'X (Twitter)' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'website', label: 'Website' }
  ];

  var EDITABLE_FIELDS = ['name', 'category', 'city', 'address', 'capacity', 'founded', 'website', 'description', 'notes', 'contacts', 'partners'];

  var state = {
    query: '',
    categories: { festival: true, stadium: true, arena: true, hall: true },
    minCapacity: 0,
    showPartners: true,
    editorId: null,
    draft: { contacts: [], partners: [] }
  };

  var overlay = loadOverlay();
  var map;
  var cluster;
  var edgesLayer;
  var highlightLayer;
  var markersById = {};
  var listEl;
  var countEl;

  function loadOverlay() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { venues: {} };
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.venues || typeof parsed.venues !== 'object') return { venues: {} };
      return parsed;
    } catch (e) {
      return { venues: {} };
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
    } catch (e) {
      setIoStatus('Could not save locally (storage full or blocked)');
    }
  }

  function baseById() {
    var m = {};
    DK_VENUES.forEach(function (v) { m[v.id] = v; });
    return m;
  }

  function mergedVenues() {
    return DK_VENUES.map(function (b) {
      return Object.assign({}, b, overlay.venues[b.id] || {});
    });
  }

  function venueById(id) {
    var bases = baseById();
    var b = bases[id];
    if (!b) return null;
    return Object.assign({}, b, overlay.venues[id] || {});
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function formatNumber(value) {
    return Number(value).toLocaleString('en-US');
  }

  function markerRadius(capacity) {
    return Math.max(5, 4 + Math.sqrt(Number(capacity) || 0) / 16);
  }

  function popupHtml(v) {
    var meta = CATEGORY_META[v.category] || CATEGORY_META.hall;
    var contacts = Array.isArray(v.contacts) ? v.contacts : [];
    var partners = Array.isArray(v.partners) ? v.partners : [];
    var rows = [
      '<p class="popup-title">' + escapeHtml(v.name) + '</p>',
      '<span class="popup-badge" style="background:' + meta.color + '">' + meta.label + '</span>',
      '<p class="popup-row">' + escapeHtml(v.city) + (v.address ? ' · ' + escapeHtml(v.address) : '') + '</p>',
      '<p class="popup-row">Capacity: <strong>' + formatNumber(v.capacity) + '</strong>' +
        (v.founded ? ' · since ' + v.founded : '') + '</p>',
      '<p class="popup-row"><a href="' + escapeHtml(v.website) + '" target="_blank" rel="noopener">Official website ↗</a></p>',
      '<p class="popup-desc">' + escapeHtml(v.description) + '</p>',
      '<p class="popup-row">Contacts: <strong>' + contacts.length + '</strong> · Partners: <strong>' + partners.length + '</strong>' +
        (v.notes ? ' · <em>has notes</em>' : '') + '</p>',
      '<p class="popup-row"><button type="button" class="manage-btn" data-id="' + escapeHtml(v.id) + '">Manage site / network</button></p>'
    ];
    return rows.join('');
  }

  function partnerPairs() {
    var seen = {};
    var pairs = [];
    mergedVenues().forEach(function (v) {
      (Array.isArray(v.partners) ? v.partners : []).forEach(function (pid) {
        var other = venueById(pid);
        if (!other) return;
        var key = [v.id, pid].sort().join('|');
        if (seen[key]) return;
        seen[key] = true;
        pairs.push({ a: v, b: other });
      });
    });
    return pairs;
  }

  function initMap() {
    map = L.map('map', { center: [55.9, 10.6], zoom: 7, worldCopyJump: true, maxZoom: 15 });
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 15
    });
    osm.addTo(map);
    edgesLayer = L.layerGroup().addTo(map);
    highlightLayer = L.layerGroup().addTo(map);
    cluster = L.markerClusterGroup({ maxClusterRadius: 55 });
    addMarkers();
    map.addLayer(cluster);
    if (cluster.getLayers().length) {
      map.fitBounds(cluster.getBounds().pad(0.06));
    }
    map.on('popupopen', function (e) {
      var el = e.popup && e.popup.getElement ? e.popup.getElement() : null;
      if (!el) return;
      var btn = el.querySelector('.manage-btn');
      if (btn) {
        btn.addEventListener('click', function () { openEditor(btn.getAttribute('data-id')); });
      }
    });
  }

  function addMarkers() {
    mergedVenues().forEach(function (v) {
      var meta = CATEGORY_META[v.category] || CATEGORY_META.hall;
      var marker = L.circleMarker([v.lat, v.lng], {
        radius: markerRadius(v.capacity),
        color: meta.color,
        weight: 2,
        fillColor: meta.color,
        fillOpacity: 0.8
      });
      marker.bindPopup(popupHtml(v), { maxWidth: 320 });
      marker.on('click', function () {
        setActiveListItem(v.id);
        highlightPartners(v.id);
      });
      marker.venueId = v.id;
      markersById[v.id] = marker;
      cluster.addLayer(marker);
    });
  }

  function rebuildMarkers() {
    cluster.clearLayers();
    markersById = {};
    addMarkers();
    updatePartnerEdges();
  }

  function updatePartnerEdges() {
    edgesLayer.clearLayers();
    var pairs = state.showPartners ? partnerPairs() : [];
    pairs.forEach(function (p) {
      L.polyline([[p.a.lat, p.a.lng], [p.b.lat, p.b.lng]], {
        color: '#b388ff', weight: 2, opacity: 0.65, dashArray: '6 6'
      }).addTo(edgesLayer);
    });
    updateCount();
  }

  function highlightPartners(id) {
    highlightLayer.clearLayers();
    var v = venueById(id);
    if (!v) return;
    (Array.isArray(v.partners) ? v.partners : []).forEach(function (pid) {
      var o = venueById(pid);
      if (!o) return;
      L.polyline([[v.lat, v.lng], [o.lat, o.lng]], {
        color: '#ffd166', weight: 4, opacity: 0.95
      }).addTo(highlightLayer);
      L.circleMarker([o.lat, o.lng], {
        radius: markerRadius(o.capacity) + 4,
        color: '#ffd166', weight: 3, fillColor: '#ffd166', fillOpacity: 0.35
      }).addTo(highlightLayer);
    });
  }

  function filteredVenues() {
    var q = state.query;
    return mergedVenues().filter(function (v) {
      if (!state.categories[v.category]) return false;
      if (Number(v.capacity) < state.minCapacity) return false;
      if (q) {
        var hay = (v.name + ' ' + v.city + ' ' + (v.address || '') + ' ' + (v.description || '') + ' ' + (v.notes || '')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return Number(b.capacity) - Number(a.capacity); });
  }

  function updateCount() {
    var items = filteredVenues();
    countEl.textContent = items.length + ' / ' + DK_VENUES.length + ' sites · ' + partnerPairs().length + ' partner link(s)';
  }

  function renderList() {
    var items = filteredVenues();
    listEl.innerHTML = '';
    items.forEach(function (v) {
      var meta = CATEGORY_META[v.category] || CATEGORY_META.hall;
      var contacts = Array.isArray(v.contacts) ? v.contacts.length : 0;
      var partners = Array.isArray(v.partners) ? v.partners.length : 0;
      var extra = (contacts ? ' · ' + contacts + ' contact' + (contacts > 1 ? 's' : '') : '') +
        (partners ? ' · ' + partners + ' partner' + (partners > 1 ? 's' : '') : '');
      var li = document.createElement('li');
      li.className = 'venue-item';
      li.dataset.id = v.id;
      li.innerHTML =
        '<span class="dot" style="background:' + meta.color + '"></span>' +
        '<span class="venue-main">' +
        '<span class="venue-name">' + escapeHtml(v.name) + '</span>' +
        '<span class="venue-sub">' + escapeHtml(v.city) + ' · ' + meta.label + ' · ' + formatNumber(v.capacity) + extra + '</span>' +
        '</span>';
      li.addEventListener('click', function () { focusVenue(v.id); });
      li.addEventListener('dblclick', function () { openEditor(v.id); });
      listEl.appendChild(li);
    });
    updateCount();
  }

  function setActiveListItem(id) {
    var prev = listEl.querySelector('.venue-item.active');
    if (prev) prev.classList.remove('active');
    var el = listEl.querySelector('.venue-item[data-id="' + id + '"]');
    if (el) {
      el.classList.add('active');
      el.scrollIntoView({ block: 'nearest' });
    }
  }

  function focusVenue(id) {
    var v = venueById(id);
    if (!v) return;
    var marker = markersById[id];
    map.flyTo([v.lat, v.lng], Math.max(map.getZoom(), 11), { duration: 0.5 });
    if (marker) {
      cluster.zoomToShowLayer(marker, function () { marker.openPopup(); });
    }
    setActiveListItem(id);
    highlightPartners(id);
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value === null || value === undefined ? '' : String(value);
  }

  function openEditor(id) {
    var v = venueById(id);
    if (!v) return;
    state.editorId = id;
    state.draft = {
      contacts: JSON.parse(JSON.stringify(Array.isArray(v.contacts) ? v.contacts : [])),
      partners: (Array.isArray(v.partners) ? v.partners : []).slice()
    };
    document.getElementById('editor-title').textContent = v.name;
    document.getElementById('editor-coords').textContent = 'Coordinates: ' + v.lat + ', ' + v.lng + ' (read-only)';
    setVal('f-name', v.name);
    setVal('f-category', v.category);
    setVal('f-city', v.city);
    setVal('f-address', v.address);
    setVal('f-capacity', v.capacity);
    setVal('f-founded', v.founded);
    setVal('f-website', v.website);
    setVal('f-description', v.description);
    setVal('f-notes', v.notes);
    document.getElementById('partner-search').value = '';
    renderContacts();
    renderPartners();
    document.getElementById('editor').hidden = false;
    document.getElementById('save-status').textContent = '';
  }

  function closeEditor() {
    state.editorId = null;
    document.getElementById('editor').hidden = true;
    highlightLayer.clearLayers();
  }

  function renderContacts() {
    var wrap = document.getElementById('contacts');
    wrap.innerHTML = '';
    state.draft.contacts.forEach(function (c, i) {
      var fs = document.createElement('fieldset');
      fs.className = 'contact';
      var legend = document.createElement('legend');
      legend.innerHTML = 'Contact ' + (i + 1) + ' <button type="button" class="remove-contact" data-idx="' + i + '">remove</button>';
      fs.appendChild(legend);
      [['name', 'Name'], ['role', 'Role / title'], ['email', 'Email'], ['phone', 'Phone']].forEach(function (f) {
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = f[1];
        inp.setAttribute('data-idx', i);
        inp.setAttribute('data-key', f[0]);
        inp.value = c[f[0]] || '';
        fs.appendChild(inp);
      });
      SOCIAL_FIELDS.forEach(function (s) {
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = s.label + ' URL';
        inp.setAttribute('data-idx', i);
        inp.setAttribute('data-social', s.key);
        inp.value = (c.socials && c.socials[s.key]) || '';
        fs.appendChild(inp);
      });
      var ta = document.createElement('textarea');
      ta.placeholder = 'Free note about this contact';
      ta.rows = 2;
      ta.setAttribute('data-idx', i);
      ta.setAttribute('data-key', 'note');
      ta.value = c.note || '';
      fs.appendChild(ta);
      wrap.appendChild(fs);
    });
  }

  function renderPartners() {
    var q = document.getElementById('partner-search').value.trim().toLowerCase();
    var wrap = document.getElementById('partners-list');
    wrap.innerHTML = '';
    mergedVenues().forEach(function (v) {
      if (v.id === state.editorId) return;
      if (q && (v.name + ' ' + v.city).toLowerCase().indexOf(q) === -1) return;
      var label = document.createElement('label');
      label.className = 'partner-item';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = state.draft.partners.indexOf(v.id) !== -1;
      cb.setAttribute('data-pid', v.id);
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + v.name + ' (' + v.city + ')'));
      wrap.appendChild(label);
    });
  }

  function saveEditor() {
    var id = state.editorId;
    if (!id) return;
    var bases = baseById();
    var base = bases[id];
    var rec = {};
    rec.name = val('f-name') || base.name;
    rec.category = val('f-category') || base.category;
    rec.city = val('f-city') || base.city;
    rec.address = val('f-address');
    rec.capacity = Number(val('f-capacity')) || base.capacity;
    rec.founded = val('f-founded') ? Number(val('f-founded')) : null;
    rec.website = val('f-website') || base.website;
    rec.description = val('f-description') || base.description;
    rec.notes = val('f-notes');
    rec.contacts = state.draft.contacts.map(function (c, i) {
      var socials = {};
      SOCIAL_FIELDS.forEach(function (s) {
        if (c.socials && c.socials[s.key]) socials[s.key] = c.socials[s.key];
      });
      return {
        id: c.id || ('c' + Date.now() + '_' + i),
        name: c.name || '',
        role: c.role || '',
        email: c.email || '',
        phone: c.phone || '',
        socials: socials,
        note: c.note || ''
      };
    });
    rec.partners = state.draft.partners.slice();
    overlay.venues[id] = rec;
    persist();
    rebuildMarkers();
    renderList();
    highlightPartners(id);
    var v = venueById(id);
    document.getElementById('editor-title').textContent = v ? v.name : '';
    document.getElementById('save-status').textContent = 'Saved ' + new Date().toLocaleTimeString();
  }

  function exportData() {
    var data = mergedVenues();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dk-live-map-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    setIoStatus('Exported ' + data.length + ' sites');
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw new Error('file is not a JSON array');
        var bases = baseById();
        var n = 0;
        arr.forEach(function (item) {
          if (!item || !item.id || !bases[item.id]) return;
          var rec = {};
          EDITABLE_FIELDS.forEach(function (f) {
            if (item[f] !== undefined) rec[f] = item[f];
          });
          overlay.venues[item.id] = rec;
          n++;
        });
        persist();
        rebuildMarkers();
        renderList();
        if (state.editorId) openEditor(state.editorId);
        setIoStatus('Imported ' + n + ' site(s)');
      } catch (e) {
        setIoStatus('Import failed: ' + e.message);
      }
    };
    reader.onerror = function () { setIoStatus('Import failed: could not read file'); };
    reader.readAsText(file);
  }

  function setIoStatus(msg) {
    var el = document.getElementById('io-status');
    if (el) el.textContent = msg;
  }

  function buildFilters() {
    var catWrap = document.getElementById('category-filters');
    Object.keys(CATEGORY_META).forEach(function (key) {
      var meta = CATEGORY_META[key];
      var label = document.createElement('label');
      label.className = 'chip';
      label.innerHTML = '<input type="checkbox" checked data-category="' + key + '"> ' +
        '<span class="dot" style="background:' + meta.color + '"></span> ' + meta.label;
      label.querySelector('input').addEventListener('change', function (e) {
        state.categories[key] = e.target.checked;
        label.classList.toggle('off', !e.target.checked);
        renderList();
      });
      catWrap.appendChild(label);
    });

    var select = document.getElementById('capacity-filter');
    CAPACITY_FILTERS.forEach(function (f) {
      var opt = document.createElement('option');
      opt.value = f.value;
      opt.textContent = f.label;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () {
      state.minCapacity = Number(select.value);
      renderList();
    });

    var partnerToggle = document.getElementById('toggle-partners');
    partnerToggle.checked = state.showPartners;
    partnerToggle.addEventListener('change', function () {
      state.showPartners = partnerToggle.checked;
      updatePartnerEdges();
    });

    document.getElementById('search').addEventListener('input', function (e) {
      state.query = e.target.value.trim().toLowerCase();
      renderList();
    });

    var legend = document.getElementById('legend');
    Object.keys(CATEGORY_META).forEach(function (key) {
      var meta = CATEGORY_META[key];
      var span = document.createElement('span');
      span.innerHTML = '<span class="dot" style="background:' + meta.color + '"></span>' + meta.label;
      legend.appendChild(span);
    });
    var linkLegend = document.createElement('span');
    linkLegend.innerHTML = '<span class="link-sample"></span> partner link';
    legend.appendChild(linkLegend);

    document.getElementById('sidebar-toggle').addEventListener('click', function () {
      document.body.classList.toggle('show-list');
    });

    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-file').addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) importData(e.target.files[0]);
      e.target.value = '';
    });
    document.getElementById('reset-btn').addEventListener('click', function () {
      if (!window.confirm('Reset all local edits (notes, contacts, partners, address changes) back to the built-in dataset?')) return;
      overlay = { venues: {} };
      persist();
      rebuildMarkers();
      renderList();
      if (state.editorId) openEditor(state.editorId);
      setIoStatus('Local edits reset');
    });

    var catSelect = document.getElementById('f-category');
    Object.keys(CATEGORY_META).forEach(function (key) {
      var opt = document.createElement('option');
      opt.value = key;
      opt.textContent = CATEGORY_META[key].label;
      catSelect.appendChild(opt);
    });

    document.getElementById('editor-close').addEventListener('click', closeEditor);
    document.getElementById('editor-save').addEventListener('click', saveEditor);
    document.getElementById('add-contact').addEventListener('click', function () {
      state.draft.contacts.push({ id: '', name: '', role: '', email: '', phone: '', socials: {}, note: '' });
      renderContacts();
    });
    document.getElementById('partner-search').addEventListener('input', renderPartners);

    var contactsEl = document.getElementById('contacts');
    contactsEl.addEventListener('input', function (e) {
      var t = e.target;
      var idx = Number(t.getAttribute('data-idx'));
      if (isNaN(idx) || !state.draft.contacts[idx]) return;
      if (t.getAttribute('data-social')) {
        state.draft.contacts[idx].socials = state.draft.contacts[idx].socials || {};
        state.draft.contacts[idx].socials[t.getAttribute('data-social')] = t.value.trim();
      } else if (t.getAttribute('data-key')) {
        state.draft.contacts[idx][t.getAttribute('data-key')] = t.value;
      }
    });
    contactsEl.addEventListener('click', function (e) {
      if (e.target.classList && e.target.classList.contains('remove-contact')) {
        state.draft.contacts.splice(Number(e.target.getAttribute('data-idx')), 1);
        renderContacts();
      }
    });
    document.getElementById('partners-list').addEventListener('change', function (e) {
      var pid = e.target.getAttribute('data-pid');
      if (!pid) return;
      var i = state.draft.partners.indexOf(pid);
      if (e.target.checked && i === -1) state.draft.partners.push(pid);
      if (!e.target.checked && i !== -1) state.draft.partners.splice(i, 1);
    });
  }

  function init() {
    listEl = document.getElementById('venue-list');
    countEl = document.getElementById('count');
    buildFilters();
    initMap();
    renderList();
    updatePartnerEdges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
