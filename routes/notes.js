const router = require('express').Router();
const fs = require('fs');
const noteID = require('../helpers/noteid') //Helper method for generating the Note ID

// Get request route to pull the Data from the DB to the front end
router.get('/', (req, res) => {

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

//Post method route to post the notes to the DB from the front end
router.post('/', (req, res) => {

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


 


module.exports = router;