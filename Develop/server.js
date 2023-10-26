const express = require('express');
const path = require('path');
const fs = require('fs');
const noteID = require('./helpers/noteid') //Helper method for generating the Note ID
const PORT = 3001;
const api = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

//Routes for the /API
app.use('/api', api);



//GET route for the notes.html 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

//Wildcard route for the public folder 
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);




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
