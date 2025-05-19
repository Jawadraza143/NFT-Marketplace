// utils/ipfs.js
import { create } from 'ipfs-http-client';

// Connect to the IPFS node
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' }); // You can use your own IPFS node

export default ipfs;

// Function to upload a file to IPFS
export const uploadFileToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file);
    return added.path; // Return the CID (Content Identifier)
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw new Error("File upload failed");
  }
};

// Function to upload JSON data to IPFS
export const uploadJSONToIPFS = async (jsonData) => {
  try {
    const added = await ipfs.add(JSON.stringify(jsonData));
    return added.path; // Return the CID (Content Identifier)
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw new Error("JSON upload failed");
  }
};