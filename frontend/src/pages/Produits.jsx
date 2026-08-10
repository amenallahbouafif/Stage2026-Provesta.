import { useContext, useEffect, useState } from 'react'
import {
  getProduits,
  getCategories,
  createProduit,
  updateProduit,
  deleteProduit,
} from '../api.js'
import AuthContext from '../AuthContext.jsx'
import { canManageProduits } from '../utils/permissions.js'

const initialForm = {
  nom: '',
  prix_unitaire: '',
  seuil_alerte: '',
  categorie_id: '',
}

export default function Produits() {
  const { user } = useContext(AuthContext)
  const canManage = canManageProduits(user?.role)
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingProduitId, setEditingProduitId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [emptyState, setEmptyState] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [produitsRes, categoriesRes] = await Promise.all([
          getProduits(),
          getCategories(),
        ])
        setProduits(produitsRes.data)
        setEmptyState(produitsRes.data.length === 0)
        setCategories(categoriesRes.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les produits')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditingProduitId(null)
  }

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const refreshProduits = async () => {
    try {
      const response = await getProduits()
      setProduits(response.data)
      setEmptyState(response.data.length === 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de rafraîchir les produits')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        nom: form.nom,
        prix_unitaire: parseFloat(form.prix_unitaire),
        seuil_alerte: form.seuil_alerte ? parseInt(form.seuil_alerte, 10) : null,
        categorie_id: parseInt(form.categorie_id, 10),
      }

      if (editingProduitId) {
        await updateProduit(editingProduitId, payload)
      } else {
        await createProduit(payload)
      }

      await refreshProduits()
      resetForm()
    } catch (err) {
      setError(
        err.isForbidden
          ? "Vous n'avez pas les droits pour cette action"
          : err.response?.data?.message || 'Impossible de sauvegarder le produit'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (produit) => {
    setEditingProduitId(produit.id)
    setForm({
      nom: produit.nom,
      prix_unitaire: produit.prix_unitaire.toString(),
      seuil_alerte: produit.seuil_alerte?.toString() || '',
      categorie_id: produit.categorie_id?.toString() || '',
    })
  }

  const handleDelete = async (id) => {
    setError('')

    try {
      await deleteProduit(id)
      await refreshProduits()
    } catch (err) {
      setError(
        err.isForbidden
          ? "Vous n'avez pas les droits pour cette action"
          : err.response?.data?.message || 'Impossible de supprimer le produit'
      )
    }
  }

  return (
    <section>
      <h2 className="page-title">Produits</h2>
      <p>Consultez et gérez vos produits depuis cette page.</p>

      {canManage && (
        <div className="card-grid">
          <div className="card">
            <h3>{editingProduitId ? 'Modifier un produit' : 'Ajouter un produit'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="nom">Nom du produit</label>
                <input
                  id="nom"
                  value={form.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="prix_unitaire">Prix unitaire</label>
                <input
                  id="prix_unitaire"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.prix_unitaire}
                  onChange={(e) => handleChange('prix_unitaire', e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="seuil_alerte">Seuil d'alerte</label>
                <input
                  id="seuil_alerte"
                  type="number"
                  min="0"
                  value={form.seuil_alerte}
                  onChange={(e) => handleChange('seuil_alerte', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="categorie_id">Catégorie</label>
                <select
                  id="categorie_id"
                  value={form.categorie_id}
                  onChange={(e) => handleChange('categorie_id', e.target.value)}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>
                      {categorie.libelle}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div className="alert">{error}</div>}

              <div className="form-actions">
                <button className="button-primary" type="submit" disabled={saving}>
                  {saving ? 'Enregistrement...' : editingProduitId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Chargement des produits...</p>}

      {!loading && !error && emptyState && <p>Aucun produit disponible pour le moment.</p>}

      {!loading && !error && !emptyState && (
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((produit) => {
              const stock = produit.stock?.quantite ?? 0
              const isLowStock = produit.seuil_alerte != null && stock <= produit.seuil_alerte
              return (
                <tr key={produit.id} className={isLowStock ? 'row-alert' : ''}>
                  <td>{produit.nom}</td>
                  <td>{produit.categorie?.libelle || 'N/A'}</td>
                  <td>{produit.prix_unitaire.toFixed(2)} €</td>
                  <td>{produit.stock?.quantite ?? '—'}</td>
                  <td>
                    {canManage && (
                      <>
                        <button className="button-secondary" type="button" onClick={() => handleEdit(produit)}>
                          Éditer
                        </button>
                        <button className="button-secondary" type="button" onClick={() => handleDelete(produit.id)}>
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}
