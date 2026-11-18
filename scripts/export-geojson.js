'use strict';

var fs = require('fs');
var path = require('path');

require('../js/data.js');
var venues = globalThis.DK_VENUES;

var featureCollection = {
  type: 'FeatureCollection',
  features: venues.map(function (v) {
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [v.lng, v.lat] },
      properties: {
        id: v.id,
        name: v.name,
        category: v.category,
        city: v.city,
        address: v.address || null,
        capacity: v.capacity,
        founded: v.founded,
        website: v.website,
        description: v.description,
        notes: v.notes || null,
        contacts: v.contacts || [],
        partners: v.partners || []
      }
    };
  })
};

var outDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(outDir, { recursive: true });
var outFile = path.join(outDir, 'venues.geojson');
fs.writeFileSync(outFile, JSON.stringify(featureCollection, null, 2) + '\n');
console.log('Wrote ' + outFile + ' with ' + featureCollection.features.length + ' features');
