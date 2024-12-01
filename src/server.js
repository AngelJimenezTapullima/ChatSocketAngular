const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "http://localhost:4200", 
    methods: ["GET", "POST"] 
  }
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.static('public'));

const storage = multer.memoryStorage(); // Almacenamiento en memoria para convertir a base64 
const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/EP4');

const User = mongoose.model('usuarios', new mongoose.Schema({
  name: {type:String, required: true},
  email: {type:String, required: true},
  password: {type:String, required: true},
  profileImage: String
}));

const Message = mongoose.model('mensajes', new mongoose.Schema({
  user: {type:String, required: true},
  text: {type:String, required: true},
  profileImageUrl: String,
  timestamp: { type: Date, default: Date.now }
}));

// Rutas de Autenticación
app.post('/register', async (req, res) => {
  try { 
    const { name, email, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = new User({ name, email, password: hashedPassword }); 
    await user.save(); 
    
    res.status(201).json({ message: 'Registro existoso.' }); 
  } catch (error) { 
    res.status(500).json({ message: 'Registro fallido.' }); 
  }
});

app.post('/login', async (req, res) => {
  try { 
    const { email, password } = req.body; 
    const user = await User.findOne({ email }); 
    
    if (user && await bcrypt.compare(password, user.password)) { 
      res.status(200).json({ message: 'Usuario logeado', name: user.name, email: user.email, profileImageUrl: user.profileImageUrl }); 
    } else { 
      res.status(401).json({ message: 'Email o Contraseña incorrectos' }); 
    } 
  } catch (error) { 
    res.status(500).json({ message: 'Logeo fallido' }); 
  }
});

app.get('/messages', async (req, res) => { 
  try { 
    const messages = await Message.find().sort({ timestamp: -1 }).exec(); 
    res.status(200).json(messages); 
  } catch (error) { 
    res.status(500).json({ message: 'Fallo al recuperar los mensajes' }); 
  } 
});

app.get('/user/:email', async (req, res) => { 
  try { 
    const email = req.params.email; 
    const user = await User.findOne({ email }); 
    if (!user) { 
      return res.status(404).json({ message: 'Usuario no encontrado.' }); 
    } 
    res.status(200).json({ profileImage: user.profileImage }); 
  } catch (error) { 
    res.status(500).json({ message: 'Error al cargar la imagen' }); 
  } 
});

// Ruta para subir archivos 
app.post('/upload', upload.single('profileImage'), async (req, res) => { 
  try { 
    const { email } = req.body; 
    if (!email || !req.file) { 
      return res.status(400).json({ message: 'Email e imagen obligatorio' }); 
    } 
    
    const profileImage = req.file.buffer.toString('base64'); 
    const user = await User.findOneAndUpdate({ email }, { profileImage }, { new: true }); 
    
    if (!user) { 
      return res.status(404).json({ message: 'Usuario no encontrado' }); 
    } 
    
    res.status(200).json({ message: 'Imagen de perfil actualizada', profileImage }); 
  } catch (error) { 
    res.status(500).json({ message: 'Fallo al subir el archivo' }); 
  } 
});

io.on('connection', (socket) => {
  socket.on('new user', async (data) => { 
    // socket.userName = data.name; 
    // socket.profileImageUrl = data.profileImage;
    // console.log(`${data.name} se ha conectado`); 
    const user = await User.findOne({ email: data.email });
    if (user) {
      socket.userName = data.name;
      socket.profileImageUrl = user.profileImage;
      console.log(`${data.name} se ha conectado con una imagen de perfil`);
    } else {
      console.log(`Usuario no encontrado: ${data.email}`);
    }
  });

  socket.on('chat message', async (msg) => {
    const message = new Message({ 
      user: socket.userName, 
      text: msg.text, 
      profileImageUrl: msg.profileImageUrl 
    }); 
    await message.save(); 
    io.emit('chat message', { 
      user: socket.userName, 
      text: msg.text, 
      profileImageUrl: msg.profileImageUrl 
    });
  });

  socket.on('disconnect', () => {
    console.log(`${socket.userName} se ha desconectado`);
  });
});

server.listen(3000, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
