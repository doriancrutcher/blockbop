import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { Card, Container, Row, Col, Jumbotron } from "react-bootstrap";
import Dropzone from "react-dropzone";

import {
  Buckets,
  PushPathResult,
  KeyInfo,
  PrivateKey,
  WithKeyInfoOptions,
} from "@textile/hub";
import { Button } from "react-bootstrap";
import { async } from "regenerator-runtime";

const Add_Music_Tool = (props) => {
  // State Variables

  const [useridentity, changeIdentity] = useState("");
  const [buckets, changeBuckets] = useState("");
  const [bucketKey, changeBucketKey] = useState("");
  const [links, changeLinks] = useState([]);
  const [songs, changeSongs] = useState([
    {
      src: "",
    },
  ]);
  const [loading, changeLoading] = useState(true);
  const [index, changeIndex] = useState({
    author: "",
    date: 0,
    paths: [],
  });
  const [music, changeFile] = useState("");

  // initial info
  const ipfsGateway = "https://hub.textile.io";
  const keyInfo = {
    key: "bfrfzbzvj6iatggdeak6d5ij36i",
    secret: "",
  };
  const keyInfoOptions = {
    debug: false,
  };

  // This will write a basic htmlfile to the root of the bucket so the bucket knows
  // how to read the index.json files and load the music files
  // this will allow the bucket to be rendered over any gateway or ipns endpoint
  const publicGallery =
    '<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta http-equiv=x-ua-compatible content="ie=edge"><meta property="twitter:description" content="built with textile.io. uses textile buckets and ipns to serve photo galleries over ipns"><title>Public Gallery</title><link rel=stylesheet href=https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css><script src=https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js></script><div ><div class=grid></div></div><script>const loadIndex=async()=>{const elements=[]\n' +
    'const index=await fetch("index.json")\n' +
    "const json=await index.json()\n" +
    "for(let path of json.paths){try{const meta=await fetchMetadata(path)\n" +
    'elements.push({href:meta.path,type:"image"})}catch(err){console.log(err)}}\n' +
    'const lightbox=GLightbox({selector:".grid",touchNavigation:true,closeButton:false,loop:true,elements:elements,});lightbox.open();}\n' +
    "const fetchMetadata=async(path)=>{const index=await fetch(path)\n" +
    "const json=await index.json()\n" +
    "return json.original}\n" +
    'window.addEventListener("DOMContentLoaded",function(){loadIndex()});</script>';
  //convienence tools

  // Setup Functions
  useEffect(() => {
    const getInfo = async () => {
      // set identity
      const identity = await getIdentity();
      changeIdentity(identity);
    };
    getInfo();
  }, []);

  useEffect(() => {
    const updateInfo = async () => {
      if (useridentity !== "") {
        //   // get user's music bucket
        const { bucketKey, buckets } = await getBucketKey(useridentity);
        changeBucketKey(bucketKey);
        changeBuckets(buckets);
      }
    };
    updateInfo();
  }, [useridentity]);

  useEffect(() => {
    const getLinks = async () => {
      if (buckets !== "" && bucketKey !== "") {
        await getBucketLinks();
        const index = await getSongIndex();
        if (index) {
          await libraryFromIndex(index);
          changeLoading(false);
          changeIndex(index);
        }
      }
    };
    getLinks();
  }, [bucketKey]);

  // User Information Functions
  const getIdentity = async () => {
    try {
      var storedIdent = localStorage.getItem("identity");

      if (storedIdent === null) {
        throw new Error("No identity");
      }
      const restored = PrivateKey.fromString(storedIdent);
      return restored;
    } catch (e) {
      // if any error, create a new idenitty
      try {
        const identy = PrivateKey.fromRandom();
        const identityString = identy.toString();
        localStorage.setItem("identity", identityString);
        // modify this to store onto the blockchain with appropriate account or in
        // some backend server
        return id;
      } catch (err) {
        return err.message + ">;D";
      }
    }
  };

  const getBucketKey = async () => {
    if (!useridentity) {
      throw new Error("Identity not set");
    }
    const buckets = await Buckets.withKeyInfo(keyInfo, keyInfoOptions);
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(useridentity);

    const buck = await buckets.getOrCreate("io.textile.dropzone");

    if (!buck.root) {
      throw new Error("Failed to open bucket");
    }

    changeBuckets(buckets);
    changeBucketKey(buck.root.key);
    return { buckets: buckets, bucketKey: buck.root.key };
  };

  // Bucket Information
  const getBucketLinks = async () => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      return;
    }

    const links = await buckets.links(bucketKey);
    changeLinks({ ...links });
  };

  //storing Information tools
  initIndex = async () => {
    if (!useridentity) {
      console.error("Identity not set");
      return;
    }
    const index = {
      author: useridentity.toString(),
      date: new Date().getTime(),
      paths: [],
    };
    await storeIndex(index);
    return index;
  };

  const storeIndex = async (index) => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }
    const buf = Buffer.from(JSON.stringify(index, null, 2));
    const path = "index.json";
    await buckets.pushPath(bucketKey, path, buf);
  };

  // Initiating Music File Storage and Retreival
  const initMusicLibrary = async () => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }
    const buf = Buffer.from(publicLibrary);
    await buckets.pushPath(bucketKey, "index.html", buf);
  };

  const libraryFromIndex = async (index) => {
    let songList = [];
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }

    for (let path of index.paths) {
      console.log(path);
      const metadata = await buckets.pullPath(bucketKey, path);
      const value = await metadata.next();

      let str = "";
      for (var i = 0; i < value.value.length; i++) {
        str += String.fromCharCode(parseInt(value.value[i]));
      }

      let info = JSON.parse(str);
      console.log(info);
      let song = info.original;
      songList.push({
        src: `${ipfsGateway}/ipfs/${song.cid}`,
        key: song.name,
      });
    }

    changeSongs(songList);
  };

  const loadSongFromIndex = async (index) => {};

  const getSongIndex = async () => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }
    try {
      const metadata = buckets.pullPath(bucketKey, "index.json");
      const { value } = await metadata.next();
      let str = "";
      for (var i = 0; i < value.length; i++) {
        str += String.fromCharCode(parseInt(value[i]));
      }
      const index = JSON.parse(str);
      return index;
    } catch (error) {
      const index = await initIndex();
      await initMusicLibrary();
      return index;
    }
  };

  const insertFile = async (file, path) => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }
    const bucketList = buckets;
    let arrayBuf = await file.arrayBuffer();
    return bucketList.pushPath(bucketKey, path, arrayBuf);
  };

  const processAndStore = async (song, path, songName) => {
    const location = `${path}/${songName}`;

    const raw = await insertFile(song, location);
    console.log(raw.path.cid.toString());
    const metaData = {
      cid: raw.path.cid.toString(),
      name: songName,
      path: location,
    };
    return metaData;
  };

  const handleNewFile = async (file) => {
    if (!buckets || !bucketKey) {
      console.error("No bucket client or root key");
      reutrn;
    }

    console.log(file);

    const songSchema = {};
    const now = new Date().getTime();
    songSchema["date"] = now;
    songSchema["name"] = `${file.name}`;
    const filename = `${now}_${file.name}`;

    songSchema["original"] = await processAndStore(
      file,
      "originals/",
      filename
    );

    const metadata = Buffer.from(JSON.stringify(songSchema, null, 2));
    const metaname = `${now}_${file.name}.json`;
    const path = `metadata/${metaname}`;

    await buckets.pushPath(bucketKey, path, metadata);
    console.log(await buckets.pullPath(bucketKey, path).next());

    let tempIndex = index;
    tempIndex.paths.push(path);

    changeIndex(tempIndex);

    changeSongs([
      ...songs,
      {
        src: `${ipfsGateway}/ipfs/${songSchema["original"].cid}`,
        key: songs["name"],
      },
    ]);
  };

  const onDrop = async (acceptedFiles) => {
    if (songs.length > 50) {
      throw new Error("Gallery at maximum size");
    }
    if (acceptedFiles.length > 5) {
      throw new Error("Max 5 images at a time");
    }
    for (const accepted of acceptedFiles) {
      await handleNewFile(accepted);
    }
    storeIndex(index);
  };

  return (
    <React.Fragment>
      <Container>
        <Row className='d-flex justify-content-center'>
          <Jumbotron
            style={{ marginTop: "10px" }}
            className='d-flex justify-content-center'
          >
            <Dropzone
              style={{ width: "100%", height: "100%" }}
              onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </Jumbotron>
        </Row>

        {songs.map((x, index) => {
          return (
            <Row
              style={{ marginTop: "10px" }}
              key={index}
              className='d-flex justify-content-center'
            >
              <ReactAudioPlayer src={x.src} autoPlay controls />
            </Row>
          );
        })}
      </Container>
    </React.Fragment>
  );
};

Add_Music_Tool.propTypes = {};

export default Add_Music_Tool;
