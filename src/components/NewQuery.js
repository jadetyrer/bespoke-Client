import React, {useState} from 'react';
import {useGlobalState} from '../config/store'
import {withRouter} from 'react-router-dom'
import {addQuery} from '../services/queryServices'
import {Block, Input, Label, InputButton, ErrorText, TextArea} from './StyledComponents'

const NewQuery = ({history}) => {
  
  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    setFormState({
      ...formState,
      [name]: value
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const newQuery = {
      name: formState.name,
      email: formState.email,
      phone_number: formState.phone_number,
      message: formState.message,
      date_created: Date.now()
    }
    addQuery(newQuery).then((newQuery) => {
      dispatch({
        type: 'setQueries',
        data: [newQuery, ...queries]
      })
      //change to confirmation message
      history.push('/')
    }).catch((error) => {
      const status = error.response ? error.response.status : 500
      console.log('Caught error creating new query', error)
      if(status === 403)
                setErrorMessage("Oops! It appears we lost your login session. Make sure 3rd party cookies are not blocked by your browser settings.")
            else
                setErrorMessage("Well, this is embarrassing... There was a problem on the server.")
    })
  }

  const initialFormState = {
    name: "",
    email: "",
    phone_number: "",
    message: ""
  }

  const [formState, setFormState] = useState(initialFormState)
  const [errorMessage, setErrorMessage] = useState(null)
  const {store, dispatch} = useGlobalState()
  const {queries} = store

  return (
    <form id="newQueryForm" onSubmit={handleSubmit}>
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <Block>
            <Label>Name</Label>
            <Input required type="text" name="name" placeholder="Enter your name" onChange={handleChange}></Input>
        </Block>
        <Block>
            <Label>Email</Label>
            <Input required type="text" name="email" placeholder="Enter your email" onChange={handleChange}></Input>
        </Block>
        <Block>
            <Label>Phone Number</Label>
            <Input required type="text" name="phone_number" placeholder="Enter your phone number" onChange={handleChange}></Input>
        </Block>
        <Block>
            <Label>Message</Label>
            <TextArea required type="text" name="message" placeholder="What would you like to ask?" onChange={handleChange}></TextArea>
        </Block>
        <Block>
            <InputButton type="submit" value="Submit your Query"></InputButton>
        </Block>
      </form>
  )

}


export default withRouter(NewQuery)