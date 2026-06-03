
// LocalStorage Persistence Pipeline for the API key
document.addEventListener("DOMContentLoaded", () => {
  const keyInput = document.getElementById('userApiKey');
  if (keyInput) {
    // Populate the field if a key was previously saved in this browser
    if (localStorage.getItem('nk_dash_gemini_key')) {
      keyInput.value = localStorage.getItem('nk_dash_gemini_key');
    }

    // Capture changes and save instantly to local storage
    keyInput.addEventListener('input', () => {
      localStorage.setItem('nk_dash_gemini_key', keyInput.value.trim());
    });
  }
});

import { GoogleGenAI } from "https://esm.run/@google/genai";

window.closeChatPopover = function() {
  const popover = document.getElementById('chatPopover');
  if (popover) {
    popover.style.display = 'none';
  }
};

const originalToggleChatPanel = window.toggleChatPanel;
window.toggleChatPanel = function() {
  window.closeChatPopover();
  
  if (typeof originalToggleChatPanel === 'function') {
    originalToggleChatPanel();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const popover = document.getElementById('chatPopover');
    if (popover) {
      popover.style.display = 'flex';
    }
  }, 3000); 
});

const dateMappedHistory = [
  { dateStr: '2025-01-01', label: 'Jan 25', umsatz: 1300, kosten: 1280, ebit: 20 },
  { dateStr: '2025-02-01', label: 'Feb 25', umsatz: 1350, kosten: 1310, ebit: 40 },
  { dateStr: '2025-03-01', label: 'Mär 25', umsatz: 1400, kosten: 1350, ebit: 50 },
  { dateStr: '2025-04-01', label: 'Apr 25', umsatz: 1380, kosten: 1390, ebit: -10 },
  { dateStr: '2025-05-01', label: 'Mai 25', umsatz: 1420, kosten: 1395, ebit: 25 },
  { dateStr: '2025-06-01', label: 'Jun 25', umsatz: 1450, kosten: 1410, ebit: 40 },
  { dateStr: '2025-07-01', label: 'Jul 25', umsatz: 1410, kosten: 1430, ebit: -20 },
  { dateStr: '2025-08-01', label: 'Aug 25', umsatz: 1460, kosten: 1420, ebit: 40 },
  { dateStr: '2025-09-01', label: 'Sep 25', umsatz: 1490, kosten: 1440, ebit: 50 },
  { dateStr: '2025-10-01', label: 'Okt 25', umsatz: 1510, kosten: 1460, ebit: 50 },
  { dateStr: '2025-11-01', label: 'Nov 25', umsatz: 1550, kosten: 1490, ebit: 60 },
  { dateStr: '2025-12-01', label: 'Dez 25', umsatz: 1600, kosten: 1510, ebit: 90 },
  { dateStr: '2026-01-01', label: 'Jan 26', umsatz: 1420, kosten: 1408, ebit: 12 },
  { dateStr: '2026-02-01', label: 'Feb 26', umsatz: 1480, kosten: 1475, ebit: 5 },
  { dateStr: '2026-03-01', label: 'Mär 26', umsatz: 1600, kosten: 1608, ebit: -8 },
  { dateStr: '2026-04-01', label: 'Apr 26', umsatz: 1540, kosten: 1600, ebit: -15 },
  { dateStr: '2026-05-01', label: 'Mai 26', umsatz: 1660, kosten: 1620, ebit: -22 },
  { dateStr: '2026-06-01', label: 'Jun 26', umsatz: 1620, kosten: 1680, ebit: -38 }
];

let modalDashChartInstance = null;
let activeModalType = ''; 

window.openDashModal = function(type) {
  activeModalType = type;
  const modal = document.getElementById('dashChartModal');
  const titleEl = document.getElementById('modalDashTitle');
  
  document.getElementById('modalStartDate').value = '2026-01-01';
  document.getElementById('modalEndDate').value = '2026-06-30';

  titleEl.textContent = type === 'rev' 
    ? "Erweiterte Ansicht: Umsatz vs. Kosten" 
    : "Erweiterte Ansicht: EBIT-Trend & Forecast";

  modal.style.display = 'flex';
  setTimeout(() => { modal.style.opacity = '1'; }, 10);
  
  renderModalDashChart();
};

window.closeDashModal = function() {
  const modal = document.getElementById('dashChartModal');
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.style.display = 'none';
    if (modalDashChartInstance) {
      modalDashChartInstance.destroy();
      modalDashChartInstance = null;
    }
  }, 200);
};

function renderModalDashChart() {
  const ctx = document.getElementById('modalDashCanvas').getContext('2d');
  if (modalDashChartInstance) {
    modalDashChartInstance.destroy();
  }

  const startBound = new Date(document.getElementById('modalStartDate').value);
  const endBound = new Date(document.getElementById('modalEndDate').value);

  const sliceData = dateMappedHistory.filter(item => {
    const checkDate = new Date(item.dateStr);
    return checkDate >= startBound && checkDate <= endBound;
  });

  const labels = sliceData.map(item => item.label);

  if (activeModalType === 'rev') {
    modalDashChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Umsatz',
            data: sliceData.map(item => item.umsatz),
            backgroundColor: 'rgba(106, 161, 33, 0.5)',
            borderColor: '#6AA121',
            borderWidth: 2,
            borderRadius: 4
          },
          {
            label: 'Kosten',
            data: sliceData.map(item => item.kosten),
            backgroundColor: 'rgba(194, 70, 65, 0.5)',
            borderColor: '#C24641',
            borderWidth: 2,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { grid: gridOpts, ticks: { callback: v => '€' + v + 'K' } }
        }
      }
    });
  } else {
    modalDashChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'EBIT',
          data: sliceData.map(item => item.ebit),
          borderColor: '#b83030',
          backgroundColor: 'rgba(184, 48, 48, 0.15)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#b83030',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { grid: gridOpts, ticks: { callback: v => '€' + v + 'K' } }
        }
      }
    });
  }
}

document.getElementById('modalStartDate').onchange = renderModalDashChart;
document.getElementById('modalEndDate').onchange = renderModalDashChart;

let chartInstances = {};

Chart.defaults.font.family = 'DM Sans';
Chart.defaults.color = '#6b7f62';
const gridOpts = { color:'rgba(0,0,0,0.05)', drawBorder:false };

const db = {
  dashboard: {
    title: "Executive Controlling",
    suggestions: ["Warum ist der EBIT negativ?", "Beste Tour nach DB?", "Was ist das größte Risiko?"],
    kpis: [
      { label: "Gesamtumsatz", val: "€4,82M", delta: "▲ +6,4 % zum Vorquartal", colorClass: "g", deltaClass: "pos" },
      { label: "Deckungsbeitrag I", val: "34,8 %", delta: "▲ +1,2 PP vs. Q1", colorClass: "gm", deltaClass: "pos" },
      { label: "Liquidität (30 Tage)", val: "€187K", delta: "⚠ Ziel: €250K", colorClass: "w", deltaClass: "warn" },
      { label: "EBIT", val: "−€38K", delta: "▼ Operativer Verlust", colorClass: "d", deltaClass: "neg" }
    ],
    html: `
      <div class="charts-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 16px;">
        <div class="chart-card">
          <div class="card-header" style="position: relative; width: 100%;">
            <div>
              <div class="card-title">Umsatz vs. Kosten</div>
              <div class="card-sub">Monatlicher Abgleich</div>
            </div>
            <button onclick="openDashModal('rev')" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #5a735a; cursor: pointer; font-size: 14px; padding: 4px; font-weight: bold;" title="Vergrößern">↗</button>
          </div>
          <div class="chart-wrap"><canvas id="dashRevChart"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="card-header">
            <div>
              <div class="card-title">Liquiditätsprognose</div>
              <div class="card-sub">6-Wochen-Vorschau</div>
            </div>
          </div>
          <div class="chart-wrap"><canvas id="dashLiqChart"></canvas></div>
        </div>
      </div>
      <div class="charts-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="chart-card">
          <div class="card-header" style="position: relative; width: 100%;">
            <div>
              <div class="card-title">EBIT-Trend & Forecast</div>
              <div class="card-sub">Operatives Ergebnis (YTD)</div>
            </div>
            <button onclick="openDashModal('ebit')" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #5a735a; cursor: pointer; font-size: 14px; padding: 4px; font-weight: bold;" title="Vergrößern">↗</button>
          </div>
          <div class="chart-wrap"><canvas id="dashEbitChart"></canvas></div>
        </div>
        <div class="chart-card" style="position: relative; display: flex; flex-direction: column; overflow: hidden;">
          <div class="card-header" style="flex-shrink: 0;">
            <div>
              <div class="card-title">Strukturanalysen</div>
              <div class="card-sub">Touren (DB I) vs. Sortimentsmix</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; height: 180px; max-height: 180px; width: 100%; gap: 16px; padding: 10px 0; overflow: hidden;">
            <div style="flex: 1; width: 50%; height: 100%; max-height: 100%; position: relative; overflow: hidden;">
              <canvas id="dashTourChart"></canvas>
            </div>
            <div style="flex: 1; width: 50%; height: 100%; max-height: 100%; position: relative; overflow: hidden;">
              <canvas id="dashSortMixChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `
  },
  umsatz: {
    title: "Umsatzanalyse",
    suggestions: ["Welches Segment wächst am stärksten?", "Warum schwächelt die Eigenmarke?", "Umsatzprognose für Q3?"],
    kpis: [
      { label: "Umsatz Q2 (Aktuell)", val: "€4,82M", delta: "Plan: €4,70M", colorClass: "g", deltaClass: "pos" },
      { label: "Durchschn. Marge", val: "38,2 %", delta: "▲ +0,8 PP", colorClass: "g", deltaClass: "pos" },
      { label: "Stärkstes Segment", val: "Trockenwaren", delta: "36% vom Gesamtumsatz", colorClass: "gm", deltaClass: "pos" },
      { label: "Wachstum Online", val: "+14 %", delta: "vs. Vorjahr", colorClass: "gm", deltaClass: "pos" }
    ],
    html: `
      <div class="charts-grid" style="grid-template-columns: 1fr; gap: 24px;">
        <div class="chart-card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div>
              <div class="card-title">Umsatzentwicklung (YTD)</div>
              <div class="card-sub">Monatliche Ist-Werte im Vergleich zum Budget</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <label for="salesStartDate" style="font-size: 12px; color: inherit; font-weight: 600;">Von:</label>
                <input type="date" id="salesStartDate" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border, #d0ded0); background: transparent; color: inherit; font-size: 12px; outline: none; cursor: pointer;">
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <label for="salesEndDate" style="font-size: 12px; color: inherit; font-weight: 600;">Bis:</label>
                <input type="date" id="salesEndDate" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border, #d0ded0); background: transparent; color: inherit; font-size: 12px; outline: none; cursor: pointer;">
              </div>
            </div>
          </div>
          <div class="chart-wrap" style="height: 280px;"><canvas id="salesTrendChart"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="card-header"><div><div class="card-title">Sortimentsmix</div></div></div>
          <div class="chart-wrap" style="height: 280px;"><canvas id="salesMixChart"></canvas></div>
        </div>
      </div>
    `
  },
  deckungsbeitrag: {
    title: "Deckungsbeitragsrechnung (DB I)",
    suggestions: ["Warum ist die Nord-Tour so profitabel?", "Logistikkosten senken?", "Marge der Eigenmarke?"],
    kpis: [
      { label: "Gesamt DB I", val: "€1,67M", delta: "▲ +4,1 % vs. Q1", colorClass: "g", deltaClass: "pos" },
      { label: "Top Region", val: "Nord (Ostfriesland)", delta: "41,6 % Marge", colorClass: "gm", deltaClass: "pos" },
      { label: "Problemkind", val: "Eigenmarke VON", delta: "▼ 23,8 % Marge", colorClass: "d", deltaClass: "neg" },
      { label: "Logistikkosten", val: "€410K", delta: "▼ -2% vs. Vormonat", colorClass: "w", deltaClass: "pos" }
    ],
    html: `
      <div class="table-card">
        <div class="card-header"><div class="card-title">Detaillierte DB-Aufschlüsselung nach Tour</div></div>
        <table>
          <thead><tr><th>Tour / Region</th><th>Umsatz</th><th>Materialkosten</th><th>DB I</th><th>DB %</th></tr></thead>
          <tbody>
            <tr><td><span class="dot" style="background:#3a6b35"></span>Nord (Ostfriesland)</td><td class="mono">€628K</td><td class="mono">€367K</td><td class="mono">€261K</td><td class="mono" style="color:#3a6b35">41,6%</td></tr>
            <tr><td><span class="dot" style="background:#4e8c47"></span>Süd (Marburg/Fulda)</td><td class="mono">€541K</td><td class="mono">€352K</td><td class="mono">€189K</td><td class="mono" style="color:#4e8c47">34,9%</td></tr>
            <tr><td><span class="dot" style="background:#7ab870"></span>Raum Göttingen</td><td class="mono">€480K</td><td class="mono">€322K</td><td class="mono">€158K</td><td class="mono" style="color:#7ab870">32,9%</td></tr>
            <tr><td><span class="dot" style="background:#c08030"></span>Online-Shop</td><td class="mono">€312K</td><td class="mono">€228K</td><td class="mono">€84K</td><td class="mono" style="color:#c08030">26,9%</td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  sortiment: {
    title: "Sortimentsanalyse & Performance",
    suggestions: ["Welche Artikel binden das meiste Kapital?", "Wie performt Frische vs. Trockenwaren?", "Top Lieferanten?"],
    kpis: [
      { label: "Gelistete Artikel", val: "10.450", delta: "▲ +120 vs. Q1", colorClass: "g", deltaClass: "pos" },
      { label: "Lagerumschlag", val: "14 Tage", delta: "Frische-Kategorie", colorClass: "gm", deltaClass: "pos" },
      { label: "Penner-Artikel (Slow)", val: "412", delta: "⚠ Kapitalbindung: €45K", colorClass: "w", deltaClass: "warn" },
      { label: "Marge Eigenmarke", val: "23,8 %", delta: "▼ Unter Ziel (30%)", colorClass: "d", deltaClass: "neg" }
    ],
    html: `
      <div class="charts-grid" style="grid-template-columns: 2fr 1fr;">
        <div class="chart-card">
          <div class="card-header"><div><div class="card-title">Kategoriewachstum (YoY)</div></div></div>
          <div class="chart-wrap"><canvas id="sortimentGrowthChart"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="card-header"><div><div class="card-title">Top 3 Lieferanten</div><div class="card-sub">Nach Umsatzvolumen</div></div></div>
          <table style="margin-top: 10px;">
            <tbody>
              <tr><td>BioHof Müller</td><td class="mono">€320K</td></tr>
              <tr><td>NaturQuelle</td><td class="mono">€280K</td></tr>
              <tr><td>VeggieLogistics</td><td class="mono">€215K</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  },
  touren: {
    title: "Tourenplanung & Logistikeffizienz",
    suggestions: ["Warum sind die Kosten pro Stopp gesunken?", "Auslastung optimieren?", "CO2-Emissionen analysieren"],
    kpis: [
      { label: "Auslieferungen", val: "1.240", delta: "Ø 41/Tag", colorClass: "g", deltaClass: "pos" },
      { label: "Kosten pro Stopp", val: "€34,50", delta: "▼ -€1,20 vs. Q1", colorClass: "gm", deltaClass: "pos" },
      { label: "Fahrzeugauslastung", val: "78 %", delta: "⚠ Ziel: 85%", colorClass: "w", deltaClass: "warn" },
      { label: "CO2-Emissionen", val: "14,2t", delta: "▲ +0,4t", colorClass: "d", deltaClass: "neg" }
    ],
    html: `
      <div class="logistics-container" style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; gap: 16px; justify-content: space-between; width: 100%;">
          <div class="kpi-card" style="flex: 1; background: #ffffff; border: 1px solid #d0ded0; border-radius: 8px; padding: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="font-size: 12px; color: #5a735a; font-weight: 600; text-transform: uppercase;">Ø Logistikkostenquote</div>
            <div style="font-size: 24px; font-weight: 700; color: #2d4a2d; margin-top: 4px;">11.4 % <span style="font-size: 12px; color: #6AA121; font-weight: normal;">-0.8% vs. Vormonat</span></div>
          </div>
          <div class="kpi-card" style="flex: 1; background: #ffffff; border: 1px solid #d0ded0; border-radius: 8px; padding: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="font-size: 12px; color: #5a735a; font-weight: 600; text-transform: uppercase;">Fuhrpark-Auslastung (Ø)</div>
            <div style="font-size: 24px; font-weight: 700; color: #2d4a2d; margin-top: 4px;">84.2 % <span style="font-size: 12px; color: #6AA121; font-weight: normal;">+2.1% Zielwert</span></div>
          </div>
          <div class="kpi-card" style="flex: 1; background: #ffffff; border: 1px solid #d0ded0; border-radius: 8px; padding: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="font-size: 12px; color: #5a735a; font-weight: 600; text-transform: uppercase;">Aktive Touren (YTD)</div>
            <div style="font-size: 24px; font-weight: 700; color: #2d4a2d; margin-top: 4px;">1,248 <span style="font-size: 12px; color: #5a735a; font-weight: normal;">Gesamt</span></div>
          </div>
        </div>
        
        <div class="charts-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 100%;">
          
          <div class="chart-card" style="background: #ffffff; border: 1px solid #d0ded0; border-radius: 8px; padding: 16px;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 16px;">
              <div>
                <div class="card-title" style="font-weight: 700; color: #2d4a2d; font-size: 15px;">Logistikkosten vs. Tour-Umsatz</div>
                <div class="card-sub" style="font-size: 12px; color: #5a735a;">Rentabilitäts-Abgleich je Tour</div>
              </div>
              
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <label for="tourStartDate" style="font-size: 12px; color: #5a735a; font-weight: 600;">Von:</label>
                  <input type="date" id="tourStartDate" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border, #d0ded0); background: transparent; color: inherit; font-size: 12px; outline: none; cursor: pointer;">
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <label for="tourEndDate" style="font-size: 12px; color: #5a735a; font-weight: 600;">Bis:</label>
                  <input type="date" id="tourEndDate" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border, #d0ded0); background: transparent; color: inherit; font-size: 12px; outline: none; cursor: pointer;">
                </div>
              </div>
            </div>
            <div class="chart-wrap" style="height: 300px; position: relative;"><canvas id="dashTourChart"></canvas></div>
          </div>
          
          <div class="chart-card" style="background: #ffffff; border: 1px solid #d0ded0; border-radius: 8px; padding: 16px;">
            <div class="card-header" style="margin-bottom: 16px;">
              <div class="card-title" style="font-weight: 700; color: #2d4a2d; font-size: 15px;">Kapazitätsauslastung nach Touren-Clustern</div>
              <div class="card-sub" style="font-size: 12px; color: #5a735a;">Soll (Maximallast) vs. Ist (Geladene Last)</div>
            </div>
            <div class="chart-wrap" style="height: 300px; position: relative;"><canvas id="logisticsUtilizationChart"></canvas></div>
          </div>
          
        </div>
      </div>
    `
  },
  liquiditaet: {
    title: "Liquiditätsmanagement (Cashflow)",
    suggestions: ["Wie schließen wir die Liquiditätslücke?", "Größte offene Forderungen?", "Cash-Burn-Rate senken"],
    kpis: [
      { label: "Flüssige Mittel", val: "€187K", delta: "⚠ Ziel: €250K", colorClass: "d", deltaClass: "neg" },
      { label: "Offene Forderungen", val: "€340K", delta: "Ø 24 Tage Zahlungsziel", colorClass: "w", deltaClass: "warn" },
      { label: "Verbindlichkeiten", val: "€210K", delta: "Fällig in < 14 Tagen", colorClass: "d", deltaClass: "neg" },
      { label: "Cash-Burn-Rate", val: "€12K", delta: "Monatlicher Abfluss", colorClass: "d", deltaClass: "neg" }
    ],
    html: `
      <div class="charts-grid" style="grid-template-columns: 2fr 1fr;">
        <div class="chart-card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div>
              <div class="card-title">Cashflow Wasserfall</div>
              <div class="card-sub">Analyse der Cashflow-Bewegungen nach Jahr und Quartal</div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
              <select id="cashflowYearSelect" style="background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-family: var(--font-b); outline: none; cursor: pointer;">
                <option value="2025">2025</option>
                <option value="2026" selected>2026</option>
              </select>
              
              <select id="cashflowQuarterSelect" style="background: var(--surface2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-family: var(--font-b); outline: none; cursor: pointer;">
                <option value="Q1">Q1</option>
                <option value="Q2" selected>Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
          </div>
          <div class="chart-wrap"><canvas id="cashflowChart"></canvas></div>
        </div>
        <div class="table-card" style="margin-top:0;">
          <div class="card-header"><div class="card-title">Mahnwesen</div><div class="card-sub">Überfällige Posten</div></div>
          <table>
            <thead><tr><th>Kunde</th><th>Betrag</th><th>Tage</th></tr></thead>
            <tbody>
              <tr><td>BioMarkt Kassel</td><td class="mono" style="color:#b83030">€14.200</td><td>+18</td></tr>
              <tr><td>NaturLaden HRO</td><td class="mono" style="color:#b83030">€8.450</td><td>+12</td></tr>
              <tr><td>KiezBio Berlin</td><td class="mono" style="color:#c08030">€5.100</td><td>+5</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  }}

const chatMessages = document.getElementById('chatMessages');
const aiInput = document.getElementById('aiInput');
const aiSend  = document.getElementById('aiSend');

window.renderView = function(viewId) {
  const container = document.getElementById('view-container');
  const title = document.getElementById('page-title');
  const suggestionsContainer = document.querySelector('.suggestions');
  const data = db[viewId];
  
  if (!data) return;

  Object.keys(chartInstances).forEach(key => chartInstances[key].destroy());
  chartInstances = {};

  title.textContent = data.title;
  
  let kpiHtml = '<div class="kpi-row">';
  data.kpis.forEach(kpi => {
    kpiHtml += `
      <div class="kpi-card ${kpi.colorClass}">
        <div class="kpi-label">${kpi.label}</div>
        <div class="kpi-value">${kpi.val}</div>
        <div class="kpi-delta ${kpi.deltaClass}">${kpi.delta}</div>
      </div>`;
  });
  kpiHtml += '</div>';

  container.innerHTML = kpiHtml + data.html;

  if (data.suggestions) {
    suggestionsContainer.innerHTML = data.suggestions.map(
      sug => `<div class="sug-chip" onclick="sendSug(this)">${sug}</div>`
    ).join('');
  } else {
    suggestionsContainer.innerHTML = '';
  }

  if (viewId === 'dashboard') initDashboardCharts();
  if (viewId === 'umsatz') initUmsatzCharts();
  if (viewId === 'sortiment') initSortimentCharts();
  if (viewId === 'touren') initTourenCharts();
  if (viewId === 'liquiditaet') initLiquiditaetCharts();
}

function initDashboardCharts() {
  const revCtx = document.getElementById('dashRevChart');
  if(revCtx) {
    chartInstances['dashRev'] = new Chart(revCtx, {
      type: 'bar',
      data: {
        labels: ['April', 'Mai', 'Juni'],
        datasets: [
          { 
            label: 'Umsatz', 
            data: [1540, 1660, 1620], 
            backgroundColor: 'rgba(106, 161, 33, 0.5)',
            borderColor: '#6AA121',
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.9,         
            categoryPercentage: 0.75     
          },
          { 
            label: 'Kosten', 
            data: [1600, 1620, 1500], 
            backgroundColor: 'rgba(194, 70, 65, 0.5)',
            borderColor: '#C24641',
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.9,
            categoryPercentage: 0.75
          }
        ]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 16, font: { size: 12, weight: '500' } } }
        },
        scales: { 
          x: { grid: { display: false } }, 
          y: { grid: gridOpts, ticks: { callback: v => '€' + v + 'K', maxTicksLimit: 6 } } 
        } 
      }
    });
  }

  const liqCtx = document.getElementById('dashLiqChart');
  if(liqCtx) {
    chartInstances['dashLiq'] = new Chart(liqCtx, {
      type: 'line',
      data: {
        labels: ['W1','W2','W3','W4','W5','W6'],
        datasets: [
          { label: 'Liquidität', data: [187,165,210,148,230,187], borderColor: '#3a6b35', backgroundColor: 'rgba(58,107,53,0.1)', borderWidth: 2, fill: true, tension: 0.4 },
          { label: 'Ziel', data: [250,250,250,250,250,250], borderColor: 'rgba(184,48,48,0.45)', borderDash: [5,5], borderWidth: 1.5, fill: false, pointRadius: 0 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: gridOpts }, y: { grid: gridOpts, ticks: { callback: v => '€' + v + 'K' } } } }
    });
  }

  const ebitCtx = document.getElementById('dashEbitChart');
  if(ebitCtx) {
    chartInstances['dashEbit'] = new Chart(ebitCtx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mär','Apr','Mai','Jun'],
        datasets: [{
          label: 'EBIT',
          data: [12, 5, -8, -15, -22, -38],
          borderColor: '#b83030',
          backgroundColor: 'rgba(184,48,48,0.15)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#b83030'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: gridOpts }, y: { grid: gridOpts, ticks: { callback: v => '€' + v + 'K' } } } }
    });
  }

  const tourCtx = document.getElementById('dashTourChart');
  if(tourCtx) {
    chartInstances['dashTour'] = new Chart(tourCtx, {
      type: 'doughnut',
      data: {
        labels: ['Nord', 'Süd', 'Göttingen', 'Online'],
        datasets: [{
          data: [41.6, 34.9, 32.9, 26.9],
          backgroundColor: ['#3a6b35', '#4e8c47', '#7ab870', '#c08030'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { boxWidth: 8, padding: 8, font: { size: 10 } } } } }
    });
  }

  const sortMixCtx = document.getElementById('dashSortMixChart');
  if(sortMixCtx) {
    chartInstances['dashSortMix'] = new Chart(sortMixCtx, {
      type: 'pie',
      data: {
        labels: ['Trocken', 'Frische', 'VON', 'Getränke'],
        datasets: [{
          data: [36, 24, 16, 14],
          backgroundColor: ['#6AA121', '#4e8c47', '#a8d89a', '#7ab870'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 8, padding: 8, font: { size: 10 } } } } }
    });
  }
}

function initUmsatzCharts() {
  requestAnimationFrame(() => {
    const umsatzTrendHistory = [
      { dateStr: '2025-01-01', label: 'Jan 25', umsatz: 1300 },
      { dateStr: '2025-02-01', label: 'Feb 25', umsatz: 1350 },
      { dateStr: '2025-03-01', label: 'Mar 25', umsatz: 1400 },
      { dateStr: '2025-04-01', label: 'Apr 25', umsatz: 1380 },
      { dateStr: '2025-05-01', label: 'Mai 25', umsatz: 1420 },
      { dateStr: '2025-06-01', label: 'Jun 25', umsatz: 1450 },
      { dateStr: '2025-07-01', label: 'Jul 25', umsatz: 1410 },
      { dateStr: '2025-08-01', label: 'Aug 25', umsatz: 1460 },
      { dateStr: '2025-09-01', label: 'Sep 25', umsatz: 1490 },
      { dateStr: '2025-10-01', label: 'Okt 25', umsatz: 1510 },
      { dateStr: '2025-11-01', label: 'Nov 25', umsatz: 1550 },
      { dateStr: '2025-12-01', label: 'Dez 25', umsatz: 1600 },
      { dateStr: '2026-01-01', label: 'Jan 26', umsatz: 1420 },
      { dateStr: '2026-02-01', label: 'Feb 26', umsatz: 1480 },
      { dateStr: '2026-03-01', label: 'Mar 26', umsatz: 1600 },
      { dateStr: '2026-04-01', label: 'Apr 26', umsatz: 1540 },
      { dateStr: '2026-05-01', label: 'Mai 26', umsatz: 1660 },
      { dateStr: '2026-06-01', label: 'Jun 26', umsatz: 1620 }
    ];

    if (!window.chartInstances) {
      window.chartInstances = {};
    }

    const mixCtx = document.getElementById('salesMixChart');
    if (mixCtx) {
      if (window.chartInstances['salesMix']) window.chartInstances['salesMix'].destroy();
      window.chartInstances['salesMix'] = new Chart(mixCtx, {
        type: 'doughnut',
        data: {
          labels: ['Trockenwaren', 'Frische & Kühl', 'Eigenmarke VON', 'Getränke', 'Sonstiges'],
          datasets: [{ 
            data: [36, 24, 16, 14, 10], 
            backgroundColor: ['#3a6b35', '#4e8c47', '#7ab870', '#a8d89a', '#c8e8bc'], 
            borderWidth: 0 
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%' }
      });
    }

    const trendCtx = document.getElementById('salesTrendChart');
    if (trendCtx) {
      const startInput = document.getElementById('salesStartDate');
      const endInput = document.getElementById('salesEndDate');

      if (startInput && !startInput.value) startInput.value = '2026-01-01';
      if (endInput && !endInput.value) endInput.value = '2026-06-30';

      function drawTrend() {
        if (window.chartInstances['salesTrend']) window.chartInstances['salesTrend'].destroy();

        const currentStart = startInput ? startInput.value : '2026-01-01';
        const currentEnd = endInput ? endInput.value : '2026-06-30';

        const startBound = new Date(currentStart);
        const endBound = new Date(currentEnd);

        const filtered = umsatzTrendHistory.filter(item => {
          const d = new Date(item.dateStr);
          return d >= startBound && d <= endBound;
        });

        window.chartInstances['salesTrend'] = new Chart(trendCtx, {
          type: 'line',
          data: {
            labels: filtered.map(item => item.label),
            datasets: [{ 
              label: 'Umsatz', 
              data: filtered.map(item => item.umsatz), 
              borderColor: '#3a6b35', 
              tension: 0.2,
              backgroundColor: 'transparent'
            }]
          },
          options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { x: { grid: { display: false } }, y: { ticks: { callback: v => '€' + v + 'K', stepSize: 500 } } }
          }
        });
      }

      if (startInput) startInput.onchange = drawTrend;
      if (endInput) endInput.onchange = drawTrend;
      drawTrend();
    }
  });
}

function initSortimentCharts() {
  const ctx = document.getElementById('sortimentGrowthChart');
  if(ctx) {
    chartInstances['sortGrowth'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Trockenwaren', 'Frische', 'Eigenmarke', 'Getränke'],
        datasets: [
          { label: '2025', data: [420, 310, 150, 190], backgroundColor: 'rgba(168, 216, 154, 0.5)', borderColor: '#a8d89a', borderWidth: 2, borderRadius: 4 },
          { label: '2026', data: [460, 340, 145, 210], backgroundColor: 'rgba(58, 107, 53, 0.5)', borderColor: '#3a6b35', borderWidth: 2, borderRadius: 4 }
        ]
      },
      options: { 
        responsive: true, maintainAspectRatio: false, 
        plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 12 } } } },
        scales: { x: { grid: { display: false } }, y: { grid: gridOpts, ticks: { maxTicksLimit: 6 } } } 
      }
    });
  }
}

function initTourenCharts() {
  requestAnimationFrame(() => {
    if (!window.chartInstances) window.chartInstances = {};

    // Historical data ledger grouped by operational window dates
    const tourHistoryLedger = [
      { dateStr: '2026-01-15', tour: 'Nord-Tour', umsatz: 2100, kosten: 240 },
      { dateStr: '2026-01-15', tour: 'Ost-Tour', umsatz: 1500, kosten: 210 },
      { dateStr: '2026-01-15', tour: 'Süd-Tour', umsatz: 2400, kosten: 290 },
      { dateStr: '2026-01-15', tour: 'West-Tour', umsatz: 1300, kosten: 180 },
      { dateStr: '2026-01-15', tour: 'Zentrum Express', umsatz: 2900, kosten: 410 },
      
      { dateStr: '2026-04-15', tour: 'Nord-Tour', umsatz: 2400, kosten: 280 },
      { dateStr: '2026-04-15', tour: 'Ost-Tour', umsatz: 1700, kosten: 270 },
      { dateStr: '2026-04-15', tour: 'Süd-Tour', umsatz: 2700, kosten: 320 },
      { dateStr: '2026-04-15', tour: 'West-Tour', umsatz: 1600, kosten: 210 },
      { dateStr: '2026-04-15', tour: 'Zentrum Express', umsatz: 3300, kosten: 480 },
      
      { dateStr: '2026-06-01', tour: 'Nord-Tour', umsatz: 4500, kosten: 520 },
      { dateStr: '2026-06-01', tour: 'Ost-Tour', umsatz: 3200, kosten: 480 },
      { dateStr: '2026-06-01', tour: 'Süd-Tour', umsatz: 5100, kosten: 610 },
      { dateStr: '2026-06-01', tour: 'West-Tour', umsatz: 2900, kosten: 390 },
      { dateStr: '2026-06-01', tour: 'Zentrum Express', umsatz: 6200, kosten: 890 }
    ];

    // 1. FILTERABLE TOUR REVENUE VS COSTS BAR CHART
    const tourCtx = document.getElementById('dashTourChart');
    if (tourCtx) {
      const startInput = document.getElementById('tourStartDate');
      const endInput = document.getElementById('tourEndDate');

      // Initialize defaults for the Q2 2026 view matching your dashboard status
      if (startInput && !startInput.value) startInput.value = '2026-04-01';
      if (endInput && !endInput.value) endInput.value = '2026-06-30';

      function drawTourPerformance() {
        if (window.chartInstances['dashTour']) {
          window.chartInstances['dashTour'].destroy();
        }

        const startBound = new Date(startInput ? startInput.value : '2026-04-01');
        const endBound = new Date(endInput ? endInput.value : '2026-06-30');

        // Filter and aggregate data per unique route within the range window
        const filteredRecords = tourHistoryLedger.filter(item => {
          const d = new Date(item.dateStr);
          return d >= startBound && d <= endBound;
        });

        const routeNames = ['Nord-Tour', 'Ost-Tour', 'Süd-Tour', 'West-Tour', 'Zentrum Express'];
        const totalUmsatz = routeNames.map(() => 0);
        const totalKosten = routeNames.map(() => 0);

        filteredRecords.forEach(rec => {
          const idx = routeNames.indexOf(rec.tour);
          if (idx !== -1) {
            totalUmsatz[idx] += rec.umsatz;
            totalKosten[idx] += rec.kosten;
          }
        });

        window.chartInstances['dashTour'] = new Chart(tourCtx, {
          type: 'bar',
          data: {
            labels: routeNames,
            datasets: [
              {
                label: 'Tour-Umsatz',
                data: totalUmsatz,
                backgroundColor: 'rgba(58, 107, 53, 0.6)', 
                borderColor: '#3a6b35',
                borderWidth: 1.5,
                borderRadius: 4
              },
              {
                label: 'Logistikkosten',
                data: totalKosten,
                backgroundColor: 'rgba(194, 70, 65, 0.6)', 
                borderColor: '#C24641',
                borderWidth: 1.5,
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false } },
              y: { 
                grid: window.gridOpts || { color: 'rgba(0,0,0,0.05)', drawBorder: false }, 
                ticks: { callback: v => '€' + v, stepSize: 1000 } 
              }
            }
          }
        });
      }

      if (startInput) startInput.onchange = drawTourPerformance;
      if (endInput) endInput.onchange = drawTourPerformance;
      
      drawTourPerformance();
    }

    // 2. CAPACITY UTILIZATION LINE CHART (UNTOUCHED)
    const utilCtx = document.getElementById('logisticsUtilizationChart');
    if (utilCtx) {
      if (window.chartInstances['logisticsUtil']) window.chartInstances['logisticsUtil'].destroy();
      window.chartInstances['logisticsUtil'] = new Chart(utilCtx, {
        type: 'line',
        data: {
          labels: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4', 'Woche 5', 'Woche 6'],
          datasets: [
            { label: 'Reale Auslastung (Ist)', data: [78, 82, 85, 80, 88, 84], borderColor: '#7ab870', backgroundColor: 'rgba(122, 184, 112, 0.1)', tension: 0.3, fill: true, pointBackgroundColor: '#7ab870' },
            { label: 'Optimale Zielgrenze (Soll)', data: [85, 85, 85, 85, 85, 85], borderColor: '#3a6b35', borderDash: [6, 6], borderWidth: 2, fill: false, pointRadius: 0 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { min: 50, max: 100, ticks: { callback: v => v + '%', stepSize: 10 } } } }
      });
    }
  });
}

function initLiquiditaetCharts() {
  requestAnimationFrame(() => {
    const ctx = document.getElementById('cashflowChart');
    if (!ctx) return;

    const yearSelect = document.getElementById('cashflowYearSelect');
    const quarterSelect = document.getElementById('cashflowQuarterSelect');

    // Matrix parsed by Year and Quarter composite tracking keys
    const cashflowDataRepository = {
      "2025_Q1": { labels: ['Start Q1/25', 'Einzahlungen', 'Auszahlungen', 'Steuern', 'Ende Q1/25'], data: [380, 1200, -1150, -100, 330] },
      "2025_Q2": { labels: ['Start Q2/25', 'Einzahlungen', 'Auszahlungen', 'Steuern', 'Ende Q2/25'], data: [330, 1380, -1250, -110, 350] },
      "2025_Q3": { labels: ['Start Q3/25', 'Einzahlungen', 'Auszahlungen', 'Steuern', 'Ende Q3/25'], data: [350, 1410, -1300, -120, 340] },
      "2025_Q4": { labels: ['Start Q4/25', 'Einzahlungen', 'Auszahlungen', 'Steuern', 'Ende Q4/25'], data: [340, 1550, -1320, -140, 430] },
      
      "2026_Q1": { labels: ['Start Q1/26', 'Einzahlungen', 'Auszahlungen', 'Steuern', 'Ende Q1/26'], data: [420, 1310, -1220, -150, 360] },
      "2026_Q2": { labels: ['Start Q2/26', 'Einzahlungen', 'Auszahlungen', 'Steuern', 'Aktuell'], data: [510, 1450, -1380, -393, 687] },
      "2026_Q3": { labels: ['Start Q3/26', 'Einzahlungen (Plan)', 'Auszahlungen (Plan)', 'Steuern', 'Ende Q3/26'], data: [687, 1520, -1290, -210, 707] },
      "2026_Q4": { labels: ['Start Q4/26', 'Einzahlungen (Plan)', 'Auszahlungen (Plan)', 'Steuern', 'Ende Q4/26'], data: [707, 1680, -1410, -250, 727] }
    };

    function drawWaterfall() {
      // Clear tracking instance array securely to prevent Chart.js canvas reuse crashes
      if (window.chartInstances && window.chartInstances['cashflow']) {
        window.chartInstances['cashflow'].destroy();
      }

      // Build composite key (e.g. "2026_Q2")
      const year = yearSelect ? yearSelect.value : '2026';
      const quarter = quarterSelect ? quarterSelect.value : 'Q2';
      const lookupKey = `${year}_${quarter}`;

      const activeDataset = cashflowDataRepository[lookupKey] || cashflowDataRepository['2026_Q2'];

      if (!window.chartInstances) {
        window.chartInstances = {};
      }

      window.chartInstances['cashflow'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: activeDataset.labels,
          datasets: [{
            label: 'Cashflow',
            data: activeDataset.data,
            backgroundColor: (context) => {
              const val = context.raw;
              if (val < 0) return 'rgba(194, 70, 65, 0.5)'; // Negative Outflow: Red
              if (context.dataIndex === 0 || context.dataIndex === 4) return 'rgba(122, 92, 58, 0.5)'; // Baseline Markers: Brown
              return 'rgba(106, 161, 33, 0.5)'; // Positive Inflow: Green
            },
            borderColor: (context) => {
              const val = context.raw;
              if (val < 0) return '#C24641';
              if (context.dataIndex === 0 || context.dataIndex === 4) return '#7a5c3a';
              return '#6AA121';
            },
            borderWidth: 2,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              grid: gridOpts || { color: 'rgba(0,0,0,0.05)', drawBorder: false },
              ticks: { callback: v => '€' + v + 'K' }
            }
          }
        }
      });
    }

    // Attach listener logic to both input nodes if they are present in the DOM
    if (yearSelect) yearSelect.onchange = drawWaterfall;
    if (quarterSelect) quarterSelect.onchange = drawWaterfall;

    // Run initial viewport paint
    drawWaterfall();
  });
}

window.addMsg = function(text, role) {
  const w=document.createElement('div'); w.className='cmsg '+role;
  const av=document.createElement('div'); av.className='cmsg-av '+role;
  av.textContent = role==='ai' ? '🌿' : '👤';
  const b=document.createElement('div'); b.className='cmsg-bubble '+role;
  b.textContent=text; w.appendChild(av); w.appendChild(b);
  chatMessages.appendChild(w); chatMessages.scrollTop=chatMessages.scrollHeight;
}

function addTyping() {
  const w=document.createElement('div'); w.className='cmsg ai'; w.id='ctyp';
  const av=document.createElement('div'); av.className='cmsg-av ai'; av.textContent='🌿';
  const b=document.createElement('div'); b.className='cmsg-bubble ai';
  b.innerHTML='<div class="typing-ind"><span></span><span></span><span></span></div>';
  w.appendChild(av); w.appendChild(b); chatMessages.appendChild(w);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}

function removeTyping() { const e=document.getElementById('ctyp'); if(e)e.remove(); }

window.ask = async function(q) {
  // Fetch the current key value from storage dynamically
  const savedKey = localStorage.getItem('nk_dash_gemini_key') || '';

  // If the field is empty, show a polite warning message in the chat panel
  if (!savedKey) {
    addMsg("Sicherheitshinweis: Bitte tragen Sie zuerst Ihren Gemini API-Key im Sidebar-Feld ein, um den Chat zu aktivieren.", 'ai'); //[cite: 2]
    return;
  }

  addMsg(q, 'user'); //[cite: 2]
  addTyping(); //[cite: 2]
  aiInput.disabled = true; //[cite: 2]
  aiSend.disabled = true; //[cite: 2]

  const dashboardContext = JSON.stringify(db); //[cite: 2]

  const promptText = `You are an expert financial controlling AI assistant for Naturkost Elkershausen.
Analyze the complete multi-view dashboard data provided below to answer the user's question:
${dashboardContext}

Rules:
1. Answer strictly in German.
2. Keep your answer brutal, precise, and under 3 sentences.
3. Give further steps to improve, keep it concise under 5 sentences. 
4. Give detailed answer if asked explicitly.
5. Answer strictly in context of data you have access to.
6. Do not use Markdown formatting.
7. If the data does not contain the answer, state that you do not have that information.

User Question: ${q}`; //[cite: 2]

  try {
    // Instantiate the SDK instance on-the-fly using the secure localized variable
    const aiInstance = new GoogleGenAI({ apiKey: savedKey }); //[cite: 2]
    
    const response = await aiInstance.models.generateContent({ //[cite: 2]
        model: 'gemini-2.5-flash', //[cite: 2]
        contents: promptText, //[cite: 2]
    }); //[cite: 2]

    removeTyping(); //[cite: 2]
    addMsg(response.text, 'ai'); //[cite: 2]

  } catch (error) {
    console.error("Gemini SDK Error:", error); //[cite: 2]
    removeTyping(); //[cite: 2]
    addMsg("Systemfehler: Verbindung fehlgeschlagen. Bitte prüfen Sie, ob Ihr eingegebener API-Key gültig ist.", 'ai'); //[cite: 2]
  }

  aiInput.disabled = false; //[cite: 2]
  aiSend.disabled = false; //[cite: 2]
  aiInput.focus(); //[cite: 2]
}

window.sendSug = function(el) { 
  ask(el.textContent); 
}

aiSend.addEventListener('click', (e) => { 
  e.preventDefault();
  const v = aiInput.value.trim(); 
  if(!v) return; 
  aiInput.value = ''; 
  ask(v); 
});

aiInput.addEventListener('keypress', (e) => { 
  if(e.key === 'Enter') { 
    e.preventDefault();
    const v = aiInput.value.trim(); 
    if(!v) return; 
    aiInput.value = ''; 
    ask(v); 
  }
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    e.currentTarget.classList.add('active');
    renderView(e.currentTarget.getAttribute('data-view'));
  });
});

renderView('dashboard');
setTimeout(() => {
  addMsg('Guten Morgen. Ich habe Ihre Q2-Zahlen analysiert. Die Liquidität ist mit €187K das dringlichste Thema – Sie liegen 25% unter dem Zielwert von €250K. Gleichzeitig zeigt der EBIT einen operativen Verlust. Womit soll ich beginnen?', 'ai');
}, 500);

window.toggleChatPanel = function() {
  const panel = document.getElementById('chatPanel');
  panel.classList.toggle('open');
  
  if (panel.classList.contains('open')) {
    setTimeout(() => document.getElementById('aiInput').focus(), 300);
  }
};