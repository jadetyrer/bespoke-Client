import React, {useState} from 'react';
import {useGlobalState} from '../config/store'
import {withRouter} from 'react-router-dom'
import {addProduct} from '../services/productServices'
import { Block, Input, Label, InputButton, ErrorText} from './StyledComponents'
import {CentralForm, FormBlock, LabelQ, InputQ, FormInfo} from './StyledComponentC'
import NewFileUpload from './NewFileUpload'
import api from '../config/api'

const NewProduct = ({history}) => {

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    setFormState({
      ...formState,
      [name]: value
    })
  }
  
  
  async function uploadImage(newProduct) {
    try{
      if (imageData) {
        const response = await api.post("/uploads", imageData)
        const imageURL = response.data
        const updatedProduct = {
          ...newProduct,
          image: {
            description: imageData.description,
            fileLink: imageURL
          }
        }
        return updatedProduct
      }
      return newProduct
    }
    catch(error) {
      console.log(error)
      alert("Oops an error occurred uploading image, please try again");
      
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const newProduct = {
      nail_length: formState.nail_length,
      nail_shape: formState.nail_shape,
      nail_style: formState.nail_style,
      cost: formState.cost
    }
    uploadImage(newProduct).then((product) => {
      addProduct(product).then((newProduct) => {
      dispatch({
        type: 'setProducts',
        data: [newProduct, ...products]
      })
      history.push(`/products`)
    }).catch((error) => {
      const status = error.response ? error.response.status : 500
      console.log('Caught error creating product', error)
      if(status === 403)
                setErrorMessage("Oops! It appears we lost your login session. Make sure 3rd party cookies are not blocked by your browser settings.")
            else
                setErrorMessage("Well, this is embarrassing... There was a problem on the server.")
    })
  })   
  }
  const initialFormState = {
    // add auto-filled form if product selected from shop
    nail_length: 0,
    nail_shape: "",
    nail_style: "",
    cost: 0
  } 
  const [formState,setFormState] = useState(initialFormState)
  const [errorMessage, setErrorMessage] = useState(null)
  const [imageData, setImageData] = useState(null)
  const {store, dispatch} = useGlobalState()
  const {products} = store

  console.log(imageData)
  return (
    <CentralForm>
      <NewFileUpload setImageData={setImageData} ></NewFileUpload>
      <form id="newProductForm" onSubmit={handleSubmit}>
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          <FormBlock>
              <LabelQ>Nail Length</LabelQ>
              <InputQ required type="text" name="nail_length" placeholder="Enter a nail length" onChange={handleChange}></InputQ>
          </FormBlock>
          <FormBlock>
              <LabelQ>Nail Shape</LabelQ>
              <InputQ required type="text" name="nail_shape" placeholder="Enter a nail shape" onChange={handleChange}></InputQ>
          </FormBlock>
          <FormBlock>
              <LabelQ>Nail Style</LabelQ>
              <InputQ required type="text" name="nail_style" placeholder="Enter a nail style" onChange={handleChange}></InputQ>
          </FormBlock>
          <FormBlock>
              <LabelQ>Cost</LabelQ>
              <InputQ required type="text" name="cost" placeholder="Enter a price" onChange={handleChange}></InputQ>
          </FormBlock>
          <FormBlock>
              <InputButton type="submit" value="Add product"></InputButton>
          </FormBlock>
      </form>
    </CentralForm>
  ) 

}

export default withRouter(NewProduct)
