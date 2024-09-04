import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Cookies from "js-cookie";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Login = () => {

  const handleLoginSuccess = async (credentialResponse) => {
  var model = {
    credential: credentialResponse.credential
  };

  fetch("https://localhost:7239/api/v1/Account", {
    method: "POST",
    body: JSON.stringify(model),
    headers: { Authorization: 'Bearer ' + Cookies.get('token') }
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json.isSuccess == true) {
        Cookies.set("token", json.token, { expires: 7, path: "/" });
        Cookies.remove('VisitorId', { path: '/' })
        window.location.href = "/#/users/index";
      }
      else {
        console.log(json.errors);
      }
    });
  };
  function PostData(e) {
    e.preventDefault();

    var model = {
      phoneNumber: document.getElementById("phoneNumber").value,
      password: document.getElementById("password").value,
    };
    // Simple POST request with a JSON body using fetch
    fetch("https://localhost:7239/api/v1/Account", {
      method: "POST",
      body: JSON.stringify(model),
      headers: { Authorization: 'Bearer ' + Cookies.get('token') }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.isSuccess == true) {
          Cookies.set("token", json.token, { expires: 7, path: "/" });
          Cookies.remove('VisitorId', { path: '/' })
          window.location.href = "/#/users/index";
        }
        else {
          console.log(json.errors);
        }
      });
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={PostData}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        id='phoneNumber'
                        name='phoneNumber'
                        placeholder="PhoneNumber"
                        autoComplete="PhoneNumber" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        id='password'
                        name='password'
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                      <CCol className="text-right m-r-10">
                        <GoogleOAuthProvider clientId="462940104381-a81hsl5sj0go33af4p0m7s0nnorkfkrv.apps.googleusercontent.com">
                          <GoogleLogin
                            className="sign"
                            onSuccess={handleLoginSuccess}
                            onError={() => {
                              console.log('Login Failed');
                            }}
                          />
                          </GoogleOAuthProvider>                    
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
