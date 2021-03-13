import React from 'react';
import PropTypes from 'prop-types';
import { TwitchEmbed } from 'react-twitch-embed'
import { Container, Row, Col, Table } from 'react-bootstrap';
import FeaturedArtist from './FeaturedArtist'


const HomePage = props => {
    return (
        <Container fluid >
            <Row style={{marginTop:'10px', marginBottom:'30px'}} className='d-flex justify-content-center'>
                <Col className='d-flex justify-content-center'>
                    <TwitchEmbed
                        style={{ height: '100%', width: '60vw' }}
                        channel="Insomniac"
                        id="moonstar_x"
                        theme="dark"
                        muted
                        onVideoPause={() => console.log(':(')}
                    />
                </Col>
                <Col>

                    <FeaturedArtist />

                </Col>
            </Row>

            <Row className="justify-content-center d-flex">
                <Table style={{width:'75vw'}} striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Artist</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>PawProbz</td>
                            <td>DJ BlockBopper 3000</td>
                          
                        </tr>

                    </tbody>
                </Table>
            </Row>

        </Container>
    );
};

HomePage.propTypes = {

};

export default HomePage;