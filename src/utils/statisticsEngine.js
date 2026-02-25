export const calculateStats = (installations, bgImage, projectWidthM, activeLayers) => {
  const stats = {};
  if (!installations || !installations.floors) return stats;
  const aspect = bgImage && bgImage.width ? (bgImage.height / bgImage.width) : 1;
  const scale = projectWidthM || 1;
  installations.floors.forEach(floor => {
    stats[floor.name] = {};
    Object.entries(floor.data).forEach(([layer, els]) => {
      if (activeLayers && !activeLayers[layer]) return;
      let count = 0;
      let zones = [];
      let devices = [];
      let totalCost = 0;
      let lineGroups = {};
      els.forEach(el => {
        if (el.type === 'circle' || el.type === 'rect') {
          count++;
          const cost = parseFloat(el.cost) || 0;
          devices.push({ label: el.label || 'Urządzenie bez nazwy', cost: cost });
          totalCost += cost;
        }
        else if (el.type === 'line') {
          const aspect = bgImage ? (bgImage.height / bgImage.width) : 1;
          let currentLen = 0;
          for (let i = 1; i < el.points.length; i++) {
            const dx = el.points[i][0] - el.points[i - 1][0];
            const dy = (el.points[i][1] - el.points[i - 1][1]) * aspect;
            currentLen += Math.hypot(dx, dy) * projectWidthM;
          }
          const lineLabel = el.label || 'Trasa bez nazwy';
          const costPerM = parseFloat(el.costPerMeter) || 0;
          const lineCost = currentLen * costPerM;
          if (!lineGroups[lineLabel]) {
            lineGroups[lineLabel] = { length: 0, cost: 0 };
          }
          lineGroups[lineLabel].length += currentLen;
          lineGroups[lineLabel].cost += lineCost;
          totalCost += lineCost;
        }
        else if (el.type === 'polygon' && el.points.length >= 3) {
          let areaFrac = 0;
          const aspect = bgImage ? (bgImage.height / bgImage.width) : 1;
          const pts = el.points;
          for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const x1 = pts[j][0], y1 = pts[j][1] * aspect;
            const x2 = pts[i][0], y2 = pts[i][1] * aspect;
            areaFrac += (x1 + x2) * (y1 - y2);
          }
          const areaM2 = Math.abs(areaFrac / 2) * (projectWidthM * projectWidthM);
          zones.push({ label: el.label || 'Strefa bez nazwy', area: areaM2.toFixed(2) });
        }
      });
      const groupedLines = Object.entries(lineGroups).map(([name, d]) => ({ label: name, length: d.length.toFixed(1), cost: d.cost }));
      if (count > 0 || groupedLines.length > 0 || zones.length > 0) {
        stats[floor.name][layer] = { count, zones, devices, groupedLines, totalCost };
      }
    });
  });
  return stats;
};