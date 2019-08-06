const nameInitialState = {
    action: ''
}
const treatmentMarkingData = (state = nameInitialState, action) => {
    switch (action.type) {
      case "VIEW_TREATMENT_MARKINGS":
      return {
        ...state,
        data:action.payload,
        action:'VIEW_TREATMENT_MARKINGS'
      }

      default:
        return state
    }
}
export default treatmentMarkingData;
