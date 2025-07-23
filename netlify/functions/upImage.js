const { Storage } = require('@google-cloud/storage');
const Busboy = require('busboy');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  const storage = new Storage();
  const bucket = storage.bucket('TU_BUCKET_NAME'); // Cambia por el nombre de tu bucket

  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: event.headers });
    let uploadData = null;
    let fileName = '';
    let mimeType = '';

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      fileName = `${Date.now()}-${filename}`;
      mimeType = mimetype;
      const buffers = [];
      file.on('data', (data) => {
        buffers.push(data);
      });
      file.on('end', () => {
        uploadData = Buffer.concat(buffers);
      });
    });

    busboy.on('finish', async () => {
      if (!uploadData) {
        resolve({
          statusCode: 400,
          body: JSON.stringify({ error: 'No se subió ninguna imagen' })
        });
        return;
      }
      try {
        const file = bucket.file(fileName);
        await file.save(uploadData, { contentType: mimeType });
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve({
          statusCode: 200,
          body: JSON.stringify({ imageUrl: publicUrl })
        });
      } catch (error) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: error.message })
        });
      }
    });

    busboy.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : undefined));
  });
};
