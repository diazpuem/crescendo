const SongKeys = [
    { id: 1, name:"C" },
    { id: 2, name:"C# / Db" },
    { id: 3, name:"D" },
    { id: 4, name:"D# / Eb" },
    { id: 5, name:"E" },
    { id: 6, name:"F" },
    { id: 7, name:"F# / Gb" },
    { id: 8, name:"G" },
    { id: 9, name:"G# / Ab" },
    { id: 10, name:"A" },
    { id: 11, name:"A# / Bb" },
    { id: 12, name:"B"}
]

export function getKeyName(id) {
    return SongKeys.find(x => x.id === id)?.name
}

export const SongKeysValues = [
    { value: 1, label:"C" },
    { value: 2, label:"C# / Db" },
    { value: 3, label:"D" },
    { value: 4, label:"D# / Eb" },
    { value: 5, label:"E" },
    { value: 6, label:"F" },
    { value: 7, label:"F# / Gb" },
    { value: 8, label:"G" },
    { value: 9, label:"G# / Ab" },
    { value: 10, label:"A" },
    { value: 11, label:"A# / Bb" },
    { value: 12, label:"B" }
]