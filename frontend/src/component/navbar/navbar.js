import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { rootApiIP, WSContext } from '../../constant'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiDatabase } from "react-icons/fi";
import { AiOutlineTool } from "react-icons/ai";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NavbarNotifyComp from './navbarNotifyComp';
import Badge from '@mui/material/Badge';
import "./navbar.css";

function NavbarComp() {
    let date = new Date()
    const [show, setShow] = useState(false);
    const [badgeNumber, setBadgeNumber] = useState(0)
    const [loading, setLoading] = useState(true)
    const [superUser, setSuperUser] = useState(0)
    const [time, setTime] = useState(date.toLocaleTimeString('en-US'))

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const nav = useNavigate()
    const socket = useContext(WSContext);

    const HandleNotifyQuantity = useCallback((arg) => {
        setBadgeNumber(arg)
    }, [])

    const HandleTime = useCallback((arg) => {
        setTime(arg)
    }, [])

    function logout(e){
        e.preventDefault()

        axios.get(rootApiIP + "/user/logout")
            .then(res => {
                socket.disconnect()
                nav("/login")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                alert("something error, please try again")
        })
    }

    useEffect(() => {
        axios.get(rootApiIP + "/data/get_notify_quantity")
        .then((res) => {
            setBadgeNumber(res.data)
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(rootApiIP + "/data/superUser")
        .then((res) => {
            setSuperUser(res.data[0]["superUser"])
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    useEffect(() => {
        if(socket){
            socket.on("REGISTER_NOTIFY_QUANTITY", (arg) => HandleNotifyQuantity(arg));
            socket.on("REGISTER_REAL_TIME", (arg) => HandleTime(arg));

            return () => {
                socket.off("REGISTER_NOTIFY_QUANTITY");
                socket.off("REGISTER_REAL_TIME");
            };
        }
    }, [socket])

    return (
        <>
            <Modal show = { show } onHide = { handleClose }>
                <Modal.Header>
                    <Modal.Title>Log out</Modal.Title>
                </Modal.Header>

                <Modal.Body>Do you want to log out?</Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick = { handleClose }>
                        No
                    </Button>

                    <Button variant = "primary" onClick = { logout }>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Navbar bg = "dark" variant = "dark" expand = "lg" fixed = 'top'>
                <Container fluid>
                    <Navbar.Brand href = "/home">Financial</Navbar.Brand>
                    <Navbar.Toggle aria-controls = "basic-navbar-nav" />
                    <Navbar.Collapse id =" basic-navbar-nav">
                        <Nav className = "ms-auto">
                            <p className = "my-auto" style = {{color : "white"}}>{time}</p>

                            <NavDropdown title = {
                                <>
                                    <FiDatabase />
                                    &emsp;資料庫相關功能
                                </>
                            } align = "end">
                                <NavDropdown.Item href = "/database">資料庫查詢</NavDropdown.Item>
                                <NavDropdown.Item href = "/post_board">個股推薦</NavDropdown.Item>
                                <NavDropdown.Item href = "/line_memo">Line memo</NavDropdown.Item>
                                <NavDropdown.Item href = "/calendar">法說會行事曆</NavDropdown.Item>
                                <NavDropdown.Item href = "/meeting_data">Meeting data</NavDropdown.Item>
                                <NavDropdown.Item href = "/industry_analysis">產業分析上傳</NavDropdown.Item>
                                { superUser === 1 && <NavDropdown.Item href = "/self_upload">個股研究報告上傳</NavDropdown.Item> }
                            </NavDropdown>
                            
                            <Nav.Link href="/tool_nav">
                                <>
                                    <AiOutlineTool />
                                    &emsp;分析工具
                                </>
                            </Nav.Link>

                            <Nav.Link href="/subscibe_list">警示訂閱</Nav.Link>
                            {/* <Nav.Link href="/choose_ticker">選股</Nav.Link> */}

                            <NavDropdown id = "notify" title = {
                                <>
                                    { loading ? 
                                        <Badge color = "success">
                                            <NotificationsNoneOutlinedIcon />
                                        </Badge>
                                        :
                                        <Badge badgeContent = { badgeNumber } invisible = { badgeNumber === "0" ? true : false } color = "success">
                                            <NotificationsNoneOutlinedIcon />
                                        </Badge>
                                    } 
                                </>
                            } align = "end">
                                <NavbarNotifyComp />
                            </NavDropdown>

                            <NavDropdown title = "更多" align = "end">
                                <NavDropdown.Item href = "/Line">加入Line</NavDropdown.Item>
                                <NavDropdown.Item href = "/userList">成員檔案</NavDropdown.Item>
                                <NavDropdown.Item onClick = { handleShow }>登出</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarComp;