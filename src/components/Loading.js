import React from 'react'
import styles from '../styles/Loading.module.css';
import logo from '../logo.svg';

function Loading() {
  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo} alt="logo" />
        <h2 className={styles.text}>Loading ...</h2>
    </div>
  )
}

export default Loading