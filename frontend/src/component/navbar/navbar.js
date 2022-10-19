import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { rootApiIP } from '../../constant'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiDatabase } from "react-icons/fi";
import { AiOutlineTool } from "react-icons/ai";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NavbarNotifyComp from './navbarNotifyComp';
import Badge from '@mui/material/Badge';
import "./navbar.css";

function NavbarComp() {
    const [show, setShow] = useState(false);
    const [badgeNumber, setBadgeNumber] = useState(0)
    const [loading, setLoading] = useState(true)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const nav = useNavigate()

    function logout(e){
        e.preventDefault()

        axios.get(rootApiIP + "/user/logout")
            .then(res => {
                nav("/login")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                alert("something error, please try again")
        })
    }

    useEffect(() => {
        setBadgeNumber(15)
        setLoading(false)
    }, [])

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
                            <NavDropdown title = {
                                <>
                                    <FiDatabase />
                                    &emsp;資料庫相關功能
                                </>
                            } align = "end">
                                <NavDropdown.Item href = "/database">個股綜合資料</NavDropdown.Item>
                                <NavDropdown.Item href = "/post_board">個股推薦</NavDropdown.Item>
                                <NavDropdown.Item href = "/line_memo">Line memo</NavDropdown.Item>
                                <NavDropdown.Item href = "/calendar">法說會行事曆</NavDropdown.Item>
                                <NavDropdown.Item href = "/meeting_data">Meeting data</NavDropdown.Item>
                                <NavDropdown.Item href = "/industry_analysis">產業分析上傳</NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title = {
                                <>
                                    <AiOutlineTool />
                                    &emsp;股票分析工具
                                </>
                            } align = "end">
                                <NavDropdown.Item href = "/stock_pricing_stratagy">股票定價策略</NavDropdown.Item>
                                <NavDropdown.Item href = "/PER_River">本益比河流圖</NavDropdown.Item>
                                <NavDropdown.Item href = "/support_resistance">天花板地板線</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link href="/screen">訂閱清單</Nav.Link>

                            <NavDropdown id = "notify" title = {
                                <>
                                    { loading ? 
                                        <Badge color = "success">
                                            <NotificationsNoneOutlinedIcon />
                                        </Badge>
                                        :
                                        <Badge badgeContent = { badgeNumber } color = "success">
                                            <NotificationsNoneOutlinedIcon />
                                        </Badge>
                                    } 
                                </>
                            } align = "end">
                                <NavbarNotifyComp />
                            </NavDropdown>

                            <NavDropdown title = "更多" align = "end">
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