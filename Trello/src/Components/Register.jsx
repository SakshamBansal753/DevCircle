import React, { useState } from 'react';
import { data } from 'react-router-dom';
import styled from 'styled-components';

const Register = () => {
    const [Formdata, setFormdata] = useState({
        "name":"",
        "email":"",
        "password":""
    })
    const [Error, setError] = useState('')
    const [Loading, setLoading] = useState(false)
    const register=async(e)=>{
        e.preventDefault()
        setLoading(true)
        try{
            const response=await fetch("http://127.0.0.1:5000/api/register",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(Formdata)
            })
            const data=await response.json()
            console.log(data)
            if(!response.ok){
                setError("Eroor")
            }
        }catch(error){
                setError(error)
        }finally{
            setLoading(false)
        }
    }
  return (
    <StyledWrapper className='h-screen bg-gradient-to-br from-purple-500 via-blue-800 to-white  text-xl overflow-y-hidden'>
      <div className="form-box relative left-[35%] top-[25%] p-5 text-xl">
        <form className="form text-2xl ">
          <span className="title">Sign up</span>
          <span className="subtitle">Create a free account with your email.</span>
          <div className="form-container">
            <input type="text" className="input" required placeholder="Full Name" onChange={(e)=>{setFormdata({...Formdata,name:e.target.value})}}/>
            <input type="email" className="input" required  placeholder="Email"onChange={(e)=>{setFormdata({...Formdata,email:e.target.value})}} />
            <input type="password" className="input" required  placeholder="Password" onChange={(e)=>{setFormdata({...Formdata,password:e.target.value})}}/>
          </div>
          <button onClick={register}>Sign up</button>
        </form>
        <div className="form-section">
          <p>Have an account? <a href>Log in</a> </p>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form-box {
    max-width: 500px;
    background: white;
    overflow: hidden;
    border-radius: 16px;
    color: #010101;
  }

  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 32px 24px 24px;
    gap: 16px;
    text-align: center;
  }

  /*Form text*/
  .title {
    font-weight: bold;
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 1rem;
    color: #666;
  }

  /*Inputs box*/
  .form-container {
    overflow: hidden;
    border-radius: 8px;
    background-color: white;
    margin: 1rem 0 .5rem;
    width: 100%;
  }

  .input {
    background: none;
    border: 0;
    outline: 0;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #eee;
    font-size: .9rem;
    padding: 8px 15px;
  }

  .form-section {
    padding: 16px;
    font-size: .85rem;
    background-color: #e0ecfb;
    box-shadow: rgb(0 0 0 / 8%) 0 -1px;
  }

  .form-section a {
    font-weight: bold;
    color: #0066ff;
    transition: color .3s ease;
  }

  .form-section a:hover {
    color: #005ce6;
    text-decoration: underline;
  }

  /*Button*/
  .form button {
    background-color: #0066ff;
    color: #fff;
    border: 0;
    border-radius: 24px;
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color .3s ease;
  }

  .form button:hover {
    background-color: #005ce6;
  }`;

export default Register;
