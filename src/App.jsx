import { useState, useEffect } from 'react';
import './App.css';
import MyCanvas from './MyCanvas';

function App() {
  const [fetchData, setFetchData] = useState('');
  const [percentages, setPercentages] = useState(
    JSON.parse(localStorage.getItem('percentages')) || {}
  );
  const [now, setNow] = useState('');
  const [coloreado , setColoreado] = useState('');

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "NID=513=S6eKp07yHewb3UL5z8EvcdJaK7hTO5yH9YXKBbGF3Pv8pOy7iTuDIq5sZYbiiGZ12iBJRM1MJ1Ap13Q62LXgPvNzWxpBaYXAnJbASDHnFgsjDUQQVR0R2iZ1bplSrmcTJeb6_ojO9Xafdoc_jlCYkGyWI9rzbAbiieMZzE-De-Y");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
  
    const fetchD = async () => {
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbylQBqT-xo_d_VntkONt-_qp52LBT_MRoVAs7kJfx7_fp82NKNmk5LQzKE0jSAPeaa02A/exec", requestOptions);
        const result = await response.text();
        setFetchData(result);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchD();
    '👑' in percentages ? setColoreado(percentages['👑']) : false;
  }, []);

  useEffect(() => {
    const fetchDataInterval = setInterval(async () => {
        setNow(new Date())
        if (fetchData) {
          const data = JSON.parse(fetchData);
          const percentages = {};
    
          for (const key in data) {
            let { hourStart, hourEnd, dayStart, dayEnd } = data[key];
            
            if(dayStart === "" && dayEnd === "") {
              dayStart = now;
              dayEnd = now;
            }
    
            const hourStartConvertir = convertirFecha(hourStart);
            const hourEndConvertir = convertirFecha(hourEnd);
            const dayStartConvertir = convertirFecha(dayStart);
            const dayEndConvertir = convertirFecha(dayEnd);
            
            const startDateTime = combinarFechaHora(dayStartConvertir, hourStartConvertir);
            const endDateTime = combinarFechaHora(dayEndConvertir, hourEndConvertir);
    
            const startDate = new Date(startDateTime);
            const endDate = new Date(endDateTime);
    
            const duration = endDate.getTime() - startDate.getTime();
            const elapsed = now.getTime() - startDate.getTime();
    
            //ver esto luego, nunca puede ser  mayor a 100
            const percentage = (duration > elapsed && (100 - ((elapsed / duration)) * 100).toFixed(4) < 100) ? (100 - ((elapsed / duration)) * 100).toFixed(2) : "✔";
            percentages[key] = percentage;
          }
    
          setPercentages(percentages);
          localStorage.setItem('percentages', JSON.stringify(percentages));
          
        }
      }, 1000); // Ejecutar cada 5 segundos (5000 milisegundos)
  
    return () => clearInterval(fetchDataInterval); // Limpiar el intervalo cuando el componente se desmonte
  }, [now]);

  function combinarFechaHora(fechaT, horaT) {
    const [fecha , horaN] = fechaT.split("T");
    const [fechaN , hora] = horaT.split("T");
    const [fechaAno, fechaMes, fechaDia] = fecha.split('-');
    const [horaHoras, horaMinutos, horaSegundos] = hora.split(':');
    return `${fechaAno}-${fechaMes}-${fechaDia}T${horaHoras}:${horaMinutos}:${horaSegundos}`;
  }

  function convertirFecha(fechaStr) {
    // Crear un objeto Date a partir de la cadena de texto
    const fecha = new Date(fechaStr);
  
    // Obtener los componentes de la fecha
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
  
    // Construir la nueva cadena de texto en el formato deseado
    const nuevoFormato = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
  
    return nuevoFormato;
  }

  return (
    <>
    <div style={{ position:'absolute', top:0 , left:0, right:0, width:'100%', height:'100%' }}>
      <MyCanvas coloreado = {Math.trunc((80/100*(100-coloreado))*12)} />
    </div>
    <div className='container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px', position:'relative' }}>
      <h1>Porcentaje</h1>
      {Object.entries(percentages).map(([key, value]) => (
        <div className='bar' key={key} style={{ position: 'relative', width: '300px', backgroundColor: '#ddd' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              backgroundColor: value === '✔' ? 'transparent' : '#8e8ec2',
              width: `${value === '✔' ? '100%' : value + '%'}`,
              transition: 'width 0.5s ease-in-out',
            }}
          />
          <p className='text' style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <span>{key}</span> <span>{value}</span>
          </p>
        </div>
      ))}
    </div>
    </>
  );
}

export default App;



