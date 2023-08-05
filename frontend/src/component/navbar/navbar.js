import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiDatabase } from "react-icons/fi";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import NavbarNotifyComp from './navbarNotifyComp';
import Badge from '@mui/material/Badge';
import "./navbar.css";
import { IconButton, Tooltip } from '@mui/material';
import { config, WSContext } from '../../constant';
import { NavDropdownMenu, DropdownSubmenu } from "react-bootstrap-submenu";
import "react-bootstrap-submenu/dist/index.css";

function NavbarComp() {
    const [show, setShow] = useState(false);
    const [badgeNumber, setBadgeNumber] = useState(0)
    const [loading, setLoading] = useState(true)
    const [superUser, setSuperUser] = useState(0)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const nav = useNavigate()
    const socket = useContext(WSContext);

    const HandleNotifyQuantity = useCallback((arg) => {
        setBadgeNumber(arg)
    }, [])

    function logout(e){
        e.preventDefault()

        axios.get(config["rootApiIP"] + "/user/logout")
            .then(res => {
                socket.disconnect()
                nav(config["rootPathPrefix"] + "/login")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                alert("something error, please try again")
        })
    }

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/unread_notify")
        .then((res) => {
            setBadgeNumber(res.data)
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(config["rootApiIP"] + "/data/superUser")
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

            return () => {
                socket.off("REGISTER_NOTIFY_QUANTITY");
            };
        }
    }, [socket])

    return (
        <>
            <Modal show = { show } onHide = { handleClose }>
                <Modal.Header>
                    <Modal.Title>登出</Modal.Title>
                </Modal.Header>

                <Modal.Body>確認登出嗎?</Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick = { handleClose }>
                        取消
                    </Button>

                    <Button variant = "primary" onClick = { logout }>
                        確認
                    </Button>
                </Modal.Footer>
            </Modal>

            <Navbar bg = "dark" variant = "dark" expand = "lg" fixed = 'top'>
                <Container fluid>
                    <Navbar.Brand href = {config["rootPathPrefix"] + "/home"}>Financial</Navbar.Brand>
                    <Navbar.Toggle aria-controls = "basic-navbar-nav" />
                    <Navbar.Collapse id =" basic-navbar-nav">
                        <Nav className = "ms-auto">
                            { !superUser ? 
                                <Nav.Link href = {config["rootPathPrefix"] + "/database"}>
                                    <Tooltip title = "資料庫查詢" style = {{ height : "1vh" }}>
                                        <IconButton>
                                            <FiDatabase style = {{ color : "rgba(255, 255, 255, 0.55)" }} />
                                        </IconButton>
                                    </Tooltip>
                                    資料庫查詢
                                </Nav.Link> : 
                                <NavDropdownMenu title = {
                                    <>
                                        <Tooltip title = "資料庫查詢" style = {{ height : "1vh" }}>
                                            <IconButton>
                                                <FiDatabase style = {{ color : "rgba(255, 255, 255, 0.55)" }} />
                                            </IconButton>
                                        </Tooltip>
                                        資料庫查詢
                                    </>
                                } align = "end">
                                    <NavDropdown.Item href = {config["rootPathPrefix"] + "/database"}>資料庫查詢</NavDropdown.Item>    

                                    { superUser && <>
                                        <DropdownSubmenu href = "#" title = '個股研究報告編輯' alignRight>
                                            <NavDropdown.Item href = {config["rootPathPrefix"] + "/self_upload"}>個股研究報告上傳</NavDropdown.Item>
                                        </DropdownSubmenu>

                                        <DropdownSubmenu href = "#" title = '其他研究報告編輯' alignRight>
                                            <NavDropdown.Item href = {config["rootPathPrefix"] + "/other_upload"}>其他研究報告上傳</NavDropdown.Item>
                                        </DropdownSubmenu>
                                    </> }
    
                                </NavDropdownMenu>}
                            
                            <Nav.Link href = {config["rootPathPrefix"] + "/tool_nav"}>
                                <Tooltip title = "分析工具" style = {{ height : "1vh" }}>
                                    <IconButton>
                                        <BuildOutlinedIcon style = {{ color : "rgba(255, 255, 255, 0.55)" }} />
                                    </IconButton>
                                </Tooltip>
                                分析工具
                            </Nav.Link>

                            <Nav.Link href = {config["rootPathPrefix"] + "/subscibe_list"}>
                                <Tooltip title = "警示訂閱" style = {{ height : "1vh" }}>
                                    <IconButton>
                                        <AccessAlarmsOutlinedIcon style = {{ color : "rgba(255, 255, 255, 0.55)" }} />
                                    </IconButton>
                                </Tooltip>
                                警示訂閱
                            </Nav.Link>

                            <Nav.Link href = {config["rootPathPrefix"] + "/choose_ticker"}>
                                <Tooltip title = "選股(開發中)" style = {{ height : "1vh" }}>
                                    <IconButton>
                                        <FilterListOutlinedIcon style = {{ color : "rgba(255, 255, 255, 0.55)" }} />
                                    </IconButton>
                                </Tooltip>
                                選股(開發中)
                            </Nav.Link>

                            <NavDropdown id = "notify" title = {
                                <Tooltip title = "通知">
                                    { loading ? 
                                        <Badge color = "error">
                                            <NotificationsNoneOutlinedIcon />
                                        </Badge>
                                        :
                                        <Badge badgeContent = { badgeNumber } invisible = { badgeNumber === "0" ? true : false } color = "error">
                                            <NotificationsNoneOutlinedIcon />
                                        </Badge>
                                    } 
                                </Tooltip>
                            } align = "end">
                                <NavbarNotifyComp />
                            </NavDropdown>
                            
                            <NavDropdown id = "notify" title = {
                                <Tooltip title = "更多" style = {{ height : "1vh" }}>
                                    <IconButton>
                                        <MenuOutlinedIcon style = {{ color : "rgba(255, 255, 255, 0.55)" }} />
                                    </IconButton>
                                </Tooltip>
                            } align = "end">
                                <NavDropdown.Item href = {config["rootPathPrefix"] + "/Line"}>加入Line</NavDropdown.Item>
                                <NavDropdown.Item href = {config["rootPathPrefix"] + "/userList"}>成員檔案</NavDropdown.Item>
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