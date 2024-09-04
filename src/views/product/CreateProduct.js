import { CForm, CCol, CFormInput, CFormCheck, CButton, CSpinner, CToaster } from "@coreui/react";
import { useState, useRef } from "react";
import Alert from "../../components/Alert";
import Cookies from "js-cookie";

const CreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, addToast] = useState(0);
  const toaster = useRef();

  function PostData(e) {
    e.preventDefault();
    setIsLoading(true); // نمایش لودینگ

    // const formData = new FormData();
    // const imageInput = document.getElementById("Images");
    // for (let i = 0; i < imageInput.files.length; i++) {
    //   formData.append("imageFile", imageInput.files[i]);
    // }
    
    // fetch("https://localhost:7239/api/v1/Product/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((json) => {
    //     console.log(json);
    //     setIsLoading(false);
    //     if (json.isSuccess === true) {
    //       window.location.href = "/#/product/index";
    //     } else {
    //       console.log(json.errors);
    //       addToast(Alert(json.errors));
    //     }
    //   });
  

    var model = {
        Name: document.getElementById("Name").value,
        Slug: document.getElementById("Slug").value,
        Description: document.getElementById("Description").value,
        Price: document.getElementById("Price").value,
        AvailableStock: document.getElementById("AvailableStock").value,
        RestockThreshold: document.getElementById("RestockThreshold").value,
        MaxStockThreshold: document.getElementById("MaxStockThreshold").value,
        Domain: document.getElementById("Domain").value,
        DomainType: document.getElementById("DomainType").value,
        ProgrammingLanguege: document.getElementById("ProgrammingLanguege").value,
        WebSiteType: document.getElementById("WebSiteType").value,
        Image: document.getElementById("Image").value
    };
    console.log(model);
    // Simple POST request with a JSON body using fetch
    fetch("https://localhost:7239/api/v1/Product", {
      method: "POST",
      body: JSON.stringify(model),
      headers: {Authorization: 'Bearer '+Cookies.get('token')},
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setIsLoading(false);
        if (json.isSuccess == true) {
          window.location.href = "/#/product/index";
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
            <CFormInput type="text" name="Name" id="Name" label="Name" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="text" name="Slug" id="Slug" label="Slug" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="text" name="Description" id="Description" label="Description" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="number" name="Price" id="Price" label="Price" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="number" name="AvailableStock" id="AvailableStock" label="AvailableStock" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="number" name="RestockThreshold" id="RestockThreshold" label="RestockThreshold" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="number" name="MaxStockThreshold" id="MaxStockThreshold" label="MaxStockThreshold" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="text" name="Domain" id="Domain" label="Domain" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="text" name="DomainType" id="DomainType" label="DomainType" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="text" name="ProgrammingLanguege" id="ProgrammingLanguege" label="ProgrammingLanguege" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="text" name="WebSiteType" id="WebSiteType" label="WebSiteType" />
          </CCol>
          <CCol md={6}>
            <CFormInput type="text" name="Image" id="Image" label="Image" />
          </CCol>
          {/* <CCol md={6}>
            <CFormInput type="file" name="Images" id="Images" label="Images" accept="image/*" multiple/>
          </CCol> */}
          <CCol xs={12}>
            <CButton color="primary" type="submit">Create</CButton>
            <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
          </CCol>
        </CForm>

      )}
    </>
  );
};


export default CreateUser