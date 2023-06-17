
export const UserBandRoles = [
    { label: "Singer", value: 1},
    { label: "Guitarist", value: 2 },
    { label: "Drummer", value: 3 },
    { label: "Bassist", value: 4 },
    { label: "Pianist", value: 5 },
  ];

const roleBandNames = [
    {id:1, name: "Singer", icon: "mic"},
    {id:2, name: "Guitarist", icon: "headset"},
    {id:3, name: "Drummer", icon: "glasses"},
    {id:4, name: "Bassist", icon: "skull"},
    {id:5, name: "Pianist", icon: "star"}
];

export function getUserBandRoleName(id) {
    return roleBandNames.find(x => x.id === id)?.name
}

export function getUserBandRoleIcon(id) {
    return roleBandNames.find(x => x.id === id)?.icon
}