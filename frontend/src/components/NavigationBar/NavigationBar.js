import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { NavigationBarData } from './NavigationBarData';
import './NavigationBar.css';
import { IconContext } from 'react-icons';

function NavigationBar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                {/*<div className='navbar'>*/}
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars style={{color: "#282c34"}} onClick={showSidebar} />
                    </Link>
                {/*</div>*/}
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to='#' style={{background: "#162328"}} className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {NavigationBarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span style={{fontFamily:"UberMoveText-Medium,Helvetica,sans-serif"}}>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default NavigationBar;