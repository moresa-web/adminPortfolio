import React from 'react'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CTableBody, CButton, CSpinner } from '@coreui/react';
import axios from "axios";
import Cookies from "js-cookie";

const Brand = () => {

  const [brands, setBrands] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  if(loading)
  {
    axios({
      headers: { Authorization: 'Bearer ' + Cookies.get('token') },
      url: 'https://localhost:7239/api/v1/Product/Brand',
    })
    .then(function (response) {
      setBrands(response.data.data);
      setLoading(false);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  return (
    <>

      {!loading ? (
        <div style={{ overflowX: 'auto' }}>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {brands.map((object, i) => (
                <CTableRow key={object.id}>
                  <CTableHeaderCell scope="row">{object.id}</CTableHeaderCell>
                  <CTableDataCell>{object.brand}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      ) : (
        <div className="text-center">
          <CSpinner size="sm" variant="grow" style={{ marginTop: "25%", width: '4rem', height: '4rem' }} />
        </div>
      )}
    </>
  );
};

export default Brand
