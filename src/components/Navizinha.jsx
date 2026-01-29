import { useState, useEffect } from "react";
import "./Navizinha.css";
import logo from "../assets/MyTaskIcon2.png";
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";


const Navizinha = () => {

    const { signout } = useContext(AuthContext);

    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // scroll para baixo → esconde
                setShowNavbar(false);
            } else {
                // scroll para cima → mostra
                setShowNavbar(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleLogout = (e) => {
        e.preventDefault();
        signout();
    };



    return (
        <div>
            <nav className={`navbar ${showNavbar ? "show" : "hide"}`}>
                <div className="container2">
                    {/* Logo */}
                    <a className="logo">
                        <img src={logo} alt="LogoMyTasks" />
                    </a>
                    {/* Marca (desktop) */}
                    <span className="brand">
                        MyTask
                    </span>


                    <ul>
                        <li className="item-menu">

                            <a href=""><FaMagnifyingGlass /></a>

                            <a href=""><FaClipboardList /></a>

                            <a className="logout" onClick={handleLogout}><RiLogoutBoxFill /></a>

                        </li>
                    </ul>
                </div>
            </nav>



            {/*
            <aside className='menu-lateral'>
                <ul>
                    <li className="item-menu">
                        <a className="logout" to="/" onClick={handleLogout}><RiLogoutBoxFill /></a>
                    </li>
                    <li className="item-menu">
                        <a href="#"><FaClipboardList /></a>
                    </li>
                    <li className="item-menu">
                        <a href="#"><FaMagnifyingGlass /></a>
                    </li>
                    <li className="item-menu">
                        <a onClick={() => setOpen(true)}><IoIosAddCircle /></a>
                    </li>
                </ul>
            </aside>
            */}
        </div>
    )
}

export default Navizinha;