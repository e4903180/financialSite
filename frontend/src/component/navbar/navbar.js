import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';

function NavbarComp() {
    return (
        <div>
            <Navbar bg = "dark" variant = "dark" expand = "lg">
                <Container>
                    <Navbar.Brand href = "/home">Financial</Navbar.Brand>
                    <Navbar.Toggle aria-controls = "basic-navbar-nav" />
                    <Navbar.Collapse id =" basic-navbar-nav">
                    <Nav className = "me-auto">
                        <Nav.Link href = "/1">個股綜合資料</Nav.Link>
                        <Nav.Link href = "/2">個股推薦</Nav.Link>
                        <Nav.Link href = "/3">Line memo</Nav.Link>
                        <Nav.Link href = "/calendar">Calendar</Nav.Link>
                        <Nav.Link href = "/5">Meeting data</Nav.Link>
                        <Nav.Link href = "/6">Plot</Nav.Link>
                        <Nav.Link href = "/7">產業分析上傳</Nav.Link>
                        <Nav.Link href = "/8">個人檔案</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavbarComp;