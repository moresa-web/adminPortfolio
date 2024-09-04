import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import axios from 'axios';

const Product = () => {
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios({
          headers: { 'Content-Type': 'application/json' },
          url: `https://localhost:7239/api/v1/Product/GetProducts/${currentPage}/${pageSize}`,
          method: 'GET',
        });

        setProducts(response.data.data); // Assuming the structure is correct
        setTotalPages(Math.ceil(response.data.message[0] / pageSize)); // Assuming totalCount is provided
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]); // Refetch data when currentPage changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return (
      <div className="text-center">
        <CSpinner
          size="sm"
          variant="grow"
          style={{ marginTop: '25%', width: '4rem', height: '4rem' }}
        />
      </div>
    );
  }

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Image</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Slug</CTableHeaderCell>
              <CTableHeaderCell scope="col">Price</CTableHeaderCell>
              <CTableHeaderCell scope="col">AvailableStock</CTableHeaderCell>
              <CTableHeaderCell scope="col">RestockThreshold</CTableHeaderCell>
              <CTableHeaderCell scope="col">MaxStockThreshold</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {products.map((product) => (
              <CTableRow key={product.id}>
                <CTableHeaderCell scope="row">{product.id}</CTableHeaderCell>
                <CTableDataCell>
                  <div className="avatar avatar-md">
                    <a href={product.images} target="_blank" rel="noopener noreferrer">
                      <img src={product.images} className="avatar-img" alt={product.name} />
                    </a>
                    <span className="avatar-status bg-success"></span>
                  </div>
                </CTableDataCell>
                <CTableDataCell>{product.name}</CTableDataCell>
                <CTableDataCell>{product.slug}</CTableDataCell>
                <CTableDataCell>{product.price}</CTableDataCell>
                <CTableDataCell>{product.availableStock}</CTableDataCell>
                <CTableDataCell>{product.restockThreshold}</CTableDataCell>
                <CTableDataCell>{product.maxStockThreshold}</CTableDataCell>
                <CTableDataCell>{product.description}</CTableDataCell>
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

export default Product;
