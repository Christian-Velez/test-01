import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UsersList } from './UsersList'
import type { User } from './types'

const url = 'https://randomuser.me/api?results=100'

/**
 * Esto está mal porque si el componente se reutilizara
 * habrían problemas
 */
// let initialList = []

export type SortBy = 'location.country' | 'name.first' | 'name.last'

function App() {
   const initialList = useRef<User[]>([])
   const [users, setUsers] = useState<User[]>([])
   const [showColor, setShowColor] = useState(false)
   const [sortBy, setSortBy] = useState<SortBy | null>(null)
   const [text, setText] = useState('')

   function reset() {
      setShowColor(false)
      setSortBy(null)
      setUsers(initialList.current)
   }

   function toggleColor() {
      setShowColor((prev) => !prev)
   }

   function onSort(field: SortBy) {
      if (field === sortBy) {
         setSortBy(null)
         return
      }

      setSortBy(field)
   }

   const deleteUser = useCallback((id: string) => {
      setUsers((prev) => prev.filter((u) => u.login.uuid !== id))
   }, [])

   useEffect(() => {
      fetch(url)
         .then((res) => res.json())
         .then((data) => {
            setUsers(data.results)
            initialList.current = data.results
         })
   }, [])

   /**
    * Sorting
    */
   const sortedUserList = useMemo(() => {
      const copy = [...users]

      if (sortBy === null) return users

      return copy.sort((a, b) => sortUsers(a, b, sortBy))
   }, [users, sortBy])

   /**
    * Filter by country
    */
   const filteredUserList = useMemo(() => {
      if (text.length > 0) {
         return filterByCountry(sortedUserList, text)
      }

      return sortedUserList
   }, [sortedUserList, text])

   return (
      <div style={{ padding: '100px' }}>
         <h2>Users ({filteredUserList?.length})</h2>

         <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => reset()}>Reset</button>
            <button onClick={() => toggleColor()}>
               {showColor ? 'Hide' : 'Show'} color
            </button>

            <button onClick={() => onSort('location.country')}>
               {sortBy === 'location.country' ? 'Unsort' : 'Sort by country'}
            </button>

            <input
               placeholder='Filter by country'
               value={text}
               onChange={(e) => setText(e.target.value)}
            />
         </div>

         <UsersList
            sortBy={sortBy}
            users={filteredUserList}
            showColor={showColor}
            deleteUser={deleteUser}
            onSort={onSort}
         />
      </div>
   )
}

function sortString(a: string, b: string) {
   return a.localeCompare(b)
}

function sortUsers(a: User, b: User, accessor: string) {
   const aValue = getFieldValue(a, accessor)
   const bValue = getFieldValue(b, accessor)

   return sortString(aValue, bValue)
}

function getFieldValue(user: User, accessorStr: string): string {
   let value: string | null = null
   const accessors = accessorStr.split('.')

   for (const accessor of accessors) {
      if (value === null) {
         value = user[accessor]
      } else {
         value = value[accessor]
      }

      if (value === undefined) {
         throw new Error('Invalid field')
      }
   }

   return value
}

function filterByCountry(list: User[], text: string) {
   return list.filter((u) =>
      u.location.country.toLowerCase().includes(text.toLowerCase())
   )
}

export default App
