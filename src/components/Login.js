import { React, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { signIn } from '../redux/actions/Auth'
import { useSelector, useDispatch } from 'react-redux'



export default function Login() {
  const [check, setCheck] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLogined } = useSelector(({ auth }) => auth)
  useEffect(() => {
    if (isLogined) history.push('/schema')
  }, [dispatch, isLogined])




  const handleSubmit = (event) => {
    let values = ["username", "password"]
    let cred = {};
    event.preventDefault();
    Object.keys(event.target.elements).forEach(key => {
      if (values.includes(event.target.elements[key].name)) {
        cred[event.target.elements[key].name] = event.target.elements[key].value;
      }

    });
    dispatch(signIn(cred, () => history.push('/reports'), setCheck));

  }
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <label>
        <p>Username</p>
        <input type="text" name="username" />
      </label>
      <label>
        <p>Password</p>
        <input type="password" name="password" />
      </label>
      <div>
        <button type="submit" onclick="getToken()" >Submit</button>
      </div>
      {check &&
        <div style={{ color: "red" }}>
          Invalid Credentials.
      </div>

      }
    </form>
  )
}