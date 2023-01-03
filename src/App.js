import {useReducer} from 'react'
import './App.css';
import OperationButton from './OperationButton';
import DigitButton from './DigitButton';
export const ACTIONS={
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT:'delete-digit',
  CHOOSE_OPERATION:'choose-operation',
  EVALUATE:'evaluate'

}

function reducer(state,{type, payload}){
 //Calling Actions
  switch(type){
    //digit display
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentOperand:payload.digit,
          overwrite: false
        }
      }

      if(payload.digit === '0' && state.currentOperand === '0'){return state}//not repeat 0
      if(payload.digit === '.' && state.currentOperand.includes('.')){return state}//not repeat .
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
       }
      //to clear
    case ACTIONS.CLEAR:
      return {}
      //operations
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){return state}
      if(state.previousOperand == null){
        return {
          ...state,
          operation:payload.operation,
          previousOperand: state.currentOperand,
          currentOperand:null
        }
      }
      if(state.currentOperand == null){
        return {
          ...state,
          operation:payload.operation,
        }
      }
    return{
      ...state,
      previousOperand: evaluate(state),
      operation:payload.operation,
      currentOperand:null
    }
    //evaluation
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand==null || state.previousOperand==null){
        return state
      } return {...state,
       previousOperand:null,
       overwrite:true,
       currentOperand:evaluate(state),
       operation:null
      }
      //to delete
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){return{
        ...state,
        overwrite:false,
        currentOperand:null
      }}
      if(state.currentOperand==null)return state//if number is not present
      if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand:null,
        }
      }
      //if number is delete one by one
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
      default:
        return state
  }

}
//evaluation function
function evaluate({currentOperand,previousOperand,operation}){
const prev= parseFloat(previousOperand)//parsing
const curr=parseFloat(currentOperand)//parsing
if(isNaN(prev) || isNaN(curr)) return '' // no number
let computation = ''
switch(operation){
  case '+':
    computation = prev + curr
    break
  case '*':
      computation = prev * curr
      break
  case '/':
    computation = prev / curr
    break
  case '-':
    computation = prev - curr
    break
  default:
    return
}
return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us',{
  maximumFractionDigits:0,
})

//To format the number
function formatOperand(operand){
  if(operand==null) return
  const [integer , decimal]=operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [{currentOperand, previousOperand,operation}, dispatch]=useReducer(reducer,{})
   return (
    
    <div className="calculator-grid">
      
      <div className='output'><p>Simple Calculator Developed by Ephrem</p>
        <div className='previous-operand'>{formatOperand(previousOperand)}{operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})} >DEL</button>

      <OperationButton operation='/' dispatch={dispatch} />
      
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      
      <OperationButton operation='*' dispatch={dispatch} />
    
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      
      <OperationButton operation='+' dispatch={dispatch} />
      
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      
      <OperationButton operation='-' dispatch={dispatch} />
      
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button className='span-two' onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>
     
    </div>
  );
}

export default App;
