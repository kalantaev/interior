import React from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import agent from "../agent";

class Login extends React.Component {
    state = {};


    loginForm = () => {
        const handleSubmit = (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === true) {
                agent.Auth.login(this.state.login, this.state.password)
            }
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} md="6" controlId="validationCustom01">
                        <Form.Control
                            type="text"
                            placeholder="Логин"
                            onChange={(e)=>{this.setState({login: e.target.value})}}
                            required
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="6" controlId="validationCustom04">
                        <Form.Control
                            type="password"
                            placeholder="Пароль"
                            onChange={(e)=>{this.setState({password: e.target.value})}}
                            required
                        />
                    </Form.Group>
                </Form.Row>
                <Button type="submit">Войти</Button>
            </Form>
        );
    };

    render() {

        return (
            <Container>
                {this.loginForm()}
            </Container>
        );
    }
}

export default Login;
