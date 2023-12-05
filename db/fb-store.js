import { child, equalTo, get, getDatabase, onValue, orderByChild, orderByKey, push, query, ref, remove, set, update } from "firebase/database"

import { Random4Digit } from "../util/Util";
import { firebaseConfig } from "../config/fb-config";
import { initializeApp } from "firebase/app";
import { musicianRequestState } from "../model/MusicianRequestState"

const USERS_PATH = 'users/';
const BANDS_PATH = '/bands/';
const SONGS_PATH = '/songs/';
const REHEARSALS_PATH = '/rehearsals/';
const MEMBERS_PATH = '/members/';
const MUSICIAN_REQUEST_PATH = '/musicianRequest/'

export function initCrescendoApp() {
    initializeApp(firebaseConfig);
}

export function createNewUserAndBand(userBandObject, responseFunction) {
    if (!userBandObject.bandCode || userBandObject.bandCode === ""){
      userBandObject.bandCode = createBand(userBandObject); 
    }
    const user = createUser(userBandObject);
    linkUserToBand(user, userBandObject.bandCode, responseFunction);
} 

function createBand(userBandObject){
    const db = getDatabase();
    const bandCode = Random4Digit();
    const band = {
        name: userBandObject.bandName,
    };
    set(ref(db, BANDS_PATH + bandCode), band).catch((error) => {
        console.error(error);
    });
    return bandCode;
}

function createUser(userBandObject){
    const db = getDatabase()
    const user = {
        name : userBandObject.name,
        userRole: userBandObject.userRole,
        userBandRole: userBandObject.userBandRole,
        bandCode: userBandObject.bandCode,
        email: userBandObject.email,
        bandName: userBandObject.bandName
    };

    const reference = push(ref(db, USERS_PATH))
    set(reference, user).catch((error) => {
        console.error(error);
    });

    user.key = reference.key;
    return user;
}

export function saveNewSong(song, bandCode, responseFunction){
    const db = getDatabase();
    const reference = push(ref(db, BANDS_PATH + bandCode + SONGS_PATH));
    set(reference, song)
    .then((response) =>{
        responseFunction("Song saved succesfully");
    }).catch((error) => {
        console.error(error);
    });
}

export function saveNewRehearsal(rehearsal, bandCode, responseFunction){
  const db = getDatabase();
  const temporalCopy = {...rehearsal };
  console.log("COPIA");
  console.log(temporalCopy);
  delete rehearsal.members;
  console.log(rehearsal);
  const RehearsalReference = push(ref(db, BANDS_PATH + bandCode + REHEARSALS_PATH));
  set(RehearsalReference, rehearsal)
  .then(() => {
    temporalCopy.members.forEach(element => {
      const membersRef = push(ref(db, BANDS_PATH + bandCode + REHEARSALS_PATH + RehearsalReference.key + MEMBERS_PATH));
      set(membersRef, element);
    });
  }).then(()=> {
    responseFunction("Rehearsal saved succesfully");
  }).catch((error) => {
      console.error(error);
  });
}

export function saveNewMusicianRequest(musicianRequest, responseFunction){
  const db = getDatabase();
  const reference = ref(db, MUSICIAN_REQUEST_PATH + musicianRequest.bandCode + '-' + musicianRequest.date);
  set(reference, musicianRequest)
    .then((response) => {
      console.log("Created musician for Band with key ", musicianRequest.bandCode);
      responseFunction(response)
    }).catch((error) => {
        console.error(error);
    });
}

function linkUserToBand(user, bandCode, responseFunction) {
    const db = getDatabase();
    let bandRef = ref(db, BANDS_PATH + bandCode + MEMBERS_PATH);
    push(bandRef, user).then((response) => {
        console.log("Created user in Band with key ", response);
        responseFunction("Created User and linked to Band Successfull")
    }).catch((error) => {
        console.error(error);
    });
}

export function getBandName(bandCode, bandFunction) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, BANDS_PATH + bandCode)).then((snapshot) => {
        if (snapshot.exists()) {
            bandFunction(snapshot.val().name);
        } else {
            console.log("No Band data available for this code");
            bandFunction(null);
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function getUserIfExists(email, userFunction) {
    const db = getDatabase();
    const topUserPostsRef = query(ref(db, USERS_PATH), orderByChild('email'), equalTo(email));

    get(topUserPostsRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("The user exists");
            userFunction(snapshot.val());
        } else {
            userFunction(null);
            alert("User does not exists");
            console.log("The user does not exists");
        }
    }).catch((error) => {
        console.error(error);
    });
}


export function setupSongsListener(bandCode, updateFunc) {
    const db = getDatabase();
    const reference = ref(db, BANDS_PATH + bandCode + SONGS_PATH);
    onValue(reference, (snapshot) => {
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          newArr.push({ ...fbObject[key], id: key });
        });
        updateFunc(newArr);
      } else {
        updateFunc([]);
      }
    }, (error) => {
      console.error(error);
    });
  } 

  export function setupRehearsalsListener(bandCode, updateFunc) {
    const db = getDatabase();
    const reference = ref(db, BANDS_PATH + bandCode + REHEARSALS_PATH);
    onValue(reference, (snapshot) => {
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          newArr.push({ ...fbObject[key], id: key });
        });
        updateFunc(newArr);
      } else {
        updateFunc([]);
      }
    }, (error) => {
      console.error(error);
    });
  } 

  export function setupMembersListener(bandCode, updateFunc) {
    const db = getDatabase();
    const reference = ref(db, BANDS_PATH + bandCode + MEMBERS_PATH);
    onValue(reference, (snapshot) => {
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          newArr.push({ ...fbObject[key], id: key });
        });
        updateFunc(newArr);
      } else {
        updateFunc([]);
      }
    }, (error) => {
      console.error(error);
    });
  }

  export function setupMusicianRequestListener(updateFunc) {
    const db = getDatabase();
    const reference = ref(db, MUSICIAN_REQUEST_PATH
    );
    onValue(reference, (snapshot) => {
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          newArr.push({ ...fbObject[key], id: key });
        });
        updateFunc(newArr);
      } else {
        updateFunc([]);
      }
    }, (error) => {
      console.error(error);
    });
  }

  export function getRehearsalData(bandCode, rehearsalId, callback) {
    const db = getDatabase();
    const starCountRef = ref(db, BANDS_PATH + bandCode + REHEARSALS_PATH + rehearsalId);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error(error);
    });
  }

  export function getMusicianRequest(musicianRequestId, callback) {
    const db = getDatabase();
    const starCountRef = ref(db, MUSICIAN_REQUEST_PATH
     + '/' + musicianRequestId);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error(error);
    });
  }

  export function deleteRehearsal(bandCode, rehearsalId, callback) {
    const db = getDatabase();
    const reference = ref(db, BANDS_PATH + bandCode + REHEARSALS_PATH + rehearsalId);
    remove(reference)
    callback();
  }

  export function deleteSong(bandCode, songId, callback) {
    const db = getDatabase();
    const reference = ref(db, BANDS_PATH + bandCode + SONGS_PATH  + songId);
    remove(reference)
    callback();
  }

  export function acceptMusicianRequest(musicianRequest, member, callback) {
    const db = getDatabase()
    const bandRef = push(ref(db, BANDS_PATH + musicianRequest.bandCode + REHEARSALS_PATH + musicianRequest.rehearsalId + MEMBERS_PATH));
    const stateRef = ref(db, MUSICIAN_REQUEST_PATH + musicianRequest.bandCode + '-' + musicianRequest.date);
    set(bandRef, member)
    .then((snap) => {
      update(stateRef, {
        "state" : musicianRequestState.ACCEPTED.id
      }).then((response) => {
        callback(response)
      });
    }).catch((error) => {
        console.error(error);
    });
  }


