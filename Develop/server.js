const express = require('express');
const path = require('path');
const fs = require('fs');
const noteID = require('./helpers/noteid') //Helper method for generating the Note ID
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

// Get request route to pull the Data from the DB to the front end
app.get('/api/notes', (req, res) => {

  //reading the DB file for the notes
  fs.readFile(('./db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes from the database.' });
    }

    const notes = JSON.parse(data);

    res.json(notes);
  });
  
});

//GET route for the notes.html 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

//Wildcard route for the public folder 
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);



// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, './public/index.html'))
// );


//Post method route to post the notes to the DB from the front end
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


//Delete method to delete the records from the DB with the related ID index
app.delete('/api/notes/:id', (req, res) => {

 const id = req.params.id;

 fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
     return res.status(500).send('Error in server');
    }
    let deletenotes = JSON.parse(data);

    let noteindex = deletenotes.findIndex(note => note.id === id);

    if (noteindex === -1) {
      return res.status(404).send('Note not found');
    }

    deletenotes.splice(noteindex, 1);

    fs.writeFile('./db/db.json', JSON.stringify(deletenotes), err => {
     if (err) {
       console.error(err);
        return res.status(500).send('Error in server');
      }
      res.send('Note successfully deleted');
    });
  });

});
 

// listen() method is responsible for listening for incoming connections on the  port 3001
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
