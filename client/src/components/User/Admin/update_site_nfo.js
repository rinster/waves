import React, { Component } from "react";

import FormField from "../../utils/Form/formfield";
import {
  update,
  generateData,
  isFormValid,
  populateFields
} from "../../utils/Form/formActions";

import { connect } from "react-redux";
import { getSiteData, updateSiteData } from '../../../actions/site_actions';

class UpdateSiteNfo extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      address: {
        element: "input",
        value: "",
        config: {
          label: "Address",
          name: "address_input",
          type: "text",
          placeholder: "Enter street address"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showlabel: true
      },
      hours: {
        element: "input",
        value: "",
        config: {
          label: "Working Hours",
          name: "hours_input",
          type: "text",
          placeholder: "Enter hours of operation"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showlabel: true
      },
      phone: {
        element: "input",
        value: "",
        config: {
          label: "Phone Number",
          name: "phone_input",
          type: "text",
          placeholder: "Enter phone number"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showlabel: true
      },
      email: {
        element: "input",
        value: "",
        config: {
          label: "Shop Email",
          name: "email_input",
          type: "text",
          placeholder: "Enter email"
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showlabel: true
      }
    }
  };

  updateForm = element => {
    const newFormdata = update(element, this.state.formdata, "site_info");
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = generateData(this.state.formdata, "site_info");
    let formIsValid = isFormValid(this.state.formdata, "site_info");

    if (formIsValid) {
      //Dispatch to server and get response
      //console.log(dataToSubmit);
      this.props.dispatch(updateSiteData(dataToSubmit)).then(()=> {
        this.setState({
          formSuccess: true
        },()=> {
          setTimeout(()=>{
            this.setState({
              formSuccess: false
            })
          },2000)
        })
      });
    } else {
      this.setState({
        formError: true
      })
    }
  };

  componentDidMount(){
    //GET site data to prepopulate form fields
    this.props.dispatch(getSiteData()).then(()=> {
      //console.log(this.props.site.siteData[0]);
      const newformData = populateFields(this.state.formdata, this.props.site.siteData[0]);
      this.setState({
        formdata: newformData
      })
    })
  } 

  render() {
    return (
      <div>
        <form onSubmit={event => this.submitForm(event)}>
            <h1>Site Info</h1>

          {/* ------Address------ */}
          <FormField
            id={"address"}
            formdata={this.state.formdata.address}
            change={element => this.updateForm(element)}
          />

          {/* ------Hours------ */}
          <FormField
            id={"hours"}
            formdata={this.state.formdata.hours}
            change={element => this.updateForm(element)}
          />

          {/* ------Phone------ */}
          <FormField
            id={"phone"}
            formdata={this.state.formdata.phone}
            change={element => this.updateForm(element)}
          />

          {/* ------Email------ */}
          <FormField
            id={"email"}
            formdata={this.state.formdata.email}
            change={element => this.updateForm(element)}
          />
          
          {/* ------Submit Button/ErrorField/Success------ */}
          <div>
            {this.state.formSuccess ?
                <div className="form_success">Success</div>
            :null
            }
            {this.state.formError ? (
                <div className="error_label">Please check your data</div>
            ) : null}

            <button onClick={event => this.submitForm(event)}>
                Update Submit
            </button>
          </div>

        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    site: state.site
  };
};

export default connect(mapStateToProps)(UpdateSiteNfo);
