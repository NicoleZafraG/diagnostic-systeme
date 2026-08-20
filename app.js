// Datos Iniciales Simulados de Diagnóstico
const systemData = {
    pcName: "WORKSTATION-C13-PRO",
    os: "Windows 11 Enterprise (64-bit)",
    uptime: "5 jours, 14 heures, 22 minutes",
    ramTotal: 16,
    ramUsed: 8.4,
    disks: [
        { drive: "C:", label: "Système SSD", total: 500, used: 460, unit: "GB" },
        { drive: "D:", label: "Données HDD", total: 1000, used: 680, unit: "GB" },
        { drive: "E:", label: "Sauvegarde Ext", total: 2000, used: 400, unit: "GB" }
    ],
    processes: [
        { id: 4120, name: "chrome.exe", ram: 1650 },
        { id: 8940, name: "msedgewebview2.exe", ram: 920 },
        { id: 1204, name: "powershell.exe", ram: 410 },
        { id: 5532, name: "sqlservr.exe", ram: 380 },
        { id: 2100, name: "explorer.exe", ram: 210 }
    ],
    stoppedServices: [
        { name: "Spooler", displayName: "Gestionnaire d'impression" },
        { name: "wuauserv", displayName: "Windows Update" }
    ]
};

// Renderizar Discos con Alertas de Color por Umbral
function renderDisks() {
    const container = document.getElementById("disks-container");
    container.innerHTML = "";

    systemData.disks.forEach(disk => {
        const percent = Math.round((disk.used / disk.total) * 100);
        let colorClass = "bg-green";
        let statusBadge = "🟢 Normal";

        if (percent >= 70 && percent <= 90) {
            colorClass = "bg-yellow";
            statusBadge = "🟡 Avertissement (Limite 70%)";
        } else if (percent > 90) {
            colorClass = "bg-red";
            statusBadge = "🔴 ALERTE CRITIQUE (>90%)";
        }

        container.innerHTML += `
            <div class="disk-block">
                <div class="disk-info">
                    <span><strong>${disk.drive}</strong> (${disk.label}) - ${disk.used}/${disk.total} ${disk.unit} (${percent}%)</span>
                    <span>${statusBadge}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${colorClass}" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    });
}

// Renderizar Top 5 Procesos
function renderProcesses() {
    const list = document.getElementById("process-list");
    list.innerHTML = "";

    systemData.processes.forEach(proc => {
        list.innerHTML += `
            <li class="process-item">
                <span><i class="fa-solid fa-gear"></i> <strong>${proc.name}</strong> (PID: ${proc.id})</span>
                <span>${proc.ram} MB</span>
            </li>
        `;
    });
}

// Renderizar Servicios Detenidos
function renderServices() {
    const container = document.getElementById("services-container");
    if (systemData.stoppedServices.length === 0) {
        container.innerHTML = `<p style="color: var(--green);"><i class="fa-solid fa-check"></i> Aucun problème détecté. Tous les services automatiques fonctionnent.</p>`;
    } else {
        let html = `<ul class="process-list">`;
        systemData.stoppedServices.forEach(s => {
            html += `
                <li class="process-item" style="color: var(--yellow);">
                    <span>⚠️ <strong>${s.name}</strong> - ${s.displayName}</span>
                    <span class="tag" style="background:#7f1d1d; color:#fca5a5;">Arrêté</span>
                </li>
            `;
        });
        html += `</ul>`;
        container.innerHTML = html;
    }
}

// Consola Log
function logConsole(message) {
    const consoleBox = document.getElementById("console-output");
    const time = new Date().toLocaleTimeString();
    consoleBox.innerText += `\n[${time}] ${message}`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

// Ejecutar Diagnóstico Completo
function runFullDiagnostic() {
    logConsole("Démarrage du diagnostic système complet...");
    renderDisks();
    renderProcesses();
    renderServices();
    logConsole("Analyse des disques complétée.");
    logConsole("Top 5 processus RAM mis à jour.");
    logConsole("Vérification des services système terminée.");
    logConsole("✅ DIAGNOSTIC COMPLET EXECUTE AVEC SUCCES.");
}

function checkServices() {
    renderServices();
    logConsole("Re-vérification des services exécutée.");
}

// Exportar TXT
function exportTxtReport() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0,10).replace(/-/g, "");
    const fileName = `rapport_${dateStr}_diagnostic.txt`;

    let content = `==================================================\n`;
    content += `   RAPPORT DE DIAGNOSTIC SYSTEME - DEP 5385\n`;
    content += `   Généré le : ${date.toLocaleString()}\n`;
    content += `==================================================\n\n`;

    content += `--- INFOS SYSTEME ---\n`;
    content += `Nom PC : ${systemData.pcName}\nOS     : ${systemData.os}\nUptime : ${systemData.uptime}\n\n`;

    content += `--- STATUT DES DISQUES ---\n`;
    systemData.disks.forEach(d => {
        const pct = Math.round((d.used/d.total)*100);
        let alert = pct > 90 ? "CRITIQUE" : (pct >= 70 ? "AVERTISSEMENT" : "OK");
        content += `- Disque ${d.drive} : ${d.used}/${d.total} GB (${pct}%) [${alert}]\n`;
    });

    content += `\n--- TOP 5 PROCESSUS MEMOIRE ---\n`;
    systemData.processes.forEach(p => {
        content += `- PID ${p.id} | ${p.name} : ${p.ram} MB\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    logConsole(`📄 Rapport TXT généré : ${fileName}`);
}

// Exportar HTML Imprimable (Punto extra para presentación)
function exportHtmlReport() {
    const win = window.open("", "_blank");
    win.document.write(`
        <html>
        <head>
            <title>Rapport de Diagnostic - ${systemData.pcName}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
                h1 { color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f1f5f9; }
                .badge { padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; }
                .red { background-color: #ef4444; }
                .green { background-color: #22c55e; }
            </style>
        </head>
        <body>
            <h1>📋 Rapport Officiel de Diagnostic Système</h1>
            <p><strong>Machine :</strong> ${systemData.pcName} | <strong>Date :</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Système :</strong> ${systemData.os}</p>
            
            <h2>Disques Dur</h2>
            <table>
                <tr><th>Lecteur</th><th>Utilisé</th><th>Total</th><th>Pourcentage</th><th>Statut</th></tr>
                ${systemData.disks.map(d => `
                    <tr>
                        <td>${d.drive}</td><td>${d.used} GB</td><td>${d.total} GB</td>
                        <td>${Math.round((d.used/d.total)*100)}%</td>
                        <td><span class="badge ${d.used/d.total > 0.9 ? 'red':'green'}">${d.used/d.total > 0.9 ? 'CRITIQUE':'NORMAL'}</span></td>
                    </tr>
                `).join('')}
            </table>
            <br>
            <button onclick="window.print()">🖨️ Imprimer le Rapport</button>
        </body>
        </html>
    `);
    logConsole("📄 Rapport HTML imprimable généré dans une nouvelle fenêtre.");
}

// Carga Inicial Automática
window.onload = function() {
    renderDisks();
    renderProcesses();
    renderServices();
};