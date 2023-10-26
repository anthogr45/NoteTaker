const express = require('express');
const path = require('path');
const fs = require('fs');
const noteID = require('./helpers/noteid')
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {

  fs.readFile(('./db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }

    // Parse the JSON data
    const notes = JSON.parse(data);

    // Return the notes as JSON response
    res.json(notes);
  });
  
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);



// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, './public/index.html'))
// );


app.post('/api/notes', (req, res) => {

  console.info(`${req.method} new note data recieved`);

  const {title, text} = req.body;

  if (title && text) {
    const newNotes = {
      title,
      text,
      id:noteID(),
      
    };

    fs.readFile ('./db/db.json', 'utf8', (err, data) => {
      if (err){
        console.error(err);
      }else{
        const oldNotes = JSON.parse(data);

        oldNotes.push(newNotes);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(oldNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully added new Notes')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNotes,
    };

    console.log(response);
    res.status(201).json(response);
  }else{
    res.status(500).json('Error in posting Notes');
  }
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
