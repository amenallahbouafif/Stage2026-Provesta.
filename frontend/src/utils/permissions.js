export function canManageProduits(role) {
  return ['administrateur', 'gestionnaire_stock'].includes(role)
}

export function canManageFournisseurs(role) {
  return ['administrateur', 'responsable_achats'].includes(role)
}

export function canManageCommandes(role) {
  return ['administrateur', 'responsable_achats'].includes(role)
}

export function canManageUsers(role) {
  return role === 'administrateur'
}

export function canViewStocks(role) {
  return ['administrateur', 'gestionnaire_stock'].includes(role)
}
