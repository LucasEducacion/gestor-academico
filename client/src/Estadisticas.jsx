import React, { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';

function Estadisticas({ rows }) {
  
  // --- CÁLCULOS (Sin cambios) ---
  const stats = useMemo(() => {
    const totalMaterias = rows.length;
    if (totalMaterias === 0) return null;

    const aprobadas = rows.filter(r => r.condicion === 'Aprobada');
    const cursadas = rows.filter(r => r.condicion === 'Cursada'); 
    
    const sumaNotas = aprobadas.reduce((acc, curr) => acc + (Number(curr.nota) || 0), 0);
    const promedio = aprobadas.length > 0 ? (sumaNotas / aprobadas.length).toFixed(2) : '0.00';
    const porcentajeCarrera = ((aprobadas.length / totalMaterias) * 100).toFixed(1);

    const porAnio = {};
    rows.forEach(r => {
      if (!porAnio[r.anio]) porAnio[r.anio] = { total: 0, aprobadas: 0, color: r.color };
      porAnio[r.anio].total += 1;
      if (r.condicion === 'Aprobada') porAnio[r.anio].aprobadas += 1;
    });

    const tablaAnios = Object.keys(porAnio).map(key => ({
      nombre: key,
      total: porAnio[key].total,
      aprobadas: porAnio[key].aprobadas,
      faltan: porAnio[key].total - porAnio[key].aprobadas,
      porcentaje: Math.round((porAnio[key].aprobadas / porAnio[key].total) * 100),
      color: porAnio[key].color
    }));

    const orden = ['Primer Año', 'Segundo Año', 'Tercer Año', 'Cuarto Año', 'Quinto Año', 'Transversales', 'Electivas'];
    tablaAnios.sort((a, b) => orden.indexOf(a.nombre) - orden.indexOf(b.nombre));

    return { cantAprobadas: aprobadas.length, cantRestantes: totalMaterias - aprobadas.length, cantCursadas: cursadas.length, promedio, porcentajeCarrera, tablaAnios };
  }, [rows]);

  if (!stats) return null;

  // --- TARJETA (Ancho fijo aumentado un poco para mejor presencia) ---
  const StatCard = ({ title, value, subcolor = '#4a148c' }) => (
    <Paper elevation={4} sx={{ 
      overflow: 'hidden', 
      textAlign: 'center', 
      height: '100%',
      width: '240px',       // <--- Un poco más anchas para que llenen mejor
      borderRadius: '16px', // Bordes más suaves
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)', // Flotan hacia arriba al pasar el mouse
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }
    }}>
      <Box sx={{ bgcolor: '#2c3e50', color: 'white', py: 1.5, px: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {title}
        </Typography>
      </Box>
      <Box sx={{ py: 3, bgcolor: 'white' }}>
        <Typography variant="h3" fontWeight="bold" color={subcolor}> {/* Letra un poco más grande (h3) */}
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ mb: 6, mt: 2 }}> {/* Margen superior agregado */}
      
      {/* SECCIÓN 1: TARJETAS SUPERIORES */}
      <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2,                     // Gap mínimo de seguridad
          justifyContent: 'space-evenly', // <--- LA CLAVE: Esto empuja las tarjetas para usar todo el ancho
          mb: 5,
          width: '100%'               // Asegura que el contenedor ocupe todo
      }}>
          <StatCard title="Materias Aprobadas" value={stats.cantAprobadas} />
          <StatCard title="Porcentaje Carrera" value={`${stats.porcentajeCarrera}%`} />
          <StatCard title="Materias Restantes" value={stats.cantRestantes} subcolor="#d32f2f" />
          <StatCard title="Pendientes de Final" value={stats.cantCursadas} subcolor="#f57c00" />
          <StatCard title="Promedio General" value={stats.promedio} subcolor="#1565c0" />
      </Box>

      {/* SECCIÓN 2: TABLA DE DESGLOSE (Sin cambios) */}
      <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: '12px' }}>
        <Box sx={{ bgcolor: '#2c3e50', color: 'white', p: 1.5, textAlign: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">PROGRESO POR AÑO</Typography>
        </Box>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
                <tr style={{ backgroundColor: '#ecf0f1', color: '#333' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Año</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Total</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Faltan</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Avance</th>
                </tr>
            </thead>
            <tbody>
                {stats.tablaAnios.map((anio) => (
                <tr key={anio.nombre} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>
                    <div style={{ 
                        backgroundColor: anio.color, color: 'white', padding: '6px 12px', 
                        borderRadius: '20px', fontWeight: 'bold', textAlign: 'center', 
                        display: 'inline-block', minWidth: '120px', fontSize: '0.8rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {anio.nombre}
                    </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{anio.total}</td>
                    <td style={{ textAlign: 'center', color: '#d32f2f', fontWeight: 'bold' }}>{anio.faltan}</td>
                    <td style={{ textAlign: 'center', width: '35%', paddingRight: '20px' }}>
                        <div style={{ 
                            background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden', 
                            height: '24px', width: '100%', position: 'relative',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ 
                                width: `${anio.porcentaje}%`, 
                                background: anio.porcentaje === 100 ? '#2e7d32' : (anio.porcentaje > 50 ? '#1976d2' : '#2196f3'), 
                                height: '100%', transition: 'width 0.8s ease'
                            }}></div>
                            <span style={{ 
                                position: 'absolute', top: 0, left: 0, width: '100%', 
                                textAlign: 'center', fontSize: '12px', lineHeight: '24px', 
                                color: anio.porcentaje > 55 ? 'white' : 'black', fontWeight: '900',
                                textShadow: anio.porcentaje > 55 ? '0px 0px 2px rgba(0,0,0,0.5)' : 'none'
                            }}>
                                {anio.porcentaje}%
                            </span>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </Paper>
    </Box>
  );
}

export default Estadisticas;