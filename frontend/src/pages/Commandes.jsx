import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCommandes,
  getFournisseurs,
  getProduits,
  createCommande,
} from '../api.js'
import AuthContext from '../AuthContext.jsx'
import { canManageCommandes } from '../utils/permissions.js'

const initialLine = {
  produit_id: '',
  quantite: '',
  prix_unitaire: '',
}

export default function Commandes() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const canManage = canManageCommandes(user?.role)
  const [commandes, setCommandes] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [produits, setProduits] = useState([])
  const [lines, setLines] = useState([initialLine])
  const [fournisseurId, setFournisseurId] = useState('')
  const [dateLivraison, setDateLivraison] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [commandesRes, fournisseursRes, produitsRes] = await Promise.all([
          getCommandes(),
          getFournisseurs(),
          getProduits(),
        ])

        setCommandes(commandesRes.data)
        setFournisseurs(fournisseursRes.data)
        setProduits(produitsRes.data)
        setDateLivraison(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les données des commandes')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLineChange = (index, field, value) => {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, [field]: value } : line
      )
    )
  }

  const handleAddLine = () => {
    setLines((current) => [...current, initialLine])
  }

  const handleRemoveLine = (index) => {
    setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))
  }

  const calculateTotal = () => {
    return lines.reduce((acc, line) => {
      const quantite = Number(line.quantite) || 0
      const prix = Number(line.prix_unitaire) || 0
      return acc + quantite * prix
    }, 0)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        fournisseur_id: parseInt(fournisseurId, 10),
        date_livraison_prevue: dateLivraison,
        lignes: lines.map((line) => ({
          produit_id: parseInt(line.produit_id, 10),
          quantite: parseInt(line.quantite, 10),
          prix_unitaire: parseFloat(line.prix_unitaire),
        })),
      }

      await createCommande(payload)
      const response = await getCommandes()
      setCommandes(response.data)
      setFournisseurId('')
      setLines([initialLine])
    } catch (err) {
      setError(
        err.isForbidden
          ? "Vous n'avez pas les droits pour cette action"
          : err.response?.data?.message || 'Impossible de créer la commande'
      )
    } finally {
      setSaving(false)
    }
  }

  const getProduitPrix = (produitId) => {
    const produit = produits.find((item) => item.id === Number(produitId))
    return produit?.prix_unitaire || 0
  }

  return (
    <section>
      <h2 className="page-title">Commandes</h2>
      <p>Accédez aux commandes et gérez les livraisons depuis ce tableau de bord.</p>

      <div className="card-grid">
        <div className="card">
          <h3>Nouvelle commande</h3>
          {canManage ? (
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="fournisseur">Fournisseur</label>
                <select
                  id="fournisseur"
                  value={fournisseurId}
                  onChange={(e) => setFournisseurId(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map((fournisseur) => (
                    <option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="date_livraison">Date de livraison prévue</label>
                <input
                  id="date_livraison"
                  type="date"
                  value={dateLivraison}
                  onChange={(e) => setDateLivraison(e.target.value)}
                  required
                />
              </div>

              {lines.map((line, index) => (
                <div key={index} className="card" style={{ marginBottom: '16px' }}>
                  <div className="form-field">
                    <label>Produit</label>
                    <select
                      value={line.produit_id}
                      onChange={(e) => {
                        handleLineChange(index, 'produit_id', e.target.value)
                        handleLineChange(index, 'prix_unitaire', getProduitPrix(e.target.value).toString())
                      }}
                      required
                    >
                      <option value="">Sélectionner un produit</option>
                      {produits.map((produit) => (
                        <option key={produit.id} value={produit.id}>
                          {produit.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Quantité</label>
                    <input
                      type="number"
                      min="1"
                      value={line.quantite}
                      onChange={(e) => handleLineChange(index, 'quantite', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Prix unitaire</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.prix_unitaire}
                      onChange={(e) => handleLineChange(index, 'prix_unitaire', e.target.value)}
                      required
                    />
                  </div>

                  <button type="button" className="button-secondary" onClick={() => handleRemoveLine(index)}>
                    Supprimer la ligne
                  </button>
                </div>
              ))}

              <button type="button" className="button-secondary" onClick={handleAddLine}>
                Ajouter une ligne
              </button>

              <div className="card" style={{ marginTop: '16px' }}>
                <strong>Total :</strong> {calculateTotal().toFixed(2)} €
              </div>

              {error && <div className="alert">{error}</div>}

              <div className="form-actions">
                <button className="button-primary" type="submit" disabled={saving}>
                  {saving ? 'Création...' : 'Créer la commande'}
                </button>
              </div>
            </form>
          ) : (
            <p>Vous pouvez consulter les commandes, mais vous n'avez pas les droits pour en créer.</p>
          )}
        </div>
      </div>

      {loading && <p>Chargement des commandes...</p>}
      {error && !loading && <div className="alert">{error}</div>}

      {!loading && !error && commandes.length === 0 && <p>Aucune commande disponible pour le moment.</p>}

      {!loading && !error && commandes.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Fournisseur</th>
              <th>Statut</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((commande) => (
              <tr key={commande.id} onClick={() => navigate(`/commandes/${commande.id}`)} style={{ cursor: 'pointer' }}>
                <td>{commande.numero_commande}</td>
                <td>{commande.fournisseur?.nom || 'N/A'}</td>
                <td>{commande.statut}</td>
                <td>{commande.montant_total.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
