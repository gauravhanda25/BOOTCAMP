const serviceInitialState = {

  action: ''

}


const ServiceReducer = (state = serviceInitialState, action) => {
  switch (action.type) {
      case "APPOINTMENT_SURVEY_UPDATE":
        return {
          ...state,
          data: action.payload,
          action:'APPOINTMENT_SURVEY_UPDATE'
        }        
    default:
      return state
  }
}

export default ServiceReducer;
