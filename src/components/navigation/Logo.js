import React from 'react';
import logo from '../letter.svg';
import styles from '../../CSS_files/Navigation.module.css';

export const Logo = () => (
	<img src={logo} alt='Logotype' className={styles.Logo} />
);
