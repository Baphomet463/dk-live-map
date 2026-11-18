# DK Live Map

An interactive map of festival grounds and large concert venues in Denmark.

![Static site](https://img.shields.io/badge/stack-static%20HTML%2FJS%20%2B%20Leaflet-blue)

## Run it

No build step. Either open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Deploy as-is to GitHub Pages (the repo root works as the Pages source).

## Features

- All festival sites and large venues (stadiums, arenas, halls) as clustered, color-coded markers
- Search by name, city or address
- Filter by category (festival / stadium / arena / hall) and minimum capacity
- Click a list entry to fly to the marker; click a marker to see details, capacity and official website
- OpenStreetMap base map (attribution in the map corner)
- Marker size scales with capacity; responsive layout with a collapsible list on mobile

## Project layout

```
index.html               app shell
css/style.css            theme styling
js/data.js               venue dataset (source of truth, plain JS so file:// works)
js/app.js                Leaflet map, clustering, filters, sidebar list
data/venues.geojson      GeoJSON export of the dataset (generated)
scripts/check-data.js    validates the dataset (ids, categories, DK coordinate bounds, links)
scripts/export-geojson.js  regenerates data/venues.geojson from js/data.js
```

## Adding or editing a venue

Edit the entry in `js/data.js`:

```js
{
  id: 'my-venue',            // unique, kebab-case
  name: 'My Venue',
  category: 'hall',          // festival | stadium | arena | hall
  city: 'Copenhagen',
  address: 'Street 1, 1000 City',
  capacity: 1500,            // approx. max guests
  founded: 1990,             // or null if unknown
  website: 'https://example.dk',
  lat: 55.6761,              // decimal degrees
  lng: 12.5683,
  description: 'Short description.'
}
```

Then run:

```sh
node scripts/check-data.js       # validate
node scripts/export-geojson.js   # regenerate data/venues.geojson
```

## Data notes

- 11 festival grounds and 22 large venues (as of this dataset).
- Coordinates are decimal degrees (WGS84), approximate to the site/building; refine against OpenStreetMap if needed.
- Capacities are approximate maximum attendance and are used for marker size and filtering only.
- Base map tiles: OpenStreetMap — see the attribution in the map corner.
