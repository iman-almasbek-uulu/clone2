import Footer from './Footer/Footer'
import scss from './LayoutSite.module.scss'
import { FC, ReactNode } from 'react'
import Header from './Header/Header'

interface LayoutSiteProps {
  children: ReactNode
}

const LayoutSite:FC<LayoutSiteProps> = ({children}) => {
  return (
    <div className={scss.LayoutSite}>
      <Header/>
      <main>
        {children}
      </main>
      <Footer/>
    </div>
  )
}

export default LayoutSite