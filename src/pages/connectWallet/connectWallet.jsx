import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEthers } from '@usedapp/core'

import { Navbar, Sidebar } from '../../components'
import ConnectWalletImg from '../../assets/ConnectWallet.png'
import { connectionAction } from '../../actions/connectionAction'
import { withWalletConnection } from '../../utils/withWalletConnection'

const ConnectWalletPure = ({ activateWallet, deactivateWallet }) => {
  const { account } = useEthers()
  const { error } = useEthers()
  const isConnected = useSelector((state) => state.connectionReducer)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      // show error to user if user denied connection request
      dispatch(connectionAction(false))
    }
  }, [error])

  useEffect(() => {
    // if connected redirect user to dashboard
    isConnected && account && history.push('/farming')
  }, [isConnected, account])

  return (
    <div className="connectWallet">
      <div className="side-nav">
        <Sidebar />
      </div>
      <div className="main">
        <Navbar />
        <div className="card-element">
          <div className="card-content">
            <p>Connect wallet</p>
            <p>DAO1 Farms are available on Ethereum and Polygon.</p>
            {!isConnected && (
              <button className="button" onClick={activateWallet}>
                <img src={ConnectWalletImg} alt="" /> Connect wallet
              </button>
            )}
            {isConnected && (
              <button className="button" onClick={deactivateWallet}>
                <img src={ConnectWalletImg} alt="" /> Disconnect wallet
              </button>
            )}
            <p href="">Help getting started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ConnectWallet = withWalletConnection(ConnectWalletPure)
