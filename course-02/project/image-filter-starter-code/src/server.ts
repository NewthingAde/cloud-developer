import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { any } from 'bluebird';

(async () => {


    // Importing express-csp-header
  const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Use of Middleware Wrapper for Csp Header
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF],
      'script-src': [SELF, INLINE],
      'img-src': ['data:', 'images.com'],
      'worker-src': [NONE],
      'block-all-mixed-content': true
    }
  }));


  app.get("/filteredimage", async (req, res) => {

    let filterimageUrl: string = req.query.filterimageUrl;

    let acceptedImageUrl: any = filterimageUrl.match("http://localhost:{{PORT}}/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg");
    
    let filteredImage: string = await filterImageFromURL(filterimageUrl);

    if (acceptedImageUrl == false)
      return res.status(401).send("Enter a valid url");

    else {

      if (filteredImage === null || filteredImage === undefined)
        return res.status(401).send("image cannot be filtered try again!");

      else {
        res.on("Completed", function () {
          deleteLocalFiles([filteredImage]);
        });
        return res.status(200).sendFile("" + filteredImage);
      }
    }
  })

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{URL}}")
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`My server is running now at http://localhost:${port}`);
    console.log(`To stop the server, press CTRL+C to stop server`);
  });
})();