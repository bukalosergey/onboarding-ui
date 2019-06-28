import React from "react";
import "../../scss/spinner.scss";

/**
 * 
 * @param {{ showSpinner: boolean }} params
 */
function Spinner({ showSpinner }) {
    
    return (
        <div className={`spinner_container ${showSpinner ? "" : "hidden_spinner"}`}>
            <div className="spinner" />
        </div>
    )
}

export default Spinner;