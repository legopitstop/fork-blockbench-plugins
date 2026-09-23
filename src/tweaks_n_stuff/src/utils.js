/**
 * Process an array function in chunks.
 * @param {Array} array
 * @param {Function} callback
 */
export function process(array, callback) {
  let index = 0;
  function processChunk() {
    callback(array[index], index);
    index++;
    if (index < array.length) {
      requestAnimationFrame(processChunk);
    }
  }
  processChunk();
}

/**
 * Imports this package.
 * @param {String} url
 * @returns
 */
export function addScript(url) {
  function deletableScript(node) {
    this.delete = function () {
      node.remove();
    };
  }
  const script = document.createElement("script");
  script.src = url;
  try {
    new Promise((resolve, reject) => {
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error("Failed to load qr-code-styling from CDN:", error);
  }
  return new deletableScript(script);
}

/**
 * desc
 * @param {*} dataUrl
 * @param {*} type
 * @param {*} quality
 * @param {*} width
 * @param {*} height
 * @returns
 */
export function convertImage(dataUrl, type, quality = 1.0, width, height) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = width ? width : img.width;
      canvas.height = height ? height : img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64Res = canvas.toDataURL(type, quality);
      resolve(base64Res);
    };

    img.onerror = (error) => {
      reject("Error loading image");
    };
  });
}

/**
 * desc
 * @param {*} dataUrl
 * @param {*} format
 * @param {*} quality
 * @param {*} name
 * @param {*} resource_id
 */
export function convertImageExport(
  dataUrl,
  format,
  quality = 1.0,
  name = Project.name || "image",
  resource_id = "export_image"
) {
  convertImage(dataUrl, `image/${format}`, quality).then((img) => {
    Blockbench.export({
      extensions: [format],
      type: tl("data.image"),
      savetype: "image",
      name: name,
      resource_id: resource_id,
      content: img,
    });
  });
}

/**
 * Wraps a function in a try-catch statement to log any errors.
 * @param {Function} callback
 */
export function wrapError(callback) {
  try {
    callback();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get a plugin by ID.
 * @param {String} id 
 * @returns {Plugin}
 */
export function getPlugin(id) {
  return Plugins.all.find((p) => p.id == id);
}
