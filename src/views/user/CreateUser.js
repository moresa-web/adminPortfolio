import { CForm, CCol, CFormInput, CFormCheck, CButton, CSpinner, CToaster } from "@coreui/react";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import * as pako from 'pako';

const CreateUser = () => {
  const token = uuidv4();

  const [isLoading, setIsLoading] = useState(false);
  const [toast, addToast] = useState(0);
  const toaster = useRef();
  const navigate = useNavigate();

  function PostData(e) {
    e.preventDefault();
    setIsLoading(true); // نمایش لودینگ

    if(!uuidValidate(document.getElementById("validateToken").value)){
      navigate('/500', { replace: true });
    }

    var model = {
      email: document.getElementById("email").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      password: document.getElementById("password").value,
      isPersistent: false
    };
    if (document.getElementById("isPersistent").value == "on") model.isPersistent = true;
    
    const compressedData = pako.gzip(JSON.stringify(model));
    const headers = new Headers({
      'Content-Encoding': 'gzip',
      'Content-Type': 'application/json'
    });

    console.log(compressedData);

    // Simple POST request with a JSON body using fetch
    fetch("https://localhost:7239/api/v1/Account", {
      method: "POST",
      body: compressedData,
      headers: headers
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setIsLoading(false);
        if (json.isSuccess == true) {
          Cookies.set("token", json.token, { expires: 7, path: "/" });
          navigate('/users/index', { replace: true });
        }
        else {
          console.log(json.errors);

          addToast(Alert(json.errors));

        }
      });
  }

  return (
    <>
      {isLoading ? (
        <div className="text-center">
          <CSpinner size="sm" variant="grow" style={{ marginTop: "25%", width: '4rem', height: '4rem' }} />
        </div>
      ) : (
        <CForm className="row g-3" onSubmit={PostData}>
          <CCol md={6}>
            <CFormInput type="email" name="email" id="email" label="Email" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="tel" name="phoneNumber" id="phoneNumber" label="PhoneNumber" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="password" name="password" id="password" label="Password" />
          </CCol>
          <CCol xs={12}>
            <CFormCheck type="checkbox" name="isPersistent" id="isPersistent" label="Check me out" />
          </CCol>
          <input type="hidden" id="validateToken" value={token} />
          <CCol xs={12}>
            <CButton color="primary" type="submit">Sign in</CButton>
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
          </CCol>
        </CForm>

      )}
    </>
  );
};


export default CreateUser