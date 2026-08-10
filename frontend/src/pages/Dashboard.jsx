import { useEffect, useState } from 'react'
import { getProduits, getCommandes, getFournisseurs } from '../api.js'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ produits: 0, commandes: 0, fournisseurs: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [produitsRes, commandesRes, fournisseursRes] = await Promise.all([
          getProduits(),
          getCommandes(),
          getFournisseurs(),
        ])

        setMetrics({
          produits: produitsRes.data.length,
          commandes: commandesRes.data.length,
          fournisseurs: fournisseursRes.data.length,
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les indicateurs')
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [])

  return (
    <section>
      <div className="page-hero">
        <div>
          <p className="tag tag--success">Bienvenue</p>
          <h2 className="page-title">Tableau de bord</h2>
          <p>
            Visualisez les informations clés et accédez rapidement aux modules de gestion
            des produits, commandes et fournisseurs.
          </p>
        </div>
      </div>

      {loading && <p>Chargement des indicateurs...</p>}
      {error && <div className="alert">{error}</div>}

      {!loading && !error && (
        <div className="card-grid">
          <div className="card">
            <h3>Produits</h3>
            <p>{metrics.produits} produits disponibles</p>
          </div>
          <div className="card">
            <h3>Commandes</h3>
            <p>{metrics.commandes} commandes enregistrées</p>
          </div>
          <div className="card">
            <h3>Fournisseurs</h3>
            <p>{metrics.fournisseurs} fournisseurs actifs</p>
          </div>
        </div>
      )}
    </section>
  )
}
