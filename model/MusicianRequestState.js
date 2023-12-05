export const musicianRequestState = {
    OPEN: {id: 1, icon : require('../assets/megaphone.png') },
    ACCEPTED: {id: 2, icon : require('../assets/accepted-icon.png')},
    EXPIRED: {id: 3, icon : require('../assets/expired.png')},
    UNKNOWN: {id: 4, icon : require('../assets/unknown.png')},
}

export function getIconSource(id) {
    for (const key of Object.keys(musicianRequestState)) {
        if (musicianRequestState[key].id == id) {
            return musicianRequestState[key].icon;
        }
    }
    return "";
}