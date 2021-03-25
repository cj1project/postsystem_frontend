import React from 'react';
import { Logo, NavigationItem, Button } from '../../components';
import styles from '../../CSS_files/Navigation.module.css';

export const Toolbar = ({ name, login, setUserID }) => {
	const logout = () => {
		localStorage.clear();
		window.location.href = '/';
		fetch(`${process.env.REACT_APP_DOMAIN}/user/api/logout`, {
			credentials: 'include',
			method: 'get',
		})
			.then((res) => {
				if (res.staus == 200) {
					setUserID('');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<header className={styles.header}>
			<div className={styles.logo_welcome}>
				<Logo />
				{login ? (
					<div className={styles.ToolbarText}>
						{`Hello ${name}, welcome to Postmann!`}
					</div>
				) : (
					<div className={styles.ToolbarText}>{`Welcome to Postmann!`}</div>
				)}
			</div>
			{login ? (
				<nav className={styles.navigation}>
					<ul className={styles.navigation_list}>
						<li>
							<NavigationItem
								href='/'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'Home'}
							</NavigationItem>
						</li>
						<li>
							<NavigationItem
								href='/history'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'History'}
							</NavigationItem>
						</li>
						<li>
							<NavigationItem
								href='/check'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'Check'}
							</NavigationItem>
						</li>
						<li>
							<NavigationItem
								href='/about'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'About'}
							</NavigationItem>
						</li>
					</ul>
					<ul className={styles.navigation_list}>
						<li>
							<Button onClick={() => logout()} type='logout' />
						</li>
					</ul>
				</nav>
			) : (
				<nav className={styles.navigation}>
					<ul className={styles.navigation_list}>
						<li>
							<NavigationItem
								href='/'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'Home'}
							</NavigationItem>
						</li>
						<li>
							<NavigationItem
								href='/about'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'About'}
							</NavigationItem>
						</li>
					</ul>
					<ul className={styles.navigation_list}>
						<li>
							<NavigationItem
								href='/register'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'Register'}
							</NavigationItem>
						</li>
						<li>
							<p className={styles.slash}>/</p>
						</li>
						<li>
							<NavigationItem
								href='/login'
								css_classActive={styles.NavigationItem_active}
								css_class={styles.NavigationItem}
							>
								{'Login'}
							</NavigationItem>
						</li>
					</ul>
				</nav>
			)}
		</header>
	);
};
