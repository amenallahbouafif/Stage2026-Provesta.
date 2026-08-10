import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common.Authorization
      window.dispatchEvent(new Event('logout'))
      window.location.replace('/login')
    }

    if (error.response?.status === 403) {
      error.isForbidden = true
    }

    return Promise.reject(error)
  }
)

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export function login(credentials) {
  return api.post('/login', credentials)
}

export function logout() {
  return api.post('/logout')
}

export function getProduits() {
  return api.get('/produits')
}

export function createProduit(payload) {
  return api.post('/produits', payload)
}

export function updateProduit(id, payload) {
  return api.put(`/produits/${id}`, payload)
}

export function deleteProduit(id) {
  return api.delete(`/produits/${id}`)
}

export function getCategories() {
  return api.get('/categories')
}

export function getCommandes() {
  return api.get('/commandes')
}

export function getCommande(id) {
  return api.get(`/commandes/${id}`)
}

export function createCommande(payload) {
  return api.post('/commandes', payload)
}

export function updateCommandeStatut(id, statut) {
  return api.put(`/commandes/${id}/statut`, { statut })
}

export function getFournisseurs() {
  return api.get('/fournisseurs')
}

export function createFournisseur(payload) {
  return api.post('/fournisseurs', payload)
}

export function getUtilisateurs() {
  return api.get('/utilisateurs')
}

export function createUtilisateur(payload) {
  return api.post('/utilisateurs', payload)
}

export function updateUtilisateur(id, payload) {
  return api.put(`/utilisateurs/${id}`, payload)
}

export function deleteUtilisateur(id) {
  return api.delete(`/utilisateurs/${id}`)
}

export function getStocks() {
  return api.get('/stocks')
}
