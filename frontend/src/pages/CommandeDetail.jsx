import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCommande, updateCommandeStatut } from '../api.js'
import AuthContext from '../AuthContext.jsx'
import { canManageCommandes } from '../utils/permissions.js'

const statutOptions = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'validee', label: 'Validée' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' },
]

export default function CommandeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const canManage = canManageCommandes(user?.role)
  const [commande, setCommande] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [statut, setStatut] = useState('')

  useEffect(() => {
    async function loadCommande() {
      try {
        const response = await getCommande(id)
        setCommande(response.data)
        setStatut(response.data.statut)
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger la commande')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadCommande()
    }
  }, [id])

  const handleUpdateStatut = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const response = await updateCommandeStatut(id, statut)
      setCommande(response.data)
    } catch (err) {
      setError(
        err.isForbidden
          ? "Vous n'avez pas les droits pour cette action"
          : err.response?.data?.message || 'Impossible de mettre à jour le statut'
      )
    } finally {
      setSaving(false)
    }
  }

  const totalAmount = commande?.lignesCommande?.reduce(
    (sum, ligne) => sum + ligne.quantite * ligne.prix_unitaire,
    0
  )

  if (loading) {
    return (
      <section>
        <h2 className="page-title">Détails de la commande</h2>
        <p>Chargement de la commande...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h2 className="page-title">Détails de la commande</h2>
        <div className="alert">{error}</div>
      </section>
    )
  }

  if (!commande) {
    return (
      <section>
        <h2 className="page-title">Détails de la commande</h2>
        <p>Commande introuvable.</p>
      </section>
    )
  }

  return (
    <section>
      <div className="content-top">
        <div>
          <p className="tag tag--success">Commande</p>
          <h2 className="page-title">{commande.numero_commande}</h2>
          <p>Suivez le statut et consultez le détail des lignes de cette commande.</p>
        </div>
        <button type="button" className="button-secondary" onClick={() => navigate('/commandes')}>
          Retour aux commandes
        </button>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Informations</h3>
          <p><strong>Fournisseur :</strong> {commande.fournisseur?.nom || 'N/A'}</p>
          <p><strong>Date commande :</strong> {new Date(commande.date_commande).toLocaleDateString()}</p>
          <p><strong>Date livraison prévue :</strong> {new Date(commande.date_livraison_prevue).toLocaleDateString()}</p>
          <p><strong>Montant total :</strong> {totalAmount?.toFixed(2) ?? '0.00'} €</p>
        </div>

        <div className="card">
          <h3>Statut</h3>
          {canManage ? (
            <form onSubmit={handleUpdateStatut}>
              <div className="form-field">
                <label htmlFor="statut">Statut de la commande</label>
                <select
                  id="statut"
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  required
                >
                  {statutOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button className="button-primary" type="submit" disabled={saving}>
                  {saving ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          ) : (
            <div className="tag" style={{ background: '#f3f4f6', color: '#1f2937' }}>
              {statutOptions.find((option) => option.value === statut)?.label || statut}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Lignes de commande</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {commande.lignesCommande.map((ligne) => (
              <tr key={ligne.id}>
                <td>{ligne.produit?.nom || 'N/A'}</td>
                <td>{ligne.quantite}</td>
                <td>{ligne.prix_unitaire.toFixed(2)} €</td>
                <td>{(ligne.quantite * ligne.prix_unitaire).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
