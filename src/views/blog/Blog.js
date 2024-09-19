import React from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CSpinner,
  CPagination,
  CPaginationItem,
  CButton
} from '@coreui/react';
import axios from "axios";
import Cookies from "js-cookie";

const Brand = () => {

  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [error, setError] = React.useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const pageSize = 10;

  React.useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const response = await axios({
          headers: { Authorization: 'Bearer ' + Cookies.get('token') },
          url: `https://localhost:7239/api/v1/Blog/${currentPage}/${pageSize}`,
          method: 'GET',
        });
        if (response.data.isSuccess === false)
          setError(response.data.message[0]);
        setPosts(response.data.data);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, [currentPage]);

  const deletePost = async (id) => {
    setLoading(true);
    try {
      const response = await axios({
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
        url: `https://localhost:7239/api/v1/Blog/${id}`,
        method: 'DELETE',
      });
      if (response.data.isSuccess === false)
        setError(response.data.message[0]);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
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
                <CTableHeaderCell scope="col">Url</CTableHeaderCell>
                <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                <CTableHeaderCell scope="col">View</CTableHeaderCell>
                <CTableHeaderCell scope="col">StudyTime</CTableHeaderCell>
                <CTableHeaderCell scope="col">InsertTime</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tags</CTableHeaderCell>
                <CTableHeaderCell scope="col">TableContents</CTableHeaderCell>
                <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {posts.map((object, i) => (
                <CTableRow key={i}>
                  <CTableHeaderCell scope="row">{object.id}</CTableHeaderCell>
                  <CTableDataCell>{object.name}</CTableDataCell>
                  <CTableDataCell>{object.url}</CTableDataCell>
                  <CTableDataCell>{object.image}</CTableDataCell>
                  <CTableDataCell>{object.data}</CTableDataCell>
                  <CTableDataCell>{object.view}</CTableDataCell>
                  <CTableDataCell>{object.studyTime}</CTableDataCell>
                  <CTableDataCell>{object.insertTime}</CTableDataCell>
                  <CTableDataCell>
                    {object.tags?.map((tag, index) => (
                      tag.data + ", "
                    ))}
                  </CTableDataCell>
                  <CTableDataCell>
                    {object.tableContents?.map((tableContent, index) => (
                      tableContent + ", "
                    ))}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton onClick={() => deletePost(object.id)} color="danger">Delete</CButton>
                  </CTableDataCell>
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
      <div className="d-flex justify-content-center mt-3">
        <CPagination>
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &laquo;
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
            &raquo;
          </CPaginationItem>
        </CPagination>
      </div>
    </>
  );
};

export default Brand
