import { child, equalTo, get, getDatabase, onValue, orderByChild, push, query, ref, remove, set } from "firebase/database"

import { Random4Digit } from "../util/Util";
import { UserContext } from "../context/UserContext";
import { firebaseConfig } from "../config/fb-config";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

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
    set(ref(db, 'bands/' + bandCode), band).catch((error) => {
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
    };

    const reference = push(ref(db, 'users/'))
    set(reference, user).catch((error) => {
        console.error(error);
    });

    user.key = reference.key;
    return user;
}

export function saveNewSong(song, bandCode, responseFunction){
    const db = getDatabase();
    const reference = push(ref(db,'bands/' + bandCode + '/songs/'));
    set(reference, song)
    .then((response) =>{
        responseFunction("Song saved succesfully");
    }).catch((error) => {
        console.error(error);
    });
}

export function saveNewRehearsal(song, bandCode, responseFunction){
  const db = getDatabase();
  const reference = push(ref(db,'bands/' + bandCode + '/rehearsals/'));
  set(reference, song)
  .then((response) =>{
      responseFunction("Rehearsal saved succesfully");
  }).catch((error) => {
      console.error(error);
  });
}


function linkUserToBand(user, bandCode, responseFunction) {
    const db = getDatabase();
    let bandRef = ref(db, 'bands/' + bandCode + '/members');
    push(bandRef, user).then((response) => {
        console.log("Created user in Band with key ", response);
        responseFunction("Created User and linked to Band Successfull")
    }).catch((error) => {
        console.error(error);
    });
}

export function getBandName(bandCode, bandFunction) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'bands/' + bandCode)).then((snapshot) => {
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
    const topUserPostsRef = query(ref(db, 'users/'), orderByChild('email'), equalTo(email));

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
    const reference = ref(db, "bands/"+ bandCode + "/songs/");
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
    const reference = ref(db, "bands/"+ bandCode + "/rehearsals/");
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
    const reference = ref(db, "bands/"+ bandCode + "/members/");
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
    const starCountRef = ref(db, 'bands/' + bandCode + '/rehearsals/' + rehearsalId);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error(error);
    });
  }

  export function deleteRehearsal(bandCode, rehearsalId, callback) {
    const db = getDatabase();
    const reference = ref(db, 'bands/' + bandCode + '/rehearsals/' + rehearsalId);
    remove(reference)
    callback();
  }

  export function deleteSong(bandCode, songId, callback) {
    const db = getDatabase();
    const reference = ref(db, 'bands/' + bandCode + '/songs/' + songId);
    remove(reference)
    callback();
  }
