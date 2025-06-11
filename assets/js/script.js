function getRandomColor() {
  // Menghasilkan warna hex random, misal: #a1b2c3
  const letters = '0123456789ABCDEF';
  let color = '#000';
  // for (let i = 0; i < 6; i++) {
  //   color += letters[Math.floor(Math.random() * 16)];
  // }
  return color;
}

// Inisialisasi peta di tengah Indonesia
const map = L.map('map', {
  zoomControl: false
}).setView([-2.5, 118], 5); // Koordinat Indonesia

// Tambahkan basemap dari Esri
L.esri.basemapLayer('Streets').addTo(map);

// Tambahkan marker dengan popup
// const marker = L.marker([-6.2, 106.8]).addTo(map);
// marker.bindPopup("<b>Halo!</b><br>Ini Jakarta.").openPopup();

const selUpt = document.getElementById("filter_upt");
let currentLayer = null; // Simpan referensi layer yang sedang aktif
let siagaLayer = null; // Simpan referensi layer yang sedang aktif

selUpt.addEventListener("change", (ev) => {
  const upt = ev.target.value;

  // Hapus layer sebelumnya jika ada
  if (currentLayer) {
    map.removeLayer(currentLayer);
    currentLayer = null;
  }

  if (siagaLayer) {
    map.removeLayer(siagaLayer);
    siagaLayer = null;
  }

  if (upt === "") {
    // Zoom ke Indonesia
    map.setView([-2.5, 118], 5);

  } else if (upt === "dkj") {
    map.setView([-6.2, 106.8], 11);

    currentLayer = L.esri.featureLayer({
      url: 'https://services-ap1.arcgis.com/zddIc5NlxDyZbzsT/ArcGIS/rest/services/RS_3D_DKI_Jakarta_WFL1/FeatureServer/1',
      style: (feature) => {
        let color = getRandomColor();
        return {
          color: color,  // Garis pinggir warna random
          weight: 2,
          fillOpacity: 0,
          // fillColor: color  // Warna isi random
        };
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.Kabupaten) {
          layer.bindPopup("Kabupaten/Kota: " + feature.properties.Kabupaten);
        }
      }
    }).addTo(map);

  } else if (upt === "jabar") {
    map.setView([-6.9, 107.6], 9);

    currentLayer = L.esri.featureLayer({
      url: 'https://arcgis.jabarprov.go.id/arcgis/rest/services/peta_dasar/BATAS_WILAYAH_ADMINISTRASI_JAWA_BARAT_2023/FeatureServer/1',
      simplifyFactor: 0.1, // Nilai antara 0 (tidak disederhanakan) sampai 1 (sangat sederhana)
      precision: 7,        // Pengaturan presisi koordinat (semakin rendah = semakin ringan)
      style: (feature) => {
        let color = getRandomColor();
        return {
          color: color,  // Garis pinggir warna random
          weight: 2,
          fillOpacity: 0,
          // fillColor: color  // Warna isi random
        };
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.wadmkk) {
          layer.bindPopup("Kabupaten/Kota: " + feature.properties.wadmkk);
        }
      }
    }).addTo(map);

    // layer warna orange pada kab.bogor
    siagaLayer = L.esri.featureLayer({
      url: 'https://arcgis.jabarprov.go.id/arcgis/rest/services/peta_dasar/BATAS_WILAYAH_ADMINISTRASI_JAWA_BARAT_2023/FeatureServer/1',
      where: "wadmkk='Bogor'", // Filter untuk Jawa Tengah
      simplifyFactor: 0.1, // Nilai antara 0 (tidak disederhanakan) sampai 1 (sangat sederhana)
      precision: 7,        // Pengaturan presisi koordinat (semakin rendah = semakin ringan)
      style: (feature) => {
        let color = '#FB8D00';
        return {
          color: '#000',  // Garis pinggir warna random
          weight: 1,
          fillOpacity: 0.8,
          fillColor: color  // Warna isi random
        };
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.wadmkk) {
          layer.bindPopup("Kabupaten/Kota: " + feature.properties.wadmkk);
        }
      }
    }).addTo(map);

  } else if (upt === "jateng") {
    map.setView([-7.2, 110.2], 8);

    currentLayer = L.esri.featureLayer({
      // url: 'https://geoportal.bps.go.id/server/rest/services/kemiskinan_anak/rank_estimasi_provinsi/MapServer/2',
      url: 'https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/Administrasi_AR_KabKota_50K/MapServer/0',
      where: "WADMPR = 'Jawa Tengah'", // Filter untuk Jawa Tengah
      simplifyFactor: 0.1, // Nilai antara 0 (tidak disederhanakan) sampai 1 (sangat sederhana)
      precision: 7,        // Pengaturan presisi koordinat (semakin rendah = semakin ringan)
      style: (feature) => {
        let color = getRandomColor();
        return {
          color: color,  // Garis pinggir warna random
          weight: 2,
          fillOpacity: 0,
          // fillColor: color  // Warna isi random
        };
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties?.WADMKK) {
          layer.bindPopup("Kabupaten/Kota: " + feature.properties.WADMKK);
        }
      }
    }).addTo(map);
  }
});

const btNavSide = document.getElementById("bt_nav_side")
const myNav = document.querySelector(".mynav")
const icon = btNavSide.querySelector("i");

btNavSide.addEventListener("click", () => {
  myNav.classList.toggle("close");

  // Toggle arah ikon
  if (icon.classList.contains("fa-arrow-left")) {
    icon.classList.replace("fa-arrow-left", "fa-arrow-right");
  } else {
    icon.classList.replace("fa-arrow-right", "fa-arrow-left");
  }
})

// show/hide card
function toggleCard(btn) {
  const mode = btn.dataset.mode; // "hide" atau "show"
  const cardEl = btn.closest(".card");
  const maximizeEl = cardEl.querySelector(".maximize");
  const minimizeEl = cardEl.querySelector(".minimize");

  const isHiding = mode === "hide";

  maximizeEl.classList.toggle("hidden", isHiding);
  minimizeEl.classList.toggle("hidden", !isHiding);
}

function initTabs(tabButtonSelector, tabPanelSelector) {
  const tabButtons = document.querySelectorAll(tabButtonSelector);
  const tabPanels = document.querySelectorAll(tabPanelSelector);

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Reset semua tombol
      tabButtons.forEach((btn) => {
        btn.classList.remove('active', 'text-white');
      });

      // Set tombol aktif
      button.classList.add('text-white', 'active');
      button.classList.remove('text-gray-300');

      // Tampilkan panel sesuai tombol
      const target = button.getAttribute('data-tab');
      tabPanels.forEach((panel) => {
        if (panel.getAttribute('data-content') === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
}
// ✅ Inisialisasi untuk nav tab
initTabs('.tab-button', '.tab-panel');

// ✅ Inisialisasi untuk bottabs card
initTabs('.bot-card1-tab-button', '.bot-card1-tab-panel');
initTabs('.bot-card2-tab-button', '.bot-card2-tab-panel');
initTabs('.bot-card3-tab-button', '.bot-card3-tab-panel');

const toggleBtn = document.getElementById('toggleBtn');
const chevronPath = document.getElementById('chevronPath');
const bottomContent = document.getElementById('bottom-content');
let isOpen = true;

toggleBtn.addEventListener('click', () => {
  isOpen = !isOpen;

  // Ganti d path SVG untuk toggle chevron up/down
  if (isOpen) {
    chevronPath.setAttribute('d', 'M19 9l-7 7-7-7'); // chevron-down   
    bottomContent.classList.add('translate-y-[-300px]');
  } else {
    chevronPath.setAttribute('d', 'M5 15l7-7 7 7'); // chevron-up 
    bottomContent.classList.remove('translate-y-[-300px]');    
  }

  // Toggle tampilan konten
  // content.classList.toggle('opacity-0');
  // content.classList.toggle('scale-95');
  // content.classList.toggle('opacity-100');
  // content.classList.toggle('scale-100');
});