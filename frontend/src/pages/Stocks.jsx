import { useContext, useEffect, useState } from 'react'
import AuthContext from '../AuthContext.jsx'
import { getStocks } from '../api.js'
import { canViewStocks } from '../utils/permissions.js'

export default function Stocks() {
  const { user } = useContext(AuthContext)
  const canView = canViewStocks(user?.role)
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStocks() {
      try {
        const response = await getStocks()
        setStocks(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger les stocks')
      } finally {
        setLoading(false)
      }
    }

    loadStocks()
  }, [])

  const alertes = stocks.filter(
    (stock) => stock.produit?.seuil_alerte != null && stock.quantite <= stock.produit.seuil_alerte
  )

  if (!canView) {
    return (
      <section>
        <h2 className="page-title">Stocks</h2>
        <p>Vous n'avez pas les droits pour consulter les stocks.</p>
      </section>
    )
  }

  return (
    <section>
      <div className="content-top">
        <div>
          <p className="tag tag--success">Stocks</p>
          <h2 className="page-title">Gestion des stocks</h2>
          <p>Consultez les niveaux de stock et suivez les produits en alerte.</p>
        </div>
      </div>

      {loading && <p>Chargement des stocks...</p>}
      {error && <div className="alert">{error}</div>}

      {!loading && !error && (
        <>
          {alertes.length > 0 && (
            <div className="alert">
              {alertes.length} produit(s) en alerte de rupture de stock.
            </div>
          )}

          <div className="card">
            <h3>Liste des stocks</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Entrepôt</th>
                  <th>Quantité</th>
                  <th>Seuil d'alerte</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const seuil = stock.produit?.seuil_alerte
                  const isLow = seuil != null && stock.quantite <= seuil
                  return (
                    <tr key={stock.id} className={isLow ? 'row-alert' : ''}>
                      <td>{stock.produit?.nom || 'N/A'}</td>
                      <td>{stock.entrepot}</td>
                      <td>{stock.quantite}</td>
                      <td>{seuil != null ? seuil : 'N/A'}</td>
                      <td>{isLow ? 'Alerte' : 'OK'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
