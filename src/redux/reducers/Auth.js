import { SET_USER_DATA, CLEAR_SESSION, START_SESSION } from '../ActionTypes'
const INIT_STATE = { isLogined: !!localStorage.getItem('token'), user: {} }
export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CLEAR_SESSION: {
            return { ...INIT_STATE, isLogined: false, user: {} }
        }
        case SET_USER_DATA: {
            return { ...state, user: action.payload }
        }
        case START_SESSION: {
            return { ...state, isLogined: true }
        }
        default: return state
    }
} 