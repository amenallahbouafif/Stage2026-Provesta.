import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'
import NavBar from './NavBar.jsx'

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Produits', to: '/produits' },
  { label: 'Commandes', to: '/commandes' },
  { label: 'Fournisseurs', to: '/fournisseurs' },
  { label: 'Stocks', to: '/stocks' },
  { label: 'Utilisateurs', to: '/utilisateurs' },
]

function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? 'sidebar-link active' : 'sidebar-link'
      }
    >
      {label}
    </NavLink>
  )
}

export default function Layout({ onLogout }) {
  return (
    <div className="provesta-layout">
      <aside className="provesta-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">P</div>
          <div>
            <p className="brand-name">Provesta</p>
            <p className="brand-subtitle">Stock & procurement</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <SidebarLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavBar onLogout={onLogout} />
        </div>
      </aside>

      <main className="provesta-content">
        <Outlet />
      </main>
    </div>
  )
}
