import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import equal from 'fast-deep-equal'

import DAO1Logo from '../../assets/white-logo.png'
import ArrowIcon from '../../assets/arrow-down.png'
import {
  card,
  cardHead,
  cardHeadLogo,
  cardLabel,
  cardInfoText,
  cardName,
  cardNameText,
  cardStakingConditions,
  cardStakingConditionsItem,
  cardStakingList,
  cardStakingListEmpty,
  cardStakingItem,
  cardStakingItemHead,
  cardStakingItemInfo,
  cardStakingItemInfoBlock,
  cardStakingItemButtons,
  cardStakingItemDetails,
  cardStakingItemDetailsHide,
  cardStakingItemDetailsRow,
  cardStakingItemDetailsName,
  cardStakingItemDetailsValue,
  cardArrowButton,
  cardArrowButtonActive,
  cardFooter,
  cardTatalStaked,
  cardTatalStakedValue,
  cardButton,
  stakeModal,
  stakeModalTitle,
  stakeModalInput,
} from './stakingCard.module.scss'
import { Button, Modal, Title, Input } from '../'
import { getContractApi } from '../../services/staking/FixedStaking'

export function StakingCard({ name, contractAddress }) {
  const { getData, stake, unstake, harvest } = getContractApi(contractAddress)
  const [stakeDurationDays, setStakeDurationDays] = useState(0)
  const [rewardRate, setRewardRate] = useState(0)
  const [stakingHistory, setStakingHistory] = useState([])
  const [totalStaked, setTotalStaked] = useState(0)
  const [stakeAmount, setStakeAmount] = useState('')
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const [visibleDetailedBlock, setVisibleDetailedBlock] = useState(null)

  useEffect(() => {
    getData().then(({ stakeDurationDays, rewardRate, stakes, totalStaked }) => {
      setStakeDurationDays(stakeDurationDays)
      setRewardRate(rewardRate)
      setStakingHistory(stakes)
      setTotalStaked(totalStaked)
    })
  }, [])

  useEffect(() => {
    // Rerender component when stakes data is changed
    const interval = setInterval(() => {
      getData().then(({ stakes, totalStaked }) => {
        if (stakingHistory) {
          for (let i = 0; i < stakes.length; i++) {
            if (!equal(stakes[i], stakingHistory[i])) {
              setStakingHistory(stakes)
              setTotalStaked(totalStaked)
              clearInterval(interval)
              return
            }
          }
        }
      })
    }, 2000)
  }, [stakingHistory])

  const accordionClickHandler = (id) => {
    if (id === visibleDetailedBlock) {
      setVisibleDetailedBlock(null)
      return
    }

    setVisibleDetailedBlock(id)
  }

  const stakeAmountHandler = (e) => {
    e.preventDefault()

    setStakeAmount(e.target.value)
  }

  const StakingHistory = () =>
    !stakingHistory || stakingHistory.length === 0 ? (
      <div className={cardStakingListEmpty}>Empty! No information</div>
    ) : (
      stakingHistory.map(
        (
          { active, staked, harvestable, allowHarvest, expires, details },
          idx,
        ) => {
          const isActive = visibleDetailedBlock === idx
          const hiddenClassNames = classnames(
            cardStakingItemDetails,
            cardStakingItemDetailsHide,
          )
          const detailsClassNames = isActive
            ? cardStakingItemDetails
            : hiddenClassNames
          const activeArrowClassNames = classnames(
            cardArrowButton,
            cardArrowButtonActive,
          )
          const arrowButtonClassnames = isActive
            ? activeArrowClassNames
            : cardArrowButton

          return (
            <div key={idx} className={cardStakingItem}>
              <div className={cardStakingItemHead}>
                <div className={cardStakingItemInfo}>
                  <div className={cardStakingItemInfoBlock}>
                    <div className={cardLabel}>DAO1 Staked</div>
                    <div className={cardInfoText}>{staked}</div>
                  </div>
                  <div className={cardStakingItemInfoBlock}>
                    <div className={cardLabel}>Harvestable</div>
                    <div className={cardInfoText}>{harvestable}</div>
                  </div>
                  <div className={cardStakingItemInfoBlock}>
                    <div className={cardLabel}>Expires</div>
                    <div className={cardInfoText}>{expires}</div>
                  </div>
                </div>
                <div className={cardStakingItemButtons}>
                  <Button
                    disabled={!allowHarvest}
                    onClick={() => allowHarvest && harvest(idx)}
                    className={cardButton}
                  >
                    Harvest
                  </Button>
                  <Button
                    disabled={!active}
                    onClick={() => active && unstake(idx)}
                    className={cardButton}
                  >
                    Unstake
                  </Button>
                  <button
                    onClick={() => accordionClickHandler(idx)}
                    className={arrowButtonClassnames}
                  >
                    <img src={ArrowIcon} alt="Arrow" />
                  </button>
                </div>
              </div>

              <div className={detailsClassNames}>
                {details &&
                  details.map(({ name, value }, idx) => (
                    <div key={idx} className={cardStakingItemDetailsRow}>
                      <div className={cardStakingItemDetailsName}>{name}</div>
                      <div className={cardStakingItemDetailsValue}>{value}</div>
                    </div>
                  ))}
              </div>
            </div>
          )
        },
      )
    )

  return (
    <>
      <Modal
        isOpen={isStakeModalOpen}
        closeHandler={() => setIsStakeModalOpen(false)}
      >
        <div className={stakeModal}>
          <Title className={stakeModalTitle} level={3}>
            Stake DAO1
          </Title>
          <Input
            onChange={stakeAmountHandler}
            value={stakeAmount}
            className={stakeModalInput}
          />
          <Button
            onClick={() => {
              stake(stakeAmount)
              setIsStakeModalOpen(false)
            }}
          >
            Stake
          </Button>
        </div>
      </Modal>
      <div className={card}>
        <div className={cardHead}>
          <div className={cardHeadLogo}>
            <img src={DAO1Logo} alt="DAO1" />
          </div>
          <div className={cardName}>
            <span className={cardLabel}>Name</span>
            <span className={cardNameText}>{name}</span>
          </div>
        </div>

        <div className={cardStakingConditions}>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>{stakeDurationDays}D yield</div>
            <div className={cardInfoText}>{rewardRate}%</div>
          </div>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>Daily yield</div>
            <div className={cardInfoText}>0.0516%</div>
          </div>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>APY-{stakeDurationDays}D compound</div>
            <div className={cardInfoText}>20.2%</div>
          </div>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>Duration</div>
            <div className={cardInfoText}>{stakeDurationDays} Days</div>
          </div>
        </div>

        <div className={cardStakingList}>
          <StakingHistory />
        </div>

        <div className={cardFooter}>
          <div className={cardTatalStaked}>
            <div className={cardLabel}>Total Staked:</div>
            <div className={cardTatalStakedValue}>{totalStaked} DAO1</div>
          </div>
          <Button
            onClick={() => setIsStakeModalOpen(true)}
            className={cardButton}
          >
            Stake
          </Button>
        </div>
      </div>
    </>
  )
}
