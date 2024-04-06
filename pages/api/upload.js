import multiparty from "multiparty"; //library to parse formData
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
//Note: multiparty operates with a callback pattern and it doesn't natively return a promise.That's why we need to wrap
//its parse method in a Promise to integrate it into an async function with async/await

export default async function handle(req, res) {
  const form = new multiparty.Form(); // Creating a new form instance to parse incoming formData
  //now we parse the formData asynchronously
  // The form.parse method extracts the fields and files from the formData
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files }); /// Resolving the promise with the parsed fields and files
    });
  });
  console.log("length:", files.file.length); // Logging the number of files uploaded for debugging

  // Initialize S3 client
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  // Loop through the files and upload them to S3
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    console.log({ ext, file });
    // The name in the bucket needs to be unique to prevent overwrites
    // so we can use the original filename, but adding a timestamp as unique identifier to avoid conflicts
    const bucketName = "namelaka";
    // const newFileName = `${Date.now()}-${file.originalFilename}`;
    const newFilename = `${Date.now()}.${ext}`;

    // Upload file to S3
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName, // Your S3 bucket name
        Key: newFilename, // The name of the file to create in the bucket
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );

    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  return res.json({ links });
}

// Disabling the default Next.js bodyParser to handle multipart/form-data manually
export const config = {
  api: { bodyParser: false },
};
