import Imagekit from "imagekit";

const imagekit = new Imagekit({
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
  urlEndpoint: process.env.urlEndpoint,
});

export default imagekit;
