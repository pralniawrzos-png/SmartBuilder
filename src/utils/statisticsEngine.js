export const calculateStats = (installations, bgImage, projectWidthM) => {
  const stats = {};
  Object.keys(installations).forEach(floor => {
    stats[floor] = {};
    Object.entries(installations[floor]).forEach(([layer, els]) => {
      let count = 0;
      let length = 0;
      els.forEach(el => {
        if (el.type === 'circle' || el.type === 'rect') count++;
        if (el.type === 'line' || el.type === 'polygon') {
          const aspect = bgImage ? (bgImage.height/bgImage.width) : 1;
          let currentLen = 0;
          for(let i=1; i<el.points.length; i++) {
             const dx = el.points[i][0] - el.points[i-1][0];
             const dy = (el.points[i][1] - el.points[i-1][1]) * aspect;
             currentLen += Math.hypot(dx, dy) * projectWidthM;
          }
          if (el.type === 'polygon' && el.points.length > 2) {
             const dx = el.points[0][0] - el.points[el.points.length-1][0];
             const dy = (el.points[0][1] - el.points[el.points.length-1][1]) * aspect;
             currentLen += Math.hypot(dx, dy) * projectWidthM;
          }
          length += currentLen;
        }
      });
      if (count > 0 || length > 0) {
        stats[floor][layer] = { count, length: length.toFixed(1) };
      }
    });
  });
  return stats;
};