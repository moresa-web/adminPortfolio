import { CToastBody, CToastClose, CToast } from "@coreui/react";

const  Alert = (errors) => {
  const errorMessages = [];

  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      errors[key].forEach((error) => {
        errorMessages.push(error);
      });
    }
  }

  return (
    <>
      {errorMessages.map((error, index) => (
        <CToast key={index} autohide={true} visible={true} color="primary" className="text-white align-items-center">
          <div className="d-flex">
            <CToastBody>{error}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      ))}
    </>
  );
};


export default Alert