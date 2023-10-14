export const setToken = (tokenName, token) => {
  localStorage.setItem(tokenName, token)
}

export const getToken = (tokenName) => {
  return localStorage.getItem(tokenName)
}

export const tokenIsValid = (tokenName) => {
  const token = getToken(tokenName)

  if (!token) return false

  const payload = JSON.parse(atob(token.split('.')[1]))
  const exp = payload.exp
  const now = Date.now() / 1000

  if (exp > now) {
    return true
  }
}

export const getUserID = (tokenName) => {
  if (tokenIsValid(tokenName)) {
    const token = getToken(tokenName)
    const userID = JSON.parse(atob(token.split('.')[1])).user_id
    return userID
  } else {
    return false
  }
}

export const deleteToken = (tokenName) => {
  return localStorage.removeItem(tokenName)
}