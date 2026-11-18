# DK Live Map

An interactive map of festival grounds and large concert venues in Denmark — used as a business network map: edit sites, keep notes and contacts, and link key partners on the map.

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
- Search by name, city, address or notes
- Filter by category (festival / stadium / arena / hall) and minimum capacity
- Click a marker, use "Manage site / network" in its popup, or double-click a list entry to open the editor:
  - edit name, category, city, address, capacity, founded year, website, description
  - free-text notes per site
  - contacts per site: name, role, email, phone, social media links (Instagram, Facebook, LinkedIn, X, YouTube, TikTok, website) and a free note
  - key partners: tick other sites — partner links are drawn on the map and highlighted when a site is selected
- Partner-link layer can be toggled; list entries show contact/partner counts
- Edits are stored in your browser (localStorage); Export JSON / Import JSON to back up, share or move data; Reset edits restores the built-in dataset
- OpenStreetMap base map, heavily muted (grayscale + blur CSS filter, so buildings and street names stay unreadable when zoomed in) and capped at zoom 15; attribution in the map corner
- Marker size scales with capacity; responsive layout with a collapsible list on mobile

## Project layout

```
index.html               app shell
css/style.css            theme styling
js/data.js               venue dataset (source of truth, plain JS so file:// works)
js/app.js                Leaflet map, clustering, filters, editor, partner network
data/venues.geojson      GeoJSON export of the dataset (generated)
scripts/check-data.js    validates the dataset (ids, categories, DK coordinate bounds, links, contacts, partners)
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
  description: 'Short description.',
  notes: '',                 // optional free text
  contacts: [],              // optional: [{ id, name, role, email, phone, socials: { instagram, facebook, linkedin, x, youtube, tiktok, website }, note }]
  partners: []               // optional: ids of other sites in this dataset
}
```

Then run:

```sh
node scripts/check-data.js       # validate
node scripts/export-geojson.js   # regenerate data/venues.geojson
```

## Network data & storage

Site edits (address, notes, contacts, partners, etc.) are kept in the browser's localStorage as an overlay on the built-in `js/data.js` dataset — nothing is sent anywhere. Use **Export JSON** to download the full merged dataset and **Import JSON** to load it on this or another device/browser. **Reset edits** clears the overlay. The checked-in `js/data.js` only changes when you edit it in the repo and commit.

## Data notes

- 11 festival grounds and 22 large venues (as of this dataset).
- Coordinates are decimal degrees (WGS84), approximate to the site/building; refine against OpenStreetMap if needed.
- Capacities are approximate maximum attendance and are used for marker size and filtering only.
- Some sites ship with seeded public contacts/notes and one partner link (NorthSide ↔ Tinderbox, same owner); extend freely via the editor.
- Base map tiles: OpenStreetMap, muted via CSS filter (grayscale + 2px blur, max zoom 15) so zoomed-in detail stays unreadable — see the attribution in the map corner.
