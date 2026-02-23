import { LAYER_CONFIG } from '../config';

export const renderCanvas = ({
  canvas, bgImage, installations, activeFloor, activeLayers,
  isEditMode, selectedElement, dragInfo,
  isMeasuring, measureStart, measureEnd, mousePos, projectWidthM
}) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (bgImage) {
    canvas.width = bgImage.width;
    canvas.height = bgImage.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    // Domyślne płótno, gdy brakuje wgranego rzutu
    canvas.width = 1200;
    canvas.height = 800;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Delikatna siatka tła
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
    for(let i=0; i<canvas.height; i+=50) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); }
  }

  const w = canvas.width;
  const h = canvas.height;
  const currentFloor = installations.floors.find(f => f.id === activeFloor);
  if (!currentFloor) return;
  const floorData = currentFloor.data;

  // Rysowanie stref i linii
  Object.entries(floorData).forEach(([layerKey, elements]) => {
    if (!activeLayers[layerKey]) return;
    elements.forEach((el, index) => {
      const isSelected = selectedElement && selectedElement.layerKey === layerKey && selectedElement.index === index;
      
      if (el.type === 'polygon') {
        ctx.beginPath();
        ctx.fillStyle = (el.color || LAYER_CONFIG[layerKey].color) + '30';
        ctx.strokeStyle = isSelected ? '#fff' : (el.color || LAYER_CONFIG[layerKey].color);
        ctx.lineWidth = isSelected ? 4 : 2;
        ctx.moveTo(el.points[0][0] * w, el.points[0][1] * h);
        el.points.forEach(p => ctx.lineTo(p[0] * w, p[1] * h));
        ctx.closePath(); ctx.fill(); ctx.stroke();
        
        if (isEditMode && isSelected) {
           ctx.fillStyle = '#ef4444';
           el.points.forEach(p => ctx.fillRect((p[0] * w) - 6, (p[1] * h) - 6, 12, 12));
        }
      } else if (el.type === 'line') {
        ctx.beginPath();
        ctx.strokeStyle = isSelected ? '#fff' : (el.color || LAYER_CONFIG[layerKey].color);
        ctx.lineWidth = isSelected ? (el.thickness || 3) + 3 : (el.thickness || 3);
        if (el.dashed && !isSelected) ctx.setLineDash([15, 10]); else ctx.setLineDash([]);
        ctx.moveTo(el.points[0][0] * w, el.points[0][1] * h);
        for (let i = 1; i < el.points.length; i++) ctx.lineTo(el.points[i][0] * w, el.points[i][1] * h);
        ctx.stroke();
        ctx.setLineDash([]); 

        if (isEditMode && isSelected) {
          ctx.fillStyle = '#ef4444';
          el.points.forEach(p => ctx.fillRect((p[0] * w) - 5, (p[1] * h) - 5, 10, 10));
        }
      }
    });
  });

  // Rysowanie punktów i urządzeń
  Object.entries(floorData).forEach(([layerKey, elements]) => {
    if (!activeLayers[layerKey]) return;
    elements.forEach((el, index) => {
      if (el.type !== 'circle' && el.type !== 'rect') return;
      const isSelected = selectedElement && selectedElement.layerKey === layerKey && selectedElement.index === index;
      const isDrag = dragInfo && dragInfo.layerKey === layerKey && dragInfo.index === index && dragInfo.pointIndex === undefined;
      
      ctx.beginPath();
      ctx.strokeStyle = el.color || LAYER_CONFIG[layerKey].color;
      ctx.fillStyle = (isDrag || isSelected) ? '#ffffff' : (el.color || LAYER_CONFIG[layerKey].color) + '95'; 
      ctx.lineWidth = (isDrag || isSelected) ? 5 : 3;

      if (el.type === 'circle') {
        ctx.arc(el.x * w, el.y * h, (el.r || 0.01) * w, 0, 2 * Math.PI);
      } else {
        ctx.rect(el.x * w, el.y * h, (el.w || 0.02) * w, (el.h || 0.02) * h);
      }
      ctx.fill(); ctx.stroke();
      
      if (isEditMode && isSelected) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect((el.x * w) - 4, (el.y * h) - 4, 8, 8);
      }
    });
  });

  // Rysowanie miarki
  if (isMeasuring && measureStart) {
    const endPos = measureEnd || mousePos;
    if (endPos) {
       const aspect = bgImage ? (bgImage.height/bgImage.width) : 1;
       const dx = endPos.x - measureStart.x;
       const dy = (endPos.y - measureStart.y) * aspect;
       const dist = Math.hypot(dx, dy) * projectWidthM;

       ctx.beginPath();
       ctx.strokeStyle = '#f43f5e';
       ctx.lineWidth = 3;
       ctx.setLineDash([5, 5]);
       ctx.moveTo(measureStart.x * w, measureStart.y * h);
       ctx.lineTo(endPos.x * w, endPos.y * h);
       ctx.stroke();
       ctx.setLineDash([]);

       const text = `${dist.toFixed(2)} m`;
       ctx.font = 'bold 16px sans-serif';
       const textWidth = ctx.measureText(text).width;
       ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
       ctx.fillRect((endPos.x * w) + 10, (endPos.y * h) + 10, textWidth + 10, 24);
       
       ctx.fillStyle = '#f43f5e';
       ctx.fillText(text, (endPos.x * w) + 15, (endPos.y * h) + 28);

       ctx.beginPath(); ctx.fillStyle='#f43f5e'; ctx.arc(measureStart.x * w, measureStart.y * h, 5, 0, 2*Math.PI); ctx.fill();
       ctx.beginPath(); ctx.fillStyle='#f43f5e'; ctx.arc(endPos.x * w, endPos.y * h, 5, 0, 2*Math.PI); ctx.fill();
    }
  }
};