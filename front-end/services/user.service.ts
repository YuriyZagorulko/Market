import config from '../config'
import { authHeader } from '../helpers/headers'
import { LocalStorage } from '../helpers/storage/localStorage'
import { store } from '../redux/store'
import { ILogin } from '../helpers/types/responces/auth'
import { IUserState } from '../redux/reducers/user.reducer'

const storage: LocalStorage = LocalStorage.Instance
export const userService = {
    login,
    logout
}

function login(payload: {username, password}) {
    // const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload)
    // }

    // return fetch(`${config.apiUrl}/market/auth-token`, requestOptions)
    //     .then(handleResponse)
    //     .then((responce: ILogin) => {
    //         if (typeof window !== 'undefined') {
    //             storage.authToken = responce.token
    //         }
    //         return responce.token
    //     })
    return testSecureAction()
}
function testSecureAction() {
    debugger
    const user: IUserState = store.getState().user
    const requestOptions = {
        method: 'POST',
        headers: {  'Content-Type': 'application/json',
                    'Authorization': 'Token ' + user.token },
        body: JSON.stringify({})
    }
    return fetch(`${config.apiUrl}/market/`, requestOptions)
        .then((responce) => {
            debugger
            console.log(responce)
            return responce.json()
        }).catch(e => {
            debugger
            return e
        })
}
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user')
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse)
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout()
                location.reload(true)
            }

            const error = (data && data.message) || response.statusText
            return Promise.reject(error)
        }

        return data
    })
}