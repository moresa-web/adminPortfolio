import { CForm, CCol, CFormInput, CButton, CSpinner, CToaster } from "@coreui/react";
import { useState, useRef } from "react";
import Alert from "../../components/Alert";

const CreateBrand = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, addToast] = useState(0);
    const toaster = useRef();

    function PostData(e) {
        e.preventDefault();
        setIsLoading(true); // نمایش لودینگ


        // Simple POST request with a JSON body using fetch
        fetch("https://localhost:7239/api/v1/Product/Type", {
            method: "POST",
            body: JSON.stringify(document.getElementById("Type").value),
            headers: {Authorization: 'Bearer '+Cookies.get('token')},
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setIsLoading(false);
                if (json.isSuccess == true) {
                    window.location.href = "/#/category";
                }
                else {
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
                        <CFormInput type="text" name="Type" id="Type" label="Type" />
                    </CCol>
                    <CCol xs={12}>
                        <CButton color="primary" type="submit">Create</CButton>
                        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
                    </CCol>
                </CForm>

            )}
        </>
    );
};

export default CreateBrand