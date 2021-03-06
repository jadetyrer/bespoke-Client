import React from 'react';
import {useGlobalState} from '../config/store'
import {getOrderFromId} from '../services/orderServices'
import {Link} from 'react-router-dom'
import {Wrapper, ConfirmationBox, BackHome} from './StyledComponentC'

const OrderConfirm = ({match}) => {
  const {store} = useGlobalState()
  const {orders} = store
  const orderId = match.params.id
  const order = getOrderFromId(orders, orderId)

  if (!order) return null

  const {name, nail_length, nail_shape, nail_style} = order

  const bigCheck = {
    width: "7em"
  }
  
  return (
    <div>
      <Wrapper>
        <ConfirmationBox>
          <div style={{margin:"auto"}}>
              <img style={bigCheck} src={'/check.png'} alt="tick"></img>
            </div>
          <h3>Thanks for placing an order for {nail_length}mm, {nail_shape} {nail_style} press-ons, {name}!</h3>
          <p>Your order confirmation number is:</p>
          <p>#{order._id}</p>
          <p>We'll be in touch soon about estimated completion and payment details.</p>
          <div>
          <BackHome to="/">BACK TO HOMEPAGE</BackHome>
          </div>      
        </ConfirmationBox>
      </Wrapper>
    </div>
  )
}


export default OrderConfirm