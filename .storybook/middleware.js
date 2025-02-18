import { urlencoded, json } from "body-parser";
import express from "express";
import Prince from "prince";
import os from "os";
import Path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import bodyParser from "body-parser";
import { Blob } from "buffer";

const expressMiddleWare = (router) => {
  router.use(urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post("/pdf", (req, res) => {
    const html = req.body.html;

    if (html == null || html == "undefined" || typeof html == undefined) {
      res.end();
    }

    console.log(`html: ${html}`)

    const filename = Path.join(os.tmpdir(), randomUUID()) + ".pdf";
    fs.writeFileSync(filename, html);

    Prince()
      .prefix(
        "C:\\Users\\yk09\\Development\\tools\\prince\\prince-20241206-win64\\bin",
      )
      .binary("prince.exe")
      .inputs(filename)
      .output(filename)
      .execute()
      .then(
        () => {
          const data = fs.readFileSync(filename);
          const blob = new Blob([data], {
            type: "application/pdf",
          });

          try {
            fs.unlinkSync(filename);
          } catch (err) {
            console.log(err);
          }

          res.type(blob.type);
          blob.arrayBuffer().then((buf) => {
            res.write(Buffer.from(buf));
            res.end();
          });
        },
        function (error) {
          console.log("ERROR: ", error);
        },
      );
  });
};

export default expressMiddleWare;
