export default function NavBar({ onLogout }) {
  return (
    <div className="nav-links">
      <button type="button" className="button-secondary" onClick={onLogout}>
        Se déconnecter
      </button>
    </div>
  )
}
