const SongKeys = [
    { id: 1, name:"C" },
    { id: 2, name:"D" },
    { id: 3, name:"E" },
    { id: 4, name:"F" },
    { id: 5, name:"G" },
    { id: 6, name:"A" },
    { id: 7, name:"B" }
]

export function getKeyName(id) {
    return SongKeys.find(x => x.id === id)?.name
}

export const SongKeysValues = [
    { value: 1, label:"C" },
    { value: 2, label:"D" },
    { value: 3, label:"E" },
    { value: 4, label:"F" },
    { value: 5, label:"G" },
    { value: 6, label:"A" },
    { value: 7, label:"B" }
]