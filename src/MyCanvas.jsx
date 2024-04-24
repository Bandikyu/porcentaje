import React, { useEffect, useRef } from 'react';

const MyCanvas = (props) => {
  const canvasRef = useRef(null);
  const coloreado = props.coloreado;
  console.log("🚀 ~ MyCanvas ~ coloreado:", coloreado)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const numRectangulosGrandes = 80;
    const numRectangulosChicos = 12;
    const gapGrande = 2; // Gap entre rectángulos grandes
    const gapChico = 1; // Gap entre rectángulos chicos
    const opacidadGrande = 0.5; // Opacidad de los rectángulos grandes (valor entre 0 y 1)
    const colorSquad = coloreado; // Número de rectángulos pequeños que se colorearán de azul LO TENGO QUE PASAR CON UNA PROP

    const tamanoMaxGrandeAncho = Math.min((canvas.width - (4 * gapGrande)) / 5);
    const tamanoMaxGrandeAlto = Math.min((canvas.height - (15 * gapGrande)) / 16); // El alto es la mitad del ancho

    const tamanoMaxChicoAncho = (tamanoMaxGrandeAncho - (gapChico * 3)) / 4;
    const tamanoMaxChicoAlto = (tamanoMaxGrandeAlto - (gapChico * 2)) / 3; // El alto es la mitad del ancho

    let cuadradosColoreados = 0;

    for (let i = 0; i < numRectangulosGrandes; i++) {
      const xGrande = ((i % 5) * (tamanoMaxGrandeAncho + gapGrande)) + gapGrande;
      const yGrande = (Math.floor(i / 5) * (tamanoMaxGrandeAlto + gapGrande)) + gapGrande;

      ctx.globalAlpha = opacidadGrande; // Establecer la opacidad para los rectángulos grandes
      ctx.fillRect(xGrande, yGrande, tamanoMaxGrandeAncho, tamanoMaxGrandeAlto);
      ctx.globalAlpha = 1.0; // Restablecer la opacidad a su valor predeterminado

      for (let j = 0; j < numRectangulosChicos; j++) {
        const xChica = xGrande + ((j % 4) * (tamanoMaxChicoAncho + gapChico)) + gapChico;
        const yChica = yGrande + (Math.floor(j / 4) * (tamanoMaxChicoAlto + gapChico)) + gapChico;

        if (cuadradosColoreados < colorSquad) {
          // Colorear los rectángulos pequeños de azul
          ctx.fillStyle = '#dddddd';
          cuadradosColoreados++;
        } else {
          ctx.fillStyle = '#8e8ec2'; // Restablecer el color a negro
        }

        ctx.fillRect(xChica, yChica, tamanoMaxChicoAncho, tamanoMaxChicoAlto);
      }
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [coloreado]);

  return <canvas ref={canvasRef} style={{width:'100%', height:'100%', padding:'0 2.5px 2.5px 0' }}></canvas>;
};

export default React.memo(MyCanvas);