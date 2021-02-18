import { SET_USER_DATA, CLEAR_SESSION, START_SESSION } from '../ActionTypes'

export const setUserData = () => {
    return async dispatch => {
        let url = process.env.REACT_APP_BASE_URL;
        fetch(url + "/api/user",
            {
                method: 'GET', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
            })
            .then(response => response.json())
            .then(result => {
                dispatch({ type: SET_USER_DATA, payload: result })
            })
    }
}
export const signIn = (cred, redirect, check) => {

    return async dispatch => {
            let url = process.env.REACT_APP_BASE_URL;
            fetch(url + "/auth/",
                {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cred)
                })
                .then(response => response.json())
                .then(result => {
                    localStorage.setItem("token", result.token);
                    dispatch({ type: START_SESSION });
                    dispatch(setUserData());
                    redirect();

                }).catch(()=>check(true))
    }
}

export const signOut = (redirect) => {

    return async dispatch => {
        localStorage.removeItem("token");
        dispatch({ type: CLEAR_SESSION });
        redirect()
    }
}
