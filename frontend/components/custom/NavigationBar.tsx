"use client"

import { UserCard_navbar } from './UserCard_navbar'
import { PageNavigation } from './PageNavigation'

export const NavigationBar = () => {
  return (
    <div className="relative">
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex-shrink-0">Logo</div>
        <PageNavigation />
        <div className="hidden lg:block">
          <UserCard_navbar />
        </div>
      </nav>
    </div>
  )
}














// import React from 'react'
// import { UserCard_navbar } from './UserCard_navbar'
// import { PageNavigation } from './PageNavigation'

// export const NavigationBar = () => {
//   return (
//     <div>
//         <nav className='flex items-center justify-between px-8 py-4 border-b'>
//             <div>Logo</div>
//             <div><PageNavigation/></div>
//             <div className=''><UserCard_navbar/></div>
//         </nav>
//     </div>
//   )
// }
