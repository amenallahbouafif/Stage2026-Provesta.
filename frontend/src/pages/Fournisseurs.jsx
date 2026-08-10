import { useContext, useEffect, useState } from 'react'
import { getFournisseurs, createFournisseur } from '../api.js'
import AuthContext from '../AuthContext.jsx'
import { canManageFournisseurs } from '../utils/permissions.js'

const initialForm = {
  nom: '',
  contact: '',
  delai_livraison_moyen: '',
}

export default function Fournisseurs() {
  const { user } = useContext(AuthContext)
  const canManage = canManageFournisseurs(user?.role)
  const [fournisseurs, setFournisseurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    async function loadFournisseurs() {
      try {
        const response = await getFournisseurs()
        setFournisseurs(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les fournisseurs')
      } finally {
        setLoading(false)
      }
    }

    loadFournisseurs()
  }, [])

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const refreshFournisseurs = async () => {
    try {
      const response = await getFournisseurs()
      setFournisseurs(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de rafraîchir les fournisseurs')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await createFournisseur({
        nom: form.nom,
        contact: form.contact,
        delai_livraison_moyen: form.delai_livraison_moyen
          ? parseInt(form.delai_livraison_moyen, 10)
          : null,
      })

      await refreshFournisseurs()
      setForm(initialForm)
    } catch (err) {
      setError(
        err.isForbidden
          ? "Vous n'avez pas les droits pour cette action"
          : err.response?.data?.message || 'Impossible de créer le fournisseur'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h2 className="page-title">Fournisseurs</h2>
      <p>Visualisez et gérez les fournisseurs pour les achats et le stock.</p>

      {canManage ? (
        <div className="card-grid">
          <div className="card">
            <h3>Ajouter un fournisseur</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="nom">Nom du fournisseur</label>
                <input
                  id="nom"
                  value={form.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="contact">Contact</label>
                <input
                  id="contact"
                  value={form.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="delai_livraison_moyen">Délai de livraison moyen (jours)</label>
                <input
                  id="delai_livraison_moyen"
                  type="number"
                  min="0"
                  value={form.delai_livraison_moyen}
                  onChange={(e) => handleChange('delai_livraison_moyen', e.target.value)}
                />
              </div>

              {error && <div className="alert">{error}</div>}

              <div className="form-actions">
                <button className="button-primary" type="submit" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Ajouter le fournisseur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <p>Vous pouvez consulter les fournisseurs, mais vous n'avez pas les droits pour en créer ou modifier.</p>
      )}

      {loading && <p>Chargement des fournisseurs...</p>}
      {error && !loading && <div className="alert">{error}</div>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Contact</th>
              <th>Délai de livraison</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map((fournisseur) => (
              <tr key={fournisseur.id}>
                <td>{fournisseur.nom}</td>
                <td>{fournisseur.contact}</td>
                <td>{fournisseur.delai_livraison_moyen ?? '—'} jours</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
