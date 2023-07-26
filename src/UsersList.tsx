import { memo } from 'react'
import type { User } from './types'
import './UserList.css'
import { SortBy } from './App'

type DeleteUser = (id: string) => void

interface UsersListProps {
   users: User[]
   deleteUser: DeleteUser
   showColor: boolean
   sortBy: SortBy | null
   onSort: (user: SortBy) => void
}

export function UsersList({
   users,
   deleteUser,
   showColor,
   sortBy,
   onSort,
}: UsersListProps) {
   return (
      <table
         style={{
            width: '100%',
         }}
      >
         <thead>
            <tr>
               <td>Foto</td>
               <td onClick={() => onSort('name.first')}>Nombre {sortBy === 'name.first' && '*'}</td>
               <td onClick={() => onSort('name.last')}>Apellido {sortBy === 'name.last' && '*'}</td>
               <td onClick={() => onSort('location.country')}>País {sortBy === 'location.country' && '*'}</td>
               <td>Acciones</td>
            </tr>
         </thead>

         <tbody>
            {users.map((user) => (
               <UserItem
                  showColor={showColor}
                  key={user.login.uuid}
                  user={user}
                  deleteUser={deleteUser}
               />
            ))}
         </tbody>
      </table>
   )
}

const UserItem = memo(
   ({
      user,
      deleteUser,
      showColor,
   }: {
      user: User
      deleteUser: DeleteUser
      showColor: boolean
   }) => {
      return (
         <tr style={{ backgroundColor: !showColor ? 'transparent' : '' }}>
            <td>
               <img src={user.picture.medium} />
            </td>
            <td> {user.name.first}</td>
            <td>{user.name.last}</td>
            <td>{user.location.country}</td>

            <td style={{ display: 'flex', gap: '5px' }}>
               <button onClick={() => deleteUser(user.login.uuid)}>
                  Delete{' '}
               </button>
            </td>
         </tr>
      )
   }
)
