
export const UserRoles = [
    { label: "Leader (I want to create a band)", value: 1 },
    { label: "Musician (I want to join a band)", value: 2 },
  ];

const roleNames = [
  {id: 1, name: "Leader"},
  {id: 2, name: "Musician"}
]

export function getUserRoleName(id) {
  return roleNames.find(x => x.id === id)?.name
}