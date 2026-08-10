import { useContext, useEffect, useState } from 'react'
import AuthContext from '../AuthContext.jsx'
import {
  getUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
} from '../api.js'
import { canManageUsers } from '../utils/permissions.js'

const roles = [
  { value: 'administrateur', label: 'Administrateur' },
  { value: 'gestionnaire_stock', label: 'Gestionnaire de stock' },
  { value: 'responsable_achats', label: 'Responsable achats' },
]

export default function Utilisateurs() {
  const { user } = useContext(AuthContext)
  const canManage = canManageUsers(user?.role)
  const [utilisateurs, setUtilisateurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nom: '', email: '', password: '', role: 'gestionnaire_stock' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function loadUtilisateurs() {
      try {
        const response = await getUtilisateurs()
        setUtilisateurs(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les utilisateurs')
      } finally {
        setLoading(false)
      }
    }

    loadUtilisateurs()
  }, [])

  const refreshUtilisateurs = async () => {
    try {
      const response = await getUtilisateurs()
      setUtilisateurs(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de rafraîchir les utilisateurs')
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      if (editingId) {
        await updateUtilisateur(editingId, {
          nom: form.nom,
          email: form.email,
          password: form.password,
          role: form.role,
        })
      } else {
        await createUtilisateur(form)
      }

      setForm({ nom: '', email: '', password: '', role: 'gestionnaire_stock' })
      setEditingId(null)
      await refreshUtilisateurs()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’enregistrer l’utilisateur')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (utilisateur) => {
    setForm({
      nom: utilisateur.nom,
      email: utilisateur.email,
      password: '',
      role: utilisateur.role,
    })
    setEditingId(utilisateur.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) {
      return
    }

    try {
      await deleteUtilisateur(id)
      await refreshUtilisateurs()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de supprimer l’utilisateur')
    }
  }

  if (!canManage) {
    return (
      <section>
        <h2 className="page-title">Utilisateurs</h2>
        <p>Vous n'avez pas les droits pour gérer les utilisateurs.</p>
      </section>
    )
  }

  return (
    <section>
      <div className="content-top">
        <div>
          <p className="tag tag--success">Utilisateurs</p>
          <h2 className="page-title">Gestion des utilisateurs</h2>
          <p>Créez et éditez les comptes qui accèdent à l'application.</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>{editingId ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                value={form.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder={editingId ? 'Laisser vide pour ne pas changer' : ''}
                {...(!editingId && { required: true })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="role">Rôle</label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                required
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="alert">{error}</div>}

            <div className="form-actions">
              <button className="button-primary" type="submit" disabled={saving}>
                {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && <p>Chargement des utilisateurs...</p>}
      {!loading && !error && utilisateurs.length === 0 && <p>Aucun utilisateur trouvé.</p>}

      {!loading && !error && utilisateurs.length > 0 && (
        <div className="card">
          <h3>Liste des utilisateurs</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((utilisateur) => (
                <tr key={utilisateur.id}>
                  <td>{utilisateur.nom}</td>
                  <td>{utilisateur.email}</td>
                  <td>{utilisateur.role}</td>
                  <td>
                    <button className="button-secondary" type="button" onClick={() => handleEdit(utilisateur)}>
                      Modifier
                    </button>
                    <button className="button-secondary" type="button" onClick={() => handleDelete(utilisateur.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
