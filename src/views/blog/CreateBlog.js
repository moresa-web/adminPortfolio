import React, { useState, useRef, useEffect } from 'react';
import { CForm, CCol, CFormInput, CButton, CSpinner, CToaster } from "@coreui/react";
import Alert from "../../components/Alert";
import Cookies from "js-cookie";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateBlog = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, addToast] = useState(0);
    const toaster = useRef();
    const [tags, setTags] = useState([]);
    const [tableContents, setTableContents] = useState([]);
    const [value, setValue] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    const PostData = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const model = {
            name: document.getElementById("Name").value,
            image: document.getElementById("Image").value,
            data: value,
            url: document.getElementById("Slug").value,
            studyTime: document.getElementById("StudyTime").value,
            tags: tags,
            tableContents: tableContents
        };
        try {
            const response = await axios.post("https://localhost:7239/api/v1/Blog", model);
            const json = response.data;
            if (json.isSuccess) {
                window.location.href = "/#/blog/index";
            } else {
                console.log(json.errors);
                addToast(Alert(json.errors));
            }
        } catch (error) {
            console.error("Request failed:", error);
            addToast(Alert(error.message));
        } finally {
            setIsLoading(false);
        }
    };

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
                        <CFormInput type="text" name="Image" id="Image" label="Image" />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput type="text" name="Slug" id="Slug" label="Slug" />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            type="text"
                            placeholder="Table Contents (comma separated)"
                            value={tableContents.join(',')}
                            onChange={(e) => setTableContents(e.target.value.split(','))}
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput type="text" id="StudyTime" placeholder="Study Time" />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={tags.join(',')}
                            onChange={(e) => setTags(e.target.value.split(','))}
                        />
                    </CCol>
                    <CCol md={12}>
                        <div className="text-editor">
                            <ReactQuill theme="snow"
                                modules={modules}
                                formats={formats}
                                value={value} 
                                onChange={setValue}>
                            </ReactQuill>
                        </div>
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

export default CreateBlog;
