import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";
import { CSpinner, CCol, CForm, CFormInput } from "@coreui/react";

const Detail = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    headers: { Authorization: 'Bearer ' + Cookies.get('token') },
                    url: `https://localhost:7239/api/v1/Visitor/` + document.location.hash.replace("#/visitor/detail?v=", "")
                });
                setData(response.data.data);
            } catch (error) {
                console.error(error);
                navigate('/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="text-center">
                <CSpinner size="sm" variant="grow" style={{ marginTop: "25%", width: '4rem', height: '4rem' }} />
            </div>
        );
    }

    if (!data) {
        return <div>No data found.</div>;
    }

    return (
        <CForm className="row g-3">
            <CCol md={6}>
                <CFormInput type="text" value={data.ip} name="Ip" label="Ip" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.currentLink} name="CurrentLink" label="CurrentLink" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.referrerLink} name="ReferrerLink" label="ReferrerLink" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.method} name="Method" label="Method" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.protocol} name="protocol" label="protocol" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.physicalPath} name="PhysicalPath" label="PhysicalPath" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.time} name="Time" label="Time" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="number" value={data.visitCount} name="VisitCount" label="VisitCount" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.browser.family} name="BrowserFamily" label="BrowserFamily" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.browser.version} name="BrowserVersion" label="BrowserVersion" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.operationSystem.family} name="OperationSystemFamily" label="OperationSystemFamily" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.operationSystem.version} name="OperationSystemVersion" label="OperationSystemVersion" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.device.brand} name="DeviceBrand" label="DeviceBrand" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.device.family} name="DeviceFamily" label="DeviceFamily" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.device.model} name="DeviceModel" label="DeviceModel" disabled />
            </CCol>
            <CCol md={6}>
                <CFormInput type="text" value={data.device.isSpider} name="DeviceIsSpider" label="DeviceIsSpider" disabled />
            </CCol>
        </CForm>
    );
};

export default Detail;
