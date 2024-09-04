import React, { useEffect, useState } from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CTableBody, CSpinner, CPagination, CPaginationItem } from '@coreui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Default image URL
  const defaultImage = 'https://via.placeholder.com/150'; 

  useEffect(() => {
    const fetchUsers = async (page) => {
      setLoading(true);
      try {
        const response = await axios({
          method: 'GET',
          headers: { Authorization: 'Bearer ' + Cookies.get('token') },
          url: `https://localhost:7239/api/v1/User/${page}/5`, // Adjust pageSize as needed
        });
        setUsers(response.data.data.users);  // Assuming the structure is correct
        setTotalPages(Math.ceil(response.data.data.count / 5)); // Calculate totalPages
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/login', { replace: true });
        } else {
          navigate('/500', { replace: true });
        }
      } finally {
        setLoading(false);  // Ensure loading is set to false after fetch
      }
    };

    fetchUsers(currentPage);
  }, [navigate, currentPage]);  // Include currentPage to refetch on page change

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner size="sm" variant="grow" style={{ marginTop: '25%', width: '4rem', height: '4rem' }} />
      </div>
    );
  }

  return (
    <>
      {users.length > 0 ? (
        <>
          <div style={{ overflowX: 'auto' }}>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Full Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Phone Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Roles</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableHeaderCell scope="row">{user.id}</CTableHeaderCell>
                    <CTableDataCell>
                      <div className="avatar avatar-md">
                        <a href={user.images} target='_blank' rel="noopener noreferrer">
                          <img
                            src={user.images ?? defaultImage}
                            alt={user.fullName}
                            className="avatar-img"
                            onError={(e) => e.target.src = defaultImage}  // Fallback to default image
                          />
                        </a>
                        <span className="avatar-status bg-success"></span>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{user.fullName}</CTableDataCell>
                    <CTableDataCell>{user.phoneNumber}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>
                      {user.roles.map((role, index) => (
                        <div className="small" key={index}>{role}</div>
                      ))}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <CPagination>
              <CPaginationItem
                aria-label="Previous"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {[...Array(totalPages).keys()].map((index) => (
                <CPaginationItem
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                aria-label="Next"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </div>
        </>
      ) : (
        <div>No users found.</div>
      )}
    </>
  );
};

export default User;
