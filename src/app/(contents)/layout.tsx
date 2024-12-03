import Header from '@/components/header'
import React from 'react'

function ContentsLayout({children}:{children:React.ReactNode}) {
  return (
    <div>
      <Header/>
      {children}</div>
  )
}

export default ContentsLayout
