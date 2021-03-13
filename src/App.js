import "regenerator-runtime/runtime";
import React, { useEffect, useState, useReducer } from "react";
import { login, logout } from "./utils";
import "./global.css";
import "./sass/App.scss";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Form,
  FormControl,
  Card,
} from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUpPage from "./Components/SignUpPage";
import HomePage from "./Components/HomePage";
import ArtistTools from "./Components/ArtistTools";
import DragAndDropContainer from "./Components/DragAndDrop/DragAndDropContainer";
import Add_Music_Tool from "./Components/Add_Music_Tool";

import getConfig from "./config";
import { async } from "regenerator-runtime/runtime";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

let pexelAPIKey = "563492ad6f91700001000001f0893039a5fc4500a009df24bc014cba";

var pageBG = {
  backgroundImage: `url(curl -H "Authorization: 563492ad6f91700001000001f0893039a5fc4500a009df24bc014cba" \
  "https://api.pexels.com/v1/curated?per_page=1"
)`,
};
export default function App() {
  const [checkLoginStatus, changeLoginStatus] = useState(false);
  const [backgroundImagePexel, changePexel] = useState("black");

  const reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return { count: state.count - 1 };
      case "decrement":
        return { count: state.count - 1 };
    }
    return { count: state.count + 1 };
  };

  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const increment = () => {
    dispatch({ type: "increment" });
  };
  useEffect(() => {
    const getBackGround = async () => {
      fetch(
        `
      https://api.pexels.com/v1/search?query=musician&per_page=5`,
        {
          headers: {
            Authorization: pexelAPIKey,
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          console.log(result);
          let x = result;
          let randomIndex = Math.floor(Math.random() * 5);
          changePexel(x.photos[randomIndex].src.large);
        });
    };
    getBackGround();
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Navbar
          bg='dark'
          variant='dark'
          style={{ color: "white", width: "100%" }}
        >
          <Navbar.Brand href='#home'>BlockBop</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse aria-controls='basic-navbar-nav' />
          <Nav className='mr-auto'>
            <Nav.Link href='#home'>Home</Nav.Link>
            <Nav.Link href='/MyMusic'>My Bops</Nav.Link>
            <Nav.Link href='#pricing'>Pricing</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type='text' placeholder='Search' className='mr-sm-2' />
            <Button variant='outline-info'>Search</Button>
          </Form>
          <Nav.Link
            style={{ color: "white" }}
            onClick={window.accountId === "" ? login : logout}
            eventKey={2}
          >
            {window.accountId === "" ? "Login" : window.accountId}
          </Nav.Link>
        </Navbar>
        <Container
          fluid
          style={{
            height: "100vh",
            backgroundImage: `url(${backgroundImagePexel})`,
            backgroundSize: "cover",
          }}
        >
          <Row className='d-flex justified-content-center'>
            {checkLoginStatus ? (
              <SignUpPage></SignUpPage>
            ) : (
              <Switch>
                <Route exact path='/'>
                  {" "}
                  <HomePage></HomePage>
                </Route>
                <Route exact path='/MyMusic'>
                  <Add_Music_Tool />
                </Route>
              </Switch>
            )}
          </Row>
          <Row></Row>
        </Container>
      </Router>
    </React.Fragment>
  );
}
