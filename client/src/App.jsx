import { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { 
  Container, Typography, Paper, Button, Snackbar, Alert, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
  Menu, MenuItem, useTheme, useMediaQuery, Box, Stack 
} from '@mui/material'; // <--- Importamos herramientas de diseño responsivo
import Login from './Login';
import Estadisticas from './Estadisticas';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [rows, setRows] = useState([]);
  const [mensaje, setMensaje] = useState({ open: false, texto: '', tipo: 'success' });
  const [openDialog, setOpenDialog] = useState(false);

  // --- DETECCIÓN DE CELULAR ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // True si es celular o tablet chica

  // --- LÓGICA DEL MENÚ ---
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const aprobarAnio = async (categoriaId, nombreAnio) => {
    handleCloseMenu();
    try {
      await axios.post('https://gestor-academico-6zru.onrender.com/materias/aprobar-anio', { categoria_id: categoriaId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaterias();
      setMensaje({ open: true, texto: `¡${nombreAnio} aprobado completo! 🎉`, tipo: 'success' });
    } catch (error) {
      setMensaje({ open: true, texto: 'Error al aprobar año', tipo: 'error' });
    }
  };

  const anios = [
    { id: 1, label: 'Primer Año' },
    { id: 2, label: 'Segundo Año' },
    { id: 3, label: 'Tercer Año' },
    { id: 4, label: 'Cuarto Año' },
    { id: 5, label: 'Quinto Año' },
    { id: 6, label: 'Transversales' },
    { id: 7, label: 'Electivas' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRows([]);
  };

  const fetchMaterias = useCallback(() => {
    if (!token) return;
    axios.get('https://gestor-academico-6zru.onrender.com/materias', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setRows(res.data))
    .catch((error) => {
      if (error.response && error.response.status === 401) handleLogout();
    });
  }, [token]);

  useEffect(() => {
    fetchMaterias();
  }, [fetchMaterias]);

  const handleReset = async () => {
    try {
      await axios.delete('https://gestor-academico-6zru.onrender.com/materias/reset', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaterias();
      setMensaje({ open: true, texto: '¡Todo ha vuelto a 0!', tipo: 'info' });
      setOpenDialog(false);
    } catch (error) {
      setMensaje({ open: true, texto: 'Error al borrar datos', tipo: 'error' });
    }
  };

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    try {
      await axios.post(`https://gestor-academico-6zru.onrender.com/materias/${newRow.id}`, {
        nota: newRow.nota,
        condicion: newRow.condicion,
        disponibilidad: newRow.disponibilidad
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaterias(); 
      setMensaje({ open: true, texto: '¡Guardado!', tipo: 'success' });
      return newRow; 
    } catch (error) {
      setMensaje({ open: true, texto: 'Error al guardar', tipo: 'error' });
      return oldRow;
    }
  };

  const columns = [
    // 1. ID
    { field: 'id', headerName: 'ID', width: 70 },
    
    // 2. MATERIA
    { field: 'materia', headerName: 'Materia', width: isMobile ? 200 : 350, flex: isMobile ? 0 : 1 },
    
    // 3. AÑO
    { 
      field: 'anio', headerName: 'Año', width: 140,
      renderCell: (p) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <div style={{ 
            backgroundColor: p.row.color, color: 'white', padding: '4px 0', borderRadius: '15px', 
            fontSize: '0.75rem', textAlign: 'center', width: '90%', fontWeight: 'bold'
          }}>
              {p.value}
          </div>
        </div>
      )
    },

    // 4. CONDICIÓN (Movida aquí)
    { 
      field: 'condicion', 
      headerName: 'Condición', 
      width: 130, 
      editable: true, 
      type: 'singleSelect', 
      valueOptions: ['Cursada', 'Aprobada', 'No aprobada'] 
    },

    // 5. DISPONIBILIDAD (Movida aquí)
    { 
      field: 'disponibilidad', 
      headerName: 'Disponibilidad', // Antes decía "Estado", ahora dice "Disponibilidad"
      width: 150, 
      editable: false,
      renderCell: (params) => {
        let color = '#757575'; let fontWeight = 'normal'; let bg = 'transparent';
        if (params.value === 'Disponible') { color = '#2e7d32'; fontWeight = 'bold'; bg = '#e8f5e9'; }
        if (params.value === 'No Disponible') { color = '#d32f2f'; bg = '#ffebee'; }
        if (params.value === 'Aprobada') { color = '#1565c0'; fontWeight = 'bold'; }
        if (params.value === 'Cursando') { color = '#ef6c00'; fontWeight = 'bold'; }
        return (
          <div style={{ color: color, fontWeight: fontWeight, backgroundColor: bg, padding: '2px 8px', borderRadius: '4px', width: '100%', textAlign: 'center', fontSize: '0.8rem' }}>
            {params.value}
          </div>
        )
      }
    },

    // 6. NOTA (Movida al final)
    { field: 'nota', headerName: 'Nota', width: 80, type: 'number', editable: true, align: 'center', headerAlign: 'center' }
  ];

  if (!token) return <Login onLoginSuccess={() => setToken(localStorage.getItem('token'))} />;

  return (
    <Container maxWidth="xl" sx={{ mt: isMobile ? 2 : 4, mb: 6, px: isMobile ? 1 : 3 }}>
      
      {/* CABECERA RESPONSIVA */}
      {/* En celular (xs) es columna, en escritorio (md) es fila */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: 2,
        mb: 3 
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
          Mi Plan Académico 🚀
        </Typography>
        
        {/* GRUPO DE BOTONES */}
        <Stack direction={isMobile ? "column" : "row"} spacing={2} width={isMobile ? '100%' : 'auto'}>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleClickMenu}
            fullWidth={isMobile} // Botón ancho completo en celular
          >
            Aprobar Año
          </Button>
          
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            {anios.map((anio) => (
              <MenuItem key={anio.id} onClick={() => aprobarAnio(anio.id, anio.label)}>
                {anio.label}
              </MenuItem>
            ))}
          </Menu>

          <Button 
            variant="contained" 
            color="warning" 
            onClick={() => setOpenDialog(true)}
            fullWidth={isMobile}
          >
            Resetear
          </Button>

          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleLogout}
            fullWidth={isMobile}
          >
            Salir
          </Button>
        </Stack>
      </Box>
      
      <Estadisticas rows={rows} />
      
      {/* TABLA RESPONSIVA */}
      <Paper elevation={4} sx={{ height: '80vh', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          disableRowSelectionOnClick 
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => console.error(error)}
          initialState={{ 
            pagination: { paginationModel: { pageSize: 100 } },
            columns: {
              columnVisibilityModel: {
                // Si es celular, ocultamos el ID automáticamente
                id: !isMobile, 
              },
            },
          }}
          pageSizeOptions={[10, 50, 100]} 
          rowHeight={50} 
          hideFooter
          sx={{
            // Ajustes finos para que la tabla no se rompa en pantallas enanas
            '& .MuiDataGrid-cell': {
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              padding: isMobile ? '0 5px' : '0 10px',
            },
            '& .MuiDataGrid-columnHeader': {
              padding: isMobile ? '0 5px' : '0 10px',
            }
          }}
        />
      </Paper>

      <Snackbar open={mensaje.open} autoHideDuration={2000} onClose={() => setMensaje({...mensaje, open: false})}>
        <Alert severity={mensaje.tipo} variant="filled" sx={{ width: '100%' }}>{mensaje.texto}</Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogContent>
          <DialogContentText>Esto borrará TODAS tus notas. Acción irreversible.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleReset} color="error" autoFocus>Sí, borrar todo</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;