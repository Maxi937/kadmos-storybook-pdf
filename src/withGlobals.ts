import { useEffect, useGlobals } from "storybook/internal/preview-api";

import ReactDOMServer from "react-dom/server"
import type {
  Renderer,
  StoryContext,
  PartialStoryFn as StoryFunction,
} from "storybook/internal/types";

import { KEY } from "./constants";

export const withGlobals = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>,
) => {
  const [globals] = useGlobals();
  const kadmosPdf = globals[KEY];
  const canvas = context.canvasElement as ParentNode;

  // Is the addon being used in the docs panel
  const isInDocs = context.viewMode === "docs";

  useEffect(() => {
    if (!isInDocs && Boolean(kadmosPdf)) {
      try {
        addPdfContentToStory(ReactDOMServer.renderToString(StoryFn()), canvas);
      } catch(err) {
        console.log(err)
        clearPdf(canvas)
      }
    } else {
      clearPdf(canvas)
    }
  }, [kadmosPdf, isInDocs]);

  if(!Boolean(kadmosPdf)) return StoryFn();
};


async function addPdfContentToStory(html: String, canvas: ParentNode) {
    const response = await fetch("/pdf", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({html: html}),
      method: "POST"
    })

    const pdfBlob = await response.blob()

  const reader = new FileReader();
  reader.readAsDataURL(pdfBlob); 
  reader.onloadend = function() {
  var base64data = reader.result;                

  const pdfRoot = canvas.appendChild(document.createElement("embed"))

  pdfRoot.id = "kadmos-pdf"
  pdfRoot.src = base64data.toString()
  pdfRoot.width = "100%"
  pdfRoot.height = "800px"
  pdfRoot.type = "application/pdf"
}


}

async function clearPdf(canvas: ParentNode) {
  const rootElement = canvas.firstChild as Element
  const pdfRoot = global.document.getElementById("kadmos-pdf");

  if(pdfRoot != null) {
    pdfRoot.remove()
    rootElement.setAttribute(
      "style",
      `
      display: block;
    `)
  }
}

