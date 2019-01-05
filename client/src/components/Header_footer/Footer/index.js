import React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCompass from "@fortawesome/fontawesome-free-solid/faCompass";
import faPhone from "@fortawesome/fontawesome-free-solid/faPhone";
import faClock from "@fortawesome/fontawesome-free-solid/faClock";
import faEnvelope from "@fortawesome/fontawesome-free-solid/faEnvelope";


const Footer = ( {data} ) => {
  return (
    data.siteData ?
    <footer className="bck_b_dark">
      <div className="container">
        <div className="logo">WAVES</div>

        <div className="wrapper">
          <div className="left">
            <h2>Contact Information</h2>

            <div className="business_nfo">
              {/*--------Address Tag--------*/}
              <div className="tag">
                <FontAwesomeIcon icon={faCompass} className="icon" />
                <div className="nfo">
                  <div>Address</div>
                  <div> {data.siteData[0].address} </div> 
                </div>
              </div>
              {/*------END Address Tag------*/}

              {/*---------Phone Tag---------*/}
              <div className="tag">
                <FontAwesomeIcon icon={faPhone} className="icon" />
                <div className="nfo">
                  <div>Phone</div>
                  <div>{data.siteData[0].phone}</div>
                </div>
              </div>
              {/*-------END Phone Tag-------*/}

              {/*---------Clock Tag---------*/}
              <div className="tag">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <div className="nfo">
                  <div>Hours</div>
                  <div>{data.siteData[0].hours}</div>
                </div>
              </div>
              {/*-------END Clock Tag-------*/}

              {/*---------Email Tag---------*/}
              <div className="tag">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <div className="nfo">
                  <div>Email</div>
                  <div>{data.siteData[0].email}</div>
                </div>
              </div>
              {/*-------END Email Tag-------*/}
            </div>
          </div>

          <div className="left"> 
            <h2>Be the first to know</h2>
            <div>
                <div>
                    Get the latest information on new releases or updates.
                </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
    :null
  );
};

export default Footer;
