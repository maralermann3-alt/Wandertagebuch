(function () {
  "use strict";

  var STORAGE_KEY = "wandertagebuch.touren.v1";
  var CATEGORIES = ["Wanderung", "Bike & Hike", "Mountainbike"];
  var CATEGORY_COLOR = {
    "Wanderung": "#3F5D45",
    "Bike & Hike": "#C1622D",
    "Mountainbike": "#2B2B26"
  };
  var CATEGORY_GRADIENT = {
    "Wanderung": "linear-gradient(135deg, #4A6B4F 0%, #6C8B62 100%)",
    "Bike & Hike": "linear-gradient(135deg, #8A6A4E 0%, #B08D68 100%)",
    "Mountainbike": "linear-gradient(135deg, #3E4A52 0%, #5C6B72 100%)"
  };

  var STAR_FILLED =
    '<svg width="{{S}}" height="{{S}}" viewBox="0 0 24 24" fill="#C1622D" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  var STAR_EMPTY =
    '<svg width="{{S}}" height="{{S}}" viewBox="0 0 24 24" fill="none" stroke="#C7BFA8" stroke-width="1.5" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  function starIcon(filled, size) {
    var tpl = filled ? STAR_FILLED : STAR_EMPTY;
    return tpl.split("{{S}}").join(String(size));
  }

  function starsHtml(rating, size) {
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out += starIcon(i <= Math.round(rating), size);
    }
    return out;
  }

  function icon(name, size, color) {
    size = size || 20;
    color = color || "currentColor";
    var icons = {
      list: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
      map: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
      back: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
      plus: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      camera: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
      elevation: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      distance: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12" stroke-dasharray="3 3"/><circle cx="3" cy="12" r="1.6" fill="' + color + '" stroke="none"/><circle cx="21" cy="12" r="1.6" fill="' + color + '" stroke="none"/></svg>',
      duration: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      peak: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20l6-11 4 7 3-4 5 8z"/></svg>',
      search: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      filter: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="17" x2="14" y2="17"/></svg>',
      bike: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>',
      boot: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h5v7l6.5 2.6a3 3 0 0 1 1.9 2.8V18H6z"/><path d="M4 21h16"/><path d="M6 7.5h5"/></svg>',
      cloud: '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
      pin: '<svg viewBox="0 0 24 24" fill="' + color + '" stroke="#FFFFFF" stroke-width="1.2" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>'
    };
    return icons[name] || "";
  }

  function uid() {
    return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------------- image store (IndexedDB) ----------------

  var imgCache = {};
  var idbPromise = null;

  function idb() {
    if (!idbPromise) {
      idbPromise = new Promise(function (resolve, reject) {
        var req = indexedDB.open("wandertagebuch-img", 1);
        req.onupgradeneeded = function () { req.result.createObjectStore("images"); };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      });
    }
    return idbPromise;
  }

  function idbTx(mode, fn) {
    return idb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction("images", mode);
        var result = fn(tx.objectStore("images"));
        tx.oncomplete = function () { resolve(result && result.result); };
        tx.onerror = tx.onabort = function () { reject(tx.error); };
      });
    });
  }

  var blobUrls = {};

  function dataUrlToBlobUrl(dataUrl) {
    if (dataUrl.indexOf("data:") !== 0) return dataUrl;
    var comma = dataUrl.indexOf(",");
    var mime = dataUrl.slice(5, dataUrl.indexOf(";"));
    var bin = atob(dataUrl.slice(comma + 1));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  }

  function imgSrc(ref) {
    if (!ref) return "";
    if (ref.indexOf("idb:") !== 0) return ref;
    if (!imgCache[ref]) return "";
    if (!blobUrls[ref]) blobUrls[ref] = dataUrlToBlobUrl(imgCache[ref]);
    return blobUrls[ref];
  }

  function tourImages(t) {
    return [t.cover].concat(t.photos || []).map(imgSrc).filter(Boolean);
  }

  function slidesHtml(t) {
    var imgs = tourImages(t);
    if (!imgs.length) return "";
    var loop = imgs.length > 1;
    var shown = loop ? [imgs[imgs.length - 1]].concat(imgs, [imgs[0]]) : imgs;
    var slides = shown.map(function (src) {
      return '<div class="slide" style="background-image:url(' + src + ')"></div>';
    }).join("");
    var dots = loop
      ? '<div class="dots" aria-hidden="true">' + imgs.map(function (_, i) {
          return '<span class="dot' + (i === 0 ? " active" : "") + '"></span>';
        }).join("") + "</div>"
      : "";
    return '<div class="card-slides"' + (loop ? ' data-loop="' + imgs.length + '"' : "") + ">" + slides + "</div>" + dots;
  }

  function storeImage(dataUrl) {
    var ref = "idb:" + uid();
    return putImage(ref, dataUrl).then(function () { return ref; });
  }

  function deleteImages(refs) {
    refs.forEach(function (r) { delete imgCache[r]; });
    idbTx("readwrite", function (s) { refs.forEach(function (r) { s.delete(r); }); }).catch(function () {});
  }

  function tourRefs(t) {
    return [t.cover].concat(t.photos || []).filter(function (r) { return r && r.indexOf("idb:") === 0; });
  }

  function initImages() {
    return idb().then(function () {
      return idbTx("readonly", function (s) {
        var keysReq = s.getAllKeys();
        var valsReq = s.getAll();
        return { get result() { return { keys: keysReq.result, vals: valsReq.result }; } };
      });
    }).then(function (all) {
      all.keys.forEach(function (k, i) { imgCache[k] = all.vals[i]; });
      return migrateLegacyImages();
    }).catch(function () {});
  }

  function migrateLegacyImages() {
    var jobs = [];
    var changed = false;
    state.tours.forEach(function (t) {
      if (t.cover && t.cover.indexOf("data:") === 0) {
        jobs.push(storeImage(t.cover).then(function (ref) { t.cover = ref; changed = true; }));
      }
      (t.photos || []).forEach(function (p, i) {
        if (p.indexOf("data:") === 0) {
          jobs.push(storeImage(p).then(function (ref) { t.photos[i] = ref; changed = true; }));
        }
      });
    });
    return Promise.all(jobs).then(function () { if (changed) saveTours(state.tours); });
  }

  if (navigator.storage && navigator.storage.persist) navigator.storage.persist();

  // ---------------- data layer ----------------

  function hashStr(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h;
  }

  var MIGRATION_TS = 1789000000000;

  var SEED_EXTRA = {
    "Lünersee": { lat: 47.0667, lon: 9.717 },
    "Zürsersee": { lat: 47.176, lon: 10.178 },
    "Tobelsee": { lat: 47.04085, lon: 9.87119, hmFuss: "400 m" },
    "Falzer Kopf": { lat: 47.33165, lon: 10.04994, hmFuss: "350 m" },
    "Gurtisspitze": { lat: 47.18205, lon: 9.63202 },
    "Hohe Köpfe": { lat: 47.177, lon: 9.638, hmRad: "400 m", hmFuss: "650 m" },
    "Steg": { lat: 47.11258, lon: 9.57666 },
    "Saxer Lücke": { lat: 47.2465, lon: 9.4245, hmRad: "400 m", hmFuss: "350 m" },
    "Seealpsee, Äscher": { lat: 47.26827, lon: 9.40077 },
    "Hohe Kugel": { lat: 47.33513, lon: 9.71592 },
    "Fritzensee": { lat: 47.10114, lon: 9.91366 },
    "Mondspitze": { lat: 47.15271, lon: 9.72635, hmRad: "2000 m", hmFuss: "300 m" },
    "Drei Schwestern": { lat: 47.17557, lon: 9.57297, hmRad: "1000 m" },
    "Schesaplana": { lat: 47.05385, lon: 9.70736 },
    "Kanisfluh": { lat: 47.33135, lon: 9.92543 },
    "Gamsfreiheit": { lat: 47.02949, lon: 9.81284 },
    "Drusator": { lat: 47.01808, lon: 9.82537 },
    "Rote Wand": { lat: 47.18634, lon: 9.9851 },
    "Naafkopf und Pfälzer Hütte": { lat: 47.06077, lon: 9.60705 },
    "Goppaschrofen": { lat: 47.17565, lon: 9.61316 },
    "Galinakopf": { lat: 47.15164, lon: 9.62059, hmRad: "700 m", hmFuss: "650 m" },
    "Mittagspitz und Runde von Tobelsee": { lat: 47.043, lon: 9.865 },
    "Langsee": { lat: 47.05124, lon: 10.14618 }
  };

  function seedData() {
    function T(o) {
      var h = hashStr(o.title);
      var t = Object.assign({
        id: "seed-" + h.toString(36),
        km: "",
        dauer: "",
        ratingGesamt: 0,
        ratingAussicht: 0,
        ratingNatur: 0,
        beschreibung: "",
        weg: "",
        zusatz: "",
        cover: null,
        photos: [],
        hmRad: "",
        hmFuss: ""
      }, o, SEED_EXTRA[o.title] || {});
      if (t.category === "Bike & Hike") t.hm = "";
      return t;
    }

    return [
      T({ title: "Lünersee", category: "Wanderung", region: "Brandnertal", date: "11.10.2025", hm: "450 m", dauer: "1:00 h", ratingGesamt: 4.5, ratingAussicht: 4, zusatz: "Anreise 40 Min", beschreibung: "Recht viel los oben, gute Halbtagestour mit Optionen zum Weiterlaufen." }),
      T({ title: "Zürsersee", category: "Wanderung", region: "Arlberg", date: "13.10.2025", hm: "600 m", dauer: "1:30 h", ratingGesamt: 3, ratingAussicht: 3.75, zusatz: "Anreise 50 Min", beschreibung: "Wenig los, aber viel zugebaut (Skigebiet)." }),
      T({ title: "Tobelsee", category: "Bike & Hike", region: "Montafon", date: "15.10.2025", hm: "400 m", dauer: "2:00 h", ratingGesamt: 4.75, ratingAussicht: 4, zusatz: "Anreise 50 Min", beschreibung: "Wenig los, Heidelbeeren, ruhiger See.", weg: "Bike: 1 h; Hike: 1 h (400 hm)." }),
      T({ title: "Falzer Kopf", category: "Bike & Hike", region: "Bregenzerwald", date: "17.10.2025", hm: "350 m", dauer: "2:00 h", ratingGesamt: 4.5, ratingAussicht: 4.5, zusatz: "Anreise 1 h", beschreibung: "Wenig los, Heidelbeeren, Radweg nur okay.", weg: "Bike: 1 h; Hike: 1 h (350 hm)." }),
      T({ title: "Gurtisspitze", category: "Wanderung", region: "Gurtis", date: "18.10.2025", hm: "850 m", dauer: "2:00 h", ratingGesamt: 5, ratingAussicht: 5 }),
      T({ title: "Hohe Köpfe", category: "Bike & Hike", region: "Gurtis", date: "20.10.2025", hm: "1050 m", dauer: "2:40 h", ratingGesamt: 4.25, ratingAussicht: 5, beschreibung: "Zieht sich recht lang, nur für Geübte, viel hoch & runter, einige Gämse.", weg: "Bike: 40 Min, 400 hm; Hike: 2 h, 650 hm." }),
      T({ title: "Steg", category: "Wanderung", region: "Liechtenstein", date: "30.10.2025", hm: "400 m", dauer: "3:00 h", ratingGesamt: 4, ratingAussicht: 4, zusatz: "Anreise 50 Min", beschreibung: "Guter langer Spaziergang, bunte Lärchen." }),
      T({ title: "Saxer Lücke", category: "Bike & Hike", region: "Appenzell", date: "31.10.2025", hm: "750 m", dauer: "2:00 h", ratingGesamt: 5, ratingAussicht: 5, zusatz: "Anreise 50 Min", weg: "Bike: 1 h, 400 hm; Hike: 1 h, 350 hm." }),
      T({ title: "Seealpsee, Äscher", category: "Wanderung", region: "Appenzell", date: "01.11.2025", hm: "700 m", dauer: "1:15 h", ratingGesamt: 4.5, ratingAussicht: 4.25, zusatz: "Anreise 1 h", beschreibung: "Recht viel los, 50 % der Zeit für den Aufstieg gebraucht." }),
      T({ title: "Hohe Kugel", category: "Wanderung", region: "Fraxern", date: "25.04.2026", hm: "700 m", dauer: "3:00 h", ratingGesamt: 4.5, ratingAussicht: 4.5, zusatz: "Anreise 30 Min", beschreibung: "Blick auf den Bodensee, Rundumblick.", weg: "Rundweg, zurück über Millrütte." }),
      T({ title: "Fritzensee", category: "Wanderung", region: "Bartholomäberg", date: "26.04.2026", hm: "500 m", dauer: "1:30 h", ratingGesamt: 4.5, ratingAussicht: 4, zusatz: "Anreise 40 Min, auch mit Fahrrad möglich", beschreibung: "Schöner See mit Floß, Ziegenmilcheis.", weg: "Rundweg." }),
      T({ title: "Mondspitze", category: "Bike & Hike", region: "Nenzing", date: "08.05.2026", hm: "2300 m", ratingGesamt: 4.5, ratingAussicht: 4.25, zusatz: "Ab Gurtis, sehr viel Fahrrad fahren notwendig", weg: "Fahrrad: 2000 hm; Wandern: 300 hm." }),
      T({ title: "Drei Schwestern", category: "Bike & Hike", region: "Gurtis / Amerlügen", date: "–", hm: "1100 m", dauer: "4-5 h", ratingGesamt: 4.75, ratingAussicht: 4.75, zusatz: "Ab Gurtis oder ab Amerlügen, alpine Tour, nur für Geübte", weg: "Mit dem Fahrrad zur Hinterälpele über Amerlügen (ca. 1000 hm), dann zu Fuß weiter (1:45 h bis zum Gipfel). Danach Möglichkeit, noch auf den Garsellakopf zu gehen (ca. 30 Min, 100 hm). Rückweg über die Garsellaalpe – ein wunderschöner Rundweg." }),
      T({ title: "Schesaplana", category: "Wanderung", region: "Brandnertal", date: "–", hm: "1400 m", ratingGesamt: 5, ratingAussicht: 5, zusatz: "Start: Lünerseebahn Talstation, Anreise ca. 35 Min, alpine Tour", beschreibung: "Alpine Tour." }),
      T({ title: "Kanisfluh", category: "Wanderung", region: "Vorarlberg", date: "–" }),
      T({ title: "Gamsfreiheit", category: "Wanderung", region: "Vorarlberg", date: "–" }),
      T({ title: "Drusator", category: "Wanderung", region: "Vorarlberg", date: "–", hm: "500 m", dauer: "1:30 h", weg: "Caschinahütte ab Linderhütte." }),
      T({ title: "Hohe Türme", category: "Wanderung", region: "Vorarlberg", date: "–" }),
      T({ title: "Rote Wand", category: "Wanderung", region: "Vorarlberg", date: "–" }),
      T({ title: "Naafkopf und Pfälzer Hütte", category: "Wanderung", region: "Vorarlberg", date: "–" }),
      T({ title: "Goppaschrofen", category: "Wanderung", region: "Vorarlberg", date: "–" }),
      T({ title: "Galinakopf", category: "Bike & Hike", region: "Gurtis", date: "–", hm: "1350 m", dauer: "4-5 h", ratingGesamt: 4, ratingAussicht: 4, weg: "Mit dem Fahrrad auf Gamp (700 hm), dann zu Fuß weiter ca. 2 Stunden bis zum Gipfel (650 hm)." }),
      T({ title: "Mittagspitz und Runde von Tobelsee", category: "Wanderung", region: "Vorarlberg", date: "–" }),
      T({ title: "Langsee", category: "Wanderung", region: "Vorarlberg", date: "–" })
    ];
  }

  function loadTours() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var seeded = seedData();
        saveTours(seeded);
        return seeded;
      }
      var tours = JSON.parse(raw);
      var seedIds = {};
      var taken = {};
      var seedsById = {};
      var migrated = false;
      seedData().forEach(function (s) { seedIds[s.title] = s.id; seedsById[s.id] = s; });
      tours.forEach(function (t) { taken[t.id] = true; });
      tours.forEach(function (t) {
        var sid = seedIds[t.title];
        if (sid && t.id !== sid && !taken[sid] && t.id.indexOf("seed-") !== 0) {
          delete taken[t.id];
          t.id = sid;
          taken[sid] = true;
          migrated = true;
        }
      });
      tours.forEach(function (t) {
        var s = seedsById[t.id];
        if (!s) return;
        var changed = false;
        if (t.lat === undefined && s.lat !== undefined) {
          t.lat = s.lat;
          t.lon = s.lon;
          changed = true;
        }
        if (t.category === "Bike & Hike" && t.hmRad === undefined && t.hmFuss === undefined) {
          t.hmRad = s.hmRad || "";
          t.hmFuss = s.hmFuss || "";
          changed = true;
        }
        if (changed && (t.updatedAt || 0) < MIGRATION_TS) t.updatedAt = MIGRATION_TS;
        migrated = migrated || changed;
      });
      if (migrated) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tours)); } catch (e) {}
      }
      return tours;
    } catch (e) {
      return seedData();
    }
  }

  function saveTours(tours) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
      scheduleSync();
      return true;
    } catch (e) {
      return false;
    }
  }

  var GIPFEL_KEY = "wandertagebuch.gipfel.v1";

  function loadGipfel() {
    try {
      var raw = localStorage.getItem(GIPFEL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveGipfel() {
    try {
      localStorage.setItem(GIPFEL_KEY, JSON.stringify(state.gipfel));
      scheduleSync();
      return true;
    } catch (e) {
      return false;
    }
  }

  var META_KEY = "wandertagebuch.meta.v1";
  var SYNC_KEY = "wandertagebuch.sync.v1";

  function loadMeta() {
    try {
      var raw = localStorage.getItem(META_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  var state = {
    tours: loadTours(),
    gipfel: loadGipfel(),
    deleted: loadMeta(),
    filter: "Alle",
    search: "",
    hmRange: "",
    timeRange: "",
    filtersOpen: false
  };

  // ---------------- sync (Netlify function + blobs) ----------------

  var syncState = { running: false, pending: false, timer: null, msg: "", kind: "" };

  function getPw() {
    try {
      var raw = localStorage.getItem(SYNC_KEY);
      return raw ? JSON.parse(raw).password || "" : "";
    } catch (e) {
      return "";
    }
  }

  function setPw(pw) {
    try {
      if (pw) localStorage.setItem(SYNC_KEY, JSON.stringify({ password: pw }));
      else localStorage.removeItem(SYNC_KEY);
    } catch (e) {}
  }

  function saveMeta() {
    try { localStorage.setItem(META_KEY, JSON.stringify(state.deleted)); } catch (e) {}
  }

  function markDeleted(key) {
    state.deleted[key] = Date.now();
    saveMeta();
    scheduleSync();
  }

  function setSyncMsg(msg, kind) {
    syncState.msg = msg;
    syncState.kind = kind || "";
    var el = document.getElementById("syncStatus");
    if (el) {
      el.textContent = msg;
      el.className = "sync-status " + (kind || "");
    }
  }

  function scheduleSync() {
    if (!state || !getPw()) return;
    clearTimeout(syncState.timer);
    syncState.timer = setTimeout(function () { syncNow(); }, 1500);
  }

  function api(method, query, body) {
    return fetch("/api?" + query, { method: method, headers: { "x-sync-password": getPw() }, body: body })
      .then(function (res) {
        if (res.status === 401) throw new Error("auth");
        if (res.status === 503) throw new Error("notconfigured");
        return res;
      });
  }

  function pickNewer(local, remote) {
    var ul = local.updatedAt || 0;
    var ur = remote.updatedAt || 0;
    if (ul !== ur) return ul > ur ? local : remote;
    var cl = tourRefs(local).length;
    var cr = tourRefs(remote).length;
    if (cl !== cr) return cl > cr ? local : remote;
    return remote;
  }

  function mergeById(localArr, remoteArr, keyFn, prefix, deleted) {
    var l = {}, r = {}, keys = [];
    localArr.forEach(function (x) { l[keyFn(x)] = x; keys.push(keyFn(x)); });
    remoteArr.forEach(function (x) {
      var k = keyFn(x);
      r[k] = x;
      if (!l[k]) keys.push(k);
    });
    var out = [];
    keys.forEach(function (k) {
      var item = l[k] && r[k] ? pickNewer(l[k], r[k]) : (l[k] || r[k]);
      var t = deleted[prefix + k];
      if (t !== undefined) {
        if (t >= (item.updatedAt || 0)) return;
        delete deleted[prefix + k];
      }
      out.push(item);
    });
    return out;
  }

  function mergeData(remote) {
    var deleted = Object.assign({}, state.deleted);
    Object.keys(remote.deleted || {}).forEach(function (k) {
      deleted[k] = Math.max(deleted[k] || 0, remote.deleted[k]);
    });
    var tours = mergeById(state.tours, remote.tours || [], function (t) { return t.id; }, "tour:", deleted);
    var fresh = tours.filter(function (t) { return t.createdAt; }).sort(function (a, b) { return b.createdAt - a.createdAt; });
    var rest = tours.filter(function (t) { return !t.createdAt; });
    var gipfel = mergeById(state.gipfel, remote.gipfel || [], function (g) { return g.name.toLowerCase(); }, "gipfel:", deleted);
    return { tours: fresh.concat(rest), gipfel: gipfel, deleted: deleted };
  }

  function putImage(ref, dataUrl) {
    imgCache[ref] = dataUrl;
    return idbTx("readwrite", function (s) { return s.put(dataUrl, ref); });
  }

  function runPool(items, size, worker) {
    var i = 0;
    function next() {
      if (i >= items.length) return Promise.resolve();
      var item = items[i++];
      return worker(item).then(next);
    }
    var starters = [];
    for (var n = 0; n < Math.min(size, items.length); n++) starters.push(next());
    return Promise.all(starters);
  }

  function syncImages(tours) {
    var seen = {};
    var refs = [];
    tours.forEach(function (t) {
      tourRefs(t).forEach(function (r) { if (!seen[r]) { seen[r] = true; refs.push(r); } });
    });
    return api("GET", "list=1").then(function (res) {
      if (!res.ok) throw new Error("http " + res.status);
      return res.json();
    }).then(function (remoteList) {
      var remoteSet = {};
      remoteList.forEach(function (r) { remoteSet[r] = true; });
      var ups = refs.filter(function (r) { return imgCache[r] && !remoteSet[r]; });
      var downs = refs.filter(function (r) { return !imgCache[r] && remoteSet[r]; });
      var total = ups.length + downs.length;
      var done = 0;
      var progress = function () { setSyncMsg("Bilder " + (++done) + " von " + total + " …", "busy"); };
      return runPool(ups, 4, function (r) {
        return api("PUT", "key=" + encodeURIComponent(r), imgCache[r]).then(function (res) {
          if (!res.ok) throw new Error("http " + res.status);
          progress();
        });
      }).then(function () {
        return runPool(downs, 4, function (r) {
          return api("GET", "key=" + encodeURIComponent(r)).then(function (res) {
            if (!res.ok) { progress(); return null; }
            return res.text().then(function (text) { return putImage(r, text); }).then(progress);
          });
        });
      }).then(function () { return downs.length > 0; });
    });
  }

  function rerenderIfSafe() {
    var name = parseRoute().name;
    if (["liste", "karte", "tour", "gipfel", "gipfeldetail"].indexOf(name) > -1) render();
  }

  function pad2(n) { return String(n).padStart(2, "0"); }

  function syncNow() {
    if (!getPw()) return Promise.resolve();
    if (syncState.running) { syncState.pending = true; return Promise.resolve(); }
    syncState.running = true;
    setSyncMsg("Synchronisiere …", "busy");
    var changed = false;
    var remote = { tours: [], gipfel: [], deleted: {} };

    return api("GET", "key=data").then(function (res) {
      if (res.ok) return res.json().then(function (d) { remote = d; });
      if (res.status !== 404) throw new Error("http " + res.status);
    }).then(function () {
      var before = JSON.stringify([state.tours, state.gipfel]);
      var merged = mergeData(remote);
      state.tours = merged.tours;
      state.gipfel = merged.gipfel;
      state.deleted = merged.deleted;
      changed = JSON.stringify([state.tours, state.gipfel]) !== before;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tours));
        localStorage.setItem(GIPFEL_KEY, JSON.stringify(state.gipfel));
      } catch (e) {}
      saveMeta();
      return syncImages(state.tours);
    }).then(function (downloaded) {
      if (downloaded) changed = true;
      var out = JSON.stringify({ tours: state.tours, gipfel: state.gipfel, deleted: state.deleted });
      var old = JSON.stringify({ tours: remote.tours || [], gipfel: remote.gipfel || [], deleted: remote.deleted || {} });
      if (out === old) return;
      return api("PUT", "key=data", out).then(function (res) {
        if (!res.ok) throw new Error("http " + res.status);
      });
    }).then(function () {
      var d = new Date();
      setSyncMsg("Zuletzt synchronisiert: " + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + " Uhr", "ok");
      if (changed) rerenderIfSafe();
    }).catch(function (e) {
      var m = e && e.message;
      if (m === "auth") setSyncMsg("Passwort falsch.", "err");
      else if (m === "notconfigured") setSyncMsg("Auf dem Server ist noch kein Passwort eingerichtet (SYNC_PASSWORD in Netlify).", "err");
      else setSyncMsg("Synchronisierung fehlgeschlagen (keine Verbindung?). Später erneut versuchen.", "err");
    }).then(function () {
      syncState.running = false;
      if (syncState.pending) { syncState.pending = false; scheduleSync(); }
    });
  }

  document.addEventListener("visibilitychange", function () { if (!document.hidden) scheduleSync(); });
  window.addEventListener("online", scheduleSync);

  function getGipfel(id) {
    for (var i = 0; i < state.gipfel.length; i++) {
      if (state.gipfel[i].id === id) return state.gipfel[i];
    }
    return null;
  }

  function todayIso() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function fmtDate(iso) {
    var p = String(iso).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : iso;
  }

  function lastVisit(g) {
    return g.visits.slice().sort().pop() || "";
  }

  function getTour(id) {
    for (var i = 0; i < state.tours.length; i++) {
      if (state.tours[i].id === id) return state.tours[i];
    }
    return null;
  }

  var HM_OPTIONS = [["0-500", "bis 500 m"], ["500-1000", "500–1000 m"], ["1000+", "über 1000 m"]];
  var TIME_OPTIONS = [["0-120", "bis 2 h"], ["120-240", "2–4 h"], ["240+", "über 4 h"]];

  function parseNum(str) {
    var m = String(str || "").replace(/\./g, "").match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  }

  function totalHm(t) {
    if (t.category === "Bike & Hike" && (parseNum(t.hmRad) !== null || parseNum(t.hmFuss) !== null)) {
      return (parseNum(t.hmRad) || 0) + (parseNum(t.hmFuss) || 0);
    }
    return parseNum(t.hm);
  }

  function parseMinutes(str) {
    var s = String(str || "");
    var m = s.match(/(\d+):(\d+)/);
    if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    m = s.match(/(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)/);
    if (m) return Math.round(((parseFloat(m[1].replace(",", ".")) + parseFloat(m[2].replace(",", "."))) / 2) * 60);
    m = s.match(/(\d+(?:[.,]\d+)?)\s*h/);
    if (m) return Math.round(parseFloat(m[1].replace(",", ".")) * 60);
    return null;
  }

  function inRange(value, range) {
    if (!range) return true;
    if (value === null) return false;
    if (range.slice(-1) === "+") return value >= parseInt(range, 10);
    var p = range.split("-");
    return value >= parseInt(p[0], 10) && value < parseInt(p[1], 10);
  }

  function filteredTours() {
    var q = state.search.trim().toLowerCase();
    return state.tours.filter(function (t) {
      if (state.filter !== "Alle" && t.category !== state.filter) return false;
      if (q) {
        var hay = [t.title, t.region, t.category, t.beschreibung, t.weg, t.zusatz].join(" ").toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return inRange(totalHm(t), state.hmRange) && inRange(parseMinutes(t.dauer), state.timeRange);
    });
  }

  // ---------------- routing ----------------

  function parseRoute() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    if (parts.length === 0) return { name: "liste" };
    if (parts[0] === "karte") return { name: "karte" };
    if (parts[0] === "neu") return { name: "neu" };
    if (parts[0] === "sync") return { name: "sync" };
    if (parts[0] === "gipfel" && parts[1] === "neu") return { name: "gipfelneu" };
    if (parts[0] === "gipfel" && parts[1]) return { name: "gipfeldetail", id: parts[1] };
    if (parts[0] === "gipfel") return { name: "gipfel" };
    if (parts[0] === "tour" && parts[1] && parts[2] === "bearbeiten") return { name: "bearbeiten", id: parts[1] };
    if (parts[0] === "tour" && parts[1]) return { name: "tour", id: parts[1] };
    return { name: "liste" };
  }

  function navigate(hash) {
    location.hash = hash;
  }

  window.addEventListener("hashchange", render);

  // ---------------- render ----------------

  function render() {
    var root = document.getElementById("app");
    var route = parseRoute();
    destroyMaps();
    if (route.name === "liste") root.innerHTML = renderListe();
    else if (route.name === "karte") root.innerHTML = renderKarte();
    else if (route.name === "tour") root.innerHTML = renderDetail(route.id);
    else if (route.name === "neu") root.innerHTML = renderNeu(null);
    else if (route.name === "bearbeiten") root.innerHTML = renderNeu(getTour(route.id));
    else if (route.name === "sync") root.innerHTML = renderSync();
    else if (route.name === "gipfel") root.innerHTML = renderGipfel();
    else if (route.name === "gipfelneu") root.innerHTML = renderGipfelNeu();
    else if (route.name === "gipfeldetail") root.innerHTML = renderGipfelDetail(route.id);
    else root.innerHTML = renderListe();

    wireUp(route);
    window.scrollTo(0, 0);
  }

  function chipsHtml() {
    var all = ["Alle"].concat(CATEGORIES);
    return all.map(function (c) {
      var active = state.filter === c;
      return '<button type="button" class="chip' + (active ? " active" : "") +
        '" data-filter="' + escapeHtml(c) + '" aria-pressed="' + active + '">' +
        escapeHtml(c) + "</button>";
    }).join("");
  }

  function navbarHtml(active) {
    return (
      '<div class="navbar">' +
      '<a href="#/liste" class="navbtn' + (active === "liste" ? " active" : "") + '"' +
      (active === "liste" ? ' aria-current="page"' : "") + ">" +
      icon("list", 20, active === "liste" ? "#3F5D45" : "#57574C") +
      "Liste</a>" +
      '<a href="#/karte" class="navbtn' + (active === "karte" ? " active" : "") + '"' +
      (active === "karte" ? ' aria-current="page"' : "") + ">" +
      icon("map", 20, active === "karte" ? "#3F5D45" : "#57574C") +
      "Karte</a>" +
      '<a href="#/gipfel" class="navbtn' + (active === "gipfel" ? " active" : "") + '"' +
      (active === "gipfel" ? ' aria-current="page"' : "") + ">" +
      icon("peak", 20, active === "gipfel" ? "#3F5D45" : "#57574C") +
      "Gipfel</a>" +
      "</div>"
    );
  }

  function statItems(t) {
    var items = [];
    if (t.category === "Bike & Hike") {
      if (t.hmRad) items.push({ icon: "bike", val: t.hmRad, label: "Höhenmeter Rad" });
      if (t.hmFuss) items.push({ icon: "boot", val: t.hmFuss, label: "Höhenmeter Fuß" });
      if (!t.hmRad && !t.hmFuss && t.hm) items.push({ icon: "elevation", val: t.hm, label: "Höhenmeter" });
    } else if (t.hm) {
      items.push({ icon: "elevation", val: t.hm, label: "Höhenmeter" });
    }
    if (t.dauer) items.push({ icon: "duration", val: t.dauer, label: "Dauer" });
    if (t.category === "Mountainbike" && t.km) items.push({ icon: "distance", val: t.km, label: "Distanz" });
    return items;
  }

  function cardsHtml() {
    var tours = filteredTours();
    if (!tours.length) return '<div class="empty-state">Keine passenden Touren gefunden.</div>';
    var ratingStar = '<svg width="13" height="13" viewBox="0 0 24 24" fill="#C1622D" stroke="#C1622D" stroke-width="1" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    return tours.map(function (t) {
      var bg = "background: " + (CATEGORY_GRADIENT[t.category] || CATEGORY_GRADIENT["Wanderung"]) + ";";
      return (
        '<a class="card" href="#/tour/' + t.id + '" style="' + bg + '" aria-label="' +
        escapeHtml(t.title) + ' öffnen">' +
        slidesHtml(t) +
        '<div class="card-top">' +
        '<div class="card-title">' + escapeHtml(t.title) + "</div>" +
        '<div class="rating-pill">' + ratingStar + " " + fmtRating(t.ratingGesamt) + "</div>" +
        "</div>" +
        '<div class="card-bottom">' +
        statItems(t).map(function (i) {
          return '<span class="card-stat" title="' + i.label + '">' + icon(i.icon, 15, "#FFFFFF") + escapeHtml(i.val) + "</span>";
        }).join("") +
        "</div></a>"
      );
    }).join("");
  }

  function toolbarHtml() {
    var activeCount = (state.hmRange ? 1 : 0) + (state.timeRange ? 1 : 0);
    var group = function (label, opts, current, key) {
      return (
        '<div class="filter-group"><div class="filter-label">' + label + '</div><div class="filter-chips">' +
        opts.map(function (o) {
          var on = current === o[0];
          return '<button type="button" class="chip' + (on ? " active" : "") + '" data-range="' + key +
            '" data-value="' + o[0] + '" aria-pressed="' + on + '">' + o[1] + "</button>";
        }).join("") + "</div></div>"
      );
    };
    return (
      '<div class="toolbar">' +
      '<label class="search-wrap">' + icon("search", 18, "#57574C") +
      '<input id="searchInput" type="search" placeholder="Touren suchen …" autocomplete="off" aria-label="Touren suchen" value="' +
      escapeHtml(state.search) + '"></label>' +
      '<button type="button" class="filter-btn' + (state.filtersOpen || activeCount ? " on" : "") +
      '" data-action="toggle-filters" aria-label="Filter" aria-expanded="' + state.filtersOpen + '">' +
      icon("filter", 20, "currentColor") +
      '<span class="filter-badge"' + (activeCount ? "" : " hidden") + ">" + activeCount + "</span></button>" +
      "</div>" +
      '<div class="chips">' + chipsHtml() + "</div>" +
      '<div class="filter-panel" id="filterPanel"' + (state.filtersOpen ? "" : " hidden") + ">" +
      group("Höhenmeter", HM_OPTIONS, state.hmRange, "hm") +
      group("Dauer", TIME_OPTIONS, state.timeRange, "time") +
      '<button type="button" class="filter-reset" data-action="reset-filters">Filter zurücksetzen</button></div>'
    );
  }

  function wireToolbar(root, refresh) {
    var input = root.querySelector("#searchInput");
    var panel = root.querySelector("#filterPanel");
    var filterBtn = root.querySelector(".filter-btn");
    var badge = root.querySelector(".filter-badge");

    function syncUi() {
      root.querySelectorAll(".chip[data-filter]").forEach(function (c) {
        var on = c.getAttribute("data-filter") === state.filter;
        c.classList.toggle("active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      root.querySelectorAll(".chip[data-range]").forEach(function (c) {
        var cur = c.getAttribute("data-range") === "hm" ? state.hmRange : state.timeRange;
        var on = c.getAttribute("data-value") === cur;
        c.classList.toggle("active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      var n = (state.hmRange ? 1 : 0) + (state.timeRange ? 1 : 0);
      badge.textContent = n;
      badge.hidden = !n;
      filterBtn.classList.toggle("on", state.filtersOpen || n > 0);
      filterBtn.setAttribute("aria-expanded", String(state.filtersOpen));
      panel.hidden = !state.filtersOpen;
    }

    input.addEventListener("input", function () {
      state.search = input.value;
      refresh();
    });
    root.querySelectorAll(".chip[data-filter]").forEach(function (c) {
      c.addEventListener("click", function () {
        state.filter = c.getAttribute("data-filter");
        syncUi();
        refresh();
      });
    });
    root.querySelectorAll(".chip[data-range]").forEach(function (c) {
      c.addEventListener("click", function () {
        var key = c.getAttribute("data-range") === "hm" ? "hmRange" : "timeRange";
        var val = c.getAttribute("data-value");
        state[key] = state[key] === val ? "" : val;
        syncUi();
        refresh();
      });
    });
    filterBtn.addEventListener("click", function () {
      state.filtersOpen = !state.filtersOpen;
      syncUi();
    });
    root.querySelector('[data-action="reset-filters"]').addEventListener("click", function () {
      state.hmRange = "";
      state.timeRange = "";
      syncUi();
      refresh();
    });
  }

  function refreshList(root) {
    root.querySelector("#listBody").innerHTML = cardsHtml();
    wireSlides(root);
  }

  function wireSlides(root) {
    root.querySelectorAll(".card-slides[data-loop]").forEach(function (strip) {
      var n = parseInt(strip.getAttribute("data-loop"), 10);
      var dots = strip.parentNode.querySelectorAll(".dot");
      var timer = null;
      strip.scrollLeft = strip.clientWidth;
      strip.addEventListener("scroll", function () {
        var w = strip.clientWidth;
        var idx = Math.round(strip.scrollLeft / w);
        var real = (idx - 1 + n) % n;
        dots.forEach(function (d, i) { d.classList.toggle("active", i === real); });
        clearTimeout(timer);
        timer = setTimeout(function () {
          var i = Math.round(strip.scrollLeft / w);
          if (i === 0) strip.scrollLeft = n * w;
          else if (i === n + 1) strip.scrollLeft = w;
        }, 120);
      }, { passive: true });
    });
  }

  function renderListe() {
    return (
      '<div class="screen">' +
      navbarHtml("liste") +
      '<div class="header">' + syncLinkHtml() +
      '<div class="header-title">Wandertagebuch</div>' +
      '<div class="header-sub">Deine Touren in Vorarlberg</div>' +
      "</div>" +
      toolbarHtml() +
      '<div class="list-body" id="listBody">' + cardsHtml() + "</div>" +
      '<a href="#/neu" class="fab" aria-label="Neue Tour anlegen">' + icon("plus", 22, "#FFFFFF") + "</a>" +
      "</div>"
    );
  }

  function fmtRating(r) {
    return (Math.round(r * 10) / 10).toString().replace(".", ",");
  }

  // ---------------- map (Leaflet + OpenStreetMap) ----------------

  var mapInstance = null;
  var mapLayer = null;
  var pickMapInstance = null;
  var leafletPromise = null;

  function ensureLeaflet() {
    if (window.L) return Promise.resolve();
    if (!leafletPromise) {
      leafletPromise = new Promise(function (resolve, reject) {
        var css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(css);
        var js = document.createElement("script");
        js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        js.onload = resolve;
        js.onerror = function () { leafletPromise = null; reject(new Error("leaflet")); };
        document.head.appendChild(js);
      });
    }
    return leafletPromise;
  }

  function destroyMaps() {
    if (mapInstance) { mapInstance.remove(); mapInstance = null; mapLayer = null; }
    if (pickMapInstance) { pickMapInstance.remove(); pickMapInstance = null; }
  }

  function addBaseLayer(map) {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap-Mitwirkende"
    }).addTo(map);
  }

  function pinIcon(color) {
    return L.divIcon({
      className: "pin-icon",
      html: icon("pin", 34, color),
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -30]
    });
  }

  function popupHtml(t) {
    var stats = statItems(t).map(function (i) { return escapeHtml(i.val); }).join(" · ");
    return (
      '<a class="popup-link" href="#/tour/' + t.id + '"><strong>' + escapeHtml(t.title) + "</strong></a>" +
      (stats ? "<br>" + stats : "") + '<br><span class="popup-cat">' + escapeHtml(t.category) + "</span>"
    );
  }

  function updateMarkers() {
    if (!mapInstance) return;
    mapLayer.clearLayers();
    var pts = [];
    var noLoc = 0;
    filteredTours().forEach(function (t) {
      if (t.lat == null || t.lon == null) { noLoc++; return; }
      var color = CATEGORY_COLOR[t.category] || CATEGORY_COLOR["Wanderung"];
      L.marker([t.lat, t.lon], { icon: pinIcon(color), title: t.title, alt: t.title })
        .bindPopup(popupHtml(t)).addTo(mapLayer);
      pts.push([t.lat, t.lon]);
    });
    if (pts.length) mapInstance.fitBounds(pts, { padding: [40, 40], maxZoom: 12 });
    var note = document.getElementById("mapNote");
    if (note) {
      note.textContent = noLoc ? noLoc + (noLoc === 1 ? " Tour hat" : " Touren haben") + " noch keinen Standort (in „Bearbeiten“ setzen)." : "";
      note.hidden = !noLoc;
    }
  }

  function initMap() {
    ensureLeaflet().then(function () {
      var el = document.getElementById("map");
      if (!el || mapInstance) return;
      mapInstance = L.map(el).setView([47.2, 9.75], 9);
      addBaseLayer(mapInstance);
      mapLayer = L.layerGroup().addTo(mapInstance);
      updateMarkers();
    }).catch(function () {
      var el = document.getElementById("map");
      if (el) el.innerHTML = '<div class="map-error">Karte konnte nicht geladen werden (keine Internetverbindung?).</div>';
    });
  }

  function renderKarte() {
    return (
      '<div class="screen">' +
      navbarHtml("karte") +
      '<div class="header">' + syncLinkHtml() +
      '<div class="header-title">Wandertagebuch</div>' +
      '<div class="header-sub">Karte deiner Touren</div>' +
      "</div>" +
      toolbarHtml() +
      '<div class="map-wrap">' +
      '<div id="map" role="application" aria-label="Karte deiner Touren"></div>' +
      '<div class="map-legend">' +
      '<div class="legend-row"><span class="legend-dot" style="background:#3F5D45;"></span>Wanderung</div>' +
      '<div class="legend-row"><span class="legend-dot" style="background:#C1622D;"></span>Bike &amp; Hike</div>' +
      '<div class="legend-row"><span class="legend-dot" style="background:#2B2B26;"></span>Mountainbike</div>' +
      "</div>" +
      '<div class="map-note" id="mapNote" hidden></div>' +
      "</div>" +
      "</div>"
    );
  }

  function renderDetail(id) {
    var t = getTour(id);
    if (!t) {
      return (
        '<div class="screen"><div class="header"><div class="header-title">Nicht gefunden</div></div>' +
        '<div class="list-body"><a href="#/liste" class="btn-primary" style="text-align:center;">Zurück zur Liste</a></div></div>'
      );
    }
    var heroBg = "background: " + (CATEGORY_GRADIENT[t.category] || CATEGORY_GRADIENT["Wanderung"]) + ";";

    var photos = (t.photos || []).map(function (p) {
      return '<div class="thumb" style="background-image:url(' + imgSrc(p) + ')"></div>';
    }).join("");

    var stats = statItems(t);

    return (
      '<div class="screen">' +
      '<div class="detail-hero" style="' + heroBg + '">' +
      slidesHtml(t) +
      '<a href="#/liste" class="detail-back" aria-label="Zurück zur Liste">' + icon("back", 18, "#2B2B26") + "</a>" +
      "</div>" +
      '<div class="detail-body">' +
      '<div style="display:flex;flex-direction:column;gap:8px;">' +
      '<div class="tag">' + escapeHtml(t.category) + "</div>" +
      '<div class="detail-title">' + escapeHtml(t.title) + "</div>" +
      '<div class="detail-meta">' + escapeHtml(t.region) + " · " + escapeHtml(t.date) + "</div>" +
      "</div>" +
      '<div class="rate-row">' +
      rateBlock("Gesamt", t.ratingGesamt) +
      rateBlock("Aussicht", t.ratingAussicht) +
      rateBlock("Natur", t.ratingNatur) +
      "</div>" +
      (stats.length
        ? '<div class="stat-row">' + stats.map(function (i) { return statBlock(i.icon, i.val, i.label); }).join("") + "</div>"
        : "") +
      (t.beschreibung ? '<div><h3>Beschreibung</h3><p>' + escapeHtml(t.beschreibung) + "</p></div>" : "") +
      (t.weg ? '<div><h3>Wegbeschreibung</h3><p>' + escapeHtml(t.weg) + "</p></div>" : "") +
      (t.zusatz ? '<div><h3>Gut zu wissen</h3><p>' + escapeHtml(t.zusatz) + "</p></div>" : "") +
      (photos ? '<div><h3>Fotos</h3><div class="thumbs">' + photos + "</div></div>" : "") +
      '<div class="detail-actions">' +
      '<a href="#/tour/' + t.id + '/bearbeiten" class="btn-edit">Bearbeiten</a>' +
      '<button type="button" class="btn-danger" data-action="delete" data-id="' + t.id + '">Tour löschen</button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function rateBlock(label, value) {
    return (
      '<div class="rate"><div class="rate-label">' + label + '</div><div class="rate-stars" aria-label="' +
      fmtRating(value) + ' von 5 Sternen">' + starsHtml(value, 13) + "</div></div>"
    );
  }

  function statBlock(iconName, val, label) {
    return (
      '<div class="stat">' + icon(iconName, 16, "#3F5D45") + '<div class="stat-val">' + escapeHtml(val || "–") +
      '</div><div class="stat-label">' + label + "</div></div>"
    );
  }

  function syncLinkHtml() {
    var on = !!getPw();
    return (
      '<a href="#/sync" class="sync-link' + (on ? " on" : "") + '" aria-label="Synchronisierung' +
      (on ? " (verbunden)" : "") + '">' + icon("cloud", 22, "#57574C") + "</a>"
    );
  }

  function renderSync() {
    var on = !!getPw();
    return (
      '<div class="screen">' +
      '<div class="form-header">' +
      '<a href="#/liste" class="form-back" aria-label="Zurück">' + icon("back", 16, "#2B2B26") + "</a>" +
      '<div class="form-title">Synchronisierung</div>' +
      '<span style="width:44px;"></span>' +
      "</div>" +
      '<div class="form-body">' +
      '<p class="sync-info">Mit einem gemeinsamen Passwort werden Touren, Gipfel und Bilder online gespeichert und auf allen Geräten abgeglichen. ' +
      "Gib auf jedem Gerät dasselbe Passwort ein.</p>" +
      '<div class="field"><label for="syncPw">Passwort</label>' +
      '<input id="syncPw" type="password" autocomplete="off" value="' + escapeHtml(getPw()) + '"></div>' +
      '<div class="sync-status ' + syncState.kind + '" id="syncStatus" role="status">' +
      escapeHtml(syncState.msg || (on ? "Verbunden." : "Nicht verbunden.")) + "</div>" +
      '<button type="button" class="btn-primary" data-action="sync-connect">' + (on ? "Jetzt synchronisieren" : "Verbinden") + "</button>" +
      (on ? '<button type="button" class="btn-danger" data-action="sync-disconnect" style="flex:none;">Trennen</button>' : "") +
      "</div></div>"
    );
  }

  function renderGipfel() {
    var list = state.gipfel.slice().sort(function (a, b) {
      return lastVisit(b).localeCompare(lastVisit(a));
    });
    var total = state.gipfel.reduce(function (s, g) { return s + g.visits.length; }, 0);

    var rows = list.map(function (g) {
      return (
        '<a class="gipfel-row" href="#/gipfel/' + g.id + '">' +
        '<div><div class="gipfel-name">' + escapeHtml(g.name) + "</div>" +
        '<div class="gipfel-sub">Zuletzt: ' + fmtDate(lastVisit(g)) + "</div></div>" +
        '<div class="gipfel-count">' + g.visits.length + "×</div></a>"
      );
    }).join("");

    var body = rows || '<div class="empty-state">Noch keine Gipfel eingetragen.<br>Tippe auf + für deinen ersten Eintrag.</div>';

    return (
      '<div class="screen">' +
      navbarHtml("gipfel") +
      '<div class="header">' + syncLinkHtml() + '<div class="header-title">Gipfeltagebuch</div>' +
      '<div class="header-sub">' + state.gipfel.length + " Gipfel · " + total + " Besteigungen</div></div>" +
      '<div class="list-body" style="padding-top:16px;">' + body + "</div>" +
      '<a href="#/gipfel/neu" class="fab" aria-label="Gipfel eintragen">' + icon("plus", 22, "#FFFFFF") + "</a>" +
      "</div>"
    );
  }

  function renderGipfelNeu() {
    var options = state.gipfel.map(function (g) {
      return '<option value="' + escapeHtml(g.name) + '"></option>';
    }).join("");

    return (
      '<div class="screen">' +
      '<div class="form-header">' +
      '<a href="#/gipfel" class="form-back" aria-label="Abbrechen">' + icon("back", 16, "#2B2B26") + "</a>" +
      '<div class="form-title">Gipfel eintragen</div>' +
      '<button type="button" class="form-save" data-action="save-gipfel">Speichern</button>' +
      "</div>" +
      '<div class="form-body">' +
      '<div class="field"><label for="gname">Name des Gipfels</label>' +
      '<input id="gname" type="text" list="gipfelListe" placeholder="z. B. Schesaplana" autocomplete="off">' +
      '<datalist id="gipfelListe">' + options + "</datalist></div>" +
      '<div class="field"><label for="gdatum">Datum der Besteigung</label>' +
      '<input id="gdatum" type="date" value="' + todayIso() + '"></div>' +
      '<div class="error-text" id="formError"></div>' +
      '<button type="button" class="btn-primary" data-action="save-gipfel">Eintragen</button>' +
      "</div></div>"
    );
  }

  function renderGipfelDetail(id) {
    var g = getGipfel(id);
    if (!g) {
      return (
        '<div class="screen"><div class="header"><div class="header-title">Nicht gefunden</div></div>' +
        '<div class="list-body"><a href="#/gipfel" class="btn-primary">Zurück zum Gipfeltagebuch</a></div></div>'
      );
    }
    var visits = g.visits.slice().sort().reverse().map(function (d) {
      return (
        '<div class="visit-row"><span>' + fmtDate(d) + "</span>" +
        '<button type="button" class="visit-del" data-action="del-visit" data-date="' + d +
        '" aria-label="Besteigung vom ' + fmtDate(d) + ' löschen">×</button></div>'
      );
    }).join("");

    return (
      '<div class="screen">' +
      '<div class="form-header">' +
      '<a href="#/gipfel" class="form-back" aria-label="Zurück">' + icon("back", 16, "#2B2B26") + "</a>" +
      '<div class="form-title">' + escapeHtml(g.name) + "</div>" +
      '<span style="width:44px;"></span>' +
      "</div>" +
      '<div class="form-body">' +
      '<div class="gipfel-big">' + g.visits.length + '<span>× bestiegen</span></div>' +
      '<div class="field"><label for="gdatum">Weitere Besteigung hinzufügen</label>' +
      '<div class="add-visit"><input id="gdatum" type="date" value="' + todayIso() + '">' +
      '<button type="button" class="btn-edit" data-action="add-visit" style="flex:none;padding:10px 18px;">Hinzufügen</button></div></div>' +
      '<div><h3 class="visit-h">Alle Besteigungen</h3>' + visits + "</div>" +
      '<button type="button" class="btn-danger" data-action="del-gipfel" style="flex:none;">Gipfel löschen</button>' +
      "</div></div>"
    );
  }

  function renderNeu(editTour) {
    var activeCategory = editTour ? editTour.category : CATEGORIES[0];

    var starsBlock = function (name, current) {
      var stars = "";
      for (var i = 1; i <= 5; i++) {
        stars += '<button type="button" class="starbtn" data-star="' + name + '" data-value="' + i +
          '" aria-label="' + i + ' Sterne">' + starIcon(i <= Math.round(current || 0), 22) + "</button>";
      }
      return stars;
    };

    var backHref = editTour ? "#/tour/" + editTour.id : "#/liste";
    var backLabel = editTour ? "Abbrechen und zurück zur Tour" : "Abbrechen und zurück zur Liste";

    return (
      '<div class="screen">' +
      '<div class="form-header">' +
      '<a href="' + backHref + '" class="form-back" aria-label="' + backLabel + '">' + icon("back", 16, "#2B2B26") + "</a>" +
      '<div class="form-title">' + (editTour ? "Tour bearbeiten" : "Neue Tour") + "</div>" +
      '<button type="button" class="form-save" data-action="save">Speichern</button>' +
      "</div>" +
      '<div class="form-body">' +
      '<button type="button" class="upload-box" id="coverBox" data-action="pick-cover">' +
      icon("camera", 26, "#57574C") +
      '<div class="upload-hint">Startbild hochladen</div>' +
      "</button>" +
      '<input type="file" accept="image/*" id="coverInput" style="display:none;">' +

      '<div class="field">' +
      "<label>Weitere Bilder</label>" +
      '<div class="thumb-row" id="photoRow">' +
      '<button type="button" class="thumb-add" id="addPhotoBtn" aria-label="Weiteres Bild hinzufügen">' + icon("plus", 16, "#57574C") + "</button>" +
      "</div>" +
      '<input type="file" accept="image/*" multiple id="photoInput" style="display:none;">' +
      "</div>" +

      '<div class="field"><label for="titel">Titel der Tour</label>' +
      '<input id="titel" type="text" placeholder="z. B. Zafernhorn" value="' + escapeHtml(editTour ? editTour.title : "") + '"></div>' +

      '<div class="field"><label>Kategorie</label><div class="chips" style="padding:0;" id="catChips">' +
      CATEGORIES.map(function (c) {
        return '<button type="button" class="chip' + (c === activeCategory ? " active" : "") + '" data-cat="' +
          escapeHtml(c) + '" aria-pressed="' + (c === activeCategory) + '">' + escapeHtml(c) + "</button>";
      }).join("") +
      "</div></div>" +

      '<div class="field"><label for="datum">Datum</label>' +
      '<input id="datum" type="text" placeholder="12.07.2026" value="' + escapeHtml(editTour && editTour.date !== "–" ? editTour.date : "") + '"></div>' +

      '<div class="field-row">' +
      '<div class="field" id="fHm"><label for="hm">Höhenmeter</label><input id="hm" type="text" placeholder="850 m" value="' + escapeHtml(editTour ? editTour.hm : "") + '"></div>' +
      '<div class="field" id="fRad"><label for="hmRad">Höhenmeter Rad</label><input id="hmRad" type="text" placeholder="400 m" value="' + escapeHtml(editTour ? editTour.hmRad : "") + '"></div>' +
      '<div class="field" id="fFuss"><label for="hmFuss">Höhenmeter Fuß</label><input id="hmFuss" type="text" placeholder="650 m" value="' + escapeHtml(editTour ? editTour.hmFuss : "") + '"></div>' +
      '<div class="field" id="fKm"><label for="km">Distanz</label><input id="km" type="text" placeholder="12,4 km" value="' + escapeHtml(editTour ? editTour.km : "") + '"></div>' +
      '<div class="field" id="fDauer"><label for="dauer">Dauer</label><input id="dauer" type="text" placeholder="4:30 h" value="' + escapeHtml(editTour ? editTour.dauer : "") + '"></div>' +
      "</div>" +

      '<div class="field"><label>Bewertung – Gesamttour</label><div class="stars-edit" data-group="ratingGesamt">' + starsBlock("ratingGesamt", editTour && editTour.ratingGesamt) + "</div></div>" +
      '<div class="field"><label>Bewertung – Aussicht</label><div class="stars-edit" data-group="ratingAussicht">' + starsBlock("ratingAussicht", editTour && editTour.ratingAussicht) + "</div></div>" +
      '<div class="field"><label>Bewertung – Natur</label><div class="stars-edit" data-group="ratingNatur">' + starsBlock("ratingNatur", editTour && editTour.ratingNatur) + "</div></div>" +

      '<div class="field"><label for="besch">Beschreibung</label>' +
      '<textarea id="besch" placeholder="Wie war die Tour? Was war besonders?">' + escapeHtml(editTour ? editTour.beschreibung : "") + "</textarea></div>" +

      '<div class="field"><label for="weg">Wegbeschreibung (kurz)</label>' +
      '<textarea id="weg" placeholder="Start, Route, Ziel …">' + escapeHtml(editTour ? editTour.weg : "") + "</textarea></div>" +

      '<div class="field"><label for="zusatz">Zusatzinfos</label>' +
      '<textarea id="zusatz" placeholder="z. B. gut zum Pilze sammeln, Einkehrmöglichkeit …">' + escapeHtml(editTour ? editTour.zusatz : "") + "</textarea></div>" +

      '<div class="field"><label for="ortSuche">Standort auf der Karte</label>' +
      '<div class="add-visit"><input id="ortSuche" type="search" placeholder="Ort oder Gipfel suchen …" autocomplete="off">' +
      '<button type="button" class="btn-edit" id="ortBtn" style="flex:none;padding:10px 18px;">Suchen</button></div>' +
      '<div class="pick-map-wrap"><div id="pickMap"></div></div>' +
      '<div class="pick-hint" id="pickHint">Tippe auf die Karte, um den Standort zu setzen.</div>' +
      "</div>" +

      '<div class="error-text" id="formError"></div>' +
      '<button type="button" class="btn-primary" data-action="save">' + (editTour ? "Änderungen speichern" : "Tour speichern") + "</button>" +
      "</div>" +
      "</div>"
    );
  }

  // ---------------- interactions ----------------

  function readFileAsDataUrl(file, cb, onFail) {
    var reader = new FileReader();
    reader.onerror = function () { alert("Das Bild konnte nicht gelesen werden."); if (onFail) onFail(); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { alert("Dieses Bildformat wird nicht unterstützt. Bitte JPEG oder PNG verwenden."); if (onFail) onFail(); };
      img.onload = function () {
        var scale = Math.min(1, 1400 / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        cb(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function wireUp(route) {
    var root = document.getElementById("app");

    wireSlides(root);

    if (route.name === "liste") {
      wireToolbar(root, function () { refreshList(root); });
    }

    if (route.name === "karte") {
      wireToolbar(root, updateMarkers);
      initMap();
    }

    if (route.name === "tour") {
      var delBtn = root.querySelector('[data-action="delete"]');
      if (delBtn) {
        delBtn.addEventListener("click", function () {
          if (confirm("Diese Tour wirklich löschen?")) {
            var id = delBtn.getAttribute("data-id");
            deleteImages(tourRefs(getTour(id) || {}));
            state.tours = state.tours.filter(function (t) { return t.id !== id; });
            state.deleted["tour:" + id] = Date.now();
            saveMeta();
            saveTours(state.tours);
            navigate("#/liste");
          }
        });
      }
    }

    if (route.name === "sync") {
      var connectBtn = root.querySelector('[data-action="sync-connect"]');
      connectBtn.addEventListener("click", function () {
        var pw = root.querySelector("#syncPw").value.trim();
        if (!pw) {
          setSyncMsg("Bitte ein Passwort eingeben.", "err");
          return;
        }
        setPw(pw);
        syncNow();
      });
      var discBtn = root.querySelector('[data-action="sync-disconnect"]');
      if (discBtn) {
        discBtn.addEventListener("click", function () {
          setPw("");
          syncState.msg = "Nicht verbunden.";
          syncState.kind = "";
          render();
        });
      }
    }

    if (route.name === "neu") {
      wireNeuForm(root, null);
    }

    if (route.name === "bearbeiten") {
      wireNeuForm(root, getTour(route.id));
    }

    if (route.name === "gipfelneu") {
      root.querySelectorAll('[data-action="save-gipfel"]').forEach(function (btn) {
        btn.addEventListener("click", function () {
          var name = root.querySelector("#gname").value.trim();
          var date = root.querySelector("#gdatum").value;
          var errorEl = root.querySelector("#formError");
          if (!name || !date) {
            errorEl.textContent = "Bitte Gipfelname und Datum angeben.";
            return;
          }
          var g = null;
          state.gipfel.forEach(function (x) {
            if (x.name.toLowerCase() === name.toLowerCase()) g = x;
          });
          if (!g) {
            g = { id: uid(), name: name, visits: [] };
            state.gipfel.push(g);
          }
          g.visits.push(date);
          g.updatedAt = Date.now();
          saveGipfel();
          navigate("#/gipfel/" + g.id);
        });
      });
    }

    if (route.name === "gipfeldetail") {
      var g = getGipfel(route.id);
      if (!g) return;
      root.querySelector('[data-action="add-visit"]').addEventListener("click", function () {
        var date = root.querySelector("#gdatum").value;
        if (!date) return;
        g.visits.push(date);
        g.updatedAt = Date.now();
        saveGipfel();
        render();
      });
      root.querySelectorAll('[data-action="del-visit"]').forEach(function (btn) {
        btn.addEventListener("click", function () {
          var d = btn.getAttribute("data-date");
          var idx = g.visits.indexOf(d);
          if (idx > -1) g.visits.splice(idx, 1);
          if (g.visits.length === 0) {
            state.gipfel = state.gipfel.filter(function (x) { return x.id !== g.id; });
            state.deleted["gipfel:" + g.name.toLowerCase()] = Date.now();
            saveMeta();
            saveGipfel();
            navigate("#/gipfel");
          } else {
            g.updatedAt = Date.now();
            saveGipfel();
            render();
          }
        });
      });
      root.querySelector('[data-action="del-gipfel"]').addEventListener("click", function () {
        if (confirm("Diesen Gipfel mit allen Besteigungen löschen?")) {
          state.gipfel = state.gipfel.filter(function (x) { return x.id !== g.id; });
          state.deleted["gipfel:" + g.name.toLowerCase()] = Date.now();
          saveMeta();
          saveGipfel();
          navigate("#/gipfel");
        }
      });
    }
  }

  function wireNeuForm(root, editTour) {
    var newCover = editTour ? editTour.cover : null;
    var newPhotos = editTour ? (editTour.photos || []).slice() : [];
    var ratings = {
      ratingGesamt: editTour ? editTour.ratingGesamt : 0,
      ratingAussicht: editTour ? editTour.ratingAussicht : 0,
      ratingNatur: editTour ? editTour.ratingNatur : 0
    };
    var category = editTour ? editTour.category : CATEGORIES[0];
    var lat = editTour && editTour.lat != null ? editTour.lat : null;
    var lon = editTour && editTour.lon != null ? editTour.lon : null;

    function applyCategory() {
      var bh = category === "Bike & Hike";
      root.querySelector("#fHm").hidden = bh;
      root.querySelector("#fRad").hidden = !bh;
      root.querySelector("#fFuss").hidden = !bh;
      root.querySelector("#fKm").hidden = category !== "Mountainbike";
    }
    applyCategory();

    var pickHint = root.querySelector("#pickHint");
    var pickMarker = null;

    function setPoint(la, lo, move) {
      lat = la;
      lon = lo;
      pickHint.textContent = "Standort gesetzt (" + la.toFixed(4) + ", " + lo.toFixed(4) + "). Zum Ändern erneut tippen oder Marker ziehen.";
      if (!pickMapInstance) return;
      if (pickMarker) pickMarker.setLatLng([la, lo]);
      else {
        pickMarker = L.marker([la, lo], { draggable: true, icon: pinIcon("#C1622D") }).addTo(pickMapInstance);
        pickMarker.on("dragend", function () {
          var p = pickMarker.getLatLng();
          setPoint(p.lat, p.lng, false);
        });
      }
      if (move) pickMapInstance.setView([la, lo], Math.max(pickMapInstance.getZoom(), 12));
    }

    ensureLeaflet().then(function () {
      var el = root.querySelector("#pickMap");
      if (!el || pickMapInstance) return;
      pickMapInstance = L.map(el, { dragging: !L.Browser.mobile }).setView(lat !== null ? [lat, lon] : [47.2, 9.75], lat !== null ? 12 : 8);
      addBaseLayer(pickMapInstance);
      if (lat !== null) setPoint(lat, lon, false);
      pickMapInstance.on("click", function (e) { setPoint(e.latlng.lat, e.latlng.lng, false); });
    }).catch(function () {
      pickHint.textContent = "Karte konnte nicht geladen werden (keine Internetverbindung?).";
    });

    function searchPlace() {
      var q = root.querySelector("#ortSuche").value.trim();
      if (!q) return;
      pickHint.textContent = "Suche …";
      fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(q))
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.length) { pickHint.textContent = "Nichts gefunden. Anderen Namen versuchen oder direkt auf die Karte tippen."; return; }
          setPoint(parseFloat(res[0].lat), parseFloat(res[0].lon), true);
        })
        .catch(function () { pickHint.textContent = "Suche fehlgeschlagen (keine Verbindung?)."; });
    }
    root.querySelector("#ortBtn").addEventListener("click", searchPlace);
    root.querySelector("#ortSuche").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); searchPlace(); }
    });

    var coverBox = root.querySelector("#coverBox");
    var coverInput = root.querySelector("#coverInput");
    if (newCover) {
      coverBox.classList.add("has-image");
      coverBox.style.backgroundImage = "url(" + imgSrc(newCover) + ")";
    }
    coverBox.addEventListener("click", function () { coverInput.click(); });
    coverInput.addEventListener("change", function () {
      var file = coverInput.files[0];
      if (!file) return;
      readFileAsDataUrl(file, function (dataUrl) {
        storeImage(dataUrl).then(function (ref) {
          newCover = ref;
          coverBox.classList.add("has-image");
          coverBox.style.backgroundImage = "url(" + dataUrl + ")";
        }).catch(function () { alert("Bild konnte nicht gespeichert werden (Browser-Speicher nicht verfügbar)."); });
      });
    });

    var photoRow = root.querySelector("#photoRow");
    var addPhotoBtn = root.querySelector("#addPhotoBtn");
    var photoInput = root.querySelector("#photoInput");
    addPhotoBtn.addEventListener("click", function () { photoInput.click(); });
    photoInput.addEventListener("change", function () {
      var files = Array.prototype.slice.call(photoInput.files);
      photoInput.value = "";
      files.reduce(function (chain, file) {
        return chain.then(function () {
          return new Promise(function (resolve) {
            readFileAsDataUrl(file, function (dataUrl) {
              storeImage(dataUrl).then(function (ref) {
                newPhotos.push(ref);
                renderPhotoRow();
              }).catch(function () {
                alert("Bild konnte nicht gespeichert werden (Browser-Speicher nicht verfügbar).");
              }).then(resolve);
            }, resolve);
          });
        });
      }, Promise.resolve());
    });

    function renderPhotoRow() {
      var extra = newPhotos.map(function (p, i) {
        return '<div class="thumb-small" style="background-image:url(' + imgSrc(p) + ')" data-idx="' + i +
          '"><span class="thumb-remove" data-remove="' + i + '">×</span></div>';
      }).join("");
      photoRow.innerHTML =
        '<button type="button" class="thumb-add" id="addPhotoBtn2" aria-label="Weiteres Bild hinzufügen">' +
        icon("plus", 16, "#57574C") + "</button>" + extra;
      photoRow.querySelector("#addPhotoBtn2").addEventListener("click", function () { photoInput.click(); });
      photoRow.querySelectorAll("[data-remove]").forEach(function (el) {
        el.addEventListener("click", function (ev) {
          ev.stopPropagation();
          var idx = parseInt(el.getAttribute("data-remove"), 10);
          newPhotos.splice(idx, 1);
          renderPhotoRow();
        });
      });
    }
    if (newPhotos.length) renderPhotoRow();

    // category chips
    var catChips = root.querySelector("#catChips");
    catChips.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        category = chip.getAttribute("data-cat");
        applyCategory();
        catChips.querySelectorAll(".chip").forEach(function (c) {
          c.classList.toggle("active", c === chip);
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
      });
    });

    // star pickers
    root.querySelectorAll(".stars-edit").forEach(function (group) {
      var name = group.getAttribute("data-group");
      group.querySelectorAll(".starbtn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var val = parseInt(btn.getAttribute("data-value"), 10);
          ratings[name] = val;
          group.querySelectorAll(".starbtn").forEach(function (b, idx) {
            b.innerHTML = starIcon(idx < val, 22);
          });
        });
      });
    });

    function save() {
      var titel = root.querySelector("#titel").value.trim();
      var errorEl = root.querySelector("#formError");
      if (!titel) {
        errorEl.textContent = "Bitte gib einen Titel für die Tour ein.";
        root.querySelector("#titel").focus();
        return;
      }
      errorEl.textContent = "";

      var fields = {
        title: titel,
        category: category,
        date: root.querySelector("#datum").value.trim() || "–",
        hm: root.querySelector("#hm").value.trim(),
        hmRad: root.querySelector("#hmRad").value.trim(),
        hmFuss: root.querySelector("#hmFuss").value.trim(),
        lat: lat,
        lon: lon,
        km: root.querySelector("#km").value.trim(),
        dauer: root.querySelector("#dauer").value.trim(),
        ratingGesamt: ratings.ratingGesamt,
        ratingAussicht: ratings.ratingAussicht,
        ratingNatur: ratings.ratingNatur,
        beschreibung: root.querySelector("#besch").value.trim(),
        weg: root.querySelector("#weg").value.trim(),
        zusatz: root.querySelector("#zusatz").value.trim(),
        cover: newCover,
        photos: newPhotos.slice(),
        updatedAt: Date.now()
      };

      var fullMsg = "Speichern fehlgeschlagen: Browser-Speicher voll.";

      if (editTour) {
        var live = getTour(editTour.id);
        if (!live) {
          live = editTour;
          state.tours.push(live);
        }
        var backup = Object.assign({}, live);
        Object.assign(live, fields);
        if (!saveTours(state.tours)) {
          Object.assign(live, backup);
          errorEl.textContent = fullMsg;
          return;
        }
        var kept = tourRefs(live);
        deleteImages(tourRefs(backup).filter(function (r) { return kept.indexOf(r) < 0; }));
        navigate("#/tour/" + live.id);
      } else {
        var tour = Object.assign({
          id: uid(),
          region: "Vorarlberg",
          createdAt: Date.now()
        }, fields);
        state.tours.unshift(tour);
        if (!saveTours(state.tours)) {
          state.tours.shift();
          errorEl.textContent = fullMsg;
          return;
        }
        navigate("#/tour/" + tour.id);
      }
    }

    root.querySelectorAll('[data-action="save"]').forEach(function (btn) {
      btn.addEventListener("click", save);
    });
  }

  var started = false;
  function start() {
    if (started) return;
    started = true;
    render();
    syncNow();
  }
  initImages().then(start);
  setTimeout(start, 1500);
})();
