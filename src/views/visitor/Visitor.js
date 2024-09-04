import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CRow, CCol, CDropdownMenu, CDropdownItem, CDropdownToggle, CDropdown, CWidgetStatsA, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CTableBody, CSpinner, CPagination, CPaginationItem, CLink, CTooltip, CButton  } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilOptions, cilUser } from '@coreui/icons';
import { CChartLine } from '@coreui/react-chartjs';
import Cookies from 'js-cookie';

const Visitor = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [values, setValues] = useState([]);
  const [date, setDate] = useState("hour");
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  console.log(document.location.hash.replace("#/visitor", ""));

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        setLoading(true);
        await GetVisitors(1);
        await GetDataForChart("hour");
      } catch (error) {
        console.error(error);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Fetch data only once on mount

  const GetVisitors = async (page) => {
    try {
      const response = await axios({
        method: 'GET',
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
        url: `https://localhost:7239/api/v1/Visitor/${page}/5`
      });
      setVisitors(response.data.data);
    } catch (error) {
      console.error(error);
      navigate('/login', { replace: true });
    }
  };

  const GetDataForChart = async (date) => {
    setDate(date);
    try {
      const response = await axios({
        method: 'GET',
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
        url: `https://localhost:7239/api/v1/Visitor/ForChart/${date}`
      });
      setDisplays(response.data.data.display);
      setValues(response.data.data.value);
    } catch (error) {
      console.error(error);
      navigate('/login', { replace: true });
    }
  };

  const handlePageChange = (newIndex) => {
    setActiveIndex(newIndex);
    setLoading(true);
    GetVisitors(newIndex).finally(() => setLoading(false));
  };

  function shortenText(text, maxLength = 20) {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  }

  return (
    <>
      {loading ? (
        <div className="text-center">
          <CSpinner size="sm" variant="grow" style={{ marginTop: '25%', width: '4rem', height: '4rem' }} />
        </div>
      ) : (
        <>
          <CRow>
            <CCol sm={12}>
              <CWidgetStatsA
                className="mb-4"
                color="info"
                value={
                  <>
                    Visitor{' '}
                    <span className="fs-6 fw-normal">
                      ({values.reduce((a, b) => a + parseInt(b, 10), 0)} <CIcon icon={cilUser} />)
                    </span>
                  </>
                }
                title={'per ' + date}
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="p-0">
                      <CIcon icon={cilOptions} className="text-white" />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => GetDataForChart('minute')}>minute</CDropdownItem>
                      <CDropdownItem onClick={() => GetDataForChart('hour')}>hour</CDropdownItem>
                      <CDropdownItem onClick={() => GetDataForChart('day')}>day</CDropdownItem>
                      <CDropdownItem onClick={() => GetDataForChart('month')}>month</CDropdownItem>
                      <CDropdownItem onClick={() => GetDataForChart('year')}>year</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: displays,
                      datasets: [
                        {
                          label: 'Visitor',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: values,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>
          {visitors.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Ip</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Current Link</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Referrer Link</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Method</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Visit Count</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Visitor Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Detail</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {visitors.map((object, i) => (
                    <CTableRow key={i}>
                      <CTableHeaderCell scope="row">{object.ip}</CTableHeaderCell>
                      <CTableDataCell>
                        <CTooltip content={object.currentLink}>
                          <CLink>{shortenText(object.currentLink)}</CLink>
                        </CTooltip>
                      </CTableDataCell>
                      <CTableDataCell><a href={object.referrerLink} target='_blank' rel="noopener noreferrer">{object.referrerLink}</a></CTableDataCell>
                      <CTableDataCell>{object.method}</CTableDataCell>
                      <CTableDataCell>{object.time}</CTableDataCell>
                      <CTableDataCell>{object.visitCount}</CTableDataCell>
                      <CTableDataCell>{object.visitorId}</CTableDataCell>
                      <CTableDataCell>
                        <CButton onClick={() => navigate('/visitor/detail?v='+object.visitorId, { replace: true })} color="primary">Detail</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              {visitors[0].count / 5 > 0 ? (
                <CPagination align="center" aria-label="Page navigation example">
                  <CPaginationItem onClick={() => handlePageChange(activeIndex - 1)} aria-label="Previous" disabled={activeIndex === 1}>
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {[...Array(Math.ceil(visitors[0].count / 5)).keys()].map((index) => (
                    <CPaginationItem onClick={() => handlePageChange(index + 1)} key={index + 1} active={index + 1 === activeIndex}>{index + 1}</CPaginationItem>
                  ))}
                  <CPaginationItem disabled={activeIndex === visitors[0].count} onClick={() => handlePageChange(activeIndex + 1)} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </CPaginationItem>
                </CPagination>
              ) : null}
            </div>
          ) : (
            <div className="text-center">
              <CSpinner size="sm" variant="grow" style={{ marginTop: "25%", width: '4rem', height: '4rem' }} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Visitor;
