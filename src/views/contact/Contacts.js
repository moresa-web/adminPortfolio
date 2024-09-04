import React from 'react'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CTableBody, CSpinner } from '@coreui/react';
import axios from "axios";
import Cookies from "js-cookie";
import Parser from "html-react-parser";

const Contacts = () => {

  const [contacts, setContacts] = React.useState([]);
  React.useEffect(() => {
    axios({
            method: 'GET',
            headers: {Authorization: 'Bearer '+Cookies.get('token')},
             url: 'https://localhost:7239/api/v1/Contact',
          })
        .then(function (response) {
            setContacts(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
            window.location.href = "/#/login";
          });
});
return (
    <>
    {contacts.length > 0 ? (
            <div style={{overflowX: 'auto'}}>
      <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Email</CTableHeaderCell>
          <CTableHeaderCell scope="col">PhoneNumber</CTableHeaderCell>
          <CTableHeaderCell scope="col">Text</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {contacts.map((object, i) => (
          <CTableRow key={object.id}>
            <CTableHeaderCell scope="row">{object.id}</CTableHeaderCell>
            <CTableDataCell>{object.name}</CTableDataCell>
            <CTableDataCell>{object.email}</CTableDataCell>            
            <CTableDataCell>{object.phoneNumber}</CTableDataCell>
            <CTableDataCell>{Parser(object.text)}</CTableDataCell>            
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

export default Contacts
