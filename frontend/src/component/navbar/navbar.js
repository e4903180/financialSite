import axios from 'axios';
import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NavbarComp() {
    const nav = useNavigate()

    function logout(e){
        e.preventDefault()

        axios.get("http://140.116.214.154:3000/api/user/logout")
        .then(res => {
            alert("Logout")
            nav("/login")
        }).catch(res => {
            alert("something error, please try again")
        })
    }

    return (
        <div>
            <Navbar bg = "dark" variant = "dark" expand = "lg">
                <Container fluid>
                    <Navbar.Brand href = "/home">Financial</Navbar.Brand>
                    <Navbar.Toggle aria-controls = "basic-navbar-nav" />
                    <Navbar.Collapse id =" basic-navbar-nav">
                        <Nav className = "me-auto">
                            <Nav.Link href = "/database">個股綜合資料</Nav.Link>
                            <Nav.Link href = "/post_board">個股推薦</Nav.Link>
                            <Nav.Link href = "/line_memo">Line memo</Nav.Link>
                            <Nav.Link href = "/calendar">Calendar</Nav.Link>
                            <Nav.Link href = "/meeting_data">Meeting data</Nav.Link>
                            <Nav.Link href = "/6">Plot</Nav.Link>
                            <Nav.Link href = "/industry_analysis">產業分析上傳</Nav.Link>
                            <Nav.Link href = "/8">個人檔案</Nav.Link>
                        </Nav>

                        <div className = 'd-flex'>
                            {/* <p className = 'text-center my-auto' style = {{ color : "white", fontSize : "15px" }}>{username}您已經登入囉 &emsp;</p> */}
                            <button className = "btn btn-outline-light" onClick= { logout }>登出</button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavbarComp;