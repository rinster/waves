// These functions are triggered when action is made on the forms

export const validate = (element, formdata=[]) => {
    let error  = [true, '']; //Default error if there is no error

    //Checks if input is an email
    if(element.validation.email){
        const valid = /\S+@\S+\.\S+/.test(element.value)
        const message = `${!valid ? 'Must be a valid email':''}`;
        error = !valid ? [valid,message] : error;
    }

    //Checks on register if Password === Confirm Password
    if(element.validation.confirm){
        const valid = element.value.trim() === formdata[element.validation.confirm].value;
        const message = `${!valid ? 'Passwords do not match':''}`;
        error = !valid ? [valid,message] : error;
    }

    //Checks if user left input field empty
    if(element.validation.required) {
        const valid = element.value.trim() !== ''; //Boolean checking if it's empty or not
        const message = `${!valid ? 'This field is required':''}`; //if its not valid, return the message, else return nothing
        error = !valid ? [valid,message] : error //If not valid, send the message, else send default message of no error
    }

    return error //return error or not
}

//Updating Form as the user types in an input
export const update = (element, formdata, formName) => {
    const newFormdata = {
        ...formdata
    }  
    const newElement = {
        ...newFormdata[element.id]
    }
    //This allows us to mutate the new element's value
    newElement.value = element.event.target.value;

    //Check if the information is valid --- Validation
    //This returns a true or false/message depending on the validation
    if(element.blur){ 
        //validata returns an array
        let validData = validate(newElement,formdata);
        newElement.valid = validData[0]; //Get value if true or false
        newElement.validationMessage = validData[1]; //Get validation/error msg
    }
    newElement.touched = element.blur; //set the boolean to same as elem.blur 
    newFormdata[element.id] = newElement;

    return newFormdata;
}

//Grabbing submitted data to send to server
export const generateData = (formdata, formName) => {
    let dataToSubmit = {};  
    for(let key in formdata) {
        if(key !== 'confirmPassword') { //This line excludes confirm password data from being submitted
            dataToSubmit[key] = formdata[key].value;
        } 
    }
    return dataToSubmit;
}

export const isFormValid = (formdata, formName) => {
//loop throught the state to see if they have the key words
    let formIsValid = true;

    for(let key in formdata){
        formIsValid = formdata[key].valid && formIsValid
    }
    return formIsValid;
}

//Populate the select fields in add_product.js
export const populateOptionFields = (formdata, arrayData =[],field) => {
    const newArray = [];
    const newFormdata = {...formdata};

    arrayData.forEach(item=>{
        newArray.push({key:item._id, value:item.name});
    });

    newFormdata[field].config.options = newArray;
    return newFormdata;
}

//Reset fields on on success in add_product.js
export const resetFields = (formdata, formName) => {
    const newFormdata = {...formdata};

    for(let key in newFormdata) {
        if(key === 'images'){
            newFormdata[key].value = [];
        } else {
            newFormdata[key].value = '';
        }
        newFormdata[key].valid = false;
        newFormdata[key].touched = false;
        newFormdata[key].validationMessage = '';
    }

    return newFormdata
}

export const populateFields = (formData, fields) => {
     for (let key in formData){
         formData[key].value = fields[key];
         formData[key].valid = true;
         formData[key].touched = true;
         formData[key].validationMessage = '';
     }

     return formData;
}