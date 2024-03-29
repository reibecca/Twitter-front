import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import moment from "moment"
import 'moment/locale/fr'

import { UserContext } from '../Context/UserContext'
import { DeleteContext } from '../Context/DeleteContext'

import styled from 'styled-components'

const Middle = styled.div`
  margin: 0;
`
const Header = styled.div`
  display: flex;
  justify-content : space-between;
`
const Footer = styled.div`
  display: flex;
`
const FooterIcon = styled.div`
  height: 2.5%;
  width: 80px;
  margin-right: 10px;
  &:hover {
    background-color: lightblue;
  }
`
const FooterNum = styled.div`
  width: 50px;
  color: black;
  &:hover {
    color: teal;
  }
`
const FooterZone = styled.a`
  text-decoration: none;
  display: flex;
  width: 50px;
  padding: 0 5px;
  &:hover {
    border-radius: 30px;
    background-color: lightblue;
    fill: teal;
  }
`
const Supprimer = styled.div`
  width: 5%;
  &:hover {
    fill: red;
  }
`
const Title = styled.div`
  display: flex;
`

const SingleTweet = (props) => {
  moment.locale("fr")
  const { user, setUser } = useContext(UserContext)
  const { setDeleted } = useContext(DeleteContext)
  const { id, name, username, userid, createdAt, text, numRetweets, numComments, retweets } = props
  const [nbRetweets, setNbRetweets] = useState(numRetweets)
  const [arrayRetweets, setArrayRetweets] = useState(retweets)

  const handleRetweet = () => {
    retweeter()
    setNbRetweets(nbRetweets + 1)
  }
  const handleUntweet = () => {
    unRetweeter()
    setNbRetweets(nbRetweets - 1)
  }

  const retweeter = async () => {
    const response = await fetch(`http://localhost:5000/tweets/${id}`, {
      method:'put',
      headers: {
        'Content-type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({
        user: user._id
      })
    })
    const data = await response.json()
    setArrayRetweets(data.retweets)

    const userResponse = await fetch(`http://localhost:5000/users/${user._id}`, {
      credentials: "include"
    })
    const userData = await userResponse.json()
    setUser(userData)
  }
  const unRetweeter = async () => {
    const response = await fetch(`http://localhost:5000/tweets/unretweet/${id}`, {
      method:'put',
      headers: {
        'Content-type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({
        user: user._id
      })
    })
    const data = await response.json()
    setArrayRetweets(data.retweets)

    const userResponse = await fetch(`http://localhost:5000/users/${user._id}`, {
      credentials: "include"
    })
    const userData = await userResponse.json()
    setUser(userData)
  }
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/tweets/${id}`, {
      method:'delete',
      headers: {
        'Content-type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({
        user: user._id
      })
    })
    const data = await response.json()
    setDeleted(data)
  }

  return (
    <div className='row d-flex border-bottom py-2'>
      <div className='col-2'>
          <img 
            className='img-fluid rounded-circle'
            alt='default_profile'
            // style={{width: '50%'}}
            src='https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png' 
          />
      </div>
      <div className='col-10'>
        <Link to={`/tweet/${id}`}>
          <Header>
            <Title>
              <Link to={`/user/${userid}`}>
                <h6>{name}</h6> 
              </Link>
              @{username} · {moment(createdAt).format('lll')}
            </Title>
            {(user._id === userid) && 
              <Supprimer onClick={handleDelete}>
                <svg viewBox="0 0 24 24" aria-hidden="true" class=""><g><path d="M20.746 5.236h-3.75V4.25c0-1.24-1.01-2.25-2.25-2.25h-5.5c-1.24 0-2.25 1.01-2.25 2.25v.986h-3.75c-.414 0-.75.336-.75.75s.336.75.75.75h.368l1.583 13.262c.216 1.193 1.31 2.027 2.658 2.027h8.282c1.35 0 2.442-.834 2.664-2.072l1.577-13.217h.368c.414 0 .75-.336.75-.75s-.335-.75-.75-.75zM8.496 4.25c0-.413.337-.75.75-.75h5.5c.413 0 .75.337.75.75v.986h-7V4.25zm8.822 15.48c-.1.55-.664.795-1.18.795H7.854c-.517 0-1.083-.246-1.175-.75L5.126 6.735h13.74L17.32 19.732z"></path><path d="M10 17.75c.414 0 .75-.336.75-.75v-7c0-.414-.336-.75-.75-.75s-.75.336-.75.75v7c0 .414.336.75.75.75zm4 0c.414 0 .75-.336.75-.75v-7c0-.414-.336-.75-.75-.75s-.75.336-.75.75v7c0 .414.336.75.75.75z"></path></g></svg>
              </Supprimer>
            }
          </Header>
          <Middle>
            {text}
          </Middle>
          <Footer>
            <FooterZone>
              <FooterIcon>
                <svg viewBox="0 0 24 24" aria-hidden="true" className=""><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>
              </FooterIcon> 
              <FooterNum className='d-flex'>
                {numComments}
              </FooterNum>
            </FooterZone>
            {arrayRetweets.includes(user._id) ?
              <FooterZone onClick={() => handleUntweet()}>
                <FooterIcon>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className=""><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>
                </FooterIcon>
                <FooterNum>
                  {nbRetweets}
                </FooterNum>
              </FooterZone>
            :  
              <FooterZone onClick={() => handleRetweet()}>
                <FooterIcon>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className=""><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>
                </FooterIcon>
                <FooterNum>
                  {nbRetweets} 
                </FooterNum>
              </FooterZone>
            }
          </Footer>
        </Link>
      </div>
    </div>
  )
}

export default SingleTweet