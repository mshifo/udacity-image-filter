import express, { response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import axios from 'axios';
import jimp from 'jimp';
import { Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8083;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //! END @TODO1

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url = req.query.image_url.toString();
    if (!image_url) {
      res.status(422).send('image_url is mandatory!');
    }

    axios({
      method: 'get',
      url: image_url,
      responseType: 'arraybuffer'
    })
      .then(function ({ data: imageBuffer }) {

        return jimp.read(imageBuffer, async (err, lenna) => {
          if (err) {
            res.status(500).send(err);
          }
          await lenna
            .resize(256, 256).quality(60)
            .greyscale().writeAsync('output.jpg'); // save
          res.download('output.jpg');

        });
      }).catch(function (err) {
        res.status(500).send(err);
      });



  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();