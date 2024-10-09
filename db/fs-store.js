import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, query, setDoc, updateDoc, where, writeBatch } from "firebase/firestore"

import { Random4Digit } from "../util/Util";
import { db } from "../config/fb-config";
import { musicianRequestState } from "../model/MusicianRequestState";

const USERS_PATH = "users";
const BANDS_PATH = "bands";
const SONGS_PATH = "songs";
const REHEARSALS_PATH = "rehearsals";
const MEMBERS_PATH = "members";
const MUSICIAN_REQUEST_PATH = "musicianRequest";

export function createNewUserAndBand(userBandObject, responseFunction) {
  if (!userBandObject.bandCode || userBandObject.bandCode === "") {
    userBandObject.bandCode = createBand(userBandObject);
  }
  createUser(userBandObject, (user) => {
    linkUserToBand(user, userBandObject.bandCode, responseFunction);
  });
}

function createBand(userBandObject) {
  const bandCode = Random4Digit();
  const band = {
    name: userBandObject.bandName,
  };
  const docRef = doc(db, BANDS_PATH, bandCode.toString());
  setDoc(docRef, band)
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    }
  );
  return bandCode;
}

function createUser(userBandObject, linkFunction) {
  const user = {
    name: userBandObject.name,
    userRole: userBandObject.userRole,
    userBandRole: userBandObject.userBandRole,
    bandCode: userBandObject.bandCode,
    email: userBandObject.email,
    bandName: userBandObject.bandName,
  };
  
  addDoc(collection(db, USERS_PATH), user)
    .then((docRef) => {
      user.key = docRef.id;
      linkFunction(user);
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
}

export function saveNewSong(song, bandCode, responseFunction) {
  const docRef = doc(db, BANDS_PATH, bandCode.toString());
  const songsRef = collection(docRef, SONGS_PATH);
  addDoc(songsRef, song)
    .then((docRef) => {
      responseFunction("Song saved succesfully");
    })
    .catch((error) => {
      console.error(error);
    });
}

export function saveNewRehearsal(rehearsal, bandCode, responseFunction) {
  const temporalCopy = { ...rehearsal };
  delete rehearsal.members;

  const bandsRef = doc(db, BANDS_PATH, bandCode.toString())
  const rehearsalRef = collection(bandsRef, REHEARSALS_PATH)
  addDoc(rehearsalRef, rehearsal)
    .then((docRef) => {
      var batch = writeBatch(db);
      const memberRef = collection(docRef, MEMBERS_PATH);
      temporalCopy.members.forEach((element) => {
        const docRef = doc(db, memberRef)
        batch.set(docRef, element);
      });
      batch.commit().then(() => {
        responseFunction("Rehearsal saved succesfully");
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

export function saveNewMusicianRequest(musicianRequest, responseFunction) {
  
  setDoc(doc(db, MUSICIAN_REQUEST_PATH, 
    musicianRequest.bandCode + "-" + musicianRequest.date), musicianRequest)
    .then((response) => {
      console.log(
        "Created musician for Band with key ",
        musicianRequest.bandCode
      );
      responseFunction(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

function linkUserToBand(user, bandCode, responseFunction) {
  const bandRef = doc(db, BANDS_PATH, bandCode.toString());
  const membersRef = collection(bandRef, MEMBERS_PATH);
  addDoc(membersRef, user)
    .then(() => {
      responseFunction("Created User and linked to Band Successful");
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getBandName(bandCode, bandFunction) {
  const bandRef = doc(db, BANDS_PATH, bandCode.toString());
  getDoc(bandRef)
    .then((doc) => {
      if (doc.exists) {
        bandFunction(doc.data().name);
      } else {
        console.log("No Band data available for this code");
        bandFunction(null);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export function getUserIfExists(email, userFunction) {
  const userQuery = query(collection(db, USERS_PATH), where("email", "==", email), limit(1));
  getDocs(userQuery)
    .then((docs) => {
      if (!docs.empty) {
        console.log("The user exists");
        docs.forEach((doc) => {
          userFunction(doc.data(), doc.id);
        });
      } else {  
        userFunction(null, null);
        alert("User does not exists");
        console.log("The user does not exists");
      }
    }).catch((error) => {
      console.error(error);
    });
}

function setupBandSubcollectionListener(bandCode, updateFunc, subcollection) {
  const bandRef = doc(db, BANDS_PATH, bandCode.toString());
  const subcollectionRef = collection(bandRef, subcollection);
  setupListenerOverReference(subcollectionRef, updateFunc)
}
export function setupSongsListener(bandCode, updateFunc) {
  setupBandSubcollectionListener(bandCode, updateFunc, SONGS_PATH);
}

export function setupRehearsalsListener(bandCode, updateFunc) {
  setupBandSubcollectionListener(bandCode, updateFunc, REHEARSALS_PATH);
}

export function setupMembersListener(bandCode, updateFunc) {
  setupBandSubcollectionListener(bandCode, updateFunc, MEMBERS_PATH);
}

export function setupMusicianRequestListener(updateFunc) {
  const rehearsalRef = collection(db, MUSICIAN_REQUEST_PATH);
  setupListenerOverReference(rehearsalRef, updateFunc)
}

function setupListenerOverReference(collectionRef, updateFunc){
  onSnapshot(collectionRef, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({...doc.data(), id: doc.id});
      });
      updateFunc(results);
    } else {
      updateFunc([]);
    }
  }, (error) => {
    console.error(error)
  });
}

export function getRehearsalData(bandCode, rehearsalId, callback) {
  const musicianRequestRef = doc(db, MUSICIAN_REQUEST_PATH, musicianRequestId);
  const rehearsalRef = musicianRequestRef(bandRef, REHEARSALS_PATH, rehearsalId);

  getDoc(rehearsalRef)
    .then((doc) => {
      if (doc.exists) {
        callback(doc.data())
      } else {
        console.log("No such document!")
        callback(null);
      }
    }).catch((error) => {
      console.error("Error getting Rehearsal", error);
    });
}

export function getMusicianRequest(musicianRequestId, callback) {
  const musicianRequestRef = doc(db, MUSICIAN_REQUEST_PATH, musicianRequestId);
  getDoc(musicianRequestId)
    .then((doc) => {
      if (doc.exists) {
        callback(doc.data())
      } else {
        console.log("Error getting Musician Request");
      }
    }).catch((error) => {
      console.error("Error getting Rehearsal", error);
    });
}

export function deleteRehearsal(bandCode, rehearsalId, callback) {
  const bandRef = doc(db, BANDS_PATH, bandCode.toString());
  const rehearsalRef = doc(bandRef, REHEARSALS_PATH, rehearsalId);

  deleteDoc(rehearsalRef)
    .then(() => {
      console.log("Rehearsal with id" , rehearsalId, "removed succesfully");
      callback();
    }).catch((error) => {
      console.error("Error removing rehearsal: ", error);
    });
}

export function deleteSong(bandCode, songId, callback) {
  const bandRef = doc(db, BANDS_PATH, bandCode.toString());
  const songRef = doc(bandRef, SONGS_PATH, rehearsalId);
  deleteDoc(songRef)
    .then(() => {
      console.log("Song with id", songId, "removed succesfully");
      callback();
    }).catch((error) => {
      console.error("Error removing song: ", error);
    });
}

export function acceptMusicianRequest(musicianRequest, member, callback) {
  const bandRef = doc(db, BANDS_PATH, musicianRequest.bandCode.toString());
  const rehearsalRef = doc(bandRef, REHEARSALS_PATH, musicianRequest.rehearsalId);
  const memberRef = collection(rehearsalRef, MEMBERS_PATH);

  addDoc(memberRef, member)
    .then((docRef) => {
      var musicianRequestRef = doc(db, MUSICIAN_REQUEST_PATH, 
        musicianRequest.bandCode + "-" + musicianRequest.date);
      updateDoc(musicianRequestRef, {
        state: musicianRequestState.ACCEPTED.id,
      }).then(() => {
        callback();
      }).catch((error) => {
        console.error("Error Accepting Musician Request: ", error);
      });
    }).catch((error) => {
      console.error("Error Accepting Request: ", error);
    });
}
