import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getTemplateData, saveTemplateData, deleteTemplate, updateSortOrder } from '../../../../Actions/Settings/settingsActions.js';
import axios from 'axios';
import LogicJump from './LogicJump.js';

const languageData = JSON.parse(localStorage.getItem('languageData'));

const hasDuplicates = (arra1) =>  {
    const object = {};
    const result = [];

    arra1.forEach(item => {
      if(!object[item])
          object[item] = 0;
        object[item] += 1;
    })

    for (const prop in object) {
       if(object[prop] >= 2) {
           result.push(prop);
       }
    }

    return result;

}

const defaultItem = {
  id : 1,
  displayOrder : 1,
  boxtype : 'Textbox',
  name : '',
  placeholder :  (languageData) ? ((languageData.global != undefined && languageData.global.global_type_question_here != undefined) ? languageData.global.global_type_question_here : '') : '',
  required : 0,
  description : 0,
  descriptionText : '',
  why_choose : 0,
  logicJumpsAns : [],
  logicJumpsQue : [],
  logicJumpsElse : [],
  options : [],
  currentlyActive : true
}

const boxTypeArr = {Textbox: 'Textbox', yesno : 'Yes/No', single: 'Single Choice', multiple: 'Multiple Choice', scale: 'Opinion Scale', file: 'File Upload'}

const getKeyByValue = (value) => {
  return Object.keys(boxTypeArr).find(key => boxTypeArr[key] === value);
}

class CreateEditTemplate extends Component {
    constructor(props) {
        super(props);
        var alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','BB','CC','DD','EE','FF','GG','HH','II','JJ','KK','LL','MM','NN','OO','PP','QQ','RR','SS','TT','UU','VV','WW','XX','YY','ZZ'];
        let languageData = JSON.parse(localStorage.getItem('languageData'));

        let stateVal = {}
        let questionsError = []
        let answersError = []
        questionsError[1] = [false];
        answersError[1] = [false];
        stateVal.alpha = alpha;
        stateVal.upDown = false;
        stateVal.questionsList = [defaultItem];
        stateVal.title = "Untitled Procedure Template";
        stateVal.activeBoxType = 'Textbox';
        stateVal.activeBoxTypeLabel = 'Textbox';
        stateVal.displaySelection = false;
        stateVal.activeBox = defaultItem;
        stateVal.viewActiveBox = defaultItem;
        stateVal.activeBoxDesc = false;
        stateVal.activeBoxRequired = false;
        stateVal.mainOptions = [{id : 1, name: ""}];
        stateVal["questions-1"] = [];
        stateVal["answers-1"] = [];
        stateVal["logicElse-1"] = false;
        stateVal.showModal = false;
        stateVal.fullScreen = false;
        stateVal.sideMenu = false;
        stateVal.appendHTML = false;
        stateVal.boxTypeArr = boxTypeArr;
        stateVal.templateData = [];
        stateVal.deletedQue = [];
        stateVal.questionsError = questionsError;
        stateVal.answersError = answersError;
        stateVal.userChanged = false;
        stateVal.titleError = false;
        stateVal.globalLang = languageData.global;
        this.state = stateVal
    }

    componentDidMount = () => {
      window.onscroll = () => {
        return false;
      }
      let templateId = (this.props.match.params.id) ? this.props.match.params.id : 0;
      if(templateId) {
        this.showLoaderFunc()
        this.setState({templateId: templateId})
        this.props.getTemplateData(templateId);
      }
    }

    reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    getItemStyle = (isDragging, draggableStyle) => ({
      userSelect: "none",
      background: isDragging ? "#f7fbfd" : "ffffff",
      ...draggableStyle
    });

    reOrderList = list => {
      let qList = JSON.parse(JSON.stringify(this.state.questionsList));
      list.map((obj, idx) => {
        let question = this.state.questionsList.find(y => (y.id == obj));
        question.displayOrder = idx + 1;
        qList[idx] = question;
      })
      this.setState({questionsList:qList, userChanged: true})
    };

    // showLoader function
    showLoaderFunc = ()  => {
      this.setState({showLoader: true});
      localStorage.setItem("showLoader", false);
    }

    // handle changes from child component
    handleChildChange = (name, value) => {
      let nameArr = name.split('-');
      let actualName = nameArr[0];
      let qid = nameArr[1]
      let returnState = {}
      let activeBox = this.getActiveBox();
      if(value) {
        if( actualName == 'questions' || actualName == 'answers') {
          let oldVal = this.state[actualName+'-'+qid];
          oldVal[nameArr[2]] = value;
          returnState[actualName+'-'+qid] = oldVal;
          if(actualName == 'answers') {
            this.state.questionsList[activeBox.index].logicJumpsQue = oldVal;
          } else {
            this.state.questionsList[activeBox.index].logicJumpsAns = oldVal;
          }
        } else {
          let oldVal = this.state['else-'+qid];
          oldVal = value;
          returnState['else-'+qid] = oldVal;
          this.state.questionsList[activeBox.index].logicJumpsElse = oldVal;
        }
        returnState.questionsList = this.state.questionsList;
      }

      this.setState(returnState);
    }

    // opens question type dropdown
    openBoxTypeDropDown = event => {
      this.setState({displaySelection : !this.state.displaySelection})
    }

    // toggle full screen mode
    toggleFullScreen = event => {
      this.setState({fullScreen : !this.state.fullScreen})
    }

    // toggle side menu
    toggleSideMenu = event => {
      this.setState({sideMenu : !this.state.sideMenu})
    }

    // get currently active question
    getActiveBox = () => {
      let selection = this.state.questionsList.find(y => (y.currentlyActive));
      let index = this.state.questionsList.findIndex(y => (y.currentlyActive));
      return {obj : selection, index : index}
    }

    // get all questions name with ids
    getAllQuestionsNameWithId = () => {
      let options = []
      this.state.questionsList.map((obj, idx) => {
        if(obj.name.trim() !== "") {
          options.push({id: obj.id, name: obj.name});
        }
      });
      return options;
    }

    // change question type
    changeBoxType = event => {
      let type = event.target.dataset.type;
      let activeBox = this.getActiveBox();
      let returnState = {}
      let boxTypeArr = this.state.boxTypeArr;
      activeBox.obj.logicJumpsQue = [""];
      activeBox.obj.logicJumpsAns = [""];
      activeBox.obj.logicJumpsElse = "";
      activeBox.obj.boxtype = type;

      if(type == 'single' || type == 'multiple') {
        activeBox.obj.options = [""];
      }

      if(type == 'single' || type == 'scale' || type == 'yesno') {
        returnState['questions-'+activeBox.obj.id] = [""];
        returnState['answers-'+activeBox.obj.id] = [""];
        returnState['else-'+activeBox.obj.id] = "";
        if(type == 'yesno') {
          activeBox.obj.options = ["Yes", "No"];
        }
      }

      this.state.questionsList[activeBox.index] = activeBox.obj;
      returnState.questionsList = this.state.questionsList;
      returnState.activeBoxType = type;
      returnState.activeBoxTypeLabel = boxTypeArr[type];
      this.setState(returnState);
      this.openBoxTypeDropDown();
    }

    // show/hide Logic Jump Box
    toggleLogicJump = event => {
      event.preventDefault();
      event.stopPropagation();
      let qid = event.currentTarget.dataset.qid;
      let returnState = {};
      returnState['showLogicJump-'+qid] = !((this.state['showLogicJump-'+qid]) ? true : false);
      this.setState(returnState);
    }

    toggleLogicJump1 = event => {
      event.preventDefault();
      event.stopPropagation();
      let qid = event.currentTarget.dataset.qid;
      let returnState = {};
      returnState['showLogicJump-'+qid] = !((this.state['showLogicJump-'+qid]) ? true : false);
      this.setState({upDown : !this.state.upDown})
      this.setState(returnState);
    }

    // copy question
    copyBox = event => {
      let activeBox = this.getActiveBox();
      let returnState = {}
      let clone = JSON.parse(JSON.stringify(activeBox.obj));
      let id = this.state.questionsList.length+1;
      clone.displayOrder = this.state.questionsList.length+1;
      /*clone.name = activeBox.obj.name;
      clone.required = activeBox.obj.required;
      clone.description = activeBox.obj.description;
      clone.descriptionText = activeBox.obj.descriptionText;*/
      clone.id = id;
      if(clone.edit_id)
        delete clone['edit_id'];

      if((clone.boxtype == 'single' || clone.boxtype == 'multiple') && clone.options.length) {
        clone.options.map((obj, idx) => {
          returnState['choice-'+id+"-"+idx] = obj
        })
      }

      this.state.questionsList.push(clone)
      this.state.questionsList[activeBox.index].currentlyActive = false;
      returnState.questionsList= this.state.questionsList;
      returnState['name-'+id] = activeBox.obj.name;
      returnState['description-'+id] = activeBox.obj.description;
      returnState['descriptionText-'+id] = activeBox.obj.descriptionText;
      returnState['required-'+id] = activeBox.obj.required;
      returnState['questions-'+id] = [];
      returnState['answers-'+id] = [];
      returnState['else-'+id] = "";
      returnState.questionsError = this.state.questionsError
      returnState.answersError = this.state.answersError
      returnState.questionsError[id] = [false];
      returnState.answersError[id] = [false];
      returnState["logicElse-"+id] = false;
      this.setState(returnState);
      let options = this.getAllQuestionsNameWithId();
      this.setState({mainOptions: options});
    }

    deleteBox = event => {
      if(this.state.questionsList.length > 1) {
        let questionsList = this.state.questionsList;
        let activeBox = this.getActiveBox();
        let index = parseInt(activeBox.index);
        let deletedQue = this.state.deletedQue;
        if(this.state.templateId) {
          deletedQue.push(parseInt(activeBox.obj.id));
        }

        questionsList.splice(activeBox.index, 1);
        let tmpIndex = parseInt(questionsList.length -1)
        questionsList[tmpIndex].currentlyActive = true;
        let viewActiveBox = questionsList[tmpIndex]
        this.setState({questionsList: questionsList, deletedQue: deletedQue, viewActiveBox: viewActiveBox});
        let options = this.getAllQuestionsNameWithId();
        this.setState({mainOptions: options});
      }
    }

    addQuestion = event => {
      let newQuestion = JSON.parse(JSON.stringify(defaultItem));
      newQuestion.displayOrder = this.state.questionsList.length+1;
      newQuestion.id = this.state.questionsList.length+1;
      newQuestion.currentlyActive = true;

      this.state.questionsList.push(newQuestion)
      let activeBox = this.getActiveBox();
      this.state.questionsList[activeBox.index].currentlyActive = false;
      this.setState({questionsList: this.state.questionsList});
      let options = this.getAllQuestionsNameWithId();
      this.setState({mainOptions: options});
    }

    // add addLogicQuestion
    addLogicQuestion = event => {
      event.preventDefault();
      let activeBox = this.getActiveBox();
      let id = activeBox.obj.id
      let questions = this.state["questions-"+id];
      questions.push(0);
      let returnState = {};
      returnState["questions-"+id] = questions;
      returnState.appendHTML = true;
      this.setState(returnState);
      this.forceUpdate();
    }

    // add addLogicQuestion
    deleteLogicJump = (lid, event) => {
      let activeBox = this.getActiveBox();
      let id = activeBox.obj.id
      let questions = this.state["questions-"+id];
      if(questions.length == 1) {
        return false;
      }
      questions.splice(lid, 1);
      let returnState = {};
      returnState["questions-"+id] = questions;
      this.setState(returnState);
    }


    // make question box active
    makeActiveBox = (qid, event) => {
      event.preventDefault();
      event.stopPropagation();
      let id = qid;//event.target.dataset.id;
      let activeBox = this.getActiveBox();
      this.state.questionsList[activeBox.index].currentlyActive = false;
      this.state.questionsList[id].currentlyActive = true;
      this.setState({questionsList: this.state.questionsList, activeBox: this.state.questionsList[id], viewActiveBox: this.state.questionsList[id], activeBoxRequired: this.state.questionsList[id].required, activeBoxDesc: this.state.questionsList[id].description, userChanged: true});
      if(this.state.sideMenu){
        this.toggleSideMenu()
      }
      return false;
    }

    // make question box active
    setScaleVal = (event) => {
      let id = event.target.dataset.id;
      let qid = this.state.viewActiveBox.id
      let returnState = {}
      returnState['selectedAnswers-'+qid] = id;
      this.setState(returnState);
    }

    // go to next question
    goToNext = (event) => {
      let activeBox = this.getActiveBox();
      let activeId = activeBox.index;
      let activeData = this.state.questionsList[activeBox.index];
      let qListLength = this.state.questionsList.length;
      let currentViewActiveBox = this.state.viewActiveBox;
      let selectedAnswer = this.state['selectedAnswers-'+currentViewActiveBox.id];
      let returnState = {};

      if((currentViewActiveBox.boxtype == 'single' || currentViewActiveBox.boxtype == 'scale' ||currentViewActiveBox.boxtype == 'yesno') && selectedAnswer == undefined) {
        return false;
      }

      if(currentViewActiveBox.boxtype == 'yesno' || currentViewActiveBox.boxtype == 'single' || currentViewActiveBox.boxtype == 'scale') {
        if(currentViewActiveBox.logicJumpsQue.length) {
          let index = currentViewActiveBox.logicJumpsAns.indexOf(parseInt(selectedAnswer));
          if(index > -1) {
            let nextQ = parseInt(currentViewActiveBox.logicJumpsQue[index]);
            let qIndex = this.state.questionsList.findIndex(y => (y.id == nextQ));
            returnState.viewActiveBox = this.state.questionsList[qIndex];
          } else {
            let index = currentViewActiveBox.logicJumpsElse;
            let qIndex = this.state.questionsList.findIndex(y => (y.id == index));
            returnState.viewActiveBox = this.state.questionsList[qIndex];
          }
        }
      } else {
        if(qListLength == currentViewActiveBox.id) {
          returnState.showSubmitBtn = true;
        } else {
          let qIndex = this.state.questionsList.findIndex(y => (y.id == parseInt(currentViewActiveBox.id)));
          returnState.viewActiveBox = this.state.questionsList[qIndex+1];
        }
      }

      this.setState(returnState);
    }

    // go to next question
    submitView = (event) => {
      for(let x in this.state){
        if(x.startsWith('selectedAnswers-')) {
          delete this.state[x];
        }
      }
      this.state.viewActiveBox = this.state.questionsList[0];

      let returnState = this.state;
      this.setState(returnState);
    }

    // handles changes from user in options in question type single & multiple
    handleKeyUp = event => {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      let name = event.target.name;
      let nameArr = name.split('-');
      let choiceId = event.currentTarget.dataset.choiceid;
      let returnState = {}
      let activeBox = this.getActiveBox();
      let options = activeBox.obj.options;


      /*for(let x in this.state){
        if(x.startsWith('choice-'+nameArr[1])) {
          options.push(this.state[x])
          delete this.state[x];
        }
      }*/

      if(value != '') {
        options[choiceId] = value;
      }

      options = options.filter(function (el) {
        return el != "";
      });

      // adds new choice
      if (event.keyCode == 13 || event == 13) {
        options.push("");
      }

      // removes choice
      if (event.keyCode == 8 || event == 8  ) {
        if(value == "" && options.length > 0) {
           options.splice(choiceId, 1);
           document.getElementById('choice-'+nameArr[1]+'-'+(activeBox.obj.options.pop()));
           document.getElementById('choice-'+nameArr[1]+'-'+(activeBox.obj.options.length-1)).focus();
           returnState['choice-'+nameArr[1]+'-'+activeBox.obj.id] = activeBox.obj.options[choiceId]
        }
      }

      options.map((obj, idx) => {
        if(obj != "") {
          returnState['choice-'+nameArr[1]+'-'+idx] = obj
          returnState['choiceError-'+nameArr[1]+'-'+idx] = false
        }
      })

      //activeBox.obj.options = options;
      this.state.questionsList[activeBox.index].options = options
      returnState.questionsList = this.state.questionsList;
      if(value.trim() != '') {
        returnState[name] = value;
      }
      this.setState(returnState);
      //document.getElementById('choice-'+nameArr[1]+'-'+(activeBox.obj.options.length-1)).focus();
    }

    handleFileChange = event => {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      let name = event.target.name;
      let returnState = {}
      let id = this.state.viewActiveBox.id;
      let selectedFile = document.getElementById('input-file').files[0];
      var reader = new FileReader();
      reader.onload = function(loadedEvent) {
        var image = document.getElementById("theImage");
        image.setAttribute("src", loadedEvent.target.result);
      }
      this.setState(returnState);
      reader.readAsDataURL(selectedFile);
    }

    // handles changes from user in form inputs
    handleInputChange = event => {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      let name = event.target.name;
      let activeBox = this.getActiveBox();
      let returnState = {}
      let flag = true;
      if(name == 'activeBoxDesc') {
        this.state.questionsList[activeBox.index].description = value;
        returnState.questionsList = this.state.questionsList
      }
      if(name == 'activeBoxRequired') {
        this.state.questionsList[activeBox.index].required = value;
        returnState.questionsList = this.state.questionsList
      }
      if(name == 'activeBoxComments') {
        this.state.questionsList[activeBox.index].why_choose = value;
        returnState.questionsList = this.state.questionsList
      }

      if(name.startsWith('description-')) {
        this.state.questionsList[activeBox.index].descriptionText = value;
        returnState.questionsList = this.state.questionsList;
      }

      if(name.startsWith('name-')) {
        this.state.questionsList[activeBox.index].name = value;
        returnState.questionsList = this.state.questionsList
        let optionsArr = this.state.mainOptions;
        let nameArr = name.split("-");
        let qid = parseInt(nameArr[1]);
        let selection = optionsArr.findIndex(y => (y.id == qid))
        if(selection > -1) {
          optionsArr[selection].name = value;
        } else {
          optionsArr.push({id: qid, name: value})
        }
        //let options = this.getAllQuestionsNameWithId();
        //let selection = options.find(y => (y.id == nameArr[1]));
        //let selIndex = options.findIndex(y => (y.id == nameArr[1]));
        /*if(selection) {
          selection.name = value;
          options[selIndex] = selection
        } else {
          options.push({id: nameArr[1], name: value})
        }*/
        returnState.mainOptions = optionsArr;
      }

      if(name.startsWith('choice-')) {
        let nameArr = name.split('-');
        if(activeBox.obj.options.length == 1 && value.trim() == "") {
          flag = false
        }
      }

      returnState.activeBox = this.state.questionsList[activeBox.index];
      if(!name.startsWith('selectedAnswers')) {
        returnState.viewActiveBox = this.state.questionsList[activeBox.index];
      }

      if(flag)
        returnState[name] = value;

      returnState.userChanged = true;
      this.setState(returnState);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if(nextProps.showLoader != undefined && nextProps.showLoader == false) {
          return {showLoader : false};
       }
      let returnState = {};
     if(nextProps.savedTemplateData != undefined && nextProps.savedTemplateData == true) {
      if(localStorage.getItem("showLoader") == "false") {
          toast.success(nextProps.message, {onClose : () => {
              nextProps.history.push('/settings/procedure-templates');
          }});
        }
      }

      if(nextProps.deleteTemplateData != undefined && nextProps.deleteTemplateData == true) {
        if(localStorage.getItem("showLoader") == "false") {
          toast.success(nextProps.message, {onClose : () => {
              nextProps.history.push('/settings/procedure-templates');
          }});
        }
      }

      if (nextProps.templateData != undefined && nextProps.templateData != prevState.templateData && !prevState.userChanged) {
        if(localStorage.getItem("showLoader") == "false") {
          let qList = nextProps.templateData.data;
          if(qList.length) {
            returnState['mainOptions'] = [];
            let questionsError = []
            let answersError = []
            qList.map((obj, idx) => {
              let bType = getKeyByValue(obj.boxtype)
              obj.boxtype = bType;
              obj.currentlyActive = false;
              obj.required = (obj.required) ? true : false;
              obj.description = (obj.description) ? true : false;
              qList[idx] = obj;
              returnState["name-"+obj.id] = obj.name;
              returnState["description-"+obj.id] = obj.descriptionText;
              returnState['answers-'+obj.id] = (obj.logicJumpsQue) ? obj.logicJumpsQue : [];
              returnState['questions-'+obj.id] = (obj.logicJumpsAns.length) ? obj.logicJumpsAns : [""];
              returnState['else-'+obj.id] = (obj.logicJumpsElse) ? obj.logicJumpsElse : "";
              returnState.mainOptions.push({id: obj.id, name: obj.name})
              questionsError[obj.id] = [false]

              answersError[obj.id] = [false]
              //returnState["else-"+obj.edit_id] = false;
              if(obj.options && obj.options.length) {
                obj.options.map((objInner ,idxInner) => {
                  returnState["choice-"+obj.id+"-"+idxInner] = objInner;
                })
              }
            })
            returnState.questionsError = questionsError;
            returnState.answersError = answersError;
            qList[0].currentlyActive = true;
            returnState.activeBox = qList[0];
            returnState.viewActiveBox = qList[0];
            returnState.activeBoxRequired = (qList[0].required) ? true : false;
            returnState.activeBoxDesc = (qList[0].description) ? true : false;
          }
          returnState.showLoader = false;
          returnState.questionsList = qList;
          returnState.title = nextProps.templateData.title;
        }
      }
      if(nextProps.showLoader != undefined && nextProps.showLoader == false) {
          if(localStorage.getItem("showLoader") == "false") {
            returnState.showLoader = false;
            return returnState;
          }
       }
      return returnState;
    }

    showLoaderFunc = ()  => {
      this.setState({showLoader: true});
      localStorage.setItem("showLoader", false);
    }

    saveTemplate = () => {
      this.setState({titleError: false,  userChanged: true})

      if(this.state.title == undefined || this.state.title == '') {
        this.setState({titleError: true})
        return false
      }

      let formData = {},
      error = false,
      errorObj = {};
      if(this.state.templateId) {
        formData.ptid = this.state.templateId;
        formData.deletedQue = []
      }

      let qList = JSON.parse(JSON.stringify(this.state.questionsList));
      qList.map((obj, idx) => {
        let returnState = {}
        if(obj.boxtype) {
          obj.boxtype = boxTypeArr[obj.boxtype];
          qList[idx] = obj;
        }

        // check question has duplicate options
        if(obj.options.length) {
          let x = hasDuplicates(obj.options);
          if(x.length != 0) {
            errorObj.hasDuplicates = true;
            error = true;
          }
        }

        // check if any logic jump is unanswered
        obj.logicJumpsAns = obj.logicJumpsAns.filter(function (el) {
          if(el == 0) {return true} else if(el != "") { return true}
        });
        obj.logicJumpsQue = obj.logicJumpsQue.filter(function (el) {
          return el != "";
        });
        if(obj.logicJumpsAns.length > obj.logicJumpsQue.length) {
          obj.logicJumpsAns.map((objInner, idxInner) => {
            errorObj.questionsError = this.state.questionsError
            if(!obj.logicJumpsQue[idxInner]) {
              errorObj.questionsError[obj.id][idxInner] = true
              //this.setState({questionsError: errorObj, userChanged: true})
              error = true;
            }
          })
        } else if(obj.logicJumpsAns.length < obj.logicJumpsQue.length) {
          obj.logicJumpsQue.map((objInner, idxInner) => {
            errorObj.answersError = this.state.answersError
            if(!obj.logicJumpsAns[idxInner]) {
              errorObj.answersError[obj.id][idxInner] = true
              //this.setState({answersError: errorObj, userChanged: true})
              //return false;
              error = true;
            }
          })
        } else if(obj.logicJumpsAns.length && obj.logicJumpsAns.length == obj.logicJumpsQue.length && obj.logicJumpsElse == "") {

          errorObj["logicElseError-"+obj.id] = true;
          errorObj.userChanged = true;
        } else {
          errorObj["logicElseError-"+obj.id] = false;
        }
      })

      if(error) {
        if(errorObj.hasDuplicates) {
          toast.error(this.state.globalLang.global_cannot_add_same_opt)
        }
        /*this.setState(errorObj)
        return false;*/
      }

      formData.title = this.state.title;
      formData.data = qList;
      formData.deletedQue = this.state.deletedQue;
      this.showLoaderFunc();
      this.props.saveTemplateData(formData)
    }

    showDeleteModal = () => {
      this.setState({showModal: true, userChanged: true})
    }

     dismissModal = () => {
        this.setState({showModal: false, userChanged: true})
     }

     deleteTemplate = () => {
        this.setState({showLoader: true, userChanged: true})
        this.dismissModal();
        let cId = this.state.templateId;
        this.props.deleteTemplate(cId);
     }

    render () {
      var list = [];
      if(this.state.questionsList.length) {
      list = this.state.questionsList.map((obj, idx) => {
        let classBox = (obj.currentlyActive) ? "edit-question-outer route selected-question" : "edit-question-outer route";
            return {
              content: (
                <React.Fragment key={"boxtypeOuter-"+obj.id}>
                {obj.boxtype == 'Textbox' &&
                  <React.Fragment key={"boxtypeText-"+obj.id}>
                      <input className="type-question" name={"name-"+obj.id} onChange={this.handleInputChange} type="text" placeholder={this.state.globalLang.global_type_question_here} value={(this.state['name-'+obj.id]) ? this.state['name-'+obj.id] : ''} />
                      <input id="descriptioBox1" className={(obj.description) ? "type-subtitle" : "type-subtitle no-display"} placeholder={this.state.globalLang.global_write_ur_description} name={'description-'+obj.id} value={this.state['description-'+obj.id]} onChange={this.handleInputChange} type="text" />
                      <span className={(obj.required) ? "survey-required" : "survey-required no-display"}  id="requiredBox1">*</span>
                      <a className="survey-drag-icon"><i className="far fa-file" id="icon_effect1" /> <span className="quest-number">{obj.displayOrder}</span></a>
                  </React.Fragment>
                }
                {obj.boxtype == 'yesno' &&
                <React.Fragment key={"boxtypeYesNo-"+obj.id}>
                    <input className="type-question" name={"name-"+obj.id} onChange={this.handleInputChange} type="Yes/No" placeholder={this.state.globalLang.global_type_question_here}value={this.state['name-'+obj.id]} id="box2" />
                    <input id="descriptioBox2" className={(obj.description) ? "type-subtitle" : "type-subtitle no-display"} placeholder={this.state.globalLang.global_write_ur_description} name={'description-'+obj.id} value={this.state['description-'+obj.id]} onChange={this.handleInputChange} type="text" />
                    <a className="share-default-icon" data-qid={obj.id} onClick={this.toggleLogicJump} ><i className="fas fa-share-alt"  /></a>
                    <span className={(obj.required) ? "survey-required" : "survey-required no-display"} style={{}} id="requiredBox2">*</span>
                    <a className="survey-drag-icon">
                        <i className="fas fa-toggle-off" id="icon_effect2" />
                        <span className="quest-number">{obj.displayOrder}</span>
                    </a>
                    <div className="login-jump-outer">
                      <div className="logic-jump-header">
                          <i className="fas fa-share-alt share-header-icon" />
                          <span className="logic-jump-title">{this.state.globalLang.global_logic_jump}</span>
                          <i className="pull-right fas no-margin loginjumponoff fa-angle-up" />
                      </div>
                      {this.state['showLogicJump-'+obj.id] &&

                     <div  className="logic-content">
                        <div className="when-ans" data-test={typeof this.state['questions-'+ obj.id]}>
                            <span className="when-ans-span">{this.state.globalLang.global_when_answering}</span>
                            <a className={this.state['questions-'+ obj.id].length <=1 ? "header-select-btn line-btn add-logic-btn" : "header-select-btn line-btn add-logic-btn disable"}  onClick={this.addLogicQuestion}>{this.state.globalLang.global_add_logic_jump}</a>
                        </div>
                        <LogicJump qid={obj.id} answers={this.state["answers-"+obj.id]} questions={this.state['questions-'+ obj.id]} type="yesno" handleChildChange={this.handleChildChange}  mainOptions={this.state.mainOptions} else={this.state['else-'+obj.id]} deleteLogicJump={this.deleteLogicJump} questionsError={this.state.questionsError} answersError={this.state.answersError} elseError={this.state['logicElseError-'+obj.id]}  />
                      </div>
                     }
                    </div>
                    </React.Fragment>
                }

                {obj.boxtype == 'single' &&
                <React.Fragment key={"boxtypeSingle-"+obj.id}>
                      <input className="type-question" name={"name-"+obj.id} value={this.state['name-'+obj.id]} onChange={this.handleInputChange}  type="Single Choice" placeholder={this.state.globalLang.global_type_question_here}  id="box3" />
                      <input id="descriptioBox3" className={(obj.description) ? "type-subtitle" : "type-subtitle no-display"} placeholder={this.state.globalLang.global_write_ur_description} name={'description-'+obj.id} value={this.state['description-'+obj.id]} onChange={this.handleInputChange} type="text" />
                      <a className="share-default-icon" data-qid={obj.id} onClick={this.toggleLogicJump}><i className="fas fa-share-alt" /></a>
                      <span className={(obj.required) ? "survey-required" : "survey-required no-display"} style={{}} id="requiredBox2">*</span>
                      <div id="singlechoiceboxouter3">
                          {obj.options.map((innerobj, inneridx) => {
                            return (<input key={"choice-"+obj.id+"-"+inneridx} id={"choice-"+obj.id+"-"+inneridx} className={(this.state['choiceError-'+obj.id+'-'+inneridx]) ? "type-choice" : "type-choice"} placeholder="- Choice" type="text" data-qid={obj.id} data-choiceid = {inneridx} onKeyUp={this.handleKeyUp} onChange={this.handleInputChange} value={this.state["choice-"+obj.id+"-"+inneridx] || ''} name={"choice-"+obj.id+"-"+inneridx} autoFocus={(obj.options.length == inneridx+1) ? true : false}/>)
                          })}
                      </div>
                      <a className="survey-drag-icon">
                          <i className="far fa-dot-circle" id="icon_effect3" />
                          <span className="quest-number">{obj.displayOrder}</span>
                      </a>
                      <div className="login-jump-outer">
                        <div className="logic-jump-header">
                            <i className="fas fa-share-alt share-header-icon" />
                            <span className="logic-jump-title">{this.state.globalLang.global_logic_jump}</span>
                            <a className={(this.state.upDown == false) ? "pull-right" : "pull-right no-display"} name="upDown" value = {this.state.upDown} data-qid={obj.id} onClick={this.toggleLogicJump1} >
                              <i className="pull-right fas no-margin loginjumponoff fa-angle-down" />
                            </a>
                            <a className={(this.state.upDown == true) ? "pull-right" : "pull-right no-display"} name="upDown" value = {this.state.upDown} data-qid={obj.id} onClick={this.toggleLogicJump1} >
                              <i className="pull-right fas no-margin loginjumponoff fa-angle-up" />
                            </a>
                        </div>
                        {this.state['showLogicJump-'+obj.id] &&

                           <div  className="logic-content">
                              <div className="when-ans" data-test={typeof this.state['questions-'+ obj.id]}>
                                  <span className="when-ans-span">{this.state.globalLang.global_when_answering}</span>
                                  <a className={this.state['questions-'+ obj.id].length <=1 ? "header-select-btn line-btn add-logic-btn" : "header-select-btn line-btn add-logic-btn disable"}  onClick={this.addLogicQuestion}>{this.state.globalLang.global_add_logic_jump}</a>
                              </div>
                              <LogicJump key={'LogicJump-'+obj.id} qid={obj.id} answers={this.state["answers-"+obj.id]} questions={this.state['questions-'+ obj.id]} type="single"  options={obj.options} addLogicQuestion={this.addLogicQuestion} mainOptions={this.state.mainOptions} handleChildChange={this.handleChildChange} else={this.state['else-'+obj.id]} deleteLogicJump={this.deleteLogicJump} questionsError={this.state.questionsError} answersError={this.state.answersError} elseError={this.state['logicElseError-'+obj.id]} />
                            </div>
                        }
                      </div>
                    </React.Fragment>
                }

                {obj.boxtype == 'multiple' &&
                <React.Fragment key={"boxtypeMultiple-"+obj.id}>
                      <input className="type-question" name={"name-"+obj.id} value={this.state['name-'+obj.id]} onChange={this.handleInputChange} type={this.state.globalLang.global_single_choice} placeholder={this.state.globalLang.global_type_question_here}  id="box3" />
                      <input id="descriptioBox3" className={(obj.description) ? "type-subtitle" : "type-subtitle no-display"} placeholder={this.state.globalLang.global_write_ur_description} name={'description-'+obj.id} value={this.state['description-'+obj.id]} onChange={this.handleInputChange} type="text" />
                      <a className="share-default-icon"><i className="fas fa-share-alt" /></a>
                      <span className={(obj.required) ? "survey-required" : "survey-required no-display"} style={{}} id="requiredBox2">*</span>
                      <div id="singlechoiceboxouter3">
                          {obj.options.map((innerobj, inneridx) => {
                            return (<input id={"choice-"+obj.id+"-"+inneridx} key={"choice-"+obj.id+"-"+inneridx} className="type-choice" placeholder="- Choice" type="text" data-qid={obj.id} data-choiceid = {inneridx} onKeyUp={this.handleKeyUp} name={"choice-"+obj.id+"-"+inneridx} defaultValue={this.state["choice-"+obj.id+"-"+inneridx]} autoFocus={(obj.options.length == inneridx+1) ? true : false}/>)
                          })}
                      </div>
                      <a className="survey-drag-icon">
                          <i className="far fa-check-square" id="icon_effect3" />
                          <span className="quest-number">{obj.displayOrder}</span>
                      </a>
                      <div className="login-jump-outer">
                          <div className="logic-jump-header"><i className="fas fa-share-alt" /><span className="logic-jump-title">Logic Jump</span> <i data-id={3} className="pull-right fa fa-angle-down no-margin loginjumponoff" /></div>
                      </div>
                      </React.Fragment>
                }

                {obj.boxtype == 'file' &&
                <React.Fragment key={"boxtypeFile-"+obj.id}>
                      <input className="type-question" name={"name-"+obj.id} onChange={this.handleInputChange} type="Single Choice" placeholder={this.state.globalLang.global_type_question_here} value={this.state['name-'+obj.id]} />
                      <input id="descriptioBox3" className={(obj.description) ? "type-subtitle" : "type-subtitle no-display"}  placeholder={this.state.globalLang.global_write_ur_description} name={'description-'+obj.id} value={this.state['description-'+obj.id]} onChange={this.handleInputChange} type="text" />
                      <a className="share-default-icon"><i className="fas fa-share-alt" /></a>
                      <span className={(obj.required) ? "survey-required" : "survey-required no-display"} style={{}} id="requiredBox2">*</span>
                      <a className="survey-drag-icon">
                          <i className="fas fa-file-upload" id="icon_effect3" />
                          <span className="quest-number">{obj.displayOrder}</span>
                      </a>
                  </React.Fragment>
                }

                {obj.boxtype == 'scale' &&
                <React.Fragment key={"boxtypeScale-"+obj.id}>
                      <input className="type-question" name={"name-"+obj.id} onChange={this.handleInputChange} type="Single Choice" placeholder={this.state.globalLang.global_type_question_here} value={this.state['name-'+obj.id]} id="box3" />
                      <input id="descriptioBox3" className={(obj.description) ? "type-subtitle" : "type-subtitle no-display"} placeholder={this.state.globalLang.global_write_ur_description} name={'description-'+obj.id} value={this.state['description-'+obj.id]} onChange={this.handleInputChange} type="text" />
                      <a className="share-default-icon" data-qid={obj.id} onClick={this.toggleLogicJump}><i className="fas fa-share-alt" /></a>
                      <span className={(obj.required) ? "survey-required" : "survey-required no-display"} style={{}} id="requiredBox2">*</span>
                      <a className="survey-drag-icon">
                          <i className="fas fa-ruler-horizontal" id="icon_effect3" />
                          <span className="quest-number">{obj.displayOrder}</span>
                      </a>
                      <div className="login-jump-outer">
                        <div className="logic-jump-header">
                            <i className="fas fa-share-alt share-header-icon" />
                            <span className="logic-jump-title">{this.state.globalLang.global_logic_jump}</span>
                            <i className="pull-right fas no-margin loginjumponoff fa-angle-up" />
                        </div>
                        {this.state['showLogicJump-'+obj.id] &&

                           <div  className="logic-content">
                              <div className="when-ans" data-test={typeof this.state['questions-'+ obj.id]}>
                                  <span className="when-ans-span">{this.state.globalLang.global_when_answering}</span>
                                  <a className={this.state['questions-'+ obj.id].length <=1 ? "header-select-btn line-btn add-logic-btn" : "header-select-btn line-btn add-logic-btn disable"}  onClick={this.addLogicQuestion}>{this.state.globalLang.global_add_logic_jump}</a>
                              </div>
                              <LogicJump qid={obj.id} answers={this.state["answers-"+obj.id]} questions={this.state['questions-'+ obj.id]} type="scale"  options={obj.options} addLogicQuestion={this.addLogicQuestion} mainOptions={this.state.mainOptions} handleChildChange={this.handleChildChange} else={this.state['else-'+obj.id]} deleteLogicJump={this.deleteLogicJump} questionsError={this.state.questionsError} answersError={this.state.answersError} elseError={this.state['logicElseError-'+obj.id]}  />

                            </div>
                          }
                    </div>
                    </React.Fragment>
                }
                </React.Fragment>

            ),
            id: obj.id, class: classBox
        };
      });
    }

      var onDragEnd = result => {
        let finalArr = [];
        if (!result.destination) {
          return;
        }


        const items = this.reorder(
          list,
          result.source.index,
          result.destination.index
        );

        list = items;
        finalArr = items.map((obj, idx) => {
          return obj.id;
        });
        this.reOrderList(finalArr);
      };
      return (
        <div className="wide-popup">
          <div className="modal-blue-header front-end-popup-title">
              <Link to="/settings/procedure-templates" className="popup-cross">×</Link>
              <span className="popup-blue-name">{this.state.globalLang.global_template}</span>
              <div className="popup-btns">
                  <a onClick={this.saveTemplate} className="line-btn popup-header-btn">{this.state.globalLang.label_save}</a>
                  <a onClick={this.addQuestion} className="line-btn popup-header-btn">{this.state.globalLang.global_add_question}</a>
                  <a onClick={this.showDeleteModal} className={(this.state.templateId) ? "line-btn popup-header-btn" : "line-btn popup-header-btn  no-display"}>{this.state.globalLang.label_delete}</a>
              </div>
          </div>
          <div className="survey-outer">
              <a onClick={this.toggleSideMenu} className={(!this.state.sideMenu) ? "arrow-slide-right no-display" : "arrow-slide-right" }><i className="fas fa-chevron-right" /></a>
              <div className={(!this.state.fullScreen) ? ((!this.state.sideMenu) ? "survey-left col-md-2" : "survey-left col-md-2 no-display") : "survey-left col-md-2 no-display"}>
                  <div className="property-title">
                      <span className="properties-span">{this.state.globalLang.global_properties}</span>
                      <a onClick={this.toggleSideMenu} className={(this.state.sideMenu) ? "arrow-slide-left  no-display" : "arrow-slide-left" }>
                          <i className="fas fa-chevron-left" />
                      </a>
                  </div>
                  <div className="survey-actions">
                      <a  className="survey-actions-a" onClick={this.deleteBox}><i className="far fa-trash-alt" /></a>
                      <a  className="survey-actions-a" onClick={this.copyBox}><i className="far fa-copy" /></a>
                  </div>
                  <div className="property-select-outer">
                      <div className="custom-select">
                          <div className="select-selected select-arrow-active" onClick={this.openBoxTypeDropDown}>{this.state.activeBoxTypeLabel} </div>
                          <div className={(this.state.displaySelection) ? "select-items" : "select-items no-display"}>
                              <div onClick={this.changeBoxType} data-type="Textbox">{this.state.globalLang.global_textbox}</div>
                              <div onClick={this.changeBoxType} data-type="yesno">{this.state.globalLang.global_yes_no}</div>
                              <div onClick={this.changeBoxType} data-type="single">{this.state.globalLang.global_single_choice}</div>
                              <div onClick={this.changeBoxType} data-type="multiple">{this.state.globalLang.global_multiple_choice}</div>
                              <div onClick={this.changeBoxType} data-type="scale">{this.state.globalLang.global_opinion_scale}</div>
                              <div onClick={this.changeBoxType} data-type="file">{this.state.globalLang.global_file_upload}</div>
                          </div>
                      </div>
                  </div>
                  <div className="new-custom-switch property-option">
                      {this.state.globalLang.global_required}
                      <label className="setting-switch pull-right">
                          <input type="checkbox" name="activeBoxRequired" checked={(this.state['activeBoxRequired']) ? "checked" : false} onChange={this.handleInputChange}  className="setting-custom-switch-input" />
                          <span className="setting-slider" />
                      </label>
                  </div>
                  <div className="new-custom-switch property-option">
                      {this.state.globalLang.label_description}
                      <label className="setting-switch pull-right">
                          <input type="checkbox" name="activeBoxDesc" checked={(this.state['activeBoxDesc']) ? "checked" : false} onChange={this.handleInputChange}   className="setting-custom-switch-input" />
                          <span className="setting-slider " />
                      </label>
                  </div>
                  <div className={ (this.state.activeBoxType == 'scale') ? "new-custom-switch property-option" : "new-custom-switch property-option no-display"}>
                      {this.state.globalLang.global_comments_on_scale}
                      <label className="setting-switch pull-right">
                          <input type="checkbox"  name="activeBoxComments" checked={(this.state['activeBoxComments']) ? "checked" : false} onChange={this.handleInputChange}   className="setting-custom-switch-input" />
                          <span className="setting-slider " />
                      </label>
                  </div>
              </div>
              <div className={(!this.state.fullScreen) ? ((this.state.sideMenu) ? "survey-middle col-md-6 width-50" : "survey-middle col-md-6 width-40") : "survey-middle col-md-6 no-display"}>
                  <div className={(this.state.titleError) ? "edit-question-title-outer field-error" : "edit-question-title-outer"}>
                      <input className="title-type-question" id="survey_title" type="Textbox" name="title" value={this.state.title} placeholder="Type title here..."  onChange={this.handleInputChange}/>

                      <span className="survey-required" style={{display: 'block'}}>*</span>
                      <a className="survey-title-drag-icon"><i  id="icon_effect1" />
                          <span className="quest-title-number">{this.state.globalLang.global_title}</span></a>
                  </div>
                  <div>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="mydrop">
                          {(provided, snapshot) => (
                            <div className="space first-space table no-bg" ref={provided.innerRef}>
                              {list.map((item, index)=>(
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot)=>(
                                  <div className={item.class}
                                       data-id={item.id}
                                       data-order_by={item.id}
                                       onClick={this.makeActiveBox.bind(this, index)}
                                       ref={provided.innerRef}
                                       {...provided.draggableProps}
                                       {...provided.dragHandleProps}
                                       style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                      {item.content}
                                  </div>)}
                                </Draggable>))
                              }
                            </div>)}
                        </Droppable>
                      </DragDropContext>
                  </div>
              </div>
              <div className={(this.state.fullScreen) ? "survey-right col-md-6 width-100" : ((this.state.sideMenu) ? "survey-right col-md-6 width-50" : "survey-right col-md-6 width-40")}>
                  <div className="property-title text-right">
                      <a className={(this.state.fullScreen) ? "properties-span full-view no-display" : "properties-span full-view"} onClick={this.toggleFullScreen}><i className="far fa-window-restore" /> {this.state.globalLang.global_full_screen_view}</a>
                      <a className={(this.state.fullScreen) ? "properties-span editeble-view" : "properties-span editeble-view no-display" } onClick={this.toggleFullScreen}><i className="far fa-edit" /> {this.state.globalLang.global_edit_view}</a>
                  </div>
                  <div className={(!this.state.fullScreen) ? "title-half-preview" : "title-half-preview servy-title-preview"}>
                      <div className="report-title-question-outer break-word-content">
                          <div className="survey-title no-margin" id="preview_survey_title">{this.state.title}</div>
                          <div className="view-title-number">{this.state.globalLang.global_title} <i className="fa fa-arrow-right" /></div>
                      </div>
                  </div>
                  <div className={(!this.state.fullScreen) ? "half-preview relative" : "servy-preview relative"} id="half-preview">
                        <div  className={(this.state.viewActiveBox.boxtype == 'Textbox') ? "report-question-outer" : "report-question-outer no-display"} >
                          <div className="survey-title no-margin" id="preview1">{this.state.viewActiveBox.name}</div>
                          <div className={(this.state.viewActiveBox.description) ? "quest-discription" : "quest-discription no-display"} >{this.state.viewActiveBox.descriptionText}</div>
                            <input name={'selectedAnswers-'+this.state.viewActiveBox.id} className={(this.state.viewActiveBox.boxtype == 'Textbox') ? "report-input" : "report-input no-display"} placeholder="Write your answer here..." type="text" onChange={this.handleInputChange} value={(this.state['selectedAnswers-'+this.state.viewActiveBox.id]) ? this.state['selectedAnswers-'+this.state.viewActiveBox.id] : ''} />
                        </div>

                          <div  className={(this.state.viewActiveBox.boxtype == 'yesno') ? "report-question-outer" : "report-question-outer no-display"} >
                          <div className="survey-title no-margin" id="preview1">{this.state.viewActiveBox.name}</div>
                          <div className={(this.state.viewActiveBox.description) ? "quest-discription" : "quest-discription no-display"} >{this.state.viewActiveBox.descriptionText}</div>
                              <div className=" multisel-outer-yesno2">
                                  <div className={(this.state["selectedAnswers-"+this.state.viewActiveBox.id] == "Yes") ? "multisel ynomultisel yescheckouter2 activated" : "multisel ynomultisel yescheckouter2"}>
                                      <input id={"Yes-"+this.state.viewActiveBox.id}  className="servy-checkbox servy-radio preboxval" onChange={this.handleInputChange} name={"selectedAnswers-"+this.state.viewActiveBox.id} checked={this.state[(this.state["selectedAnswers-"+this.state.viewActiveBox.id] == "Yes") ? "checked" : false]} type="radio"  value="Yes" /><span className="multi-sel-alpha">{this.state.globalLang.global_a}</span>
                                      <label className="multisel-label" htmlFor={"Yes-"+this.state.viewActiveBox.id}>Yes</label><i className="fa fa-check" /></div>
                                  <div className={(this.state["selectedAnswers-"+this.state.viewActiveBox.id] == "No") ? "multisel ynomultisel yescheckouter2 activated" : "multisel ynomultisel yescheckouter2"}>
                                      <input id={"No-"+this.state.viewActiveBox.id} className="servy-checkbox servy-radio preboxval" onChange={this.handleInputChange} checked={(this.state["selectedAnswers-"+this.state.viewActiveBox.id] == "No") ? "checked" : false} value="No"  name={"selectedAnswers-"+this.state.viewActiveBox.id}  type="radio"  /><span className="multi-sel-alpha" >{this.state.globalLang.global_b}</span>
                                      <label className="multisel-label" htmlFor={"No-"+this.state.viewActiveBox.id}>No</label><i className="fa fa-check" /></div>
                              </div>
                          </div>


                          <div  className={(this.state.viewActiveBox.boxtype == 'single') ? "report-question-outer" : "report-question-outer no-display"}>
                          <div className="survey-title no-margin" id="preview1">{this.state.viewActiveBox.name}</div>
                          <div className={(this.state.viewActiveBox.description) ? "quest-discription" : "quest-discription no-display"} >{this.state.viewActiveBox.descriptionText}</div>
                              <div className="col-sm-12 multisel-outer preview-single-selectouter3">
                              {this.state.viewActiveBox.options.map((obj, idx)=>{
                                  return (
                                      <div key={'selectedAnswers-'+idx} className={(this.state["selectedAnswers-"+this.state.viewActiveBox.id] == idx) ? "multisel activated" : "multisel"}  >
                                          <input id={this.state.viewActiveBox.id+"-"+idx}  className="servy-checkbox servy-radio preboxval" onChange={this.handleInputChange} name={"selectedAnswers-"+this.state.viewActiveBox.id} checked={(this.state["selectedAnswers-"+this.state.viewActiveBox.id] == idx) ? "checked" : false} value={idx} type="radio"  /><span  className="multi-sel-alpha">{String.fromCharCode(65+idx)}</span>
                                          <label  className="multisel-label" htmlFor={this.state.viewActiveBox.id+"-"+idx}>{obj}</label><i className="fa fa-check" />
                                      </div>
                                    )
                              })}
                              </div>
                          </div>


                          <div  className={(this.state.viewActiveBox.boxtype == 'multiple') ? "report-question-outer" : "report-question-outer no-display"}>
                          <div className="survey-title no-margin" id="preview1">{this.state.viewActiveBox.name}</div>
                          <div className={(this.state.viewActiveBox.description) ? "quest-discription" : "quest-discription no-display"} >{this.state.viewActiveBox.descriptionText}</div>
                              <div className="col-sm-12 multisel-outer preview-multi-selectouter4">
                              {this.state.viewActiveBox.options.map((obj, idx)=>{
                                  return (
                                      <div key={'viewActiveBox-'+idx} className="multisel" >
                                          <input   className="servy-checkbox servy-radio preboxval" name="satisfied" type="radio"  /><span  className="multi-sel-alpha">{String.fromCharCode(65+idx)}</span>
                                          <label  className="multisel-label" htmlFor="previewMultiRadio42">{obj}</label><i className="fa fa-check" />
                                      </div>
                                    )
                              })}
                              </div>
                          </div>

                          <div  className={(this.state.viewActiveBox.boxtype == 'scale') ? "report-question-outer" : "report-question-outer no-display"}>
                          <div className="survey-title no-margin" id="preview1">{this.state.viewActiveBox.name}</div>
                          <div className={(this.state.viewActiveBox.description) ? "quest-discription" : "quest-discription no-display"} >{this.state.viewActiveBox.descriptionText}</div>
                              <ul className="survey-rate-outer" id="survey-rateouter5">
                                  <li  onClick={this.setScaleVal} data-id={1} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 1) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>1</li>
                                  <li  onClick={this.setScaleVal} data-id={2} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 2) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>2</li>
                                  <li  onClick={this.setScaleVal} data-id={3} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 3) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>3</li>
                                  <li  onClick={this.setScaleVal} data-id={4} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 4) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>4</li>
                                  <li  onClick={this.setScaleVal} data-id={5} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 5) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>5</li>
                                  <li  onClick={this.setScaleVal} data-id={6} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 6) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>6</li>
                                  <li  onClick={this.setScaleVal} data-id={7} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 7) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>7</li>
                                  <li  onClick={this.setScaleVal} data-id={8} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 8) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>8</li>
                                  <li  onClick={this.setScaleVal} data-id={9} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 9) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>9</li>
                                  <li   onClick={this.setScaleVal} data-id={10} className={(this.state['selectedAnswers-'+this.state.viewActiveBox.id] == 10) ? "survey-li preboxval survey-li-active" : "survey-li preboxval"}>10</li>
                              </ul>
                              <div className="likeornot"><span>{this.state.globalLang.global_not_at_all_likely}</span> <span className="pull-right">{this.state.globalLang.global_extremely_likely}</span></div>
                              <div className={(this.state.viewActiveBox.why_choose) ? "" : "no-display"} id="why_choose_open_box5">
                                  <input className="report-input" placeholder={this.state.globalLang.global_write_your_answer} type="text" name={"selectedAnswers-whyChoose-"+this.state.viewActiveBox.id} onChange={this.handleInputChange} autoComplete="off" value={(this.state["selectedAnswers-whyChoose-"+this.state.viewActiveBox.id]) ? this.state["selectedAnswers-whyChoose-"+this.state.viewActiveBox.id] : ""} />
                              </div>
                          </div>

                          <div  className={(this.state.viewActiveBox.boxtype == 'file') ? "report-question-outer" : "report-question-outer no-display"}>
                          <div className="survey-title no-margin" id="preview1">{this.state.viewActiveBox.name}</div>
                          <div className={(this.state.viewActiveBox.description) ? "quest-discription" : "quest-discription no-display"} >{this.state.viewActiveBox.descriptionText}</div>
                              <div className="profile_image_div" id="profile_image_div6">
                                  <div className="dropzone add_margin survey-dropzone dz-clickable">
                                    <input className="input-file" type="file" id="input-file" name={"file-"+this.state.viewActiveBox.id} onChange={this.handleFileChange} />
                                      <div className="dz-default dz-message upload">{this.state.globalLang.global_upload}</div>
                                    <img src="" id="theImage" />
                                  </div>
                              </div>
                          </div>
                          <button id="rating-ok" className={(this.state.questionsList && this.state.questionsList[this.state.questionsList.length-1].id != this.state.viewActiveBox.id && this.state.questionsList.length > 1) ? "report-btn" : "report-btn no-display"} onClick={this.goToNext}>{this.state.globalLang.global_ok} <i className="fa fa-check" /></button>
                          <button id="rating-ok" className={(this.state.questionsList && this.state.questionsList[this.state.questionsList.length-1].id == this.state.viewActiveBox.id || this.state.questionsList.length == 1) ? "report-btn" : "report-btn no-display"} onClick={this.submitView}>{this.state.globalLang.label_submit} <i className="fa fa-check" /></button>
                          <div className="view-number">{this.state.viewActiveBox.displayOrder} <i className="fa fa-arrow-right" /></div>
                      </div>
                  </div>
            </div>
            <div className={(this.state.showModal ? 'overlay' : '')}></div>
              <div id="filterModal" role="dialog" className={(this.state.showModal ? 'modal fade in displayBlock' : 'modal fade')}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" onClick={this.dismissModal}>×</button>
                      <h4 className="modal-title" id="model_title">{this.state.globalLang.global_delete_template}</h4>
                    </div>
                    <div id="errorwindow" className="modal-body add-patient-form filter-patient">
                      {this.state.globalLang.global_r_u_sure_want}
                    </div>
                    <div className="modal-footer" >
                      <div className="col-md-12 text-left" id="footer-btn">

                        <button type="button" className="btn  logout pull-right" data-dismiss="modal" onClick={this.dismissModal}>{this.state.globalLang.global_no}</button>
                        <button type="button" className="btn btn-success pull-right m-r-10" data-dismiss="modal" onClick={this.deleteTemplate}>{this.state.globalLang.global_yes}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeonClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover />
            <div className={(this.state.showLoader) ? 'new-loader text-left displayBlock positionFixed' : 'new-loader text-left'}>
              <div className="loader-outer">
                <img id="loader-outer" src="/images/Eclipse.gif" className="loader-img" />
                <div id="modal-confirm-text" className="popup-subtitle" >{this.state.globalLang.loading_please_wait_text}</div>
              </div>
            </div>
        </div>
      )}
}

function mapStateToProps(state) {
  let returnState = {};
  let languageData = JSON.parse(localStorage.getItem("languageData"));
  localStorage.setItem("showLoader", false);

  if (state.SettingReducer.action === "PROCEDURE_TEMPLATE_DATA") {
    if(state.SettingReducer.data.status != 200) {
      toast.error(languageData.global[state.SettingReducer.data.message]);
      returnState.showLoader = false
    } else {
      returnState.templateData = state.SettingReducer.data.data;
    }
  }

  if (state.SettingReducer.action === "SAVE_PROCEDURE_TEMPLATE_DATA") {
    if(state.SettingReducer.data.status != 201 || state.SettingReducer.data.status != 200) {
      toast.error(languageData.global[state.SettingReducer.data.message]);
      returnState.showLoader = false
    }
    else{
      returnState.savedTemplateData = true;
      returnState.message = languageData.global[state.SettingReducer.data.message];
    }
  }
  if (state.SettingReducer.action === "DELETE_PROCEDURE_TEMPLATE") {
    if(state.SettingReducer.data.status  != 200){
    toast.error(languageData.global[state.SettingReducer.data.message]);
    returnState.showLoader = false
  }
  else{
    returnState.deleteTemplateData = true;
    returnState.message = languageData.global[state.SettingReducer.data.message];
  }
}
  return returnState;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getTemplateData: getTemplateData, saveTemplateData: saveTemplateData, deleteTemplate: deleteTemplate, updateSortOrder: updateSortOrder}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateEditTemplate);
