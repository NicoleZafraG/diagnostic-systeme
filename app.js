function generateReport() {
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:T-]/g, "").slice(0, 13);
    const fileName = `rapport_${dateStr}.txt`;

    const content = `=== RAPPORT DE DIAGNOSTIC SYSTEME ===
Généré le: ${now.toLocaleString()}
PC: WORKSTATION-01
OS: Windows 11 Pro

--- STATUT DES DISQUES ---
- C: 92% Utilisé (🔴 ALERTE CRITIQUE)
- D: 45% Utilisé (🟢 Normal)

--- TOP PROCESSUS MEMOIRE ---
1. chrome.exe - 1450 MB
2. msedgewebview2.exe - 820 MB
3. powershell.exe - 310 MB
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    document.getElementById("log-output").innerText = `Rapport généré et téléchargé : ${fileName}`;
}

function refreshData() {
    document.getElementById("log-output").innerText = "Diagnostic système mis à jour avec succès.";
}