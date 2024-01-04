//we created a new directory because all files inside pages directory are seen as a rendering stuff to show users directly
//since this is a reusable component we declared it in a new directory

import React from "react";
import Header from "./Header"
import Footer from "./Footer"
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css"

 const Layout = (props) => {
    return(
        <Container>
            <Header/>
            {props.children}
            <Footer/>
        </Container>

    )
 }
 
export default Layout;