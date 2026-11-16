'use strict';

require('../js/data.js');

var venues = globalThis.DK_VENUES;
var categories = ['festival', 'stadium', 'arena', 'hall'];
var ids = {};
var errors = [];

if (!Array.isArray(venues) || venues.length === 0) {
  console.error('DK_VENUES is missing or empty');
  process.exit(1);
}

venues.forEach(function (v) {
  if (!v.id || ids[v.id]) errors.push('missing or duplicate id: ' + v.id);
  ids[v.id] = true;
  if (categories.indexOf(v.category) === -1) errors.push(v.id + ': unknown category ' + v.category);
  if (!(typeof v.lat === 'number' && v.lat > 54.4 && v.lat < 57.9)) errors.push(v.id + ': lat out of Denmark range: ' + v.lat);
  if (!(typeof v.lng === 'number' && v.lng > 7.9 && v.lng < 13.1)) errors.push(v.id + ': lng out of Denmark range: ' + v.lng);
  ['name', 'city', 'website', 'description'].forEach(function (f) {
    if (!v[f]) errors.push(v.id + ': missing ' + f);
  });
  if (!(typeof v.capacity === 'number' && v.capacity > 0)) errors.push(v.id + ': bad capacity');
  if (!/^https:\/\//.test(v.website || '')) errors.push(v.id + ': website must be https');
  if (v.founded !== null && v.founded !== undefined && !(v.founded >= 1800 && v.founded <= 2030)) {
    errors.push(v.id + ': suspicious founded year ' + v.founded);
  }
});

if (errors.length) {
  console.error('DATA ERRORS:\n' + errors.join('\n'));
  process.exit(1);
}

console.log('OK: ' + venues.length + ' venues valid (' +
  venues.filter(function (v) { return v.category === 'festival'; }).length + ' festivals, ' +
  venues.filter(function (v) { return v.category !== 'festival'; }).length + ' venues)');
