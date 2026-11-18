(function () {
  'use strict';

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

  var state = {
    query: '',
    categories: { festival: true, stadium: true, arena: true, hall: true },
    minCapacity: 0
  };

  var map;
  var cluster;
  var markersById = {};
  var listEl;
  var countEl;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function formatNumber(value) {
    return value.toLocaleString('en-US');
  }

  function markerRadius(capacity) {
    return Math.max(5, 4 + Math.sqrt(capacity) / 16);
  }

  function popupHtml(v) {
    var meta = CATEGORY_META[v.category];
    var rows = [
      '<p class="popup-title">' + escapeHtml(v.name) + '</p>',
      '<span class="popup-badge" style="background:' + meta.color + '">' + meta.label + '</span>',
      '<p class="popup-row">' + escapeHtml(v.city) + (v.address ? ' · ' + escapeHtml(v.address) : '') + '</p>',
      '<p class="popup-row">Capacity: <strong>' + formatNumber(v.capacity) + '</strong>' +
        (v.founded ? ' · since ' + v.founded : '') + '</p>',
      '<p class="popup-row"><a href="' + escapeHtml(v.website) + '" target="_blank" rel="noopener">Official website ↗</a></p>',
      '<p class="popup-desc">' + escapeHtml(v.description) + '</p>'
    ];
    return rows.join('');
  }

  function initMap() {
    map = L.map('map', { center: [55.9, 10.6], zoom: 7, worldCopyJump: true });
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });
    osm.addTo(map);
    cluster = L.markerClusterGroup({ maxClusterRadius: 55 });
    addMarkers();
    map.addLayer(cluster);
    if (cluster.getLayers().length) {
      map.fitBounds(cluster.getBounds().pad(0.06));
    }
  }

  function addMarkers() {
    DK_VENUES.forEach(function (v) {
      var meta = CATEGORY_META[v.category];
      var marker = L.circleMarker([v.lat, v.lng], {
        radius: markerRadius(v.capacity),
        color: meta.color,
        weight: 2,
        fillColor: meta.color,
        fillOpacity: 0.8
      });
      marker.bindPopup(popupHtml(v), { maxWidth: 320 });
      marker.on('click', function () { setActiveListItem(v.id); });
      marker.venueId = v.id;
      markersById[v.id] = marker;
      cluster.addLayer(marker);
    });
  }

  function filteredVenues() {
    var q = state.query;
    return DK_VENUES.filter(function (v) {
      if (!state.categories[v.category]) return false;
      if (v.capacity < state.minCapacity) return false;
      if (q) {
        var hay = (v.name + ' ' + v.city + ' ' + (v.address || '') + ' ' + (v.description || '')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return b.capacity - a.capacity; });
  }

  function renderList() {
    var items = filteredVenues();
    countEl.textContent = items.length + ' / ' + DK_VENUES.length + ' shown';
    listEl.innerHTML = '';
    items.forEach(function (v) {
      var meta = CATEGORY_META[v.category];
      var li = document.createElement('li');
      li.className = 'venue-item';
      li.dataset.id = v.id;
      li.innerHTML =
        '<span class="dot" style="background:' + meta.color + '"></span>' +
        '<span class="venue-main">' +
        '<span class="venue-name">' + escapeHtml(v.name) + '</span>' +
        '<span class="venue-sub">' + escapeHtml(v.city) + ' · ' + meta.label + ' · ' + formatNumber(v.capacity) + '</span>' +
        '</span>';
      li.addEventListener('click', function () { focusVenue(v.id); });
      listEl.appendChild(li);
    });
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
    var v = null;
    for (var i = 0; i < DK_VENUES.length; i++) {
      if (DK_VENUES[i].id === id) { v = DK_VENUES[i]; break; }
    }
    if (!v) return;
    var marker = markersById[id];
    map.flyTo([v.lat, v.lng], Math.max(map.getZoom(), 11), { duration: 0.5 });
    cluster.zoomToShowLayer(marker, function () { marker.openPopup(); });
    setActiveListItem(id);
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

    document.getElementById('sidebar-toggle').addEventListener('click', function () {
      document.body.classList.toggle('show-list');
    });
  }

  function init() {
    listEl = document.getElementById('venue-list');
    countEl = document.getElementById('count');
    buildFilters();
    initMap();
    renderList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
