import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync('./db.json');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
};

app.get('/', (req, res) => {
  res.send('Mi primer API con nodejs');
});

app.get('/tareas', (req, res) => {
  const data = readData();
  res.json(data.tareas);
});

app.get('/tareas/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const tarea = data.tareas.find((tarea) => tarea.id === id);
  if (!tarea) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  res.json(tarea);
});

app.post('/tareas', (req, res) => {
  const data = readData();
  const body = req.body;
  const maxId = Math.max(...data.tareas.map((t) => t.id), 0);
  const newTask = {
    id: maxId + 1,
    ...body,
  };
  data.tareas.push(newTask);
  writeData(data);
  res.json(newTask);
});

app.put('/tareas/:id', (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const tareaIndex = data.tareas.findIndex((tarea) => tarea.id === id);
  if (tareaIndex === -1) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  data.tareas[tareaIndex] = {
    ...data.tareas[tareaIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: 'Tarea modificada' });
});

app.delete('/tareas/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const tareaIndex = data.tareas.findIndex((tarea) => tarea.id === id);
  if (tareaIndex === -1) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  data.tareas.splice(tareaIndex, 1);
  writeData(data);
  res.json({ message: 'Tarea eliminada' });
});

app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});